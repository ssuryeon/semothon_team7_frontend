import {useTheme} from 'styled-components';
import Header from '../components/Header.tsx';
import Input from '../components/Input.tsx';
import LogoWhite from '../components/LogoWhite.tsx';
import {Container} from '../components/Container.tsx';
import Button from '../components/Button.tsx';
import {useNavigate, Link} from 'react-router';

function SignUp() {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column'}}>
            <Header name='회원가입' />
            <Container>
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <LogoWhite />
                    <Input placeholder='Name'/>
                    <Input placeholder='ID (Email Address)'/>
                    <Input placeholder='Password'/>
                </div>
                <div style={{width: '100%'}}>
                    <Button text='가입하기' onClick={() => navigate('/onboarding')}/>
                    <div style={{height: 10}} />
                    <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                        <span style={{color: theme.white, marginRight: 10}}>이미 계정이 있으신가요?</span>
                        <span style={{color: theme.white, marginRight: 10}}>|</span>
                        <Link to={{pathname: '/login'}} style={{color: theme.btnColor}}><span>로그인하기</span></Link>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default SignUp;