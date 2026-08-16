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
import { buildTreeSpatialIndex, getVisibleTrees } from "../../utils/viewportCulling";
import { ForestAtmosphere } from "./ForestAtmosphere";
import { ForestAmbient } from "./ForestAmbient";
import { ForestTreeNode, swayPhaseForTree } from "./ForestTreeNode";
import { useTheme } from "../../theme";
import {
  MAX_ZOOM,
  MID_PARALLAX,
  MIN_ZOOM,
  Y_SCREEN_FACTOR,
  cameraPanBounds,
  clampZoom,
} from "../../services/forest/camera";
import { FOREST_WORLD } from "../../services/forest/placement";

const NEW_TREE_MS = 12_000;
const VIEWPORT_THROTTLE_MS = 80;

interface ForestCanvasProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
}

function clamp(v: number, min: number, max: number) {
  "worklet";
  return Math.max(min, Math.min(max, v));
}

/**
 * 2.5D-лес: камера (pan + pinch с фокусом), параллакс слоёв,
 * деревья проецируются на UI-потоке.
 */
export function ForestCanvas({ trees, onSelectTree }: ForestCanvasProps) {
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const groundY = screenHeight * 0.62;

  const camX = useSharedValue(0);
  const camY = useSharedValue(0);
  const zoom = useSharedValue(1);
  const savedCamX = useSharedValue(0);
  const savedCamY = useSharedValue(0);
  const savedZoom = useSharedValue(1);
  const pinchWorldX = useSharedValue(0);
  const pinchWorldY = useSharedValue(0);
  const sway = useSharedValue(0);

  const [viewport, setViewport] = useState({ camX: 0, camY: 0, zoom: 1 });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const lastReportRef = useRef(0);

  const normalizedTrees = useMemo(() => trees.map((tree) => normalizeTree(tree)), [trees]);

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
    if (normalizedTrees.length < 3) {
      setShowHint(false);
      return;
    }
    setShowHint(true);
    const timer = setTimeout(() => setShowHint(false), 4800);
    return () => clearTimeout(timer);
  }, [normalizedTrees.length]);

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
    setViewport({ camX: x, camY: y, zoom: z });
  }

  useAnimatedReaction(
    () => ({ x: camX.value, y: camY.value, z: zoom.value }),
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
      const z = zoom.value * MID_PARALLAX;
      const bounds = cameraPanBounds(zoom.value, FOREST_WORLD.minX, FOREST_WORLD.maxX);
      camX.value = clamp(savedCamX.value - event.translationX / z, bounds.minX, bounds.maxX);
      camY.value = clamp(savedCamY.value - (event.translationY * 0.32) / z, bounds.minY, bounds.maxY);
      runOnJS(setShowHint)(false);
    })
    .onEnd((event) => {
      const z = zoom.value * MID_PARALLAX;
      const bounds = cameraPanBounds(zoom.value, FOREST_WORLD.minX, FOREST_WORLD.maxX);
      camX.value = withDecay({
        velocity: -event.velocityX / z,
        clamp: [bounds.minX, bounds.maxX],
        deceleration: 0.997,
      });
      camY.value = withDecay({
        velocity: -(event.velocityY * 0.32) / z,
        clamp: [bounds.minY, bounds.maxY],
        deceleration: 0.997,
      });
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin((event) => {
      cancelAnimation(camX);
      cancelAnimation(camY);
      cancelAnimation(zoom);
      savedZoom.value = zoom.value;
      const z = zoom.value * MID_PARALLAX;
      pinchWorldX.value = camX.value + (event.focalX - screenWidth / 2) / z;
      pinchWorldY.value =
        camY.value + (event.focalY - groundY) / (z * Y_SCREEN_FACTOR);
    })
    .onUpdate((event) => {
      const nextZoom = clampZoom(savedZoom.value * event.scale);
      zoom.value = nextZoom;
      const z = nextZoom * MID_PARALLAX;
      const bounds = cameraPanBounds(nextZoom, FOREST_WORLD.minX, FOREST_WORLD.maxX);
      camX.value = clamp(pinchWorldX.value - (event.focalX - screenWidth / 2) / z, bounds.minX, bounds.maxX);
      camY.value = clamp(
        pinchWorldY.value - (event.focalY - groundY) / (z * Y_SCREEN_FACTOR),
        bounds.minY,
        bounds.maxY,
      );
      runOnJS(setShowHint)(false);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const spatialIndex = useMemo(() => buildTreeSpatialIndex(normalizedTrees), [normalizedTrees]);

  const visibleTrees = useMemo(
    () =>
      getVisibleTrees(normalizedTrees, viewport, screenWidth, screenHeight, groundY, spatialIndex),
    [normalizedTrees, viewport, screenWidth, screenHeight, groundY, spatialIndex],
  );

  const newestCreatedAt = useMemo(() => {
    let max = 0;
    for (const tree of normalizedTrees) {
      const t = Date.parse(tree.createdAt);
      if (t > max) max = t;
    }
    return max;
  }, [normalizedTrees]);

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
        zoom={zoom}
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
          {visibleTrees.map((tree) => {
            const created = Date.parse(tree.createdAt);
            const isNew =
              !reduceMotion && created === newestCreatedAt && now - created < NEW_TREE_MS;
            return (
              <ForestTreeNode
                key={tree.id}
                tree={tree}
                screenWidth={screenWidth}
                groundY={groundY}
                camX={camX}
                camY={camY}
                zoom={zoom}
                sway={sway}
                phase={swayPhaseForTree(tree.id)}
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
            Пройдись по лесу — свайп и щипок двумя пальцами
          </Text>
        </View>
      )}
    </View>
  );
}
