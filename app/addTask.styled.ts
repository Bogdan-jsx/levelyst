import { RegularText, RegularTextBold, RegularTextToggle } from "@/components/commonStyles";
import styled from "styled-components/native";


export const Wrapper = styled.SafeAreaView<{paddingBottom: number, bgColor: string}>`
    flex: 1;
    padding-bottom: ${props => props.paddingBottom}px;
    background-color: ${props => props.bgColor};
`

export const AddTaskContainer = styled.View`
    flex: 1;
`

export const MainInfoContainer = styled.View`
    padding: 24px 16px;
    gap: 24px;
`

export const MainInput = styled.TextInput<{borderColor: string, color: string}>`
    padding: 8px 16px;
    border-radius: 18.5px;
    border-width: 2px;
    border-color: ${props => props.borderColor};
    color: ${props => props.color};
`

export const DueDate = styled.View`
    flex-direction: row;
    justify-content: space-between;
`

export const DueDateEdit = styled(RegularTextBold)`
    text-decoration: underline solid ${props => props.color};
`

export const DifficultySelect = styled.View<{borderColor: string}>`
    border-radius: 19.5px;
    border-color: ${props => props.borderColor};
    border-width: 2px;
    width: 100%;
    flex-direction: row;
    overflow: hidden;
`

export const DifficultySelectOption = styled.TouchableOpacity<{bgColor: string}>`
    padding: 8px 0;
    flex: 1;
    background-color: ${props => props.bgColor};
`

export const DifficultySelectDivider = styled.View<{bgColor: string}>`
    width: 2px;
    height: 100%;
    background-color: ${props => props.bgColor};
`

export const DifficultySelectText = styled(RegularTextToggle)`
    text-align: center;
`

export const BadgesContainer = styled.View`
    gap: 8px;
    flex-direction: row;
    flex-wrap: wrap;    
`

export const BadgeOption = styled.TouchableOpacity<{borderColor: string}>`
    padding: 8px 24px; 
    border: 2px solid ${props => props.borderColor};
    border-radius: 19.5px;
    flex-direction: row;
    gap: 8px;
    align-items: center;
`

export const SubtasksHeader = styled(RegularText)`
    padding: 0 16px;
`

export const Divider = styled.View<{bgColor: string}>`
    width: 100%;
    height: 2px;
    margin-top: 8px;
    background-color: ${props => props.bgColor};
`

export const SubtaskContainer = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 0 16px;
    margin-top: 24px;
`

export const SubtaskInput = styled(MainInput)`
    flex: 1;
`

export const AddIconContainer = styled.TouchableOpacity`
    margin: 16px 0 0 16px;
`

export const SaveTask = styled.Text<{color: string}>`
    font-family: "Nunito Sans Semibold";
    font-size: 14px;
    text-align: center;
    margin-top: 16px;
    color: ${props => props.color};
`
