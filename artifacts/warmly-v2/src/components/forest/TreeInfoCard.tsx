import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Entry, Tree } from "../../types";
import { useTheme } from "../../theme";
import { getMoodById } from "../../constants/moods";
import { getSpeciesVisual } from "../../constants/treeSpecies";
import { FadeView, ScaleView, SlideView } from "../animation";
import { TreeIllustration } from "../tree";
import { formatHumanDate } from "../../utils/date";

interface TreeInfoCardProps {
  visible: boolean;
  tree: Tree | null;
  entry: Entry | undefined;
  onClose: () => void;
}

/**
 * Карточка записи по нажатию на дерево: дата, настроение, текст, маленькая победа.
 * Без блока статистики — лес остаётся главным, карточка не перегружает экран.
 */
export function TreeInfoCard({ visible, tree, entry, onClose }: TreeInfoCardProps) {
  const theme = useTheme();
  if (!entry || !tree) return null;

  const mood = getMoodById(entry.moodId);
  const species = getSpeciesVisual(tree.species);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <FadeView visible={visible} style={StyleSheet.absoluteFill}>
          <Pressable
            onPress={onClose}
            style={{
              flex: 1,
              backgroundColor: theme.mode === "dark" ? "#0C0A14AA" : "#2A241888",
            }}
          />
        </FadeView>

        <SlideView visible={visible} direction="up" distance={36} duration="base">
          <ScaleView visible={visible} from={0.96} duration="base">
            <Pressable
              style={{
                backgroundColor: theme.colors.surface,
                borderTopLeftRadius: theme.radius.xl,
                borderTopRightRadius: theme.radius.xl,
                paddingHorizontal: theme.spacing("lg"),
                paddingTop: theme.spacing("md"),
                paddingBottom: theme.spacing("xl"),
                borderTopWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: theme.colors.border,
                  marginBottom: theme.spacing("md"),
                }}
              />

              <View style={{ alignItems: "center", marginBottom: theme.spacing("sm") }}>
                <TreeIllustration tree={tree} size={84} />
                <Text
                  style={{
                    marginTop: theme.spacing("xs"),
                    fontSize: theme.typography.sizes.caption,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {species.labelRu}
                </Text>
              </View>

              <Text
                style={{
                  color: theme.colors.textSecondary,
                  textAlign: "center",
                  marginBottom: theme.spacing("xs"),
                  textTransform: "capitalize",
                  fontSize: theme.typography.sizes.caption,
                }}
              >
                {formatHumanDate(entry.date)}
              </Text>

              {mood && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: theme.spacing("md"),
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: mood.color,
                      marginRight: theme.spacing("xs"),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.subtitle,
                      color: theme.colors.textPrimary,
                      fontWeight: theme.typography.weights.medium,
                    }}
                  >
                    {mood.label}
                  </Text>
                </View>
              )}

              {entry.note.length > 0 && (
                <Text
                  style={{
                    fontSize: theme.typography.sizes.body,
                    color: theme.colors.textPrimary,
                    lineHeight: theme.typography.sizes.body * 1.45,
                    marginBottom: theme.spacing("sm"),
                    textAlign: "center",
                  }}
                  maxFontSizeMultiplier={theme.typography.scaleLimits.content}
                >
                  {entry.note}
                </Text>
              )}

              {entry.smallWin ? (
                <Text
                  style={{
                    color: theme.colors.accentWarm,
                    fontStyle: "italic",
                    textAlign: "center",
                    marginTop: theme.spacing("xs"),
                  }}
                  maxFontSizeMultiplier={theme.typography.scaleLimits.content}
                >
                  ✦ {entry.smallWin}
                </Text>
              ) : null}
            </Pressable>
          </ScaleView>
        </SlideView>
      </View>
    </Modal>
  );
}
