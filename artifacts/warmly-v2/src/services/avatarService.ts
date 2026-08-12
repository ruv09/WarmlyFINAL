import { File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const AVATAR_FILENAME = "warmly-user-avatar.jpg";

/**
 * Выбор фото из галереи и сохранение во внутреннее хранилище приложения.
 */
export async function pickAndStoreUserAvatar(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });

  if (result.canceled || !result.assets[0]?.uri) {
    return null;
  }

  const dest = new File(Paths.document, AVATAR_FILENAME);
  if (dest.exists) {
    dest.delete();
  }

  const source = new File(result.assets[0].uri);
  source.copy(dest);

  return `${dest.uri}?t=${Date.now()}`;
}

export async function clearStoredUserAvatar(): Promise<void> {
  const dest = new File(Paths.document, AVATAR_FILENAME);
  if (dest.exists) {
    dest.delete();
  }
}
