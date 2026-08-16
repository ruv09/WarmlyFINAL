import React, { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { Tree, normalizeTree } from "../../types";
import { getVisibleSceneTrees, SceneTree } from "../../utils/viewportCulling";
import { ForestAtmosphere } from "./ForestAtmosphere";
import { ForestAmbient } from "./ForestAmbient";
import { ForestTreeNode, swayPhaseForTree } from "./ForestTreeNode";
import { useTheme } from "../../theme";
import {
  MAX_LOOK_X,
  MAX_LOOK_Y,
  WALK_PER_PINCH,
  clampLookX,
  clampLookY,
} from "../../services/forest/camera";
import { treesForCamera } from "../../services/forest/chunks";

const NEW_TREE_MS = 12_000;
const VIEWPORT_THROTTLE_MS = 80;

interface ForestCanvasProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
}

/**
 * Камера внутри леса: pinch = шаг вглубь (cameraDepth),
 * pan = ограниченный взгляд влево/вправо. Не карта.
 */
export function ForestCanvas({ trees, onSelectTree }: ForestCanvasProps) {
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const groundY = screenHeight * 0.62;

  const camX = useSharedValue(0);
  const camY = useSharedValue(0);
  const camZ = useSharedValue(0);
  const savedCamX = useSharedValue(0);
  const savedCamY = useSharedValue(0);
  const savedCamZ = useSharedValue(0);
  const pinchFocalX = useSharedValue(0);
  const sway = useSharedValue(0);

  const [viewport, setViewport] = useState({ camX: 0, camY: 0, camZ: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const lastReportRef = useRef(0);

  const userTrees = useMemo(() => trees.map((tree) => normalizeTree(tree)), [trees]);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const sub = AccessibilityInfo.addEventListener?.("reduceMotionChanged", setReduceMotion);
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(sway);
      sway.value = 0;
      return;
    }
    sway.value = 0;
    sway.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 7800, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(sway);
  }, [reduceMotion, sway]);

  function reportViewport(x: number, y: number, z: number, force = false) {
    const now = Date.now();
    if (!force && now - lastReportRef.current < VIEWPORT_THROTTLE_MS) return;
    lastReportRef.current = now;
    setViewport({ camX: x, camY: y, camZ: z });
  }

  useAnimatedReaction(
    () => ({ x: camX.value, y: camY.value, z: camZ.value }),
    (curr) => {
      runOnJS(reportViewport)(curr.x, curr.y, curr.z, false);
    },
  );

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .minDistance(8)
    .onBegin(() => {
      cancelAnimation(camX);
      cancelAnimation(camY);
      savedCamX.value = camX.value;
      savedCamY.value = camY.value;
    })
    .onUpdate((event) => {
      camX.value = clampLookX(savedCamX.value - event.translationX * 0.45);
      camY.value = clampLookY(savedCamY.value - event.translationY * 0.12);
      runOnJS(setShowHint)(false);
    })
    .onEnd((event) => {
      camX.value = withDecay({
        velocity: -event.velocityX * 0.45,
        clamp: [-MAX_LOOK_X, MAX_LOOK_X],
        deceleration: 0.996,
      });
      camY.value = withDecay({
        velocity: -event.velocityY * 0.12,
        clamp: [-MAX_LOOK_Y, MAX_LOOK_Y],
        deceleration: 0.996,
      });
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin((event) => {
      cancelAnimation(camZ);
      cancelAnimation(camX);
      savedCamZ.value = camZ.value;
      savedCamX.value = camX.value;
      pinchFocalX.value = event.focalX;
    })
    .onUpdate((event) => {
      const walk = (event.scale - 1) * WALK_PER_PINCH;
      camZ.value = Math.max(0, savedCamZ.value + walk);
      const look = ((pinchFocalX.value - screenWidth / 2) / (screenWidth / 2)) * 70 * Math.max(-1, Math.min(1, walk / 200));
      camX.value = clampLookX(savedCamX.value + look);
      runOnJS(setShowHint)(false);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const sceneTrees: SceneTree[] = useMemo(() => {
    const ambient = treesForCamera(viewport.camZ).map((tree) => ({
      id: tree.id,
      species: tree.species,
      x: tree.x,
      z: tree.z,
      scale: tree.scale,
      variant: tree.variant,
      interactive: false,
      createdAt: "ambient",
    }));

    const personal = userTrees.map((tree) => ({
      id: tree.id,
      species: tree.species,
      x: tree.position.x,
      z: tree.worldZ ?? 160,
      scale: tree.scale * 1.06,
      variant: tree.variant,
      interactive: true,
      source: tree,
      createdAt: tree.createdAt,
    }));

    const occupied = personal.map((t) => ({ x: t.x, z: t.z }));
    const filteredAmbient = ambient.filter((amb) =>
      occupied.every((p) => Math.hypot(p.x - amb.x, (p.z - amb.z) * 0.6) > 90),
    );

    return [...filteredAmbient, ...personal];
  }, [userTrees, viewport.camZ]);

  const visibleTrees = useMemo(
    () => getVisibleSceneTrees(sceneTrees, viewport, screenWidth),
    [sceneTrees, viewport, screenWidth],
  );

  const newestCreatedAt = useMemo(() => {
    let max = 0;
    for (const tree of userTrees) {
      const t = Date.parse(tree.createdAt);
      if (t > max) max = t;
    }
    return max;
  }, [userTrees]);

  const now = Date.now();
  const hitLayerStyle = useAnimatedStyle(() => ({ flex: 1 }));

  return (
    <View style={{ flex: 1, overflow: "hidden" }}>
      <ForestAtmosphere
        width={screenWidth}
        height={screenHeight}
        groundY={groundY}
        camX={camX}
        camY={camY}
        camZ={camZ}
      />

      <ForestAmbient
        width={screenWidth}
        height={screenHeight}
        groundY={groundY}
        camX={camX}
        reduceMotion={reduceMotion}
      />

      <GestureDetector gesture={composedGesture}>
        <Animated.View style={hitLayerStyle} collapsable={false}>
          {visibleTrees.map((scene) => {
            const created = Date.parse(scene.createdAt);
            const isNew =
              scene.interactive &&
              !reduceMotion &&
              created === newestCreatedAt &&
              now - created < NEW_TREE_MS;
            return (
              <ForestTreeNode
                key={scene.id}
                scene={scene}
                screenWidth={screenWidth}
                groundY={groundY}
                camX={camX}
                camY={camY}
                camZ={camZ}
                sway={sway}
                phase={swayPhaseForTree(scene.id)}
                isNew={isNew}
                reduceMotion={reduceMotion}
                onPress={onSelectTree}
              />
            );
          })}
        </Animated.View>
      </GestureDetector>

      {showHint && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: 92,
            alignSelf: "center",
            left: 24,
            right: 24,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              backgroundColor: theme.colors.overlay,
              color: theme.colors.textSecondary,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
              overflow: "hidden",
              fontSize: theme.typography.sizes.caption,
              textAlign: "center",
            }}
          >
            Сведи пальцы — шагни вглубь леса
          </Text>
        </View>
      )}
    </View>
  );
}
