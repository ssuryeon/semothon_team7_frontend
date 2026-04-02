import styled, {useTheme} from 'styled-components';
import Header from '../components/Header';
import {Container} from '../components/Container';
import Button from '../components/Button';
import {Modal} from '../components/Modal';
import {useState} from 'react';
import { userStore } from '../stores/UserStore';
import {modifyMyInfo} from '../utils/modify_setting';

const Slider = styled.input`
    width: 100%;
    height: 35px;
    -webkit-appearance: none;
    border: none;
    background: #A09F9C;
    border-radius: 20px;
    overflow: visible;
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 74px;
        height: 79px;
        border-radius: 50%;
        background-image: url('/slider_btn.png');
        cursor: pointer;
    }
    outline: none;
`;


function Setting_Time(){
    const theme = useTheme();
    const [time, setTime] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const name = userStore((state) => state.name);
    const accessToken = userStore((state) => state.accessToken);

    const onChange = (e:any) => {
        setTime(e.currentTarget.value)
    }
    const onClick = async () => {
        if(!isCompleted) {
            const h2 = document.getElementById('time') as HTMLElement;
            const res = await modifyMyInfo(name, h2.innerText, accessToken);
            console.log(res);
            if(!res) alert('닉네임 변경 오류');
            else {
                setIsCompleted(true);
            }
        }
    }

    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Header name='수면 시간 설정'/>
            <Container style={{backgroundColor: '#E7E7E7', position: 'relative', justifyContent: isCompleted? 'flex-end' : 'space-between'}}>
                    {
                        isCompleted? 
                        (
                            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '50%', transform: 'translateY(-100%)'}}>
                                <img src='/checkIcon.png' style={{width: 100, height: 100}}/>
                                <span style={{fontSize: 12, color: theme.GreyText, marginTop: 16}}>수면시간 설정이 완료되었습니다.</span>
                            </div>
                        ) : 
                        (
                            <Modal style={{marginTop: 110}}>
                                <img src='/ruler_dark.png' style={{marginTop: 30, marginBottom: 0}}/>
                                <Slider type='range' value={time} onChange={onChange} max={720} style={{background: `linear-gradient(
                                    to right,
                                    ${theme.Yellow1} 0%,
                                    ${theme.Yellow2} ${time*100/720}%,
                                    #A09F9C ${time*100/720}%,
                                    #A09F9C 100%
                                )`, marginTop: 25}}/>
                                <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', color: theme.GreyText, marginTop: 10}}>
                                    <span>18:00</span>
                                    <span>06:00</span>
                                </div>
                                <div style={{width: '100%', margin: 'auto'}}>
                                    <h2 style={{fontWeight: 700, fontSize: 32, marginBottom: 5, textAlign: 'center', marginTop: 0}} id='time'>
                                        {(18 + Math.floor(time / 60)) >= 24 ? (18 + Math.floor(time / 60) - 24).toString().padStart(2, '0') : (18 + Math.floor(time / 60)).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}
                                    </h2>
                                    <span style={{fontSize: 12, display: 'inline-block', width: '100%', textAlign: 'center'}}>목표 수면 시간 오전 {(18 + Math.floor(time / 60)) >= 24 ? (18 + Math.floor(time / 60) - 24).toString().padStart(2, '0') : (18 + Math.floor(time / 60)).toString().padStart(2, '0')}시 {(time % 60).toString().padStart(2, '0')}분</span>
                                </div>
                                <span style={{color: theme.white, fontSize: 12, fontWeight: 400, display: 'inline-block', width: '100%', textAlign: 'center'}}>*목표 시간 30분 전에 PUSH 알리을 보내드립니다.</span>
                            </Modal>
                        )
                    }
                    <Button text='완료' onClick={onClick} style={{}}/>
            </Container>
        </div>
    )
}
export default Setting_Time;