import { Tabs } from "expo-router";
import { Colors } from "@/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.action.primary,
        tabBarInactiveTintColor: Colors.text.disabled,
        tabBarStyle: {
          backgroundColor: Colors.bg.default,
          borderTopColor: Colors.border.default,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="contacts/index" options={{ title: "연락처" }} />
      <Tabs.Screen name="meetings/create" options={{ title: "미팅" }} />
    </Tabs>
  );
}
