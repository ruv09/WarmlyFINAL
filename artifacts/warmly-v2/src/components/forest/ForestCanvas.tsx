import React, { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, useWindowDimensions, View } from "react-native";
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
import { Tree } from "../../types";
import { buildTreeSpatialIndex, getVisibleTrees } from "../../utils/viewportCulling";
import { ForestAtmosphere } from "./ForestAtmosphere";
import { ForestTreeNode, TREE_HEIGHT, swayPhaseForTree } from "./ForestTreeNode";
import { getSpeciesVisual } from "../../constants/treeSpecies";

const MIN_SCALE = 0.7;
const MAX_SCALE = 1.8;
const CULLING_MARGIN = 180;
const NEW_TREE_MS = 12_000;
const VIEWPORT_THROTTLE_MS = 72;

interface ForestCanvasProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
}

/**
 * Пейзаж леса в фас (как на концептах): деревья стоят на линии горизонта.
 * Пан по горизонтали + лёгкий зум; вертикаль почти не уводит «в карту сверху».
 */
export function ForestCanvas({ trees, onSelectTree }: ForestCanvasProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const groundY = screenHeight * 0.62;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const sway = useSharedValue(0);

  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [reduceMotion, setReduceMotion] = useState(false);
  const lastReportRef = useRef(0);

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
    if (reduceMotion) {
      cancelAnimation(sway);
      sway.value = 0;
      return;
    }
    sway.value = 0;
    sway.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 5600, easing: Easing.linear }),
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
    .minDistance(8)
    .onUpdate((event) => {
      // В основном горизонтальный обзор леса.
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY * 0.35;
      runOnJS(reportViewport)(translateX.value, translateY.value, scale.value, false);
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

  const spatialIndex = useMemo(() => buildTreeSpatialIndex(trees), [trees]);

  const visibleTrees = useMemo(
    () => getVisibleTrees(trees, viewport, screenWidth, screenHeight, CULLING_MARGIN, spatialIndex),
    [trees, viewport, screenWidth, screenHeight, spatialIndex],
  );

  const newestCreatedAt = useMemo(() => {
    let max = 0;
    for (const tree of trees) {
      const t = Date.parse(tree.createdAt);
      if (t > max) max = t;
    }
    return max;
  }, [trees]);

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

            // Глубина: y в мире → чуть дальше/ближе + масштаб (пейзаж, не карта сверху).
            const depth = Math.max(0, Math.min(1, (tree.position.y + 220) / 440));
            const depthScale = 0.62 + depth * 0.5;
            const heightScale = getSpeciesVisual(tree.species).heightScale;
            const side = Math.round(TREE_HEIGHT * heightScale * depthScale);
            const left = screenWidth / 2 + tree.position.x - side / 2;
            const top = groundY + tree.position.y * 0.22 - side * 0.92;

            return (
              <ForestTreeNode
                key={tree.id}
                tree={tree}
                left={left}
                top={top}
                size={side}
                sway={sway}
                phase={swayPhaseForTree(tree.id)}
                isNew={isNew}
                onPress={onSelectTree}
              />
            );
          })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
