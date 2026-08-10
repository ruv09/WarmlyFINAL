import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "../../src/theme";
import { TabBarIcon } from "../../src/components/ui";

/**
 * Нижняя навигация без «Дыши».
 * Близко к референсу: Дневник / Лес / Календарь / Профиль (+ Главная).
 */
export default function TabsLayout() {
  const theme = useTheme();
  const isDark = theme.mode === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: isDark ? theme.colors.accentWarm : theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.caption - 1,
          fontWeight: theme.typography.weights.medium,
        },
        tabBarStyle: {
          backgroundColor: isDark ? "#211A36EE" : "#FFFDF8F2",
          borderTopWidth: 0,
          borderTopLeftRadius: theme.radius.lg,
          borderTopRightRadius: theme.radius.lg,
          height: 64,
          paddingTop: 6,
          position: "absolute",
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.25 : 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Дневник",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? "book" : "book-outline"} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="forest"
        options={{
          title: "Лес",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? "leaf" : "leaf-outline"} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Календарь",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? "calendar" : "calendar-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? "person" : "person-outline"} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
