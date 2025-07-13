import { LargeText, ProgressBarBackground, ProgressBarFilling, SmallText, SmallTextBold, TinyText } from "@/components/commonStyles";
import { changeUsername, getProfile } from "@/db/queries/profile";
import { getAllStats } from "@/db/queries/stats";
import { Profile } from "@/types/profile";
import { Stats } from "@/types/stats";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileIcon from "../../icons/profile_icon.svg";
import { Divider, EditUsernameText, ProfileIconWrapper, StatsLineWrapper, UserInfoContainer, UserLevelText, UsernameInput, UserProfileContainer, WeeklyStatsContainer, WeeklyStatsHeader, Wrapper } from "../tabsStyles/profile.styled";

export default function TasksScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const [profile, setProfile] = useState<Profile | null>();
    const [stats, setStats] = useState<Stats | null>();
    const [progress, setProgress] = useState<number>(0)
    const [isChangingUsername, setIsChangingUsername] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    
    useEffect(() => {
        if (profile) {
            setProgress(profile.exp_gained / (profile.level * 150));
        }
    }, [profile])

    const fetchData = useCallback(async () => {
        const temp: Profile | null = await getProfile()
        setProfile(temp);
        const tempStats: Stats | null = await getAllStats('weekly');
        setStats(tempStats);
    }, [])
    
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    )
    
    return (
        <Wrapper bgColor={theme.colors.background} paddingTop={Platform.OS === 'android' ? insets.top + 12 : 0}>
            <ScrollView>
                <UserProfileContainer bgColor={theme.colors.primary}>
                    <ProfileIconWrapper bgColor={theme.colors.secondary}>
                        <ProfileIcon width={64} height={64} color={theme.colors.primary} />
                    </ProfileIconWrapper>
                    <UserInfoContainer>
                        {isChangingUsername ? (
                            <UsernameInput
                                color={theme.colors.secondary}
                                value={username} 
                                onChangeText={setUsername} 
                                onBlur={async () => {
                                    if (username === profile?.nickname) {
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
                                <LargeText color={theme.colors.background}>{profile?.nickname}</LargeText>
                                <TouchableOpacity onPress={() => {
                                    setUsername(profile?.nickname || '');
                                    setIsChangingUsername(true);
                                }}>
                                    <EditUsernameText color={theme.colors.secondary}>Edit</EditUsernameText>
                                </TouchableOpacity>
                            </>
                        )}
                        <UserLevelText color={theme.colors.secondary}>Level {profile?.level}</UserLevelText>
                        <TinyText color={theme.colors.secondary}>({((profile?.level || 1) * 150) - (profile?.exp_gained || 0)} experience left to level up)</TinyText>
                        <ProgressBarBackground bgColor={theme.colors.primaryContainer}><ProgressBarFilling widthPercentage={progress*100} bgColor={theme.colors.onSurface}/></ProgressBarBackground>
                    </UserInfoContainer>
                </UserProfileContainer>
                <WeeklyStatsContainer>
                    <WeeklyStatsHeader color={theme.colors.onBackground}>Weekly statistics</WeeklyStatsHeader>
                    <Divider bgColor={theme.colors.secondary} />
                    <StatsLineWrapper>
                        <SmallText color={theme.colors.onBackground}>Completed tasks</SmallText>
                        <SmallTextBold color={theme.colors.primary}>{stats?.completedTasks || 0}</SmallTextBold>
                    </StatsLineWrapper>
                    <StatsLineWrapper>
                        <SmallText color={theme.colors.onBackground}>Completed single-time tasks</SmallText>
                        <SmallTextBold color={theme.colors.primary}>{stats?.completedSingleTimeTasks || 0}</SmallTextBold>
                    </StatsLineWrapper>
                    <StatsLineWrapper>
                        <SmallText color={theme.colors.onBackground}>Completed repeatable tasks</SmallText>
                        <SmallTextBold color={theme.colors.primary}>{stats?.completedRepeatableTasks || 0}</SmallTextBold>
                    </StatsLineWrapper>
                    <StatsLineWrapper>
                        <SmallText color={theme.colors.onBackground}>Completed hard-level tasks</SmallText>
                        <SmallTextBold color={theme.colors.primary}>{stats?.completedHardLevelTasks || 0}</SmallTextBold>
                    </StatsLineWrapper>
                    <StatsLineWrapper>
                        <SmallText color={theme.colors.onBackground}>Completed insane-level tasks</SmallText>
                        <SmallTextBold color={theme.colors.primary}>{stats?.completedInsaneLevelTasks || 0}</SmallTextBold>
                    </StatsLineWrapper>
                    <StatsLineWrapper>
                        <SmallText color={theme.colors.onBackground}>Experience gained</SmallText>
                        <SmallTextBold color={theme.colors.primary}>{stats?.experienceGained || 0}</SmallTextBold>
                    </StatsLineWrapper>
                    <StatsLineWrapper>
                        <SmallText color={theme.colors.onBackground}>Expired tasks</SmallText>
                        <SmallTextBold color={theme.colors.primary}>{stats?.expiredTasks || 0}</SmallTextBold>
                    </StatsLineWrapper>
                    <StatsLineWrapper>
                        <SmallText color={theme.colors.onBackground}>Tasks completion in time percentage</SmallText>
                        <SmallTextBold color={theme.colors.primary}>{stats?.tasksCompletedInTimePercentage || 0}%</SmallTextBold>
                    </StatsLineWrapper>
                    <StatsLineWrapper>
                        <SmallText color={theme.colors.onBackground}>Average completed tasks per day</SmallText>
                        <SmallTextBold color={theme.colors.primary}>{stats?.averageCompletedTasksDaily || 0}</SmallTextBold>
                    </StatsLineWrapper>
                </WeeklyStatsContainer>
            </ScrollView>
        </Wrapper>
    )
}