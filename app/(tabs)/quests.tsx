import { getQuests } from "@/db/queries/quests";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Card, ProgressBar, Text, useTheme } from 'react-native-paper';

export default function QuestsScreen() {
    const theme = useTheme();
    
    const [dailyQuests, setDailyQuests] = useState<any[]>([]);
    const [weeklyQuests, setWeeklyQuests] = useState<any[]>([]);

    const fetchData = useCallback(async () => {
        const daily: any = await getQuests('daily')
        const weekly: any = await getQuests('weekly')
        setDailyQuests(daily);
        setWeeklyQuests(weekly);
    }, [])
    
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    )

    return (
        <SafeAreaView style={{backgroundColor: theme.colors.background}}>
            <ScrollView>
                <View style={{padding: 8, gap: 24}}>
                    <View style={{gap: 8}}>
                        <Text variant={'titleLarge'}>Daily quests: </Text>
                        {dailyQuests && dailyQuests.map((item: any) => (
                            <Card key={item.id} mode={'contained'}>
                                <Card.Title title={item.title} subtitle={`Completed ${item.progress}/${item.goal}`} />
                                <Card.Content style={{gap: 8}}>
                                    <Text variant={'bodyMedium'} >{item.reward} coins</Text>
                                    <ProgressBar progress={item.progress/item.goal} />
                                </Card.Content>
                            </Card>
                        ))}
                    </View>
                    <View style={{gap: 8}}>
                        <Text variant={'titleLarge'}>Weekly quests: </Text>
                        {weeklyQuests && weeklyQuests.map((item: any) => (
                            <Card key={item.id} mode={'contained'}>
                                <Card.Title title={item.title} subtitle={`Completed ${item.progress}/${item.goal}`} />
                                <Card.Content style={{gap: 8}}>
                                    <Text variant={'bodyMedium'} >{item.reward} coins</Text>
                                    <ProgressBar progress={item.progress/item.goal} style={{backgroundColor: theme.colors.surface}} />
                                </Card.Content>
                            </Card>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}