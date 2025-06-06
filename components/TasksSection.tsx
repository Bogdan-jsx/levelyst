import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Card, Checkbox, Chip, List, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TasksSection({name, tasks, type}: {name: string, tasks: any, type: any}) {
    const theme = useTheme()
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    
    const usableHeight = height - insets.top - insets.bottom - 84;
    const halfHeight = usableHeight / 2;
    
    const [undoneTasks, setUndoneTasks] = useState(tasks.filter((item: any) => !item.done))
    
    const toggleDoneTask = useCallback((id: number) => {
        setUndoneTasks(undoneTasks.map((item: any) => {
            if (item.id !== id) {
                return item;
            } else {
                return {...item, done: !item.done, subtasks: item.subtasks.map((subtask: any) => ({...subtask, done: !item.done}))}
            }
        }))
    }, [undoneTasks])

    const toggleDoneSubtask = useCallback((id: number, subtaskId: number) => {
        const task = undoneTasks.find((item: any) => item.id === id);
        if (!task?.subtasks) return;
        let doneSubtasks = 0;
        task.subtasks = task?.subtasks.map((item: any) => {
            if (item.id === subtaskId) {
                doneSubtasks += item.done ? 0 : 1;
                return {...item, done: !item.done};
            } else {
                doneSubtasks += item.done ? 1 : 0;
                return item;
            }
        });
        task.done = task.subtasks.length === doneSubtasks;
        setUndoneTasks(undoneTasks.map((item: any) => item.id === id ? task : item));
    }, [undoneTasks])
    
    return (
        <Card mode={"contained"} theme={theme} style={{minHeight: halfHeight}}>
            <Card.Title 
                title={`${name} (${undoneTasks.length})`} 
                titleVariant={"titleLarge"} 
                right={() => (
                    <Link href={{pathname: "/addTask", params: {type}}} style={{marginRight: 12}} >
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
                                    <Checkbox status={item.done ? 'checked' : 'unchecked'} onPress={() => toggleDoneTask(item.id)} />
                                </View>
                            )}
                        />
                        <Card.Content>
                            <Text variant={"labelSmall"} >{`Complete this task until ${new Date(item.dueDate).toLocaleDateString()} to gain ${item.experience} experience`}</Text>
                            <View style={{display: "flex", flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8, marginBottom: 8}}>
                                {item.badges && item.badges.map((item: any, index: number) => (
                                    <Chip key={index} disabled style={{backgroundColor: "#d9cece"}} compact>{item}</Chip>
                                ))}
                            </View>
                            {item?.subtasks?.length && (
                                <List.Accordion title={<Text variant={'titleSmall'}>Expand subtasks</Text>} style={{backgroundColor: 'white', paddingVertical: 0, marginVertical: 0}}>
                                    {item.subtasks.map((subtask: any) => (
                                        <List.Item 
                                            key={subtask.id} 
                                            title={subtask.title} 
                                            titleStyle={{textDecorationLine: subtask.done ? 'line-through' : 'none', textDecorationColor: 'black'}} 
                                            style={{paddingVertical: 0}} 
                                            right={() => (
                                                <View style={{borderColor: 'black', borderWidth: 1, borderRadius: '50%'}}>
                                                    <Checkbox status={subtask.done ? 'checked' : 'unchecked'} onPress={() => toggleDoneSubtask(item.id, subtask.id)} />
                                                </View>
                                            )} />
                                    ))}
                                </List.Accordion>
                            )}
                        </Card.Content>
                    </Card>
                ))}
            </Card.Content>
        </Card>
    )
}