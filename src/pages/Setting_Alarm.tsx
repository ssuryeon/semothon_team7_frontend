import {useTheme} from 'styled-components';
import Header from '../components/Header';
import {Container} from '../components/Container';
import {Modal} from '../components/Modal';
import { FaRegBell } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from 'react';
import { alarmStore } from '../stores/AlarmStore';


function Setting_Alarm(){
    const theme = useTheme();
    const pushState = alarmStore((state) => state.push_alarm);
    const movState = alarmStore((state) => state.movement_alarm);
    const [push, setPush] = useState(pushState);
    const [mov, setMov] = useState(movState);
    const [btn1, setBtn1] = useState(false);
    const [btn2, setBtn2] = useState(false);
    const [btn3, setBtn3] = useState(false);
    const [btn4, setBtn4] = useState(false);
    const setPushState = alarmStore((state) => state.setPush);
    const setMovState = alarmStore((state) => state.setMovement);

    const onPushClick = () => {
        setPush(!push);
        setPushState()
    }
    const onMovClick = () => {
        setMov(!mov);
        setMovState();
    }
    const onClick = (num:number) => {
        switch(num) {
            case 1:
                setBtn1(!btn1);
                break
            case 2:
                setBtn2(!btn2);
                break
            case 3:
                setBtn3(!btn3);
                break
            case 4:
                setBtn4(!btn4);
                break
        }
    } 

    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Header name='알림 설정'/>
            <Container style={{backgroundColor: '#E7E7E7', justifyContent: 'flex-start'}}>
                <FaRegBell color={theme.GreyText} size={26} style={{marginBottom: 51}}/>
                <Modal style={{backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(42, 50, 71, 0.3)'}}>
                    <div style={{width: '100%', height: 45, backgroundColor: theme.white, borderRadius: 15, padding: '8px 13px', boxSizing: 'border-box', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <span style={{display: 'flex', alignItems: 'center', color: theme.btnColor, fontSize: 20, fontWeight: 700}}>푸쉬 알림</span>
                        <label style={{height: '100%', boxSizing: 'border-box', width: 55, display: 'inline-block'}}>
                            <input type='checkbox' style={{display: 'none'}}/>
                            <div style={{width: 55, height: '100%', borderRadius: 999, backgroundColor: push? theme.btnColor : theme.GreyText, boxSizing: 'border-box', padding: 3, position: 'relative'}}>
                                <div style={{boxSizing: 'border-box', height: 'calc(100% - 6px)', aspectRatio: '1 / 1',backgroundColor: theme.white, borderRadius: '50%', cursor: 'pointer', position: 'absolute', transition: 'transform 0.3s', transform: push ? 'translateX(0%)' : 'translateX(100%)'}} onClick={onPushClick}/>
                            </div>
                        </label>
                    </div>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', boxSizing: 'border-box', paddingRight: 8, paddingLeft: 8, marginBottom: 10, marginTop: 16}}>
                        <span style={{display: 'flex', alignItems: 'center', color: theme.GreyText}}>데일리 체크인 및 수면 시간 알림</span>
                        <FaCheckCircle size={26} color={btn1? theme.GreyText : theme.btnColor} onClick={() => onClick(1)}/>
                    </div>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', boxSizing: 'border-box', paddingRight: 8, paddingLeft: 8, marginBottom: 10}}>
                        <span style={{display: 'flex', alignItems: 'center', color: theme.GreyText}}>찌르기 알림</span>
                        <FaCheckCircle size={26} color={btn2? theme.GreyText : theme.btnColor} onClick={() => onClick(2)}/>
                    </div>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', boxSizing: 'border-box', paddingRight: 8, paddingLeft: 8, marginBottom: 10}}>
                        <span style={{display: 'flex', alignItems: 'center', color: theme.GreyText}}>목표 시간 초과 경고 알림</span>
                        <FaCheckCircle size={26} color={btn3? theme.GreyText : theme.btnColor} onClick={() => onClick(3)}/>
                    </div>
                </Modal>
                <Modal style={{backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(42, 50, 71, 0.3)'}}>
                    <div style={{width: '100%', height: 45, backgroundColor: theme.white, borderRadius: 15, padding: '8px 13px', boxSizing: 'border-box', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <span style={{display: 'flex', alignItems: 'center', color: theme.btnColor, fontSize: 20, fontWeight: 700}}>동작 및 피트니스</span>
                        <label style={{height: '100%', boxSizing: 'border-box', width: 55, display: 'inline-block'}}>
                            <input type='checkbox' style={{display: 'none'}}/>
                            <div style={{width: 55, height: '100%', borderRadius: 999, backgroundColor: mov? theme.btnColor : theme.GreyText, boxSizing: 'border-box', padding: 3, position: 'relative'}}>
                                <div style={{boxSizing: 'border-box', height: 'calc(100% - 6px)', aspectRatio: '1 / 1',backgroundColor: theme.white, borderRadius: '50%', cursor: 'pointer', position: 'absolute', transition: 'transform 0.3s', transform: mov ? 'translateX(0%)' : 'translateX(100%)'}} onClick={onMovClick}/>
                            </div>
                        </label>
                    </div>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', boxSizing: 'border-box', paddingRight: 8, paddingLeft: 8, marginBottom: 10, marginTop: 16}}>
                        <span style={{display: 'flex', alignItems: 'center', color: theme.GreyText}}>폰 뒤집기 동작 감지</span>
                        <FaCheckCircle size={26} color={btn4? theme.GreyText : theme.btnColor} onClick={() => onClick(4)}/>
                    </div>
                </Modal>
            </Container>
        </div>
    )
}

export default Setting_Alarm;