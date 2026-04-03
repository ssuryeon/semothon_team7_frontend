import {useTheme} from 'styled-components';
import Header from '../components/Header';
import Input from '../components/Input';
import LogoWhite from '../components/LogoWhite';
import {Container} from '../components/Container';
import Button from '../components/Button';
import {useNavigate, Link} from 'react-router';
import {signUp, login, setNickname} from '../utils/auth';
import {useState} from 'react';
import {userStore} from '../stores/UserStore';

function SignUp() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const setUserinfo = userStore((state) => state.signUp);
    const nameState = userStore((state) => state.name);
    const accessToken = userStore((state) => state.accessToken);
    const setToken = userStore((state) => state.setAccessToken);
    
    const onClick = async () => {
        const signUp_res = await signUp(name, email, password);
        if(!signUp_res) {
            alert('사용자 정보를 다시 입력해 주세요.');
        }
        else {
            setToken(signUp_res?.accessToken as string);
            const nickname_res = await setNickname(name, accessToken);
            if(!nickname_res) alert('이름 설정 오류');
            else {
                const login_res = await login(email as string, password);
                if(!login_res) {
                    alert('로그인 중 오류 발생');
                }
                else {
                    const accessToken = login_res.accessToken;
                    const refreshToken = login_res.refreshToken;
                    const e = login_res.userinfo?.email;
                    const name = login_res.userinfo?.user_metadata.name;
                    console.log(accessToken, refreshToken);
                    console.log(login_res.userinfo);
                    setUserinfo(name, e as string, accessToken as string, refreshToken as string)
                    console.log(`state : ${nameState}`)
                    navigate('/onboarding')
                }
            }
        }
    }

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column'}}>
            <Header name='회원가입' />
            <Container>
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <LogoWhite />
                    <Input placeholder='Name' value={name} onChange={(e:any) => setName(e.currentTarget.value)}/>
                    <Input placeholder='Email Address' value={email} onChange={(e:any) => setEmail(e.currentTarget.value)}/>
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