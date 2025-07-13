import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView<{bgColor: string, paddingTop: number}>`
    background-color: ${(props) => props.bgColor};
    padding-top: ${(props) => props.paddingTop}px;
    flex: 1;
`;

export const Container = styled.View`
    gap: 12px;
    padding-bottom: 12px;
`