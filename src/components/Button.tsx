import styled from 'styled-components';

const ButtonContainer = styled.button`
    background-color: ${props => props.theme.btnColor};
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    color: ${props => props.theme.white};
    border-radius: 30px;
    cursor: pointer;
    border: none;
    font-weight: 500;
    font-size: 16px;
`;

interface IButton {
    text:string,
    onClick?: any,
}

function Button({text, onClick}:IButton) {
    return (
        <ButtonContainer onClick={onClick}>{text}</ButtonContainer>
    )
}

export default Button;