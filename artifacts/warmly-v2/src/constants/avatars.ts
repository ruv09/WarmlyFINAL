import { ImageSourcePropType } from "react-native";

/**
 * Готовые аватары Warmly — мягкие животные-компаньоны.
 * Новые варианты добавляются сюда + файл в assets/brand/avatars/.
 */
export type AvatarPresetId = "fox" | "custom";

export interface AvatarPreset {
  id: Exclude<AvatarPresetId, "custom">;
  labelRu: string;
  image: ImageSourcePropType;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "fox",
    labelRu: "Лиса",
    image: require("../../assets/brand/fox-avatar.png"),
  },
  // Сюда добавим: owl, deer, rabbit, bear… когда придут ассеты
];

export function getAvatarPreset(id: string | undefined): AvatarPreset {
  return AVATAR_PRESETS.find((item) => item.id === id) ?? AVATAR_PRESETS[0];
}
