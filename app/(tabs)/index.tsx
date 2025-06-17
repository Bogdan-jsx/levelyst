import TasksSection from "@/components/TasksSection";
import { useEffect } from "react";
import { Platform, SafeAreaView, ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export enum TaskSectionNames {
    SINGLE_TIME = "Single-time tasks",
    REPEATABLE = "Repeatable tasks"
}

export default function TasksScreen() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();

    useEffect(() => {
        // initProfile('Created nickname')
        // addTask({title: 'Test task 2', dueDate: new Date(), expAmount: 18, subtasks: [{title: "test subtask 1"}, {title: "test subtask 2"}], badges: [1, 2], repeatEveryDays: null});
        // addTask({title: 'Test task 3', dueDate: new Date(), expAmount: 16, subtasks: [{title: "test subtask 3"}, {title: "test subtask 5"}], badges: [2], repeatEveryDays: 3});
        // getAllUndoneOneTimeTasks();
        // addBadge({name: 'Urgent'});
        // addBadge({name: 'Studies'});
        // addBadge({name: 'Chemistry'});
    }, []);

    return (
        <SafeAreaView style={{backgroundColor: theme.colors.background, paddingTop: Platform.OS === 'android' ? insets.top + 12 : 0, flex: 1}}>
            <ScrollView>
                <View style={{gap: 12, paddingBottom: 12, paddingHorizontal: 8}}>
                    <TasksSection name={TaskSectionNames.SINGLE_TIME} />
                    <TasksSection name={TaskSectionNames.REPEATABLE} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}