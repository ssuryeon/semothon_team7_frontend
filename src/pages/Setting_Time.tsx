import styled, {useTheme} from 'styled-components';
import Header from '../components/Header';
import {Container} from '../components/Container';
import Button from '../components/Button';
import {Modal} from '../components/Modal';
import {useState} from 'react';

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
    const onChange = (e:any) => {
        setTime(e.currentTarget.value)
    }

    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Header name='수면 시간 설정'/>
            <Container style={{backgroundColor: '#E7E7E7'}}>
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
                    <Button text='완료'/>
            </Container>
        </div>
    )
}

export default Setting_Time;