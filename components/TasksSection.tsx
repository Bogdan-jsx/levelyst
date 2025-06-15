import { TaskSectionNames } from "@/app/(tabs)";
import { getAllUndoneTasks, toggleSubtaskDone, toggleTaskDone } from "@/db/queries/tasks";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Card, Checkbox, Chip, List, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TasksSection({name}: {name: TaskSectionNames}) {
    const theme = useTheme()
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    
    const usableHeight = height - insets.top - insets.bottom - 84;
    const halfHeight = usableHeight / 2;

    const [undoneTasks, setUndoneTasks] = useState<any>([]);

    const fetchData = useCallback(async () => {
        const temp: any = await getAllUndoneTasks(name)
        setUndoneTasks(temp);
    }, [name])

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    )
    
    return (
        <Card mode={"contained"} theme={theme} style={{minHeight: halfHeight}}>
            <Card.Title 
                title={`${name} (${undoneTasks?.length})`} 
                titleVariant={"titleLarge"} 
                right={() => (
                    <Link href={{pathname: "/addTask", params: {name}}} style={{marginRight: 12}} >
                        <AntDesign name="plus" size={24} color="black" />
                    </Link>
                )}/>
            <Card.Content style={{paddingHorizontal: 8, gap: 4}}>
                {undoneTasks && undoneTasks.map((item: any) => (
                    <Card mode={"outlined"} theme={theme} key={item.id}>
                        <Card.Title 
                            style={{minHeight: 0, marginTop: 10}}
                            title={item.title} 
                            titleNumberOfLines={3}
                            titleStyle={{textDecorationLine: item.done ? 'line-through' : 'none', textDecorationColor: 'black'}}
                            right={() => (
                                <View style={{borderColor: 'black', borderWidth: 1, borderRadius: '50%', marginRight: 8}}>
                                    <Checkbox status={item.done === 1 ? 'checked' : 'unchecked'} onPress={async () => {
                                        await toggleTaskDone(item.done === 0 ? 1 : 0, item.id);
                                        fetchData();
                                    }} />
                                </View>
                            )}
                        />
                        <Card.Content>
                            <Text variant={"labelSmall"} >{`Complete this task until ${item.due_date_string} to gain ${item.exp_amount} experience`}</Text>
                            <View style={{display: "flex", flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8, marginBottom: 8}}>
                                {item.badges && item.badges.map((item: any, index: number) => (
                                    <Chip key={index} disabled style={{backgroundColor: "#d9cece"}} compact>{item.name}</Chip>
                                ))}
                            </View>
                            {item?.subtasks?.length ? (
                                <List.Accordion title={<Text variant={'titleSmall'}>Expand subtasks</Text>} style={{backgroundColor: 'white', paddingVertical: 0, marginVertical: 0}}>
                                    {item.subtasks.map((subtask: any) => (
                                        <List.Item 
                                            key={subtask.id} 
                                            title={subtask.title} 
                                            titleStyle={{textDecorationLine: subtask.done === 1 ? 'line-through' : 'none', textDecorationColor: 'black'}} 
                                            style={{paddingVertical: 0}} 
                                            right={() => (
                                                <View style={{borderColor: 'black', borderWidth: 1, borderRadius: '50%'}}>
                                                    <Checkbox status={subtask.done === 1 ? 'checked' : 'unchecked'} onPress={async () => {
                                                        await toggleSubtaskDone(subtask.done === 0 ? 1 : 0, subtask.id, item.id);
                                                        fetchData();
                                                    }} />
                                                </View>
                                            )} 
                                            />
                                    ))}
                                </List.Accordion>
                            ) : null}
                        </Card.Content>
                    </Card>
                ))}
            </Card.Content>
        </Card>
    )
}