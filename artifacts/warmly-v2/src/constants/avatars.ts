import { ImageSourcePropType } from "react-native";

/**
 * Готовые аватары Warmly — мягкие животные-компаньоны.
 * Новые варианты добавляются сюда + файл в assets/brand/avatars/.
 */
export type AvatarPresetId =
  | "fox"
  | "deer"
  | "wolf"
  | "rabbit"
  | "hedgehog"
  | "bear"
  | "red-panda"
  | "owl"
  | "cat"
  | "squirrel"
  | "raccoon"
  | "badger"
  | "capybara"
  | "arctic-fox"
  | "otter"
  | "alpaca"
  | "bird"
  | "moose"
  | "axolotl"
  | "koala"
  | "custom";

export interface AvatarPreset {
  id: Exclude<AvatarPresetId, "custom">;
  labelRu: string;
  image: ImageSourcePropType;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: "fox", labelRu: "Лиса", image: require("../../assets/brand/avatars/fox.png") },
  { id: "deer", labelRu: "Олень", image: require("../../assets/brand/avatars/deer.png") },
  { id: "wolf", labelRu: "Волк", image: require("../../assets/brand/avatars/wolf.png") },
  { id: "rabbit", labelRu: "Кролик", image: require("../../assets/brand/avatars/rabbit.png") },
  { id: "hedgehog", labelRu: "Ёжик", image: require("../../assets/brand/avatars/hedgehog.png") },
  { id: "bear", labelRu: "Медведь", image: require("../../assets/brand/avatars/bear.png") },
  { id: "red-panda", labelRu: "Панда", image: require("../../assets/brand/avatars/red-panda.png") },
  { id: "owl", labelRu: "Сова", image: require("../../assets/brand/avatars/owl.png") },
  { id: "cat", labelRu: "Кот", image: require("../../assets/brand/avatars/cat.png") },
  { id: "squirrel", labelRu: "Белка", image: require("../../assets/brand/avatars/squirrel.png") },
  { id: "raccoon", labelRu: "Енот", image: require("../../assets/brand/avatars/raccoon.png") },
  { id: "badger", labelRu: "Барсук", image: require("../../assets/brand/avatars/badger.png") },
  { id: "capybara", labelRu: "Капибара", image: require("../../assets/brand/avatars/capybara.png") },
  { id: "arctic-fox", labelRu: "Песец", image: require("../../assets/brand/avatars/arctic-fox.png") },
  { id: "otter", labelRu: "Выдра", image: require("../../assets/brand/avatars/otter.png") },
  { id: "alpaca", labelRu: "Альпака", image: require("../../assets/brand/avatars/alpaca.png") },
  { id: "bird", labelRu: "Птичка", image: require("../../assets/brand/avatars/bird.png") },
  { id: "moose", labelRu: "Лось", image: require("../../assets/brand/avatars/moose.png") },
  { id: "axolotl", labelRu: "Аксолотль", image: require("../../assets/brand/avatars/axolotl.png") },
  { id: "koala", labelRu: "Коала", image: require("../../assets/brand/avatars/koala.png") },
];

export function getAvatarPreset(id: string | undefined): AvatarPreset {
  return AVATAR_PRESETS.find((item) => item.id === id) ?? AVATAR_PRESETS[0];
}
