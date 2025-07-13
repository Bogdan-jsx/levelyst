import styled from "styled-components/native";

export const Divider = styled.View<{bgColor: string}>`
    width: 100%;
    height: 2px;
    margin-top: 8px;
    background-color: ${props => props.bgColor};
`

//ProgressBarBackground
export const ProgressBarBackground = styled.View<{bgColor: string}>`
    width: 100%;
    height: 8px;
    borderRadius: 4px;
    margin-top: 8px;
    background-color: ${props => props.bgColor};
`

export const ProgressBarFilling = styled.View<{bgColor: string, widthPercentage: number}>`
    height: 8px;
    border-radius: 4px;
    width: ${props => props.widthPercentage}%;
    background-color: ${props => props.bgColor};
`

///

//ModalSecondaryText, UsernameText, EmptyStateText
export const LargeText = styled.Text<{color: string}>`
    font-family: "Nunito Sans";
    font-size: 16px;
    color: ${props => props.color};
`
//EmptyStateTextBold, ModalText
export const LargeTextBold = styled.Text<{color: string}>`
    font-family: "Nunito Sans Semibold";
    font-size: 16px;
    color: ${props => props.color};
`

///////

//WeeklyStatsHeader, QuestsSectionTitle, QuestTitle, DueDateText, SubtasksHeader, StyledText, TaskTitleText
export const RegularText = styled.Text<{color: string}>`
    font-family: "Nunito Sans";
    font-size: 14px;
    color: ${props => props.color};
`

//DueDateTextEmphasize, DueDateEdit, HeaderText
export const RegularTextBold = styled.Text<{color: string}>`
    font-family: "Nunito Sans Semibold";
    font-size: 14px;
    color: ${props => props.color};
`

//DifficultySelectText, TabItemText
export const RegularTextToggle = styled.Text<{color: string, isBold: boolean}>`
    font-family: "Nunito Sans${props => props.isBold ? ' Semibold' : ''}";
    font-size: 14px;
    color: ${props => props.color};
`

/////

//QuestProgress, StatsLineName, ToggleButtonText, SubtaskText, BadgeText, TaskSubtitleText
export const SmallText = styled.Text<{color: string}>`
    font-family: "Nunito Sans";
    font-size: 12px;
    color: ${props => props.color};
`

//StatsLineValue, UserLevelText, QuestReward, SubtitleEmphasize
export const SmallTextBold = styled.Text<{color: string}>`
    font-family: "Nunito Sans Semibold";
    font-size: 12px;
    color: ${props => props.color};
`

/////
//UserExpLeft, EditUsernameText
export const TinyText = styled.Text<{color: string}>`
    font-family: "Nunito Sans";
    font-size: 10px;
    color: ${props => props.color};
`
