import styled from 'styled-components';

export const Modal = styled.div`
    background-color: ${props =>props.theme.white};
    border: 2px solid ${props => props.theme.GreyText};
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
    border-radius: 20px;
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;