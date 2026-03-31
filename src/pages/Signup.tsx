import {useTheme} from 'styled-components';
import Header from '../components/Header.tsx';
import Input from '../components/Input.tsx';
import LogoWhite from '../components/LogoWhite.tsx';
import {Container} from '../components/Container.tsx';
import Button from '../components/Button.tsx';
import {useNavigate, Link} from 'react-router';
import {signUp} from '../utils/auth.tsx';
import {useState} from 'react';
import {userStore} from '../stores/UserStore.tsx';

function SignUp() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const setUserinfo = userStore((state) => state.signUp);
    console.log(userStore((state) => state.name));
    
    const onClick = async () => {
        const res = await signUp(name, email, password);
        if(!res) {
            alert('사용자 정보를 다시 입력해 주세요.');
        }
        else {
            const accessToken = res.accessToken;
            const refreshToken = res.refreshToken;
            const email = res.userinfo?.email;
            const name = res.userinfo?.user_metadata.name;
            console.log(accessToken, refreshToken);
            console.log(res.userinfo);
            setUserinfo(name, email as string, accessToken as string, refreshToken as string)
            navigate('/onboarding')
        }
    }

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column'}}>
            <Header name='회원가입' />
            <Container>
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <LogoWhite />
                    <Input placeholder='Name' value={name} onChange={(e:any) => setName(e.currentTarget.value)}/>
                    <Input placeholder='ID (Email Address)' value={email} onChange={(e:any) => setEmail(e.currentTarget.value)}/>
                    <Input placeholder='Password' value={password} onChange={(e:any) => setPassword(e.currentTarget.value)}/>
                </div>
                <div style={{width: '100%'}}>
                    <Button text='가입하기' onClick={onClick} />
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