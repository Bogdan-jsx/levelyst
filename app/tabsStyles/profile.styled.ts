import { RegularText, SmallTextBold, TinyText } from "@/components/commonStyles";
import styled from "styled-components/native";


export const Wrapper = styled.SafeAreaView<{bgColor: string, paddingTop: number}>`
    background-color: ${props => props.bgColor};
    padding-top: ${props => props.paddingTop}px;
    flex: 1;
`

export const UserProfileContainer = styled.View<{bgColor: string}>`
    padding: 24px 16px;
    gap: 32px;
    marging-top: 32px;
    flex-direction: row;
    background-color: ${props => props.bgColor};
`

export const ProfileIconWrapper = styled.View<{bgColor: string}>`
    width: 100px;
    height: 100px;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    background-color: ${props => props.bgColor};
`

export const UserInfoContainer = styled.View`
    flex: 1;
`

export const UsernameInput = styled.TextInput<{color: string}>`
    font-family: "Nunito Sans Semibold";
    font-size: 14px;
    border-width: 2px;
    padding: 8px 16px;
    border-radius: 19.5px;
    color: ${props => props.color};
    border-color: ${props => props.color};
`

export const EditUsernameText = styled(TinyText)`
    margin-top: 4px;
`

export const UserLevelText = styled(SmallTextBold)`
    margin-top: 16px;
`

export const WeeklyStatsContainer = styled.View`
    margin-top: 32px;
`

export const WeeklyStatsHeader = styled(RegularText)`
    margin-left: 16px;
`

export const Divider = styled.View<{bgColor: string}>`
    width: 100%;
    height: 2px;
    margin-top: 8px;
    background-color: ${props => props.bgColor};
`

export const StatsLineWrapper = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 0 16px;
    margin-top: 16px;
`
