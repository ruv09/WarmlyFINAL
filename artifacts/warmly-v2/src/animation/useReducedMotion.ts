import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * Читает системную настройку "уменьшить движение" (iOS: Reduce Motion,
 * Android: "Удалить анимации"). Все хуки анимации в этом модуле
 * проверяют это значение и при true применяют конечное состояние
 * мгновенно, без интерполяции — не "ускоряют" анимацию, а убирают её.
 *
 * Это единственное место в приложении, которое обращается к
 * AccessibilityInfo по поводу движения — остальной код зависит от
 * этого хука, а не от платформенного API напрямую.
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (isMounted) setReducedMotion(value);
    });

    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (value) => {
      setReducedMotion(value);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return reducedMotion;
}
