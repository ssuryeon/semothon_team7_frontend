import {useTheme} from 'styled-components';
import Header from '../components/Header.tsx';
import Input from '../components/Input.tsx';
import LogoWhite from '../components/LogoWhite.tsx';
import Button from '../components/Button.tsx';
import {Container} from '../components/Container.tsx';
import {Link} from 'react-router';
import {login} from '../utils/auth.tsx';
import {useState} from 'react';
import {userStore} from '../stores/UserStore.tsx';

function Login() {
    const theme = useTheme()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const setUserinfo = userStore((state) => state.login);
    const onClick = async () => {
        const res = await login(email, password);
        if(!res) {
            alert('이메일과 비밀번호를 다시 입력해주세요.');
        }
        else {
            const accessToken = res.accessToken;
            const refreshToken = res.refreshToken;
            const userinfo = res.userinfo;
            console.log(accessToken, refreshToken);
            console.log(userinfo);
            setUserinfo(userinfo.email as string, accessToken);
            console.log(userStore((state) => state.email));
        }
    }

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column'}}>
            <Header name='로그인' />
            <Container>
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <LogoWhite />
                    <Input placeholder='ID (Email Address)' value={email} onChange={(e:any) => setEmail(e.currentTarget.value)}/>
                    <Input placeholder='Password' value={password} onChange={(e:any) => setPassword(e.currentTarget.value)}/>
                    <span style={{color: theme.white, fontSize: 10, textAlign: 'right'}}>비밀번호를 잊어버리셨나요?</span>
                </div>
                <div style={{width: '100%'}}>
                    <Button text='로그인하기' onClick={onClick}/>
                    <div style={{height: 10}} />
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <span style={{color: theme.white, marginRight: 10}}>계정이 없으신가요?</span>
                        <span style={{color: theme.white, marginRight: 10}}>|</span>
                        <Link to={{pathname: '/signup'}}><span style={{color: theme.btnColor}}>회원가입하기</span></Link>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Login;