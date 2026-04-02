import styled, {useTheme} from 'styled-components';
import {Container} from '../components/Container';
import {HeaderContainer} from '../components/Header';
import LogoBlack from '../components/LogoBlack';
import { IoIosArrowBack } from "react-icons/io";
import {Outlet, useLocation, useNavigate} from'react-router';
import {setSleepTime} from '../utils/set_setting';
import {userStore} from '../stores/UserStore';
import {useEffect, useState} from 'react';

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
    const navigate = useNavigate();
    const location = useLocation();
    const token = userStore((state) => state.accessToken);
    const [menu, setMenu] = useState(1);
    useEffect(() => {
        switch(location.pathname) {
            case '/onboarding':
              setMenu(1);
              break;
            case '/onboarding/alarm':
              setMenu(2);
              break;
            case '/onboarding/group':
              setMenu(3);
              break;
        }
    }, [location.pathname]);

    const onPrevClick = () => {
        const path = location.pathname;
        console.log(path);
        switch(path) {
            case '/onboarding':
                break
            case '/onboarding/alarm':
                navigate('/onboarding');
                break
            case '/onboarding/group':
                navigate('/onboarding/alarm');
                break
        }
    }
    const onNextClick = async () => {
        const path = location.pathname;
        console.log(path)

        switch(path) {
            case '/onboarding':
                const time = document.getElementById('time')?.innerText;
                console.log(`sleep time : ${time}`);
                const res = await setSleepTime(time as string, token);
                console.log(`res : ${res}`);
                if(res) navigate('/onboarding/alarm');
                else alert('시간 설정 오류');
                break
            case '/onboarding/alarm':
                navigate('/onboarding/group');
                break
            case '/onboarding/group':
                break
        }
    }

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column'}}>
            <HeaderContainer style={{justifyContent: 'center', position: 'relative'}}>
                <IoIosArrowBack size={20} color={theme.btnColor} style={{position: 'absolute', left: 40, cursor: 'pointer'}} onClick={() => navigate(-1)}/>
                <LogoBlack />
            </HeaderContainer>
            <Container >
                <Outlet />
                <div style={{width: '100%', marginTop: 20, boxSizing: 'border-box'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 20}} id='bar'>
                        <Circle style={{backgroundColor: menu == 1 ? theme.white : theme.ContentColor}}/>
                        <Circle style={{backgroundColor: menu == 2 ? theme.white : theme.ContentColor}}/>
                        <Circle style={{backgroundColor: menu == 3 ? theme.white : theme.ContentColor}}/>
                    </div>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <OnboardingBtn style={{backgroundColor: 'transparent', border: '2px solid white', color: theme.white}} onClick={onPrevClick}>이전</OnboardingBtn>
                        <OnboardingBtn style={{backgroundColor: 'white', border: 'none', color: theme.btnColor}} onClick={onNextClick}>다음</OnboardingBtn>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Onboarding;