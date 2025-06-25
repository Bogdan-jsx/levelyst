import { CustomTabBar } from "@/components/CustomTabBar";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import ProfileIcon from "../../icons/profile_icon.svg";
import QuestsIcon from "../../icons/quests_icon.svg";
import ShopIcon from "../../icons/shop_icon.svg";
import TasksIcon from "../../icons/tasks_icon.svg";

export default function TabLayout() {
    const theme = useTheme()
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
            headerShown: false,
            // tabBarButton: HapticTab,
            // tabBarActiveTintColor: theme.colors.primary,
            // tabBarInactiveTintColor: theme.colors.onSecondary,
            // tabBarStyle: {
            //     backgroundColor: theme.colors.secondary,
            //     paddingHorizontal: 16,
            //     paddingBottom: 16,
            //     paddingTop: 16,
            //     maxHeight: 200,
            //     shadowColor: 'rgba(79, 79, 79, .2)',
            //     shadowOffset: {width: 0, height: -5},
            //     shadowOpacity: 1,
            //     shadowRadius: 4
            // }
        }}>
            <Tabs.Screen name="index" options={{ title: "Tasks", tabBarIcon: ({color}) => <TasksIcon width={24} color={color} /> }} />
            <Tabs.Screen name="quests" options={{ title: "Quests", tabBarIcon: ({color}) => <QuestsIcon width={24} color={color} /> }} />
            <Tabs.Screen name="shop" options={{ title: "Shop", tabBarIcon: ({color}) => <ShopIcon width={24} color={color} /> }} />
            <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({color}) => <ProfileIcon width={24} color={color} /> }} />
        </Tabs>
    )
}