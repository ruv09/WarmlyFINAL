import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { runOnJS } from "react-native-worklets";
import { useTheme } from "../../theme";

const TRACK_H = 132;
const TRACK_W = 52;
const KNOB = 40;
const TRAVEL = (TRACK_H - KNOB - 10) / 2;
const TOUCH_W = 88;
const TOUCH_H = 188;
export const TAB_BAR_CLEARANCE = 66;
export const JOYSTICK_TOUCH_H = 188;

interface ForestWalkJoystickProps {
  axis: SharedValue<number>;
  onEngage?: () => void;
}

/**
 * Вертикальный аналоговый joystick. Только ось Y:
 * вверх → вперёд по cameraZ, вниз → назад. Горизонталь игнорируется.
 */
export const ForestWalkJoystick = memo(function ForestWalkJoystick({
  axis,
  onEngage,
}: ForestWalkJoystickProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const insets = useSafeAreaInsets();
  const knobY = useSharedValue(0);

  const pan = Gesture.Pan()
    .minDistance(0)
    .onBegin(() => {
      cancelAnimation(knobY);
      if (onEngage) runOnJS(onEngage)();
    })
    .onUpdate((event) => {
      const y = Math.max(-TRAVEL, Math.min(TRAVEL, event.translationY));
      knobY.value = y;
      axis.value = Math.max(-1, Math.min(1, -y / TRAVEL));
    })
    .onFinalize(() => {
      axis.value = 0;
      knobY.value = withSpring(0, { damping: 16, stiffness: 210, mass: 0.7 });
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: knobY.value }],
  }));

  const bottom = TAB_BAR_CLEARANCE + Math.max(insets.bottom, 8) + 10;
  const trackFill = isDark ? "#2A2048E0" : "#FFF6EDE8";
  const trackBorder = isDark ? "#FFFFFF1A" : "#E8D5C8";
  const knobFill = isDark ? "#E8B4A8" : "#F0B4AA";
  const chevron = isDark ? "#E8B4A8CC" : "#C9956AAA";

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom }]}
      accessibilityRole="adjustable"
      accessibilityLabel="Движение по лесу"
      accessibilityHint="Потяните вверх, чтобы идти вглубь, вниз — чтобы вернуться"
    >
      <GestureDetector gesture={pan}>
        <Animated.View style={styles.touch} collapsable={false}>
          <Ionicons name="chevron-up" size={16} color={chevron} />
          <View
            style={[
              styles.track,
              {
                backgroundColor: trackFill,
                borderColor: trackBorder,
              },
            ]}
          >
            <View style={[styles.notch, { backgroundColor: chevron }]} />
            <Animated.View
              style={[
                styles.knob,
                { backgroundColor: knobFill, shadowColor: isDark ? "#E8B4A8" : "#C9956A" },
                knobStyle,
              ]}
            />
          </View>
          <Ionicons name="chevron-down" size={16} color={chevron} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  touch: {
    width: TOUCH_W,
    height: TOUCH_H,
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  notch: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.55,
  },
  knob: {
    position: "absolute",
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
