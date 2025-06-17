import { HapticTab } from "@/components/HapticTab";
import { Entypo, FontAwesome5, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
    const theme = useTheme()
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.secondary,
            tabBarStyle: {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.outline
            }
        }}>
            <Tabs.Screen name="index" options={{ title: "Tasks", tabBarIcon: ({color}) => <FontAwesome5 name="tasks" size={24} color={color} /> }} />
            <Tabs.Screen name="quests" options={{ title: "Quests", tabBarIcon: ({color}) => <Octicons name="tasklist" size={24} color={color} /> }} />
            <Tabs.Screen name="shop" options={{ title: "Shop", tabBarIcon: ({color}) => <Entypo name="shop" size={24} color={color} /> }} />
            <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({color}) => <MaterialIcons name="face" size={24} color={color} /> }} />
        </Tabs>
    )
}