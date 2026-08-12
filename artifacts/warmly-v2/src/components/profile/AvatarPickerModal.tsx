import React from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AVATAR_PRESETS } from "../../constants/avatars";
import { useTheme } from "../../theme";
import { Button } from "../ui";

interface AvatarPickerModalProps {
  visible: boolean;
  selectedPresetId: string;
  customUri?: string;
  onClose: () => void;
  onSelectPreset: (id: string) => void;
  onPickPhoto: () => void;
}

/**
 * Выбор аватара: готовые животные Warmly или своё фото.
 */
export function AvatarPickerModal({
  visible,
  selectedPresetId,
  customUri,
  onClose,
  onSelectPreset,
  onPickPhoto,
}: AvatarPickerModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isCustom = selectedPresetId === "custom" && Boolean(customUri);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          onPress={() => undefined}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, 16) + 12,
              maxHeight: "88%",
            },
          ]}
        >
          <Text
            style={{
              fontSize: theme.typography.sizes.title,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.textPrimary,
              marginBottom: 4,
            }}
          >
            Аватар
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.caption,
              marginBottom: theme.spacing("md"),
            }}
          >
            Выбери компаньона Warmly или своё фото
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.grid}
          >
            <Pressable onPress={onPickPhoto} style={styles.cell}>
              <View
                style={[
                  styles.avatarRing,
                  {
                    borderColor: isCustom ? theme.colors.accent : theme.colors.border,
                    borderWidth: isCustom ? 2.5 : 1,
                    backgroundColor: theme.colors.background,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                {isCustom && customUri ? (
                  <Image source={{ uri: customUri }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="camera-outline" size={26} color={theme.colors.textSecondary} />
                )}
              </View>
              <Text
                style={{
                  marginTop: 6,
                  fontSize: theme.typography.sizes.caption,
                  color: isCustom ? theme.colors.accent : theme.colors.textSecondary,
                  fontWeight: isCustom
                    ? theme.typography.weights.semibold
                    : theme.typography.weights.regular,
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                Фото
              </Text>
            </Pressable>

            {AVATAR_PRESETS.map((preset) => {
              const selected = !isCustom && selectedPresetId === preset.id;
              return (
                <Pressable
                  key={preset.id}
                  onPress={() => onSelectPreset(preset.id)}
                  style={styles.cell}
                >
                  <View
                    style={[
                      styles.avatarRing,
                      {
                        borderColor: selected ? theme.colors.accent : theme.colors.border,
                        borderWidth: selected ? 2.5 : 1,
                      },
                    ]}
                  >
                    <Image source={preset.image} style={styles.avatarImage} />
                  </View>
                  <Text
                    style={{
                      marginTop: 6,
                      fontSize: theme.typography.sizes.caption,
                      color: selected ? theme.colors.accent : theme.colors.textSecondary,
                      fontWeight: selected
                        ? theme.typography.weights.semibold
                        : theme.typography.weights.regular,
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    {preset.labelRu}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={{ marginTop: theme.spacing("md") }}>
            <Button label="Готово" onPress={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 4,
  },
  cell: {
    width: "22%",
    flexGrow: 1,
    maxWidth: "23%",
    alignItems: "center",
  },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
  },
  avatarImage: {
    width: 64,
    height: 64,
  },
});
