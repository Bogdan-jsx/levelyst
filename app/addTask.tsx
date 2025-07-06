import { addTask, addTaskSample, getAllBadges } from '@/db/queries/tasks';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Appearance, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, useTheme } from "react-native-paper";
import AddIcon from "../icons/add_icon.svg";
import DeleteIcon from "../icons/delete_icon.svg";
import Tick from "../icons/tick.svg";
import { TaskSectionNames } from './(tabs)';

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
        if (name === TaskSectionNames.SINGLE_TIME) {
            await addTask({title, expAmount: expAmounts[difficultyLevel], dueDate: date, badges: selectedBadges, subtasks: subtasks[0] !== '' ? subtasks : []}, false);
        } else {
            await addTaskSample({title, expAmount: expAmounts[difficultyLevel], repeatEachDays, badges: selectedBadges, subtasks: subtasks[0] !== '' ? subtasks : []})
        }
        
        router.back();
    }, [date, difficultyLevel, name, repeatEachDays, router, selectedBadges, subtasks, title])

    return (
        <SafeAreaView style={{flex: 1}}>
            <Portal>
                <Modal visible={dateOpen} onDismiss={() => setDateOpen(false)} contentContainerStyle={Platform.OS === 'ios' ? {backgroundColor: colorScheme === 'dark' ? 'black' : 'white', padding: 20, margin: 10} : {}}>
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
            <View style={{flex: 1}}>
                <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 98 : 0}>
                    <ScrollView ref={scrollRef} style={{flex: 1}} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <View style={{paddingVertical: 24, paddingHorizontal: 16, gap: 24}}>
                        <TextInput placeholder='Title...'  placeholderTextColor={theme.colors.secondary} style={{paddingVertical: 8, paddingHorizontal: 16, borderColor: theme.colors.secondary, borderWidth: 2, borderRadius: 18.5}} onChangeText={setTitle} />
                        {name === TaskSectionNames.SINGLE_TIME ? (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{fontFamily: 'Nunito Sans', fontSize: 14, color: theme.colors.onBackground}}>To complete until <Text style={{fontWeight: 600, color: theme.colors.primary}}>{date.toLocaleDateString()}</Text></Text>
                                <TouchableOpacity 
                                    onPress={() => {
                                        setDateOpen(true);
                                        Keyboard.dismiss();
                                    }}>
                                    <Text style={{fontFamily: "Nunito Sans", fontSize: 14, fontWeight: 600, color: theme.colors.primary, textDecorationStyle: 'solid', textDecorationColor: theme.colors.primary, textDecorationLine: 'underline'}}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TextInput value={String(repeatEachDays || '')} placeholder='Repeat once in ... days'  placeholderTextColor={theme.colors.secondary} style={{paddingVertical: 8, paddingHorizontal: 16, borderColor: theme.colors.secondary, borderWidth: 2, borderRadius: 18.5}} onChangeText={(newVal) => {
                                const numeric = newVal.replace(/[^0-9]/g, '');
                                setRepeatEachDays(Number(numeric));
                            }} />
                        )}
                        
                        <View style={{borderRadius: 19.5, borderColor: theme.colors.secondary, borderWidth: 2, width: '100%', flexDirection: 'row', overflow: 'hidden'}}>
                            <TouchableOpacity style={{paddingVertical: 8, flex: 1, backgroundColor: difficultyLevel === Difficulties.EASY ? theme.colors.secondary : 'none'}} onPress={() => setDifficultyLevel(Difficulties.EASY)}>
                                <Text style={{fontFamily: 'Nunito Sans',  fontSize: 14, color: difficultyLevel === Difficulties.EASY ? theme.colors.primary : theme.colors.onSurface,  textAlign: 'center', fontWeight: difficultyLevel === Difficulties.EASY ? 600 : 400}}>Easy</Text>
                            </TouchableOpacity>
                            <View style={{width: 2, height: '100%', backgroundColor: theme.colors.secondary}} />
                            <TouchableOpacity style={{paddingVertical: 8, flex: 1, backgroundColor: difficultyLevel === Difficulties.MEDIUM ? theme.colors.secondary : 'none'}} onPress={() => setDifficultyLevel(Difficulties.MEDIUM)}>
                                <Text style={{fontFamily: 'Nunito Sans',  fontSize: 14, color: difficultyLevel === Difficulties.MEDIUM ? theme.colors.primary : theme.colors.onSurface,  textAlign: 'center', fontWeight: difficultyLevel === Difficulties.MEDIUM ? 600 : 400}}>Medium</Text>
                            </TouchableOpacity>
                            <View style={{width: 2, height: '100%', backgroundColor: theme.colors.secondary}} />
                            <TouchableOpacity style={{paddingVertical: 8, flex: 1, backgroundColor: difficultyLevel === Difficulties.HARD ? theme.colors.secondary : 'none'}} onPress={() => setDifficultyLevel(Difficulties.HARD)}>
                                <Text style={{fontFamily: 'Nunito Sans',  fontSize: 14, color: difficultyLevel === Difficulties.HARD ? theme.colors.primary : theme.colors.onSurface,  textAlign: 'center', fontWeight: difficultyLevel === Difficulties.HARD ? 600 : 400}}>Hard</Text>
                            </TouchableOpacity>
                            <View style={{width: 2, height: '100%', backgroundColor: theme.colors.secondary}} />
                            <TouchableOpacity style={{paddingVertical: 8, flex: 1, backgroundColor: difficultyLevel === Difficulties.INSANE ? theme.colors.secondary : 'none'}} onPress={() => setDifficultyLevel(Difficulties.INSANE)}>
                                <Text style={{fontFamily: 'Nunito Sans',  fontSize: 14, color: difficultyLevel === Difficulties.INSANE ? theme.colors.primary : theme.colors.onSurface,  textAlign: 'center', fontWeight: difficultyLevel === Difficulties.INSANE ? 600 : 400}}>Insane</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{gap: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
                            {badges && badges.map((item: {name: string, id: number}) => (
                                <TouchableOpacity key={item.id} onPress={() => toggleSelectedBadge(item.id)} style={{paddingVertical: 8, paddingHorizontal: 24, borderWidth: 2, borderColor: selectedBadges.indexOf(item.id) !== -1 ? theme.colors.primary : theme.colors.secondary, borderRadius: 19.5, flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                                    {selectedBadges.indexOf(item.id) !== -1 && (
                                        <Tick width={16} height={11} color={theme.colors.onBackground} />
                                    )}
                                    <Text style={{fontFamily: "Nunito Sans", fontSize: 14, color: selectedBadges.indexOf(item.id) !== -1 ? theme.colors.primary : theme.colors.onSurface}}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View>
                        <Text style={{fontFamily: 'Nunito Sans', fontSize: 14, color: theme.colors.onBackground, paddingHorizontal: 16}}>{name}</Text>
                        <View style={{width: '100%', height: 2, backgroundColor: theme.colors.secondary, marginTop: 8}} />
                        {subtasks && subtasks.map((item: string, index: number) => (
                            <View key={index} style={{flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, marginTop: 24}}>
                                <TextInput 
                                    placeholder='Subtask...'  
                                    placeholderTextColor={theme.colors.secondary} 
                                    style={{paddingVertical: 8, paddingHorizontal: 16, borderColor: theme.colors.secondary, borderWidth: 2, borderRadius: 18.5, flex: 1}}
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
                            </View>
                        ))}
                        <TouchableOpacity disabled={subtasks[subtasks.length-1] === ''} style={{marginTop: 16, marginLeft: 16}} onPress={() => {
                                setSubtasks([...subtasks, '']);
                                setTimeout(() => {
                                    scrollRef.current?.scrollToEnd({ animated: true });
                                }, 100);
                            }}>
                            <AddIcon width={32} height={32} color={subtasks[subtasks.length-1] === '' ? theme.colors.secondary : theme.colors.onBackground} />
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View>
                    <View style={{width: '100%', height: 2, backgroundColor: theme.colors.secondary, marginTop: 8}} />
                    <TouchableOpacity onPress={saveTask}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 14, fontWeight: 600, color: theme.colors.onBackground, textAlign: 'center', marginTop: 16}}>Save task</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}