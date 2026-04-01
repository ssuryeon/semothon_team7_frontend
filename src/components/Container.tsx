import styled from 'styled-components';

export const Container = styled.div`
    background-color: ${props => props.theme.bgColor};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    width: 100%;
    flex: 1;
    box-sizing: border-box;
`;