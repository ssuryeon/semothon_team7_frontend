import {useTheme} from 'styled-components';
import Header from '../components/Header';
import {Container} from '../components/Container';
import Button from '../components/Button';
import {Modal} from '../components/Modal';
import Input from '../components/Input';
import {useState} from 'react';
import { userStore } from '../stores/UserStore';
import { modifyMyInfo } from '../utils/modify_setting';


function Setting_Nickname(){
    const theme = useTheme();
    const [prev, setPrev] = useState('');
    const [next, setNext] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const time = userStore((state) => state.target_sleep_time);
    const accessToken= userStore((state) => state.accessToken);

    const onClick = async () => {
        if(!isCompleted) {
            const res = await modifyMyInfo(next, time, accessToken);
            console.log(res);
            if(!res) alert('시간 설정 오류');
            else setIsCompleted(true);
        }
    }

    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Header name='닉네임 설정'/>
            <Container style={{backgroundColor: '#E7E7E7', justifyContent: isCompleted? 'flex-end' : 'space-between'}}>
                {
                    isCompleted?
                    (
                        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '50%', transform: 'translateY(-100%)'}}>
                                <img src='/checkIcon.png' style={{width: 100, height: 100}}/>
                                <span style={{fontSize: 12, color: theme.GreyText, marginTop: 16}}>닉네임 설정이 완료되었습니다.</span>
                        </div>
                    ) :
                    (
                        <Modal style={{backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '2px solid rgba(42, 50, 71, 0.3)', marginTop: 110}}>
                            <span style={{marginBottom: 16, fontSize: 20, fontWeight: 700, color: theme.btnColor}}>닉네임 변경하기</span>
                            <Input placeholder='기존 닉네임 입력' style={{backgroundColor: theme.white, border: `1px solid ${theme.GreyText}`}} value={prev} onChange={(e:any) => setPrev(e.currentTarget.value)}/>
                            <Input placeholder='새로운 닉네임 입력' style={{backgroundColor: theme.white, border: `1px solid ${theme.GreyText}`}} value={next} onChange={(e:any) => setNext(e.currentTarget.value)}/>
                            <Button text='변경' style={{backgroundColor: 'rgba(42, 50, 71, 0.35)'}} onClick={onClick}/>
                        </Modal>
                    )
                }
                    <Button text='완료' />
            </Container>
        </div>
    )
}

export default Setting_Nickname;