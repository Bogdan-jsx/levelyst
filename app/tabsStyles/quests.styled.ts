import { RegularText, SmallText, SmallTextBold } from "@/components/commonStyles";
import { Platform } from "react-native";
import styled from "styled-components/native";

export const Wrapper = styled.SafeAreaView<{bgColor: string, paddingTop: number}>`
    background-color: ${props => props.bgColor};
    padding-top: ${props => props.paddingTop}px;
`

export const DailyQuestsContainer = styled.View`
    padding-top: 32px;
    ${Platform.OS === 'android' ? 'elevation: 8;' : ''}
`

export const WeeklyQuestsContainer = styled(DailyQuestsContainer)`
    padding-bottom: 24px
`

export const QuestsSectionTitle = styled(RegularText)`
    margin-left: 16px;
`

export const Divider = styled.View<{bgColor: string}>`
    width: 100%;
    height: 2px;
    margin-top: 8px;
    background-color: ${props => props.bgColor};
`

export const QuestsWrapper = styled.View`
    padding: 24px 16px 0 16px;
    gap: 24px;
    ${Platform.OS === 'android' ? 'elevation: 8;' : ''}
`

export const QuestItem = styled.View<{bgColor: string, shadowOpacity: number}>`
    padding: 16px;
    background-color: ${props => props.bgColor};
    border-radius: 12px;

    shadow-opacity: ${({ shadowOpacity }) => shadowOpacity};
    shadow-color: #000;
    shadow-offset: 0px 0px;
    shadow-radius: 10px; 

    elevation: ${props => props.shadowOpacity ? 8 : 0};
`

export const QuestReward = styled(SmallTextBold)`
    margin-top: 4px;
`

export const QuestProgress = styled(SmallText)`
    margin-top: 16px;
`