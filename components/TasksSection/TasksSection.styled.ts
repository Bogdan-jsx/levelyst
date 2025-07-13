import styled from "styled-components/native";
import { LargeText, LargeTextBold } from "../commonStyles";

export const ModalButtonsContainer = styled.View`
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
`

export const ModalConfirmBtn = styled.TouchableOpacity<{borderColor: string}>`
    border-radius: 17px;
    border-width: 2px;
    padding: 4px 16px;
    border-color: ${props => props.borderColor}
`

export const Wrapper = styled.View`
    margin-top: 24px;
`

export const SectionHeaderContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin: 0 16px;
    align-items: flex-end;
`

export const Divider = styled.View<{bgColor: string}>`
    width: 100%;
    height: 2px;
    margin-top: 8px;
    background-color: ${props => props.bgColor};
`

export const TaskContainer = styled.View<{borderColor: string}>`
    border-bottom-width: 2px;
    border-bottom-color: ${props => props.borderColor};
    gap: 8px
`

export const MainTaskInfo = styled.View`
    flex-direction: row;
    gap: 16px;
    justify-content: space-between;
    max-width: 100%;
    margin: 16px 16px 0 16px;
`

export const TitleWrapper = styled.View`
    flex: 1;
    gap: 8px;
`

export const TaskTickContainer = styled.TouchableOpacity<{bgColor: string}>`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: ${props => props.bgColor};
`

export const BadgesContainer = styled.View<{marginBottom: number}>`
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    margin: 8px 16px ${props => props.marginBottom}px 16px;
`

export const BadgeItem = styled.View<{bgColor: string}>`
    padding: 4px 16px;
    border-radius: 12px;
    background-color: ${props => props.bgColor};
`

export const EmptyStateContainer = styled.View`
    padding: 32px 48px;
    gap: 16px;
`

export const EmptyStateText = styled(LargeText)`
    text-align: center;
`

export const EmptyStateTextBold = styled(LargeTextBold)`
    text-align: center;
`