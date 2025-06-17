import TasksSection from "@/components/TasksSection";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export enum TaskSectionNames {
    SINGLE_TIME = "Single-time tasks",
    REPEATABLE = "Repeatable tasks"
}

const singleTimeTasksMock = [
    {title: "task 1", done: false, dueDate: new Date(), experience: 15, badges: ["Studies", "Urgent", "Chemisty", "Urgent", "Chemisty", "Urgent", "Chemisty"], id: 1, subtasks: [{title: 'subtask 1', done: false, id: 8}, {title: 'subtask 2', done: false, id: 9}]},
    {title: "task 2", done: false, dueDate: new Date(), experience: 15, badges: ["Studies", "Urgent", "Chemisty"], id: 2, subtasks: []},
    {title: "task 3", done: false, dueDate: new Date(), experience: 15, badges: ["Studies", "Urgent", "Chemisty"], id: 3, subtasks: []},
    {title: "task 4", done: true, dueDate: new Date(), experience: 15, badges: ["Studies", "Urgent", "Chemisty"], id: 4, subtasks: []},
]

const repeatableTasksMock = [
    {title: "task 1", done: false, dueDate: new Date(), experience: 15, badges: ["Studies", "Urgent", "Chemisty"], id: 5, subtasks: []},
    {title: "task 2", done: true, dueDate: new Date(), experience: 15, badges: ["Studies", "Urgent", "Chemisty"], id: 6, subtasks: []},
    {title: "task 3", done: false, dueDate: new Date(), experience: 15, badges: ["Studies", "Urgent", "Chemisty"], id: 7, subtasks: []},
]

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
        <ScrollView style={{paddingTop: insets.top + 12, backgroundColor: theme.colors.background}}>
            <View style={{gap: 12, paddingBottom: 12, paddingHorizontal: 8}}>
                <TasksSection name={TaskSectionNames.SINGLE_TIME} />
                <TasksSection name={TaskSectionNames.REPEATABLE} />
            </View>
        </ScrollView>
    )
}