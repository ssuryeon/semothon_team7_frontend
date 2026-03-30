import {useTheme} from 'styled-components';
import {Container} from '../components/Container';
import {HeaderContainer} from '../components/Header';
import LogoBlack from '../components/LogoBlack';
import { IoIosArrowBack } from "react-icons/io";

function Onboarding(){
    const theme = useTheme()

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column'}}>
            <HeaderContainer style={{justifyContent: 'center', position: 'relative'}}>
                <IoIosArrowBack size={20} color={theme.btnColor} style={{position: 'absolute', left: 40}}/>
                <LogoBlack />
            </HeaderContainer>
            <Container>

            </Container>
        </div>
    )
}

export default Onboarding;