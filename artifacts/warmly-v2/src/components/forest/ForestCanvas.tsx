import React, { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { Tree, normalizeTree } from "../../types";
import { buildTreeSpatialIndex, getVisibleTrees } from "../../utils/viewportCulling";
import { ForestAtmosphere } from "./ForestAtmosphere";
import { ForestTreeNode, TREE_HEIGHT, swayPhaseForTree } from "./ForestTreeNode";
import { getSpeciesVisual } from "../../constants/treeSpecies";
import { useTheme } from "../../theme";

const MIN_SCALE = 0.7;
const MAX_SCALE = 1.6;
const CULLING_MARGIN = 320;
const NEW_TREE_MS = 12_000;
const VIEWPORT_THROTTLE_MS = 72;
/** Насколько сильно мировые Y видны на экране (раньше 0.34 сжимало лес в кучу). */
const Y_SCREEN_FACTOR = 0.72;
const MAX_PAN_X = 1600;
const MAX_PAN_Y = 180;

interface ForestCanvasProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
}

/**
 * Панорама леса: свайп влево/вправо (прогулка), pinch-zoom.
 * Не 360° — это 2D пейзаж, как на концептах.
 */
export function ForestCanvas({ trees, onSelectTree }: ForestCanvasProps) {
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const groundY = screenHeight * 0.58;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const sway = useSharedValue(0);

  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const lastReportRef = useRef(0);

  const normalizedTrees = useMemo(
    () => trees.map((tree) => normalizeTree(tree)),
    [trees],
  );

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
    const timer = setTimeout(() => setShowHint(false), 4200);
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
      withTiming(Math.PI * 2, { duration: 6200, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(sway);
  }, [reduceMotion, sway]);

  function reportViewport(x: number, y: number, s: number, force = false) {
    const now = Date.now();
    if (!force && now - lastReportRef.current < VIEWPORT_THROTTLE_MS) return;
    lastReportRef.current = now;
    setViewport({ x, y, scale: s });
  }

  const panGesture = Gesture.Pan()
    .minDistance(6)
    .onUpdate((event) => {
      const nextX = Math.max(-MAX_PAN_X, Math.min(MAX_PAN_X, savedTranslateX.value + event.translationX));
      const nextY = Math.max(
        -MAX_PAN_Y,
        Math.min(MAX_PAN_Y, savedTranslateY.value + event.translationY * 0.22),
      );
      translateX.value = nextX;
      translateY.value = nextY;
      runOnJS(reportViewport)(nextX, nextY, scale.value, false);
      runOnJS(setShowHint)(false);
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(reportViewport)(translateX.value, translateY.value, scale.value, true);
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const next = savedScale.value * event.scale;
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      runOnJS(reportViewport)(translateX.value, translateY.value, scale.value, false);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      runOnJS(reportViewport)(translateX.value, translateY.value, scale.value, true);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const spatialIndex = useMemo(() => buildTreeSpatialIndex(normalizedTrees), [normalizedTrees]);

  const visibleTrees = useMemo(
    () =>
      getVisibleTrees(
        normalizedTrees,
        viewport,
        screenWidth,
        screenHeight,
        CULLING_MARGIN,
        spatialIndex,
      ),
    [normalizedTrees, viewport, screenWidth, screenHeight, spatialIndex],
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

  return (
    <View style={{ flex: 1, overflow: "hidden" }}>
      <ForestAtmosphere width={screenWidth} height={screenHeight} />

      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          {visibleTrees.map((tree) => {
            const created = Date.parse(tree.createdAt);
            const isNew =
              !reduceMotion && created === newestCreatedAt && now - created < NEW_TREE_MS;

            const depth = tree.depth;
            const depthScale = 0.55 + depth * 0.5;
            const heightScale = getSpeciesVisual(tree.species).heightScale;
            const side = Math.round(TREE_HEIGHT * heightScale * depthScale * tree.scale);
            const depthFade = 0.58 + depth * 0.42;
            const left = screenWidth / 2 + tree.position.x - side / 2;
            const top = groundY + tree.position.y * Y_SCREEN_FACTOR - side * 0.88;

            return (
              <ForestTreeNode
                key={tree.id}
                tree={tree}
                left={left}
                top={top}
                size={side}
                depthFade={depthFade}
                sway={sway}
                phase={swayPhaseForTree(tree.id)}
                isNew={isNew}
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
            Свайпни влево или вправо — пройдись по лесу
          </Text>
        </View>
      )}
    </View>
  );
}
