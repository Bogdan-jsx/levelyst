import { TaskSectionNames } from "@/app/(tabs)";
import { getAllTasks, toggleSubtaskDone, toggleTaskDone } from "@/db/queries/tasks";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Modal, Portal, useTheme } from "react-native-paper";
import AddIcon from "../icons/add_icon.svg";
import Tick from "../icons/tick.svg";
import { ExpandableSubtasksList } from "./ExpandableSubtasksList";

export default function TasksSection({name}: {name: TaskSectionNames}) {
    const theme = useTheme()

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
        <>
            <Portal>
                <Modal visible={dialogVisible} style={{marginHorizontal: 48}} contentContainerStyle={{paddingVertical: 16, paddingHorizontal: 24, backgroundColor: theme.colors.background, borderRadius: 12}}>
                    <Text style={{fontFamily: "Nunito Sans", fontSize: 16, fontWeight: 600, color: theme.colors.primary}}>Are you sure that you&apos;ve completed this task?</Text>
                    <View style={{marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16}}>
                        <TouchableOpacity onPress={() => setDialogVisible(false)}>
                            <Text style={{fontFamily: "Nunito Sans", fontSize: 16, fontWeight: 400, color: theme.colors.onBackground}}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onTaskDoneConfirm(1)} style={{borderColor: theme.colors.primary, borderWidth: 2, borderRadius: 17, paddingVertical: 4, paddingHorizontal: 16}}>
                            <Text style={{fontFamily: "Nunito Sans", fontSize: 16, fontWeight: 600, color: theme.colors.primary}}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal visible={subtaskDialogVisible} style={{marginHorizontal: 48}} contentContainerStyle={{paddingVertical: 16, paddingHorizontal: 24, backgroundColor: theme.colors.background, borderRadius: 12}}>
                    <Text style={{fontFamily: "Nunito Sans", fontSize: 16, fontWeight: 600, color: theme.colors.primary}}>Are you sure that you&apos;ve completed all subtasks for this task?</Text>
                    <View style={{marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16}}>
                        <TouchableOpacity onPress={() => setSubtaskDialogVisible(false)}>
                            <Text style={{fontFamily: "Nunito Sans", fontSize: 16, fontWeight: 400, color: theme.colors.onBackground}}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onSubtaskDoneConfirm(1)} style={{borderColor: theme.colors.primary, borderWidth: 2, borderRadius: 17, paddingVertical: 4, paddingHorizontal: 16}}>
                            <Text style={{fontFamily: "Nunito Sans", fontSize: 16, fontWeight: 600, color: theme.colors.primary}}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </Portal>
            <View style={{marginTop: 24}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, alignItems: 'flex-end'}}>
                    <Text style={{fontFamily: 'Nunito Sans', fontSize: 14, color: theme.colors.onBackground}}>{name}</Text>
                    <Link href={{ pathname: "/addTask", params: { name } }}>
                        <AddIcon width={24} height={24} color={theme.colors.onBackground} />
                    </Link>
                </View>
                
                <View style={{width: '100%', height: 2, backgroundColor: theme.colors.secondary, marginTop: 8}} />
                {undoneTasks?.length > 0 ? undoneTasks.map((item: any) => (
                    <View key={item.id} style={{borderBottomColor: theme.colors.secondary, borderBottomWidth: 2}}>
                        <View style={{flexDirection: 'row', gap: 16, justifyContent: 'space-between', maxWidth: '100%', marginTop: 16, marginHorizontal: 16}}>
                            <View style={{flex: 1}}>
                                <Text style={{fontFamily: "Nunito Sand", fontSize: 14, color: item.done === 0 ? theme.colors.primary : theme.colors.onSecondary}}>{item.title}</Text>
                                <Text style={{fontFamily: "Nunito Sand", fontSize: 12, color: item.done === 0 ? theme.colors.onSecondary : theme.colors.primaryContainer}}>Complete this task until <Text style={{fontWeight: 600}}>{item.due_date_string}</Text> to gain {item.exp_amount} experience</Text>
                            </View> 
                            <TouchableOpacity onPress={() => onTaskDonePress(item)} disabled={item.done === 1} style={{width: 24, height: 24, backgroundColor: theme.colors.secondary, borderRadius: 12}}>
                                {item.done === 1 && (
                                    <Tick width={24} height={16} style={{marginLeft: 2, marginTop: 3}} color={item.done === 1 ? theme.colors.onSecondary : theme.colors.primary} />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, marginHorizontal: 16, marginBottom: item?.subtasks?.length ? 0 : 16}}>
                            {item.badges && item.badges.map((badge: any, index: number) => (
                                <View key={index} style={{paddingVertical: 4, paddingHorizontal: 16, borderRadius: 12, backgroundColor: theme.colors.primary}}>
                                    <Text style={{fontFamily: 'Nunito Sans', fontSize: 12, color: theme.colors.secondary}}>{badge.name}</Text>
                                </View>
                            ))} 
                        </View>
                        {item?.subtasks?.length ? (
                            <ExpandableSubtasksList task={item} onSubtaskDonePress={onSubtaskDonePress} />
                        ) : null}
                    </View>
                )) : (
                    <View style={{paddingVertical: 32, paddingHorizontal: 48, gap: 16}}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 16, color: theme.colors.primary, textAlign: 'center'}}>Seems like you don’t have any {name === TaskSectionNames.REPEATABLE ? "repeatable" : "single-time"} tasks created.</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 16, color: theme.colors.primary, textAlign: 'center', fontWeight: 600}}>Start with creating one by pressing plus!</Text>
                    </View>
                )}
            </View>
        </>
    )
}