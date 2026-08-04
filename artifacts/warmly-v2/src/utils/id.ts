import uuid from "react-native-uuid";

export function generateId(): string {
  return uuid.v4() as string;
}
