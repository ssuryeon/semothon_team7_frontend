import styled, {useTheme} from 'styled-components';
import Header from '../components/Header.tsx';
import Input from '../components/Input.tsx';
import LogoWhite from '../components/LogoWhite.tsx';
import Button from '../components/Button.tsx';
import {Container} from '../components/Container.tsx';

function Login() {
    const theme = useTheme()

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column'}}>
            <Header name='로그인' />
            <Container>
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <LogoWhite />
                    <Input placeholder='ID (Email Address)'/>
                    <Input placeholder='Password'/>
                    <span style={{color: theme.white, fontSize: 10, textAlign: 'right'}}>비밀번호를 잊어버리셨나요?</span>
                </div>
                <div style={{width: '100%'}}>
                    <Button text='로그인하기' />
                    <div style={{height: 10}} />
                    <div style={{display: 'flex', flexDirection: 'row', fontSize: 10, justifyContent: 'center'}}>
                        <span style={{color: theme.white, marginRight: 10}}>계정이 없으신가요?</span>
                        <span style={{color: theme.white, marginRight: 10}}>|</span>
                        <span style={{color: theme.btnColor}}>회원가입하기</span>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Login;