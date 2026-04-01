import styled, {useTheme} from 'styled-components';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import {useNavigate} from 'react-router';

export const HeaderContainer = styled.div`
    width: 100%;
    height: 60px;
    background-color: ${props => props.theme.white};
    color: ${props => props.theme.btnColor};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding-left: 40px;
    padding-right: 40px;
    font-weight: 700;
`;

interface IHeader {
    name: string
}

function Header({name}:IHeader) {
    const theme = useTheme();
    const navigate = useNavigate();
    const onClick = () => {
        navigate(-1);
    }
    return (
        <HeaderContainer>
                <IoIosArrowBack size={20} color={theme.btnColor} onClick={onClick} style={{cursor: 'pointer'}}/>
                <span style={{textAlign: 'center'}}>{name}</span>
                <IoIosClose size={24} color={theme.btnColor}/>
        </HeaderContainer>
    )
}

export default Header;