import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entry, Tree } from "../../types";
import { useTheme } from "../../theme";
import { getMoodById } from "../../constants/moods";
import { ScaleView } from "../animation";
import { TreeIllustration } from "../tree";
import { formatHumanDate } from "../../utils/date";
import { useStatistics } from "../../hooks";

interface TreeInfoCardProps {
  visible: boolean;
  tree: Tree | null;
  entry: Entry | undefined;
  onClose: () => void;
}

function StatChip({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Ionicons name={icon} size={16} color={theme.colors.accentWarm} />
      <Text
        style={{
          marginTop: 4,
          fontSize: theme.typography.sizes.body,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.textPrimary,
        }}
      >
        {value}
      </Text>
      <Text
        style={{ fontSize: theme.typography.sizes.caption, color: theme.colors.textSecondary, textAlign: "center" }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        {label}
      </Text>
    </View>
  );
}

/**
 * Карточка при нажатии на дерево: иллюстрация, дата, настроение
 * (цветной кружок + название — в духе референса), заметка, маленькая
 * победа, и блок "Твоя статистика". После закрытия пользователь
 * остаётся в том же месте леса — это модалка поверх ForestCanvas,
 * который не размонтируется и не теряет состояние панорамирования.
 */
export function TreeInfoCard({ visible, tree, entry, onClose }: TreeInfoCardProps) {
  const theme = useTheme();
  const stats = useStatistics();
  if (!entry || !tree) return null;
  const mood = getMoodById(entry.moodId);
  const mostFrequentMood = stats.mostFrequentMoodId ? getMoodById(stats.mostFrequentMoodId) : undefined;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: "#00000055", justifyContent: "flex-end" }}
      >
        <ScaleView visible={visible} from={0.94}>
          <Pressable
            style={{
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.radius.xl,
              borderTopRightRadius: theme.radius.xl,
              padding: theme.spacing("lg"),
            }}
          >
            <View style={{ alignItems: "center", marginBottom: theme.spacing("sm") }}>
              <TreeIllustration tree={tree} size={72} />
            </View>

            <Text
              style={{
                color: theme.colors.textSecondary,
                textAlign: "center",
                marginBottom: theme.spacing("xs"),
                textTransform: "capitalize",
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
                <Text style={{ fontSize: theme.typography.sizes.subtitle, color: theme.colors.textPrimary }}>
                  {mood.label}
                </Text>
              </View>
            )}

            {entry.note.length > 0 && (
              <Text
                style={{
                  fontSize: theme.typography.sizes.body,
                  color: theme.colors.textPrimary,
                  lineHeight: theme.typography.sizes.body * 1.4,
                  marginBottom: theme.spacing("sm"),
                }}
                maxFontSizeMultiplier={theme.typography.scaleLimits.content}
              >
                {entry.note}
              </Text>
            )}

            {entry.smallWin && (
              <Text
                style={{ color: theme.colors.accent, fontStyle: "italic", marginBottom: theme.spacing("md") }}
                maxFontSizeMultiplier={theme.typography.scaleLimits.content}
              >
                ✦ {entry.smallWin}
              </Text>
            )}

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
                paddingTop: theme.spacing("md"),
                marginTop: theme.spacing("xs"),
              }}
            >
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.caption,
                  marginBottom: theme.spacing("sm"),
                }}
              >
                Твоя статистика
              </Text>
              <View style={{ flexDirection: "row" }}>
                <StatChip icon="leaf" value={String(stats.treesGrown)} label="деревьев" />
                <StatChip icon="calendar" value={String(stats.totalDays)} label="дней" />
                <StatChip
                  icon="happy"
                  value={mostFrequentMood?.label ?? "—"}
                  label="чаще всего"
                />
              </View>
            </View>
          </Pressable>
        </ScaleView>
      </Pressable>
    </Modal>
  );
}
