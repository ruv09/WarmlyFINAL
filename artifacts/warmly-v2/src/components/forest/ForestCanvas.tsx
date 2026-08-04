import React, { useMemo, useState } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Tree } from "../../types";
import { TreeIllustration } from "../tree";
import { getVisibleTrees } from "../../utils/viewportCulling";

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const TREE_SIZE = 64;
/** Запас вокруг видимой области при отсечении невидимых деревьев —
 *  дерево не должно резко выскакивать в кадре при панорамировании. */
const CULLING_MARGIN = 120;

interface ForestCanvasProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
}

/**
 * Взаимодействие пользователя (жесты) и визуальное отображение
 * (иллюстрации деревьев) — разные ответственности внутри одного
 * компонента, разделённые по требованию ТЗ через явные подфункции
 * и вынесенную виртуализацию (utils/viewportCulling.ts) и генерацию
 * (services/forest/*), а не смешаны в одну процедуру.
 *
 * Жесты — на react-native-gesture-handler + react-native-reanimated
 * (UI-поток), а не на встроенном Animated: непрерывный мультитач
 * (пан + пинч-зум) на JS-потоке даёт заметные рывки, что прямо
 * запрещено ТЗ. См. обоснование выбора в /FOREST.md.
 */
export function ForestCanvas({ trees, onSelectTree }: ForestCanvasProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(1);

  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });

  function reportViewport(x: number, y: number, s: number) {
    setViewport({ x, y, scale: s });
  }

  // Сообщаем viewport во время жеста (не только в onEnd), иначе при
  // панорамировании дальше CULLING_MARGIN пользователь тянет пустое поле.
  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
      runOnJS(reportViewport)(translateX.value, translateY.value, scale.value);
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(reportViewport)(translateX.value, translateY.value, scale.value);
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const next = savedScale.value * event.scale;
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      runOnJS(reportViewport)(translateX.value, translateY.value, scale.value);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      runOnJS(reportViewport)(translateX.value, translateY.value, scale.value);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const visibleTrees = useMemo(
    () => getVisibleTrees(trees, viewport, screenWidth, screenHeight, CULLING_MARGIN),
    [trees, viewport, screenWidth, screenHeight],
  );

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          {visibleTrees.map((tree) => (
            <Pressable
              key={tree.id}
              onPress={() => onSelectTree(tree)}
              hitSlop={8}
              style={{
                position: "absolute",
                left: screenWidth / 2 + tree.position.x - TREE_SIZE / 2,
                top: screenHeight / 2 + tree.position.y - TREE_SIZE / 2,
              }}
            >
              <TreeIllustration tree={tree} size={TREE_SIZE} />
            </Pressable>
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
