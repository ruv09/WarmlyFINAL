import { useRef } from "react";
import { Animated } from "react-native";
import { SPRING_CONFIGS, SpringConfigToken } from "../theme/tokens/animation";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Единственное место, которое напрямую вызывает Animated.spring.
 * Любая пружинная анимация в приложении (нажатие кнопки, дерево,
 * реагирующее на новую запись, — что угодно в будущем) строится на
 * этом хуке, а не на новом вызове Animated.spring в компоненте.
 */
export function useSpringValue(initialValue: number, config: SpringConfigToken = "soft") {
  const value = useRef(new Animated.Value(initialValue)).current;
  const reducedMotion = useReducedMotion();

  function animateTo(toValue: number) {
    if (reducedMotion) {
      value.setValue(toValue);
      return;
    }
    Animated.spring(value, {
      toValue,
      ...SPRING_CONFIGS[config],
      useNativeDriver: true,
    }).start();
  }

  return { value, animateTo };
}
