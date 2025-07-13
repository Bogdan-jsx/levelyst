import TasksSection from "@/components/TasksSection/index";
import { Platform, ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Container, Wrapper } from "../tabsStyles/tasks.styled";

export enum TaskSectionNames {
    SINGLE_TIME = "Single-time tasks",
    REPEATABLE = "Repeatable tasks"
}

export default function TasksScreen() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();

    return (
        <Wrapper bgColor={theme.colors.background} paddingTop={Platform.OS === 'android' ? insets.top + 8 : 8}>
            <ScrollView>
                <Container>
                    <TasksSection name={TaskSectionNames.SINGLE_TIME} />
                    <TasksSection name={TaskSectionNames.REPEATABLE} />
                </Container>
            </ScrollView>
        </Wrapper>
    )
}