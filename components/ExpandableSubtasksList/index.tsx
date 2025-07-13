import { Subtask, Task } from "@/types/tasks";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import ArrowIcon from "../../icons/down-arrow.svg";
import Tick from "../../icons/tick.svg";
import { SmallText } from "../commonStyles";
import { CheckboxWrapper, SubtaskItem, SubtasksContainer, ToggleButton } from "./ExpandableSubtasksList.styled";

export const ExpandableSubtasksList = ({task, onSubtaskDonePress}: {task: Task, onSubtaskDonePress: (subtask: Subtask, task: Task) => void}) => {
    const theme = useTheme()
    
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const [contentHeight, setContentHeight] = useState(0);

    const maxHeight = useSharedValue(999999);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (isExpanded) {
            maxHeight.value = withTiming(contentHeight, { duration: 300 });
        } else {
            maxHeight.value = withTiming(0, { duration: 300 });
        }
        
    }, [contentHeight, isExpanded, maxHeight, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        maxHeight: maxHeight.value,
    }));

    const onContentLayout = (event: LayoutChangeEvent) => {
        if (contentHeight === 0 && (task?.subtasks?.length || 0) > 0) {
            setContentHeight(event.nativeEvent.layout.height);
            setIsExpanded(false);
        }
    };

    return (
        <>
            <ToggleButton onPress={() => setIsExpanded(!isExpanded)}>
                <SmallText color={theme.colors.primary}>{isExpanded ? "Collapse" : "Expand"} {task?.subtasks?.length || 0} subtasks</SmallText>
                <ArrowIcon width={12} height={12} color={theme.colors.primary} style={{transform: isExpanded ? [{rotate: '180deg'}] : []}} />
            </ToggleButton>
            <Animated.View style={[animatedStyle, styles.subtasksWrapper]}>
                <SubtasksContainer onLayout={onContentLayout}>
                    {task?.subtasks?.map((subtask: Subtask) => (
                        <SubtaskItem key={subtask.id} bgColor={theme.colors.secondary}>
                            <SmallText color={subtask.done === 1 ? theme.colors.onSecondary : theme.colors.primary}>{subtask.title}</SmallText>
                            <CheckboxWrapper disabled={task.done === 1} onPress={() => onSubtaskDonePress(subtask, task)} bgColor={theme.colors.surface}>
                                {subtask.done === 1 && (
                                    <Tick width={16} height={11} style={styles.tickStyles} color={task.done === 1 ? theme.colors.onSecondary : theme.colors.primary} />
                                )}
                            </CheckboxWrapper>
                        </SubtaskItem>
                    ))}
                </SubtasksContainer>
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    subtasksWrapper: {
        overflow: "hidden",
    },
    tickStyles: {
        marginLeft: 2,
        marginTop: 1
    }
})