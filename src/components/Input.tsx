import styled from 'styled-components';

const InputContainer = styled.input`
    padding: 12px;
    background-color: ${props => props.theme.ContentColor};
    border: 1px solid ${props => props.theme.BorderColor};
    color: ${props => props.theme.GreyText};
    border-radius: 15px;
    width: 100%;
    margin-bottom: 16px;
    box-sizing: border-box;
    outline: none;
`;

interface IInput {
    placeholder:string,
    style?: object,
    value?: string,
    onChange?: any,
}

function Input({placeholder, style, value, onChange}:IInput) {
    return (
        <InputContainer placeholder={placeholder} style={style} value={value} onChange={onChange}/>
    )
}

export default Input;