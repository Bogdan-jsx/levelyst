import { TaskSectionNames } from "@/app/(tabs)/index";
import { getAllTasks, toggleSubtaskDone, toggleTaskDone } from "@/db/queries/tasks";
import { Badge, Subtask, Task } from "@/types/tasks";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Modal, Portal, useTheme } from "react-native-paper";
import AddIcon from "../../icons/add_icon.svg";
import Tick from "../../icons/tick.svg";
import { LargeText, LargeTextBold, RegularText, SmallText, SmallTextBold } from "../commonStyles";
import { ExpandableSubtasksList } from "../ExpandableSubtasksList";
import { BadgeItem, BadgesContainer, Divider, EmptyStateContainer, EmptyStateText, EmptyStateTextBold, MainTaskInfo, ModalButtonsContainer, ModalConfirmBtn, SectionHeaderContainer, TaskContainer, TaskTickContainer, TitleWrapper, Wrapper } from "./TasksSection.styled";

export default function TasksSection({name}: {name: TaskSectionNames}) {
    const theme = useTheme()

    const [undoneTasks, setUndoneTasks] = useState<Task[]>([]);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [subtaskDialogVisible, setSubtaskDialogVisible] = useState<boolean>(false);
    const [taskItemId, setTaskItemId] = useState<number>(0);
    const [subtaskItemId, setSubtaskItemId] = useState<number>(0);

    const fetchData = useCallback(async () => {
        const temp: Task[] = await getAllTasks(name)
        setUndoneTasks(temp);
    }, [name])

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    )

    const onTaskDoneConfirm = useCallback(async (newVal: number) => {
        await toggleTaskDone(newVal, taskItemId);
        fetchData();
        setDialogVisible(false);
    } , [fetchData, taskItemId]) 

    const onTaskDonePress = useCallback((item: Task) => {
        setDialogVisible(true);
        setTaskItemId(item.id);
    }, [])

    const onSubtaskDoneConfirm = useCallback(async (newVal: number, subtaskId: number = 0, taskId: number = 0) => {
        await toggleSubtaskDone(newVal, subtaskId || subtaskItemId, taskId || taskItemId);
        fetchData();
        setSubtaskDialogVisible(false);
    }  , [fetchData, subtaskItemId, taskItemId]) 

    const onSubtaskDonePress = useCallback((subtask: Subtask, task: Task) => {
        setTaskItemId(task.id);
        setSubtaskItemId(subtask.id);

        if (subtask.done === 1) {
            onSubtaskDoneConfirm(0, subtask.id, task.id);
            return;
        }

        let undoneSubtaskCount = 0;

        if (!task?.subtasks) return;

        for (const subtask of task?.subtasks) {
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
                <Modal visible={dialogVisible} style={styles.modalStyles} contentContainerStyle={[{backgroundColor: theme.colors.background}, styles.modalContainerStyles]}>
                    <LargeTextBold color={theme.colors.primary}>Are you sure that you&apos;ve completed this task?</LargeTextBold>
                    <ModalButtonsContainer>
                        <TouchableOpacity onPress={() => setDialogVisible(false)}>
                            <LargeText color={theme.colors.onBackground}>No</LargeText>
                        </TouchableOpacity>
                        <ModalConfirmBtn onPress={() => onTaskDoneConfirm(1)} borderColor={theme.colors.primary}>
                            <LargeTextBold color={theme.colors.primary}>Yes</LargeTextBold>
                        </ModalConfirmBtn>
                    </ModalButtonsContainer>
                </Modal>
                <Modal visible={subtaskDialogVisible} style={styles.modalStyles} contentContainerStyle={[{backgroundColor: theme.colors.background}, styles.modalContainerStyles]}>
                    <LargeTextBold color={theme.colors.primary}>Are you sure that you&apos;ve completed all subtasks for this task?</LargeTextBold>
                    <ModalButtonsContainer>
                        <TouchableOpacity onPress={() => setSubtaskDialogVisible(false)}>
                            <LargeText color={theme.colors.onBackground}>No</LargeText>
                        </TouchableOpacity>
                        <ModalConfirmBtn onPress={() => onSubtaskDoneConfirm(1)} borderColor={theme.colors.primary}>
                            <LargeTextBold color={theme.colors.primary}>Yes</LargeTextBold>
                        </ModalConfirmBtn>
                    </ModalButtonsContainer>
                </Modal>
            </Portal>
            <Wrapper>
                <SectionHeaderContainer>
                    <RegularText color={theme.colors.onBackground}>{name}</RegularText>
                    <Link href={{ pathname: "/addTask", params: { name } }}>
                        <AddIcon width={24} height={24} color={theme.colors.onBackground} />
                    </Link>
                </SectionHeaderContainer>
                
                <Divider bgColor={theme.colors.secondary} />
                {undoneTasks?.length > 0 ? undoneTasks.map((item: Task) => (
                    <TaskContainer key={item.id} borderColor={theme.colors.secondary}>
                        <MainTaskInfo>
                            <TitleWrapper>
                                <RegularText color={item.done === 0 ? theme.colors.primary : theme.colors.onSecondary}>{item.title}</RegularText>
                                <SmallText color={item.done === 0 ? theme.colors.onSecondary : theme.colors.primaryContainer}>Complete this task until <SmallTextBold color={item.done === 0 ? theme.colors.onSecondary : theme.colors.primaryContainer}>{item.due_date_string}</SmallTextBold> to gain {item.exp_amount} experience</SmallText>
                            </TitleWrapper> 
                            <TaskTickContainer onPress={() => onTaskDonePress(item)} disabled={item.done === 1} bgColor={theme.colors.secondary}>
                                {item.done === 1 && (
                                    <Tick width={24} height={16} style={styles.tickStyles} color={item.done === 1 ? theme.colors.onSecondary : theme.colors.primary} />
                                )}
                            </TaskTickContainer>
                        </MainTaskInfo>
                        <BadgesContainer marginBottom={item?.subtasks?.length ? 0 : 16}>
                            {item.badges && item.badges.map((badge: Badge, index: number) => (
                                <BadgeItem key={index} bgColor={theme.colors.primary}>
                                    <SmallText color={theme.colors.secondary}>{badge.name}</SmallText>
                                </BadgeItem>
                            ))} 
                        </BadgesContainer>
                        {item?.subtasks?.length ? (
                            <ExpandableSubtasksList task={item} onSubtaskDonePress={onSubtaskDonePress} />
                        ) : null}
                    </TaskContainer>
                )) : (
                    <EmptyStateContainer>
                        <EmptyStateText color={theme.colors.primary}>Seems like you don’t have any {name === TaskSectionNames.REPEATABLE ? "repeatable" : "single-time"} tasks created.</EmptyStateText>
                        <EmptyStateTextBold color={theme.colors.primary}>Start with creating one by pressing plus!</EmptyStateTextBold>
                    </EmptyStateContainer>
                )}
            </Wrapper>
        </>
    )
}

const styles = StyleSheet.create({
    tickStyles: {
        marginLeft: 2,
        marginTop: 3,
    },
    modalStyles: {
        marginHorizontal: 48
    },
    modalContainerStyles: {
        paddingVertical: 16, 
        paddingHorizontal: 24,  
        borderRadius: 12
    }
})