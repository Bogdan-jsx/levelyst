import { addTask, getAllBadges } from '@/db/queries/tasks';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from "react-native";
import { Button, Chip, Divider, Modal, Portal, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";
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
        <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
            <Portal>
                <Modal visible={dateOpen} onDismiss={() => setDateOpen(false)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 10}}>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            if (selectedDate && selectedDate > new Date()) setDate(selectedDate);
                            if (selectedDate && selectedDate < new Date()) setDate(new Date);
                        }} 
                    />
                    <Button onPress={() => setDateOpen(false)} textColor='black'>Submit</Button>
                </Modal>
            </Portal>
            <View style={{flex: 1}}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 98 : 0}>
                <ScrollView ref={scrollRef} style={{flex: 1}} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={{flex: 1, padding: 8, gap: 8}}>
                    <TextInput label={"Title"} value={title} onChangeText={(newVal) => {
                        setTitle(newVal);
                    }} mode="outlined" />
                    {name === TaskSectionNames.SINGLE_TIME ? (
                        <View style={{flexDirection: "row", alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text variant={'bodyLarge'}>Due date: {date.toLocaleDateString()}</Text>
                            <Button mode="outlined" onPress={() => {
                                setDateOpen(true);
                                Keyboard.dismiss();
                            }}>Change</Button>
                        </View>
                    ) : (
                        <TextInput 
                            mode={'outlined'}
                            keyboardType={'numeric'} 
                            label={'Repeat once in days:'}
                            value={String(repeatEachDays)} 
                            onChangeText={(newVal) => {
                                const numeric = newVal.replace(/[^0-9]/g, '');
                                setRepeatEachDays(Number(numeric));
                            }} 
                        />
                    )}
                    
                    <Text variant={'labelMedium'}>Difficulty level:</Text>
                    <SegmentedButtons
                        value={difficultyLevel}
                        onValueChange={setDifficultyLevel}
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
                    {badges.length > 0 ? (
                        <>
                        <Text variant={'labelMedium'}>Badges (optional):</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 4}}>
                            {badges.map((item) => (
                                <Chip 
                                    key={item.id} 
                                    mode='outlined' 
                                    onPress={() => toggleSelectedBadge(item.id)} 
                                    selected={selectedBadges.indexOf(item.id) !== -1}
                                >
                                    {item.name}
                                </Chip>
                            ))}
                        </View></>
                    ) : null}
                    <Text variant={"labelMedium"}>Subtasks (optional):</Text>
                    {subtasks && subtasks.map((item: string, index: number) => (
                        <TextInput 
                            key={index} 
                            mode={'outlined'} 
                            label={'Subtask title'} 
                            right={<TextInput.Icon icon={'trash-can-outline'} onPress={() => {
                                if (subtasks.length <= 1) return;
                                const temp = [...subtasks];
                                temp.splice(index, 1);
                                setSubtasks(temp);
                            }} />} 
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
                    ))}
                    <Button 
                        icon={'plus'} 
                        style={{alignSelf: 'flex-end'}}
                        onPress={() => {
                            setSubtasks([...subtasks, '']);
                            setTimeout(() => {
                                scrollRef.current?.scrollToEnd({ animated: true });
                              }, 100);
                        }}
                        disabled={subtasks[subtasks.length-1] === ''}
                    >
                        Add subtask
                    </Button>
                    </View>
                </ScrollView>
                
                </KeyboardAvoidingView>
                <View>
                    <Divider />
                    <Button onPress={saveTask}>Save task</Button>
                </View>
            </View>
            
        </SafeAreaView>
    )
}