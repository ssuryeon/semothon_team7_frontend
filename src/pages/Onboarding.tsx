import styled, {useTheme} from 'styled-components';
import {Container} from '../components/Container';
import {HeaderContainer} from '../components/Header';
import LogoBlack from '../components/LogoBlack';
import { IoIosArrowBack } from "react-icons/io";
import TimeSetting from './TimeSetting';
import AlarmSetting from './AlarmSetting';
import GroupSetting from './GroupSetting';

const OnboardingBtn = styled.button`
    width: 45%;
    height: 50px;
    font-weight: 700;
    font-size: 20px;
    border-radius: 26px;
    box-sizing: border-box;
    cursor: pointer;
`;

const Circle = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.theme.ContentColor};
    margin-right: 10px;
`;

function Onboarding(){
    const theme = useTheme()

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column'}}>
            <HeaderContainer style={{justifyContent: 'center', position: 'relative'}}>
                <IoIosArrowBack size={20} color={theme.btnColor} style={{position: 'absolute', left: 40}}/>
                <LogoBlack />
            </HeaderContainer>
            <Container >
                <TimeSetting />
                <div style={{width: '100%', marginTop: 20}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 20}}>
                        <Circle />
                        <Circle />
                        <Circle />
                    </div>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <OnboardingBtn style={{backgroundColor: 'transparent', border: '2px solid white', color: theme.white}}>이전</OnboardingBtn>
                        <OnboardingBtn style={{backgroundColor: 'white', border: 'none', color: theme.btnColor}}>다음</OnboardingBtn>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Onboarding;