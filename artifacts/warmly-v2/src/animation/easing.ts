import { Easing, EasingFunction } from "react-native";
import { EASING_CURVES, EasingToken } from "../theme/tokens/animation";

/**
 * theme/tokens/animation.ts хранит кривые как чистые данные (контрольные
 * точки Безье), не зависящие от конкретного API анимации — так решили
 * в THEME.md. Эта функция — единственное место, где кривая превращается
 * в EasingFunction конкретно для Animated (react-native). Если в
 * будущем часть анимаций переедет на reanimated — понадобится
 * аналогичная функция рядом, а не переписывание токенов.
 */
export function toNativeEasing(token: EasingToken): EasingFunction {
  const [x1, y1, x2, y2] = EASING_CURVES[token];
  return Easing.bezier(x1, y1, x2, y2);
}
