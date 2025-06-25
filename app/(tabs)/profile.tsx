import { changeUsername, getProfile } from "@/db/queries/profile";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileIcon from "../../icons/profile_icon.svg";

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
               <View style={{paddingHorizontal: 16, paddingVertical: 24, gap: 32, backgroundColor: theme.colors.primary, marginTop: 32, flexDirection: 'row'}}>
                    <View style={{width: 100, height: 100, backgroundColor: theme.colors.secondary, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
                        <ProfileIcon width={64} height={64} color={theme.colors.primary} />
                    </View>
                    <View style={{flex: 1}}>
                        {isChangingUsername ? (
                            <TextInput
                                style={{fontFamily: "Nunito Sans", fontWeight: 600, fontSize: 14, color: theme.colors.secondary, borderWidth: 2, borderColor: theme.colors.secondary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 19.5}}
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
                            />
                        ) : (
                            <>
                                <Text style={{fontFamily: "Nunito Sans", fontSize: 16, color: theme.colors.background}}>{profile?.nickname}</Text>
                                <TouchableOpacity onPress={() => {
                                    setUsername(profile.nickname);
                                    setIsChangingUsername(true);
                                }}>
                                    <Text style={{fontFamily: "Nunito Sans", fontSize: 10, color: theme.colors.secondary, marginTop: 4}}>Edit</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.secondary, fontWeight: 600, marginTop: 16}}>Level {profile?.level}</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 10, color: theme.colors.secondary}}>({(profile?.level * 150) - profile?.exp_gained} experience left to level up)</Text>
                        <View style={{width: '100%', height: 8, borderRadius: 4, backgroundColor: theme.colors.primaryContainer, marginTop: 8}}><View style={{width: `${progress*100}%`, height: 8, borderRadius: 4, backgroundColor: theme.colors.onSurface}} /></View>
                    </View>
               </View>
               <View style={{marginTop: 32}}>
                    <Text style={{fontFamily: "Nunito Sans", fontSize: 14, color: theme.colors.onBackground, marginLeft: 16}}>Weekly statistics</Text>
                    <View style={{width: '100%', height: 2, backgroundColor: theme.colors.secondary, marginTop: 8}} />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16}}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.onBackground}}>Completed tasks</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.primary, fontWeight: 600}}>{profile?.completed_singletime_tasks_weekly + profile?.completed_repeatable_tasks_weekly}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16}}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.onBackground}}>Completed single-time tasks</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.primary, fontWeight: 600}}>{profile?.completed_singletime_tasks_weekly}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16}}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.onBackground}}>Completed repeatable tasks</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.primary, fontWeight: 600}}>{profile?.completed_repeatable_tasks_weekly}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16}}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.onBackground}}>Completed hard-level tasks</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.primary, fontWeight: 600}}>0</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16}}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.onBackground}}>Completed insane-level tasks</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.primary, fontWeight: 600}}>{profile?.completed_insane_tasks_weekly}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16}}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.onBackground}}>Experience gained</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.primary, fontWeight: 600}}>{profile?.exp_gained_weekly}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16}}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.onBackground}}>Expired tasks</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.primary, fontWeight: 600}}>0</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16}}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.onBackground}}>Tasks completion in time percentage</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.primary, fontWeight: 600}}>0</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16}}>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.onBackground}}>Average completed tasks per day</Text>
                        <Text style={{fontFamily: "Nunito Sans", fontSize: 12, color: theme.colors.primary, fontWeight: 600}}>0</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}