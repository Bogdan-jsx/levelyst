import { RegularText, RegularTextBold } from '@/components/commonStyles';
import { CustomAddTaskHeader } from '@/components/CustomAddTaskHeader';
import { addTask, addTaskSample, getAllBadges } from '@/db/queries/tasks';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Appearance, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddIcon from "../icons/add_icon.svg";
import DeleteIcon from "../icons/delete_icon.svg";
import Tick from "../icons/tick.svg";
import { TaskSectionNames } from './(tabs)/index';
import { AddIconContainer, AddTaskContainer, BadgeOption, BadgesContainer, DifficultySelect, DifficultySelectDivider, DifficultySelectOption, DifficultySelectText, Divider, DueDate, DueDateEdit, MainInfoContainer, MainInput, SaveTask, SubtaskContainer, SubtaskInput, SubtasksHeader, Wrapper } from './addTask.styled';

export enum Difficulties {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard',
    INSANE = 'Insane'
}

export const expAmounts = {
    [Difficulties.EASY]: 10,
    [Difficulties.MEDIUM]: 15,
    [Difficulties.HARD]: 20,
    [Difficulties.INSANE]: 30
}

export default function AddTask() {
    const theme = useTheme();
    const {name} = useLocalSearchParams()
    const router = useRouter();
    const colorScheme = Appearance.getColorScheme();
    const insets = useSafeAreaInsets();

    const [title, setTitle] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date);
    const [dateOpen, setDateOpen] = useState<boolean>(false);
    const [repeatEachDays, setRepeatEachDays] = useState<number>(0);
    const [difficultyLevel, setDifficultyLevel] = useState<Difficulties>(Difficulties.EASY);
    const [badges, setBadges] = useState<{name: string, id: number}[]>([]);
    const [selectedBadges, setSelectedBadges] = useState<number[]>([]);
    const [subtasks, setSubtasks] = useState<string[]>(['']);

    const toggleSelectedBadge = useCallback((id: number) => {
        if (selectedBadges.indexOf(id) === -1) {
            setSelectedBadges([...selectedBadges, id]);
        } else {
            setSelectedBadges(selectedBadges.filter((item) => item !== id));
        }
    }, [selectedBadges])  

    const fetchData = useCallback(async () => {
        setBadges(await getAllBadges() as {name: string, id: number}[]);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const scrollRef = useRef<ScrollView>(null);

    const saveTask = useCallback(async () => {
        if (!title || !difficultyLevel || ((!date && name === TaskSectionNames.SINGLE_TIME) || (!repeatEachDays && name === TaskSectionNames.REPEATABLE))) return;
        
        const tempSubtasks = subtasks.filter((item: string) => item !== '');
        if (name === TaskSectionNames.SINGLE_TIME) {
            await addTask({title, expAmount: expAmounts[difficultyLevel], dueDate: date, badges: selectedBadges, subtasks: tempSubtasks[0] !== '' ? tempSubtasks : []}, false);
        } else {
            await addTaskSample({title, expAmount: expAmounts[difficultyLevel], repeatEachDays, badges: selectedBadges, subtasks: tempSubtasks[0] !== '' ? tempSubtasks : []})
        }
        
        router.back();
    }, [date, difficultyLevel, name, repeatEachDays, router, selectedBadges, subtasks, title])

    return (
        <Wrapper paddingBottom={insets.bottom} bgColor={theme.colors.background}>
            <CustomAddTaskHeader />
            <Portal>
                <Modal visible={dateOpen} onDismiss={() => setDateOpen(false)} contentContainerStyle={[Platform.OS === 'ios' ? {backgroundColor: colorScheme === 'dark' ? 'black' : 'white'} : {}, styles.modalStyles]}>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            if (selectedDate && selectedDate > new Date()) setDate(selectedDate);
                            if (selectedDate && selectedDate < new Date()) setDate(new Date);
                            if (Platform.OS === 'android') setDateOpen(false);
                        }} 
                    />
                    <Button onPress={() => setDateOpen(false)} textColor={colorScheme === 'dark' ? 'white' : 'black'}>Submit</Button>
                </Modal>
            </Portal>
            <AddTaskContainer>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex} keyboardVerticalOffset={Platform.OS === 'ios' ? 98 : 0}>
                    <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.scrollViewContainerStyle} keyboardShouldPersistTaps="handled">
                        <MainInfoContainer>
                            <MainInput placeholder='Title...'  placeholderTextColor={theme.colors.secondary} borderColor={theme.colors.secondary} onChangeText={setTitle} color={theme.colors.onBackground} />
                            {name === TaskSectionNames.SINGLE_TIME ? (
                                <DueDate>
                                    <RegularText color={theme.colors.onBackground}>To complete until <RegularTextBold color={theme.colors.primary}>{date.toLocaleDateString()}</RegularTextBold></RegularText>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            setDateOpen(true);
                                            Keyboard.dismiss();
                                        }}>
                                        <DueDateEdit color={theme.colors.primary}>Edit</DueDateEdit>
                                    </TouchableOpacity>
                                </DueDate>
                            ) : (
                                <MainInput value={String(repeatEachDays || '')} placeholder='Repeat once in ... days'  placeholderTextColor={theme.colors.secondary} color={theme.colors.onBackground} borderColor={theme.colors.secondary} onChangeText={(newVal) => {
                                    const numeric = newVal.replace(/[^0-9]/g, '');
                                    setRepeatEachDays(Number(numeric));
                                }} />
                            )}
                        
                            <DifficultySelect borderColor={theme.colors.secondary}>
                                <DifficultySelectOption bgColor={difficultyLevel === Difficulties.EASY ? theme.colors.secondary : theme.colors.background} onPress={() => setDifficultyLevel(Difficulties.EASY)}>
                                    <DifficultySelectText color={difficultyLevel === Difficulties.EASY ? theme.colors.primary : theme.colors.onSurface} isBold={difficultyLevel === Difficulties.EASY}>Easy</DifficultySelectText>
                                </DifficultySelectOption>
                                <DifficultySelectDivider bgColor={theme.colors.secondary}/>
                                <DifficultySelectOption bgColor={difficultyLevel === Difficulties.MEDIUM ? theme.colors.secondary : theme.colors.background} onPress={() => setDifficultyLevel(Difficulties.MEDIUM)}>
                                    <DifficultySelectText color={difficultyLevel === Difficulties.MEDIUM ? theme.colors.primary : theme.colors.onSurface} isBold={difficultyLevel === Difficulties.MEDIUM}>Medium</DifficultySelectText>
                                </DifficultySelectOption>
                                <DifficultySelectDivider bgColor={theme.colors.secondary}/>
                                <DifficultySelectOption bgColor={difficultyLevel === Difficulties.HARD ? theme.colors.secondary : theme.colors.background} onPress={() => setDifficultyLevel(Difficulties.HARD)}>
                                    <DifficultySelectText color={difficultyLevel === Difficulties.HARD ? theme.colors.primary : theme.colors.onSurface} isBold={difficultyLevel === Difficulties.HARD}>Hard</DifficultySelectText>
                                </DifficultySelectOption>
                                <DifficultySelectDivider bgColor={theme.colors.secondary}/>
                                <DifficultySelectOption bgColor={difficultyLevel === Difficulties.INSANE ? theme.colors.secondary : theme.colors.background} onPress={() => setDifficultyLevel(Difficulties.INSANE)}>
                                    <DifficultySelectText color={difficultyLevel === Difficulties.INSANE ? theme.colors.primary : theme.colors.onSurface} isBold={difficultyLevel === Difficulties.INSANE}>Insane</DifficultySelectText>
                                </DifficultySelectOption>
                            </DifficultySelect>
                            <BadgesContainer>
                                {badges && badges.map((item: {name: string, id: number}) => (
                                    <BadgeOption key={item.id} onPress={() => toggleSelectedBadge(item.id)} borderColor={selectedBadges.indexOf(item.id) !== -1 ? theme.colors.primary : theme.colors.secondary}>
                                        {selectedBadges.indexOf(item.id) !== -1 && (
                                            <Tick width={16} height={11} color={theme.colors.onBackground} />
                                        )}
                                        <RegularText color={selectedBadges.indexOf(item.id) !== -1 ? theme.colors.primary : theme.colors.onSurface}>{item.name}</RegularText>
                                    </BadgeOption>
                                ))}
                            </BadgesContainer>
                        </MainInfoContainer>
                        <View>
                            <SubtasksHeader color={theme.colors.onBackground}>Subtasks</SubtasksHeader>
                            <Divider bgColor={theme.colors.secondary}/>
                            {subtasks && subtasks.map((item: string, index: number) => (
                                <SubtaskContainer key={index}>
                                    <SubtaskInput 
                                        placeholder='Subtask...'  
                                        placeholderTextColor={theme.colors.secondary} 
                                        borderColor={theme.colors.secondary}
                                        color={theme.colors.onBackground} 
                                        value={item}
                                        onChangeText={(newVal) => {
                                            const temp = [...subtasks];
                                            temp[index] = newVal;
                                            setSubtasks(temp);
                                        }}  
                                        onFocus={() => {
                                            if (index === subtasks.length - 1) {
                                                setTimeout(() => {
                                                    scrollRef.current?.scrollToEnd({ animated: true });
                                                }, 300);
                                            }
                                        }}
                                    />
                                    <TouchableOpacity 
                                        disabled={item === ''}
                                        onPress={() => {
                                            if (subtasks.length <= 1) return;
                                            const temp = [...subtasks];
                                            temp.splice(index, 1);
                                            setSubtasks(temp);
                                        }}>
                                        <DeleteIcon width={22} height={24} color={item === '' ? theme.colors.secondary : theme.colors.onBackground}  />
                                    </TouchableOpacity>
                                </SubtaskContainer>
                            ))}
                            <AddIconContainer disabled={subtasks[subtasks.length-1] === ''} onPress={() => {
                                    setSubtasks([...subtasks, '']);
                                    setTimeout(() => {
                                        scrollRef.current?.scrollToEnd({ animated: true });
                                    }, 100);
                                }}>
                                <AddIcon width={32} height={32} color={subtasks[subtasks.length-1] === '' ? theme.colors.secondary : theme.colors.onBackground} />
                            </AddIconContainer>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View>
                    <Divider bgColor={theme.colors.secondary} />
                    <TouchableOpacity onPress={saveTask}>
                        <SaveTask color={theme.colors.onBackground}>Save task</SaveTask>
                    </TouchableOpacity>
                </View>
            </AddTaskContainer>
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    scrollViewContainerStyle: {
        flexGrow: 1
    },
    modalStyles: {
        padding: 20, 
        margin: 10
    }
})