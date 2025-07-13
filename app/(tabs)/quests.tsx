import { ProgressBarBackground, ProgressBarFilling, RegularText } from "@/components/commonStyles";
import { getQuests, updateQuestsStatus } from "@/db/queries/quests";
import { Quest } from "@/types/quests";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Platform, ScrollView } from "react-native";
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DailyQuestsContainer, Divider, QuestItem, QuestProgress, QuestReward, QuestsSectionTitle, QuestsWrapper, WeeklyQuestsContainer, Wrapper } from "../tabsStyles/quests.styled";

export default function QuestsScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    
    const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
    const [weeklyQuests, setWeeklyQuests] = useState<Quest[]>([]);

    const fetchData = useCallback(async () => {
        await updateQuestsStatus();
        const daily: Quest[] = await getQuests('daily')
        const weekly: Quest[] = await getQuests('weekly')
        setDailyQuests(daily);
        setWeeklyQuests(weekly);
    }, [])
    
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    )

    return (
        <Wrapper bgColor={theme.colors.background} paddingTop={Platform.OS === 'android' ? insets.top + 12 : 0}>
            <ScrollView>
                <DailyQuestsContainer>
                    <QuestsSectionTitle color={theme.colors.onBackground}>Daily</QuestsSectionTitle>
                    <Divider bgColor={theme.colors.secondary} />
                    <QuestsWrapper>
                        {dailyQuests && dailyQuests.map((item) => (
                            <QuestItem key={item.id} shadowOpacity={item.done === 1 ? 0 : .35} bgColor={item.done === 1 ? theme.colors.secondary : theme.colors.surface}>
                                <RegularText color={item.done === 1 ? theme.colors.onBackground : theme.colors.primary}>{item.title}</RegularText>
                                <QuestReward color={item.done === 1 ? theme.colors.onBackground : theme.colors.primary}>{item.reward} coins</QuestReward>
                                <QuestProgress color={item.done === 1 ? theme.colors.onSecondary : theme.colors.onBackground}>Completed {item.progress} out of {item.goal}</QuestProgress>
                                <ProgressBarBackground bgColor={theme.colors.primaryContainer}><ProgressBarFilling widthPercentage={item?.progress/item?.goal * 100} bgColor={item.done === 1 ? theme.colors.onSecondary : theme.colors.onSurface} /></ProgressBarBackground>
                            </QuestItem>
                        ))}
                    </QuestsWrapper>
                </DailyQuestsContainer>
                <WeeklyQuestsContainer>
                    <QuestsSectionTitle color={theme.colors.onBackground}>Weekly</QuestsSectionTitle>
                    <Divider bgColor={theme.colors.secondary} />
                    <QuestsWrapper>
                        {weeklyQuests && weeklyQuests.map((item) => (
                            <QuestItem key={item.id} shadowOpacity={item.done === 1 ? 0 : .35} bgColor={item.done === 1 ? theme.colors.secondary : theme.colors.surface}>
                                <RegularText color={item.done === 1 ? theme.colors.onBackground : theme.colors.primary}>{item.title}</RegularText>
                                <QuestReward color={item.done === 1 ? theme.colors.onBackground : theme.colors.primary}>{item.reward} coins</QuestReward>
                                <QuestProgress color={item.done === 1 ? theme.colors.onSecondary : theme.colors.onBackground}>Completed {item.progress} out of {item.goal}</QuestProgress>
                                <ProgressBarBackground bgColor={theme.colors.primaryContainer}><ProgressBarFilling widthPercentage={item?.progress/item?.goal * 100} bgColor={item.done === 1 ? theme.colors.onSecondary : theme.colors.onSurface} /></ProgressBarBackground>
                            </QuestItem>
                        ))}
                    </QuestsWrapper>
                </WeeklyQuestsContainer>
            </ScrollView>
        </Wrapper>
    )
}