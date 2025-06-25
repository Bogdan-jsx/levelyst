import { addTask, getAllBadges } from '@/db/queries/tasks';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Appearance, Keyboard, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, SegmentedButtons, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    const insets = useSafeAreaInsets();
    const colorScheme = Appearance.getColorScheme();

    const [title, setTitle] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date);
    const [dateOpen, setDateOpen] = useState<boolean>(false);
    const [repeatEachDays, setRepeatEachDays] = useState<number>(1);
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
        if (!title || !date || !difficultyLevel) return;
        await addTask({title, expAmount: expAmounts[difficultyLevel], dueDate: date, badges: selectedBadges, subtasks: subtasks[0] !== '' ? subtasks : [], repeatEveryDays: name === TaskSectionNames.SINGLE_TIME ? null : repeatEachDays});
        router.back();
    }, [date, difficultyLevel, name, repeatEachDays, router, selectedBadges, subtasks, title])

    return (
        <SafeAreaView>
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
            <View style={{paddingVertical: 24, paddingHorizontal: 16, gap: 24}}>
                <TextInput placeholder='Title...'  placeholderTextColor={theme.colors.secondary} style={{paddingVertical: 8, paddingHorizontal: 16, borderColor: theme.colors.secondary, borderWidth: 2, borderRadius: 18.5}} />
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
                <SegmentedButtons
                        value={difficultyLevel}
                        onValueChange={setDifficultyLevel}
                        style={{borderColor: theme.colors.secondary, borderWidth: 2}}
                        buttons={[
                            {
                                value: Difficulties.EASY,
                                label: Difficulties.EASY,
                            },
                            {
                                value: Difficulties.MEDIUM,
                                label: Difficulties.MEDIUM,
                            },
                            {
                                value: Difficulties.HARD,
                                label: Difficulties.HARD,
                            },
                            {
                                value: Difficulties.INSANE,
                                label: Difficulties.INSANE,
                            }
                        ]}
                    />
                <View style={{borderRadius: 19.5, borderColor: theme.colors.secondary, borderWidth: 2, width: '100%', flexDirection: 'row'}}>
                    <Text style={{paddingVertical: 8, fontFamily: 'Nunito Sans', fontSize: 14, color: theme.colors.onSurface, textAlign: 'center', flex: 1}}>Easy</Text>
                    <View style={{width: 2, height: '100%', backgroundColor: theme.colors.secondary}} />
                    <Text style={{paddingVertical: 8, fontFamily: 'Nunito Sans', fontSize: 14, fontWeight: 600, color: theme.colors.primary, textAlign: 'center', flex: 1, backgroundColor: theme.colors.secondary}}>Medium</Text>
                    <View style={{width: 2, height: '100%', backgroundColor: theme.colors.secondary}} />
                    <Text style={{paddingVertical: 8, fontFamily: 'Nunito Sans', fontSize: 14, color: theme.colors.onSurface, textAlign: 'center', flex: 1}}>Hard</Text>
                    <View style={{width: 2, height: '100%', backgroundColor: theme.colors.secondary}} />
                    <Text style={{paddingVertical: 8, fontFamily: 'Nunito Sans', fontSize: 14, color: theme.colors.onSurface, textAlign: 'center', flex: 1}}>Insane</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}