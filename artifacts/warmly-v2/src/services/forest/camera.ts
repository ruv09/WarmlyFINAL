/**
 * Виртуальная камера леса (2.5D).
 * Joystick меняет cameraZ. Каждый слой/дерево проецируется отдельно:
 * relativeZ = worldZ - cameraZ, scale = focal / relativeZ.
 * Запрещено: forestContainer.scale = zoom и pinch-to-zoom.
 */

export const FOCAL_LENGTH = 420;
export const NEAR_PLANE = 42;
export const PASS_PLANE = 110;
export const FAR_PLANE = 1680;
export const TREE_BASE_SIZE = 200;
export const MAX_LOOK_X = 160;
export const MAX_LOOK_Y = 36;

/** Максимальная скорость шага по Z при полном отклонении joystick. */
export const MAX_WALK_SPEED = 260;
export const WALK_ACCEL = 7;
export const WALK_DECEL = 5.2;
export const STICK_DEADZONE = 0.08;

export const DEPTH_LAYERS = [
  { id: "background", z: 2100, parallax: 0.05, cycle: 2400 },
  { id: "far", z: 1480, parallax: 0.15, cycle: 1800 },
  { id: "middle", z: 920, parallax: 0.35, cycle: 1200 },
  { id: "main", z: 540, parallax: 0.6, cycle: 860 },
  { id: "near", z: 240, parallax: 0.85, cycle: 640 },
  { id: "foreground", z: 88, parallax: 1.2, cycle: 480 },
] as const;

export type DepthLayerId = (typeof DEPTH_LAYERS)[number]["id"];

export function clampLookX(x: number): number {
  "worklet";
  return Math.max(-MAX_LOOK_X, Math.min(MAX_LOOK_X, x));
}

export function clampLookY(y: number): number {
  "worklet";
  return Math.max(-MAX_LOOK_Y, Math.min(MAX_LOOK_Y, y));
}

export function clampZ(z: number): number {
  "worklet";
  return Math.max(0, z);
}

export function relativeZ(worldZ: number, cameraZ: number): number {
  "worklet";
  return worldZ - cameraZ;
}

export function perspective(relZ: number): number {
  "worklet";
  const z = Math.max(NEAR_PLANE * 0.4, relZ);
  const raw = FOCAL_LENGTH / z;
  return Math.max(0.2, Math.min(3.15, raw));
}

/** Дерево проходит камеру: растёт, уезжает к краям, мягко гаснет. */
export function passBy(relZ: number): { opacity: number; boost: number } {
  "worklet";
  if (relZ >= PASS_PLANE) {
    if (relZ > FAR_PLANE * 0.78) {
      const t = (relZ - FAR_PLANE * 0.78) / (FAR_PLANE * 0.22);
      return { opacity: Math.max(0.18, 1 - t), boost: 1 };
    }
    return { opacity: 1, boost: 1 };
  }
  if (relZ <= NEAR_PLANE * 0.35) {
    return { opacity: 0, boost: 2.35 };
  }
  const t = 1 - (relZ - NEAR_PLANE * 0.35) / (PASS_PLANE - NEAR_PLANE * 0.35);
  return {
    opacity: Math.max(0, 1 - t * t),
    boost: 1 + t * 0.85,
  };
}

export function projectFromCamera(
  worldX: number,
  worldZ: number,
  camX: number,
  camY: number,
  cameraZ: number,
  screenWidth: number,
  groundY: number,
  size: number,
): { left: number; top: number; persp: number } {
  "worklet";
  const relZ = relativeZ(worldZ, cameraZ);
  const persp = perspective(relZ);
  const left = screenWidth / 2 + (worldX - camX) * persp - size / 2;
  const depthLift = (1 - Math.min(1.35, persp)) * 64;
  const top = groundY + depthLift - camY * persp * 0.22 - size * 0.88;
  return { left, top, persp };
}

export function wrappingLayerZ(homeZ: number, cameraZ: number, cycle: number): number {
  "worklet";
  const phase = ((cameraZ % cycle) + cycle) % cycle;
  let z = homeZ - phase;
  if (z < NEAR_PLANE) z += cycle;
  return z;
}

export function companionLayerZ(z: number, cycle: number): number {
  "worklet";
  return z > cycle * 0.5 ? z - cycle : z + cycle;
}

export function projectAtRelativeZ(
  relZ: number,
  homeZ: number,
  parallax: number,
  camX: number,
  camY: number,
): { translateX: number; translateY: number; scale: number; opacity: number } {
  "worklet";
  if (relZ <= 1) {
    return { translateX: 0, translateY: 0, scale: 1, opacity: 0 };
  }
  const persp = perspective(relZ);
  const rest = FOCAL_LENGTH / Math.max(homeZ, 1);
  const scale = Math.max(0.58, Math.min(2.55, persp / Math.max(0.15, rest)));
  let opacity = 1;
  if (relZ < PASS_PLANE) {
    opacity = Math.max(0, (relZ - NEAR_PLANE) / Math.max(1, PASS_PLANE - NEAR_PLANE));
  } else if (relZ > homeZ * 2.8) {
    opacity = Math.max(0, 1 - (relZ - homeZ * 2.8) / Math.max(80, homeZ * 1.4));
  }
  return {
    translateX: -camX * parallax * persp * 0.5,
    translateY: (scale - 1) * 26 - camY * parallax * 0.28,
    scale,
    opacity,
  };
}

/** -1..1 с мёртвой зоной: маленькое отклонение даёт медленный шаг. */
export function analogFromStick(raw: number): number {
  "worklet";
  const sign = raw < 0 ? -1 : 1;
  const mag = Math.abs(raw);
  if (mag <= STICK_DEADZONE) return 0;
  return sign * (mag - STICK_DEADZONE) / (1 - STICK_DEADZONE);
}

/**
 * Один кадр ходьбы: joystick → целевая скорость → плавное ускорение → cameraZ.
 * dt в секундах.
 */
export function stepWalk(
  cameraZ: number,
  velocity: number,
  stick: number,
  dt: number,
): { z: number; velocity: number } {
  "worklet";
  const safeDt = Math.max(0, Math.min(0.032, dt));
  const target = analogFromStick(stick) * MAX_WALK_SPEED;
  const rate = Math.abs(target) < 0.5 ? WALK_DECEL : WALK_ACCEL;
  const nextV = velocity + (target - velocity) * (1 - Math.exp(-rate * safeDt));
  let z = cameraZ + nextV * safeDt;
  let v = Math.abs(nextV) < 0.15 ? 0 : nextV;
  if (z <= 0) {
    z = 0;
    if (v < 0) v = 0;
  }
  return { z, velocity: v };
}
