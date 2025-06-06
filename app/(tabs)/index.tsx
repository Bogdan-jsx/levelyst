import TasksSection from "@/components/TasksSection";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

    return (
        <ScrollView style={{marginTop: insets.top + 12}}>
            <View style={{gap: 12, paddingBottom: 12, paddingHorizontal: 8}}>
                <TasksSection name={'Single-time tasks'} tasks={singleTimeTasksMock} type={'singleTime'} />
                <TasksSection name={'Repeatable tasks'} tasks={repeatableTasksMock} type={'repeatable'} />
            </View>
        </ScrollView>
    )
}