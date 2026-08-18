import React, { memo, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { useTheme } from "../../theme";
import {
  companionLayerZ,
  DEPTH_LAYERS,
  projectAtRelativeZ,
  wrappingLayerZ,
} from "../../services/forest/camera";

interface ForestAtmosphereProps {
  width: number;
  height: number;
  groundY: number;
  camX: SharedValue<number>;
  camY: SharedValue<number>;
  cameraZ: SharedValue<number>;
}

function useLayerStyle(
  camX: SharedValue<number>,
  camY: SharedValue<number>,
  cameraZ: SharedValue<number>,
  homeZ: number,
  parallax: number,
  cycle: number,
  extra: number,
  copy: 0 | 1,
) {
  return useAnimatedStyle(() => {
    let z = wrappingLayerZ(homeZ, cameraZ.value, cycle);
    if (copy === 1) z = companionLayerZ(z, cycle);
    const p = projectAtRelativeZ(z, homeZ, parallax, camX.value, camY.value);
    return {
      transform: [{ translateX: p.translateX }, { translateY: p.translateY }, { scale: p.scale }],
      opacity: p.opacity,
      width: "100%" as const,
      height: "100%" as const,
      position: "absolute" as const,
      left: -extra,
      right: -extra,
    };
  });
}

function ParallaxBillboard({
  camX,
  camY,
  cameraZ,
  layer,
  extra,
  dual,
  children,
}: {
  camX: SharedValue<number>;
  camY: SharedValue<number>;
  cameraZ: SharedValue<number>;
  layer: (typeof DEPTH_LAYERS)[number];
  extra: number;
  dual?: boolean;
  children: ReactNode;
}) {
  const primary = useLayerStyle(camX, camY, cameraZ, layer.z, layer.parallax, layer.cycle, extra, 0);
  const companion = useLayerStyle(camX, camY, cameraZ, layer.z, layer.parallax, layer.cycle, extra, 1);
  return (
    <>
      {dual ? (
        <Animated.View style={companion} pointerEvents="none">
          {children}
        </Animated.View>
      ) : null}
      <Animated.View style={primary} pointerEvents="none">
        {children}
      </Animated.View>
    </>
  );
}

/**
 * Шесть слоёв глубины Warmly. Joystick двигает cameraZ —
 * каждый слой едет со своим parallax, без scale всего леса.
 */
export const ForestAtmosphere = memo(function ForestAtmosphere({
  width,
  height,
  groundY,
  camX,
  camY,
  cameraZ,
}: ForestAtmosphereProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const extra = Math.round(width * 0.45);
  const sceneW = width + extra * 2;
  const [bg, far, middle, main, near, fg] = DEPTH_LAYERS;

  const farFill = isDark ? "#241C3A" : "#D8CDB4";
  const midFill = isDark ? "#1C1630" : "#C8D2AE";
  const mainFill = isDark ? "#181428" : "#BCCAA0";
  const nearFill = isDark ? "#141022" : "#B6C498";
  const groundFill = isDark ? "#100A1C" : "#A8B888";
  const moss = isDark ? "#24301C" : "#8FA374";
  const stone = isDark ? "#3A3548" : "#C4B49A";
  const trunk = isDark ? "#2A2238" : "#7A6248";

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={isDark ? "#2E2450" : "#FAF4EA"} />
            <Stop offset="0.35" stopColor={isDark ? "#22183C" : "#F0E6D4"} />
            <Stop offset="0.7" stopColor={isDark ? "#18102C" : "#E4D6BE"} />
            <Stop offset="1" stopColor={isDark ? "#100A1E" : "#D2C4A8"} />
          </LinearGradient>
          <RadialGradient id="sun" cx="82%" cy="16%" rx="32%" ry="22%">
            <Stop offset="0" stopColor="#FFE6B0" stopOpacity={0.5} />
            <Stop offset="0.55" stopColor="#F0D090" stopOpacity={0.16} />
            <Stop offset="1" stopColor="#F0D090" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="moon" cx="78%" cy="14%" rx="24%" ry="16%">
            <Stop offset="0" stopColor="#F0E6D0" stopOpacity={0.38} />
            <Stop offset="0.55" stopColor="#C8B8E0" stopOpacity={0.12} />
            <Stop offset="1" stopColor="#C8B8E0" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />
        {!isDark && (
          <>
            <Ellipse cx={width * 0.82} cy={height * 0.14} rx={width * 0.28} ry={height * 0.16} fill="url(#sun)" />
            <Circle cx={width * 0.84} cy={height * 0.12} r={15} fill="#FFE8B8" opacity={0.4} />
          </>
        )}
        {isDark && (
          <>
            <Ellipse cx={width * 0.78} cy={height * 0.12} rx={width * 0.22} ry={height * 0.13} fill="url(#moon)" />
            <Circle cx={width * 0.8} cy={height * 0.11} r={10} fill="#EDE4D4" opacity={0.78} />
          </>
        )}
      </Svg>

      <ParallaxBillboard camX={camX} camY={camY} cameraZ={cameraZ} extra={extra} layer={bg}>
        <Svg width={sceneW} height={height}>
          <Path
            d={`M0 ${groundY - 24}
                C ${sceneW * 0.2} ${groundY - 96} ${sceneW * 0.48} ${groundY - 8} ${sceneW * 0.72} ${groundY - 80}
                S ${sceneW * 0.9} ${groundY - 12} ${sceneW} ${groundY - 48}
                V ${height} H0 Z`}
            fill={isDark ? "#2A2244" : "#E4D8C0"}
            opacity={isDark ? 0.5 : 0.55}
          />
        </Svg>
      </ParallaxBillboard>

      <ParallaxBillboard camX={camX} camY={camY} cameraZ={cameraZ} extra={extra} layer={far}>
        <Svg width={sceneW} height={height}>
          <Path
            d={`M0 ${groundY + 18}
                Q ${sceneW * 0.22} ${groundY - 36} ${sceneW * 0.48} ${groundY + 8}
                T ${sceneW} ${groundY - 4}
                V ${height} H0 Z`}
            fill={farFill}
            opacity={0.88}
          />
          {[0.12, 0.24, 0.38, 0.52, 0.66, 0.8, 0.92].map((x, i) => (
            <Ellipse
              key={`far-t-${i}`}
              cx={sceneW * x}
              cy={groundY - 70 - (i % 3) * 16}
              rx={26 + (i % 4) * 8}
              ry={48 + (i % 3) * 12}
              fill={isDark ? "#201834" : "#C8BCA4"}
              opacity={0.5}
            />
          ))}
        </Svg>
      </ParallaxBillboard>

      <ParallaxBillboard camX={camX} camY={camY} cameraZ={cameraZ} extra={extra} layer={middle}>
        <Svg width={sceneW} height={height}>
          <Path
            d={`M0 ${groundY + 52}
                Q ${sceneW * 0.3} ${groundY + 8} ${sceneW * 0.58} ${groundY + 42}
                T ${sceneW} ${groundY + 28}
                V ${height} H0 Z`}
            fill={midFill}
            opacity={0.94}
          />
          {[0.1, 0.22, 0.36, 0.5, 0.64, 0.78, 0.91].map((x, i) => (
            <Path
              key={`mid-tr-${i}`}
              d={`M${sceneW * x} ${groundY + 16}
                  C ${sceneW * x - 7} ${groundY - 36} ${sceneW * x - 5} ${groundY - 86} ${sceneW * x} ${groundY - 108 - (i % 3) * 14}
                  C ${sceneW * x + 6} ${groundY - 86} ${sceneW * x + 8} ${groundY - 36} ${sceneW * x + 3} ${groundY + 16} Z`}
              fill={trunk}
              opacity={0.32 + (i % 3) * 0.08}
            />
          ))}
        </Svg>
      </ParallaxBillboard>

      <ParallaxBillboard camX={camX} camY={camY} cameraZ={cameraZ} extra={extra} dual layer={main}>
        <Svg width={sceneW} height={height}>
          <Path
            d={`M0 ${groundY + 70}
                Q ${sceneW * 0.28} ${groundY + 28} ${sceneW * 0.55} ${groundY + 64}
                T ${sceneW} ${groundY + 44}
                V ${height} H0 Z`}
            fill={mainFill}
            opacity={0.96}
          />
          {[0.08, 0.2, 0.34, 0.66, 0.8, 0.93].map((x, i) => (
            <Ellipse
              key={`main-t-${i}`}
              cx={sceneW * x}
              cy={groundY - 42 - (i % 2) * 12}
              rx={20 + (i % 3) * 7}
              ry={44 + (i % 2) * 10}
              fill={isDark ? "#1C162C" : "#A8B888"}
              opacity={0.58}
            />
          ))}
        </Svg>
      </ParallaxBillboard>

      <ParallaxBillboard camX={camX} camY={camY} cameraZ={cameraZ} extra={extra} dual layer={near}>
        <Svg width={sceneW} height={height}>
          <Path
            d={`M0 ${groundY + 95}
                Q ${sceneW * 0.35} ${groundY + 58} ${sceneW * 0.7} ${groundY + 82}
                T ${sceneW} ${groundY + 72}
                V ${height} H0 Z`}
            fill={nearFill}
            opacity={0.98}
          />
          <Path
            d={`M0 ${groundY + 128}
                Q ${sceneW * 0.4} ${groundY + 98} ${sceneW} ${groundY + 118}
                V ${height} H0 Z`}
            fill={groundFill}
          />
        </Svg>
      </ParallaxBillboard>

      <ParallaxBillboard camX={camX} camY={camY} cameraZ={cameraZ} extra={extra} dual layer={fg}>
        <Svg width={sceneW} height={height}>
          <Path
            d={`M0 ${height * 0.2}
                C ${sceneW * 0.08} ${height * 0.1} ${sceneW * 0.04} ${groundY - 30} 16 ${height}
                H0 Z`}
            fill={trunk}
            opacity={0.5}
          />
          <Path
            d={`M${sceneW} ${height * 0.16}
                C ${sceneW - sceneW * 0.1} ${height * 0.08} ${sceneW - 10} ${groundY - 18} ${sceneW - 14} ${height}
                H${sceneW} Z`}
            fill={trunk}
            opacity={0.46}
          />
          <Ellipse cx={sceneW * 0.12} cy={height - 26} rx={88} ry={34} fill={moss} opacity={0.55} />
          <Ellipse cx={sceneW * 0.88} cy={height - 20} rx={104} ry={38} fill={moss} opacity={0.5} />
          <Ellipse cx={sceneW * 0.18} cy={groundY + 118} rx={30} ry={16} fill={stone} opacity={0.7} />
          <Ellipse cx={sceneW * 0.82} cy={groundY + 126} rx={38} ry={18} fill={stone} opacity={0.65} />
        </Svg>
      </ParallaxBillboard>
    </View>
  );
});
