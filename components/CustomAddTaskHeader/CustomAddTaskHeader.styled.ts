import styled from "styled-components/native";


export const HeaderWrapper = styled.SafeAreaView<{paddingTop: number}>`
    padding-top: ${props => props.paddingTop}px;
`

export const HeaderContainer = styled.View<{bgColor: string, borderColor: string, borderWidth: number}>`
    padding: 16px;
    background-color: ${props => props.bgColor};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    border-bottom-color: ${props => props.borderColor};
    border-bottom-width: ${props => props.borderWidth}px;

    shadow-opacity: 0.15;
    shadow-color: black;
    shadow-offset: 0 3px;
    shadow-radius: 2px;
`

export const HeaderButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    gap: 4px;
`

export const HiddenHeaderButton = styled(HeaderButton)`
    opacity: 0;
`