import React from "react";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import { Tree } from "../../types";
import { getSpeciesVisual, SpeciesVisual } from "../../constants/treeSpecies";
import { useTheme } from "../../theme";

interface TreeIllustrationProps {
  tree: Tree;
  size?: number;
}

/**
 * Иллюстрация полностью выросшего дерева — версия 2: дерево больше
 * не имеет стадий (см. /FOREST.md), поэтому здесь нет ветвления по
 * времени, только по виду дерева. Форма кроны переиспользуется между
 * несколькими видами (6 категорий форм на 10 видов) — так добавление
 * нового вида дерева в constants/treeSpecies.ts почти всегда не
 * требует новой функции отрисовки, только выбора существующей формы
 * и цвета.
 *
 * Не финальная художественная графика — рабочая версия в похожем
 * настроении на присланный референс (акварельные, приглушённые тона,
 * слои разной прозрачности для ощущения глубины), без копирования.
 */
export function TreeIllustration({ tree, size = 64 }: TreeIllustrationProps) {
  const theme = useTheme();
  const visual = getSpeciesVisual(tree.species);
  const groundColor = theme.mode === "dark" ? "#00000030" : "#00000014";

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Ellipse cx="50" cy="90" rx="24" ry="6" fill={groundColor} />
      <Rect x="46.5" y="46" width="7" height="42" rx="3" fill={visual.trunkColor} />
      {renderCanopy(visual)}
    </Svg>
  );
}

function renderCanopy(visual: SpeciesVisual) {
  const { canopyShape, canopyColor, accentColor } = visual;

  switch (canopyShape) {
    case "conical":
      return (
        <>
          <Path d="M50 18 L67 46 L33 46 Z" fill={canopyColor} opacity={0.85} />
          <Path d="M50 32 L70 60 L30 60 Z" fill={canopyColor} opacity={0.9} />
          <Path d="M50 46 L72 75 L28 75 Z" fill={canopyColor} opacity={0.95} />
        </>
      );

    case "round":
      return (
        <>
          <Circle cx="36" cy="40" r="21" fill={canopyColor} opacity={0.75} />
          <Circle cx="64" cy="38" r="20" fill={canopyColor} opacity={0.78} />
          <Circle cx="50" cy="24" r="20" fill={canopyColor} opacity={0.88} />
          <Circle cx="50" cy="34" r="14" fill={canopyColor} opacity={1} />
        </>
      );

    case "drooping":
      return (
        <>
          <Circle cx="50" cy="26" r="18" fill={canopyColor} opacity={0.85} />
          <Ellipse cx="33" cy="50" rx="10" ry="17" fill={canopyColor} opacity={0.7} />
          <Ellipse cx="67" cy="52" rx="10" ry="19" fill={canopyColor} opacity={0.7} />
          <Ellipse cx="50" cy="58" rx="9" ry="21" fill={canopyColor} opacity={0.65} />
        </>
      );

    case "clustered":
      return (
        <>
          <Circle cx="38" cy="38" r="11" fill={canopyColor} opacity={0.85} />
          <Circle cx="58" cy="32" r="12" fill={canopyColor} opacity={0.85} />
          <Circle cx="48" cy="48" r="10" fill={canopyColor} opacity={0.8} />
          <Circle cx="63" cy="48" r="9" fill={canopyColor} opacity={0.8} />
          {accentColor && (
            <>
              <Circle cx="40" cy="40" r="1.6" fill={accentColor} />
              <Circle cx="56" cy="30" r="1.6" fill={accentColor} />
              <Circle cx="61" cy="49" r="1.6" fill={accentColor} />
              <Circle cx="46" cy="47" r="1.6" fill={accentColor} />
            </>
          )}
        </>
      );

    case "blossom":
      return (
        <>
          <Circle cx="38" cy="36" r="17" fill={canopyColor} opacity={0.8} />
          <Circle cx="62" cy="34" r="16" fill={canopyColor} opacity={0.82} />
          <Circle cx="50" cy="22" r="17" fill={canopyColor} opacity={0.9} />
          {accentColor && (
            <>
              <Circle cx="42" cy="30" r="2" fill={accentColor} />
              <Circle cx="58" cy="26" r="2" fill={accentColor} />
              <Circle cx="50" cy="40" r="2" fill={accentColor} />
              <Circle cx="34" cy="40" r="1.6" fill={accentColor} />
            </>
          )}
        </>
      );

    case "wideWarm":
      return (
        <>
          <Ellipse cx="30" cy="42" rx="18" ry="14" fill={canopyColor} opacity={0.75} />
          <Ellipse cx="70" cy="42" rx="18" ry="14" fill={canopyColor} opacity={0.75} />
          <Ellipse cx="50" cy="30" rx="25" ry="17" fill={canopyColor} opacity={0.9} />
        </>
      );
  }
}
