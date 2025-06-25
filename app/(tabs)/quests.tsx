import { getQuests } from "@/db/queries/quests";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function QuestsScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    
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
        <SafeAreaView style={[{backgroundColor: theme.colors.background, paddingTop: Platform.OS === 'android' ? insets.top + 12 : 0}]}>
            <ScrollView>
                <View style={{paddingTop: 32}}>
                    <Text style={{fontFamily: "Nunito Sans", fontSize: 14, color: theme.colors.onBackground, marginLeft: 16}}>Daily</Text>
                    <View style={{width: '100%', height: 2, backgroundColor: theme.colors.secondary, marginTop: 8}} />
                    <View style={{paddingTop: 24, paddingHorizontal: 16, gap: 24}}>
                        {dailyQuests && dailyQuests.map((item) => (
                            <View key={item.id} style={{padding: 16, backgroundColor: item.done === 1 ? theme.colors.secondary : theme.colors.surface, shadowOffset: {width: 0, height: 0}, shadowRadius: 10, shadowColor: 'black', shadowOpacity: item.done === 1 ? 0 : .35, borderRadius: 12}}>
                                <Text style={{fontFamily: 'Nunito Sans', fontSize: 14, color: item.done === 1 ? theme.colors.onBackground : theme.colors.primary}}>{item.title}</Text>
                                <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: item.done === 1 ? theme.colors.onBackground : theme.colors.primary, fontWeight: 600, marginTop: 4}}>{item.reward} coins</Text>
                                <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: item.done === 1 ? theme.colors.onSecondary : theme.colors.onBackground, marginTop: 16}}>Completed {item.progress} out of {item.goal}</Text>
                                <View style={{width: '100%', height: 8, borderRadius: 4, backgroundColor: theme.colors.primaryContainer, marginTop: 8}}><View style={{width: `${item?.progress/item?.goal * 100}%`, height: 8, borderRadius: 4, backgroundColor: item.done === 1 ? theme.colors.onSecondary : theme.colors.onSurface}} /></View>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={{paddingTop: 32, paddingBottom: 24}}>
                    <Text style={{fontFamily: "Nunito Sans", fontSize: 14, color: theme.colors.onBackground, marginLeft: 16}}>Weekly</Text>
                    <View style={{width: '100%', height: 2, backgroundColor: theme.colors.secondary, marginTop: 8}} />
                    <View style={{paddingTop: 24, paddingHorizontal: 16, gap: 24}}>
                        {weeklyQuests && weeklyQuests.map((item) => (
                            <View key={item.id} style={{padding: 16, backgroundColor: item.done === 1 ? theme.colors.secondary : theme.colors.surface, shadowOffset: {width: 0, height: 0}, shadowRadius: 10, shadowColor: 'black', shadowOpacity: item.done === 1 ? 0 : .35, borderRadius: 12}}>
                                <Text style={{fontFamily: 'Nunito Sans', fontSize: 14, color: item.done === 1 ? theme.colors.onBackground : theme.colors.primary}}>{item.title}</Text>
                                <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: item.done === 1 ? theme.colors.onBackground : theme.colors.primary, fontWeight: 600, marginTop: 4}}>{item.reward} coins</Text>
                                <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: item.done === 1 ? theme.colors.onSecondary : theme.colors.onBackground, marginTop: 16}}>Completed {item.progress} out of {item.goal}</Text>
                                <View style={{width: '100%', height: 8, borderRadius: 4, backgroundColor: theme.colors.primaryContainer, marginTop: 8}}><View style={{width: `${item?.progress/item?.goal * 100}%`, height: 8, borderRadius: 4, backgroundColor: item.done === 1 ? theme.colors.onSecondary : theme.colors.onSurface}} /></View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}