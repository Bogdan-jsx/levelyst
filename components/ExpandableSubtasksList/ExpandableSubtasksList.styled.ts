import styled from "styled-components/native";


export const ToggleButton = styled.Pressable`
    flex-direction: row;
    align-self: flex-end;
    align-items: center;
    gap: 4px;
    margin: 8px 16px 16px 16px;
    opacity: 1;
`

export const SubtasksContainer = styled.View`
    gap: 2px;
    margin-bottom: 4px;
`

export const SubtaskItem = styled.View<{bgColor: string}>`
    background-color: ${props => props.bgColor};
    padding: 16px;
    flex-direction: row;
    max-width: 100%;
    justify-content: space-between;
`

export const CheckboxWrapper = styled.TouchableOpacity<{bgColor: string}>`
    background-color: ${props => props.bgColor};
    width: 16px;
    height: 16px;
    border-radius: 8px;
`