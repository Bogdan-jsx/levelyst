import styled from "styled-components/native";


export const TabBarContainer = styled.View<{bgColor: string, paddingBottom: number}>`
    background-color: ${props => props.bgColor};
    flex-direction: row;
    justify-content: space-between;
    padding: 16px 24px ${props => props.paddingBottom}px 24px;
    
    shadow-color: rgba(79, 79, 79, .2);
    shadow-opacity: 1;
    shadow-radius: 4px;
    shadow-offset: 0 -5px;
`

export const TabItem = styled.View`
    align-items: center;
`

export const TabIconPlaceholder = styled.View`
    width: 24px;
    height: 24px;
`