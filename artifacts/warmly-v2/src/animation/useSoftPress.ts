import { useSpringValue } from "./useSpringValue";

interface UseSoftPressOptions {
  /** Насколько уменьшается элемент при нажатии. Близко к 1 —
   *  едва заметное "вдавливание", а не игровой bounce-эффект. */
  pressedScale?: number;
}

/**
 * Тактильная обратная связь на нажатие через мягкую пружину
 * (SPRING_CONFIGS.soft, см. theme/tokens/animation.ts). Единственный
 * пружинный профиль в приложении — намеренно, чтобы "ощущение" нажатия
 * было одинаковым во всём интерфейсе, а не отличалось от кнопки к кнопке.
 */
export function useSoftPress(options: UseSoftPressOptions = {}) {
  const { pressedScale = 0.97 } = options;
  const { value: scale, animateTo } = useSpringValue(1, "soft");

  return {
    scale,
    onPressIn: () => animateTo(pressedScale),
    onPressOut: () => animateTo(1),
  };
}
