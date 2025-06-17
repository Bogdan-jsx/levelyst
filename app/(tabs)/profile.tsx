import { changeUsername, getProfile } from "@/db/queries/profile";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Platform, SafeAreaView, ScrollView, View } from "react-native";
import { Avatar, Button, Divider, ProgressBar, Text, TextInput, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TasksScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const screenWidth = Dimensions.get('window').width;

    const [profile, setProfile] = useState<any>();
    const [progress, setProgress] = useState<number>(0)
    const [isChangingUsername, setIsChangingUsername] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    
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
        <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background, paddingTop: Platform.OS === 'android' ? insets.top + 12 : 0}}>
            <ScrollView>
                <View style={{alignItems: 'center', paddingTop: 24, gap: 8, width: '100%', marginBottom: 12}}>
                    <Avatar.Icon icon={'account-circle-outline'} size={128}/>
                    {isChangingUsername ? (
                        <TextInput 
                            mode="outlined" 
                            label={'New username'} 
                            value={username} 
                            onChangeText={setUsername} 
                            onBlur={async () => {
                                if (username === profile.nickname) {
                                    setIsChangingUsername(false);
                                    return;
                                }
                                await changeUsername(username);
                                setIsChangingUsername(false);
                                fetchData();
                            }}
                            style={{width: '90%'}} />
                    ) : (
                        <View>
                            <Text variant={'headlineLarge'}>{profile?.nickname}</Text>
                            <Button onPress={() => {
                                setUsername(profile.nickname);
                                setIsChangingUsername(true);
                            }}>Edit</Button>
                        </View>
                    )}
                    <Text variant={'labelLarge'}>Level {profile?.level}</Text>
                    <ProgressBar progress={progress} style={{width: screenWidth - 24, backgroundColor: theme.colors.surface}} />
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