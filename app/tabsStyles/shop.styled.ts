import styled from "styled-components/native";


export const Wrapper = styled.SafeAreaView<{bgColor: string, paddingTop: number}>`
    background-color: ${props => props.bgColor};
    padding-top: ${props => props.paddingTop}px;
    flex: 1;
`

export const ShopContainer = styled.View`
    padding: 32px 0;
`

export const ShopHeaderContainer = styled.View`
    padding: 0 16px;
    flex-direction: row;
    justify-content: space-between;
`

export const ThemePreviewWrapper = styled.View`
    flex-direction: row;
`

export const ThemePreviewItem = styled.View<{bgColor: string}>`
    width: 32px;
    height: 100%;
    background-color: ${props => props.bgColor};
`

export const ThemeDescriptionContainer = styled.View`
    padding: 16px 0;
`

export const ThemeButton = styled.TouchableOpacity`
    margin-top: 16px;
`