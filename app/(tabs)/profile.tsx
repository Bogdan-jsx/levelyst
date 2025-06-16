import { getProfile } from "@/db/queries/profile";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, View } from "react-native";
import { Avatar, Divider, ProgressBar, Text } from "react-native-paper";

export default function TasksScreen() {
    const screenWidth = Dimensions.get('window').width;

    const [profile, setProfile] = useState<any>();
    const [progress, setProgress] = useState<number>(0)
    
    useEffect(() => {
        if (profile) {
            setProgress(profile.exp_gained / (profile.level * 150));
        }
    }, [profile])

    const fetchData = useCallback(async () => {
        const temp: any = await getProfile()
        setProfile(temp);
    }, [])
    
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    )
    
    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView>
                <View style={{alignItems: 'center', paddingTop: 24, gap: 8, width: '100%', marginBottom: 12}}>
                    <Avatar.Icon icon={'account-circle-outline'} size={128}/>
                    <Text variant={'headlineLarge'}>{profile?.nickname}</Text>
                    <Text variant={'labelLarge'}>Level {profile?.level}</Text>
                    <ProgressBar progress={progress} color={'black'} style={{width: screenWidth - 24}} />
                    <Text variant={'labelLarge'}>Gain {(profile?.level * 150) - profile?.exp_gained} more experience points to level up</Text>
                </View>
                <Divider />
                <View style={{padding: 12, gap: 8}}>
                    <Text variant={'titleLarge'}>Weekly statistics:</Text>
                    <Text variant={'bodyMedium'}>Completed tasks (total): {profile?.completed_singletime_tasks_weekly + profile?.completed_repeatable_tasks_weekly}</Text>
                    <Text variant={'bodyMedium'}>Completed tasks (single-time): {profile?.completed_singletime_tasks_weekly}</Text>
                    <Text variant={'bodyMedium'}>Completed tasks (repeatable): {profile?.completed_repeatable_tasks_weekly}</Text>
                    <Text variant={'bodyMedium'}>Completed insane tasks: {profile?.completed_insane_tasks_weekly}</Text>
                    <Text variant={'bodyMedium'}>Experience gained: {profile?.exp_gained_weekly}</Text>
                    <Text variant={'bodyMedium'}>Achievements gained: {profile?.achievements_gained_weekly}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}