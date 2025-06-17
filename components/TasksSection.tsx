import { TaskSectionNames } from "@/app/(tabs)";
import { getAllTasks, toggleSubtaskDone, toggleTaskDone } from "@/db/queries/tasks";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, useWindowDimensions, View } from "react-native";
import { Button, Card, Checkbox, Chip, Dialog, List, Portal, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TasksSection({name}: {name: TaskSectionNames}) {
    const theme = useTheme()
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    
    const usableHeight = height - insets.top - insets.bottom - 84;
    const halfHeight = usableHeight / 2;

    const [undoneTasks, setUndoneTasks] = useState<any>([]);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [subtaskDialogVisible, setSubtaskDialogVisible] = useState<boolean>(false);
    const [taskItemId, setTaskItemId] = useState<any>();
    const [subtaskItemId, setSubtaskItemId] = useState<any>();

    const fetchData = useCallback(async () => {
        const temp: any = await getAllTasks(name)
        setUndoneTasks(temp);
    }, [name])

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    )

    const onTaskDoneConfirm = useCallback(async (newVal: any) => {
        await toggleTaskDone(newVal, taskItemId);
        fetchData();
        setDialogVisible(false);
    } , [fetchData, taskItemId]) 

    const onTaskDonePress = useCallback((item: any) => {
        setDialogVisible(true);
        setTaskItemId(item.id);
    }, [])

    const onSubtaskDoneConfirm = useCallback(async (newVal: any, subtaskId: number = 0, taskId: number = 0) => {
        await toggleSubtaskDone(newVal, subtaskId || subtaskItemId, taskId || taskItemId);
        fetchData();
        setSubtaskDialogVisible(false);
    }  , [fetchData, subtaskItemId, taskItemId]) 

    const onSubtaskDonePress = useCallback((subtask: any, task: any) => {
        setTaskItemId(task.id);
        setSubtaskItemId(subtask.id);

        if (subtask.done === 1) {
            onSubtaskDoneConfirm(0, subtask.id, task.id);
            return;
        }

        let undoneSubtaskCount = 0;
        for (const subtask of task.subtasks) {
            undoneSubtaskCount += subtask?.done ? 0 : 1;
        }

        if (undoneSubtaskCount <= 1) {
            setSubtaskDialogVisible(true);
        } else {
            onSubtaskDoneConfirm(1, subtask.id, task.id);
        }
    }, [onSubtaskDoneConfirm])
    
    return (
        <><Portal>
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                <Dialog.Title>Are you sure that this task is done?</Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={() => setDialogVisible(false)}>No</Button>
                    <Button onPress={() => onTaskDoneConfirm(1)}>Yes</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog visible={subtaskDialogVisible} onDismiss={() => setSubtaskDialogVisible(false)}>
                <Dialog.Title>Are you sure that all subtasks of this task are done?</Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={() => setSubtaskDialogVisible(false)}>No</Button>
                    <Button onPress={() => onSubtaskDoneConfirm(1)}>Yes</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal><Card mode={"contained"} theme={theme} style={{ minHeight: halfHeight }}>
                <Card.Title
                    title={`${name} (${undoneTasks?.length})`}
                    titleVariant={"titleLarge"}
                    right={() => (
                        <Link href={{ pathname: "/addTask", params: { name } }} style={{ marginRight: 12 }}>
                            <AntDesign name="plus" size={24} color={theme.colors.onBackground} />
                        </Link>
                    )} />
                <Card.Content style={{ paddingHorizontal: 8, gap: 4 }}>
                    {undoneTasks && undoneTasks.map((item: any) => (
                        <Card mode={"outlined"} theme={theme} key={item.id}>
                            <Card.Title
                                style={{ minHeight: 0, marginTop: 10 }}
                                title={item.title}
                                titleNumberOfLines={3}
                                titleStyle={{ textDecorationLine: item.done ? 'line-through' : 'none', textDecorationColor: theme.colors.onBackground }}
                                right={() => (
                                    <View style={{ borderColor: theme.colors.onBackground, borderWidth: Platform.OS === 'ios' ? 1 : 0, borderRadius: '50%', marginRight: 8 }}>
                                        <Checkbox status={item.done === 1 ? 'checked' : 'unchecked'} disabled={item.done === 1} onPress={() => onTaskDonePress(item)} />
                                    </View>
                                )} />
                            <Card.Content>
                                <Text variant={"labelSmall"}>{`Complete this task until ${item.due_date_string} to gain ${item.exp_amount} experience`}</Text>
                                <View style={{ display: "flex", flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8, marginBottom: 8 }}>
                                    {item.badges && item.badges.map((item: any, index: number) => (
                                        <Chip key={index} disabled compact>{item.name}</Chip>
                                    ))}
                                </View>
                                {item?.subtasks?.length ? (
                                    <List.Accordion title={<Text variant={'titleSmall'}>Expand subtasks</Text>} style={{ paddingVertical: 0, marginVertical: 0 }}>
                                        {item.subtasks.map((subtask: any) => (
                                            <List.Item
                                                key={subtask.id}
                                                title={subtask.title}
                                                titleStyle={{ textDecorationLine: subtask.done === 1 ? 'line-through' : 'none', textDecorationColor: theme.colors.onBackground }}
                                                style={{ paddingVertical: 0 }}
                                                right={() => (
                                                    <View style={{ borderColor: theme.colors.onBackground, borderWidth: Platform.OS === 'ios' ? 1 : 0, borderRadius: '50%' }}>
                                                        <Checkbox status={subtask.done === 1 ? 'checked' : 'unchecked'} disabled={item.done === 1} onPress={() => {
                                                            setTaskItemId(item.id);
                                                            setSubtaskItemId(subtask.id);
                                                            onSubtaskDonePress(subtask, item)
                                                        }} />
                                                    </View>
                                                )} />
                                        ))}
                                    </List.Accordion>
                                ) : null}
                            </Card.Content>
                        </Card>
                    ))}
                </Card.Content>
            </Card></>
    )
}