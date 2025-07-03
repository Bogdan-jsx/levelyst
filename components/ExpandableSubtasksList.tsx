import { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import ArrowIcon from "../icons/down-arrow.svg";
import Tick from "../icons/tick.svg";

export const ExpandableSubtasksList = ({task, onSubtaskDonePress}: {task: any, onSubtaskDonePress: (subtask: any, task: any) => void}) => {
    const theme = useTheme()
    
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const [contentHeight, setContentHeight] = useState(0);

    const maxHeight = useSharedValue(999999);
    const opacity = useSharedValue(0);

    useEffect(() => {
        console.log(isExpanded);
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
        if (contentHeight === 0 && task.subtasks.length > 0) {
            setContentHeight(event.nativeEvent.layout.height);
            setIsExpanded(false);
        }
    };

    return (
        <>
            <Pressable onPress={() => setIsExpanded(!isExpanded)} style={{flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', gap: 4, marginTop: 8, marginHorizontal: 16, marginBottom: 16, opacity: 1}}>
                <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.primary}}>{isExpanded ? "Collapse" : "Expand"} {task.subtasks.length} subtasks</Text>
                <ArrowIcon width={12} height={12} color={theme.colors.primary} style={{transform: isExpanded ? [{rotate: '180deg'}] : []}} />
            </Pressable>
            <Animated.View style={[animatedStyle, {overflow: 'hidden'}]}>
                <View onLayout={onContentLayout} style={{gap: 2, marginBottom: 4}}>
                    {task.subtasks.map((subtask: any) => (
                        <View key={subtask.id} style={{backgroundColor: theme.colors.secondary, padding: 16, flexDirection: 'row', maxWidth: '100%', justifyContent: 'space-between'}}>
                            <Text style={{color: subtask.done === 1 ? theme.colors.onSecondary : theme.colors.primary}}>{subtask.title}</Text>
                            <TouchableOpacity disabled={task.done === 1} onPress={() => onSubtaskDonePress(subtask, task)} style={{backgroundColor: theme.colors.surface, width: 16, height: 16, borderRadius: 8}}>
                                {subtask.done === 1 && (
                                    <Tick width={16} height={11} style={{marginLeft: 2, marginTop: 1}} color={task.done === 1 ? theme.colors.onSecondary : theme.colors.primary} />
                                )}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </Animated.View>
        </>
    )
}