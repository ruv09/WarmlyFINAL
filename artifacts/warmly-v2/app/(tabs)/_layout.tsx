import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "../../src/theme";
import { TabBarIcon } from "../../src/components/ui";

/**
 * Главная с поддерживающей фразой — первый экран.
 * Дальше: Дневник / Лес / Календарь / Профиль. Без «Дыши».
 */
export default function TabsLayout() {
  const theme = useTheme();
  const isDark = theme.mode === "dark";

  return (
    <Tabs
      initialRouteName="index"
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
          backgroundColor: theme.colors.tabBar,
          borderTopWidth: 0,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: 66,
          paddingTop: 6,
          paddingBottom: 6,
          position: "absolute",
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.3 : 0.07,
          shadowRadius: 14,
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
