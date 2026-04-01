import styled, {useTheme} from 'styled-components';
import {useState} from 'react';

const Modal = styled.div`
    background-color: ${props =>props.theme.ContentColor};
    border: 2px solid ${props => props.theme.BorderColor};
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
    flex: 1;
    border-radius: 20px;
`;


function AlarmSetting(){
    const theme = useTheme();
    const [push, setPush] = useState(false);
    const [mov, setMov] = useState(false);

    const onPushClick = () => {
        setPush(!push);
    }
    const onMovClick = () => {
        setMov(!mov);
    }

    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'flex-start'}}>
            <div style={{flexDirection: 'column', justifyContent: 'flex-start', marginBottom: 16}}>
                <h2 style={{marginBottom: 5, textAlign: 'center', color: theme.btnColor, fontSize: 32, marginTop: 0}}>권한 허용</h2>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span style={{color: theme.white, fontSize: 12, textAlign:'center', width: '100%', marginBottom: 3}}>
                        핵심 기능 사용을 위한 권한 허용
                    </span>
                </div>
            </div>
            <div style={{flex: 1}}>
                <Modal>
                    <div style={{backgroundColor: theme.white, border: 'none', borderRadius: 15, marginBottom: 16, padding: '8px 13px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', boxSizing: 'border-box', height: 45, alignItems: 'center'}}>
                        <span style={{color: theme.btnColor, fontSize: 20, fontWeight: 700}}>푸쉬 알림</span>
                        <label style={{height: '100%', boxSizing: 'border-box', width: 55, display: 'inline-block'}}>
                            <input type='checkbox' style={{display: 'none'}}/>
                            <div style={{width: 55, height: '100%', borderRadius: 999, backgroundColor: push? theme.btnColor : theme.GreyText, boxSizing: 'border-box', padding: 3, position: 'relative'}}>
                                <div style={{boxSizing: 'border-box', height: 'calc(100% - 6px)', aspectRatio: '1 / 1',backgroundColor: theme.white, borderRadius: '50%', cursor: 'pointer', position: 'absolute', transition: 'transform 0.3s', transform: push ? 'translateX(0%)' : 'translateX(100%)'}} onClick={onPushClick}/>
                            </div>
                        </label>
                    </div>
                    <p style={{color: theme.GreyText, fontSize: 16, fontWeight: 400, marginLeft: 13, marginRight: 13, marginBottom: 0}}>
                        데일리 체크인 및 수면 시간알림<br />
                        찌르기 알림<br />
                        목표 수면 시간 초과 경고 알림
                    </p>
                </Modal>
                <Modal style={{marginTop: '5%'}}>
                    <div style={{backgroundColor: theme.white, border: 'none', borderRadius: 15, marginBottom: 16, padding: '8px 13px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', boxSizing: 'border-box', height: 45, alignItems: 'center'}}>
                        <span style={{color: theme.btnColor, fontSize: 20, fontWeight: 700}}>동작 및 피트니스</span>
                        <label style={{height: '100%', boxSizing: 'border-box', width: 55, display: 'inline-block'}}>
                            <input type='checkbox' style={{display: 'none'}}/>
                            <div style={{width: 55, height: '100%', borderRadius: 999, backgroundColor: mov? theme.btnColor : theme.GreyText, boxSizing: 'border-box', padding: 3, position: 'relative'}}>
                                <div style={{boxSizing: 'border-box', height: 'calc(100% - 6px)', aspectRatio: '1 / 1',backgroundColor: theme.white, borderRadius: '50%', cursor: 'pointer', position: 'absolute', transition: 'transform 0.3s', transform: mov ? 'translateX(0%)' : 'translateX(100%)'}} onClick={onMovClick}/>
                            </div>
                        </label>
                    </div>
                    <p style={{color: theme.GreyText, fontSize: 16, fontWeight: 400, marginLeft: 13, marginRight: 13, marginBottom: 0}}>
                        폰 뒤집기 동작을 통한 수면 시작 감지<br />
                        수면 중 스마트폰 사용(이탈) 확인
                    </p>
                </Modal>
            </div>
        </div>
    )
}

export default AlarmSetting;