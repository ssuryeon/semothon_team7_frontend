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
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

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


function TimeSetting(){
    const theme = useTheme();
    const [time, setTime] = useState(0);
    const onChange = (e:any) => {
        setTime(e.currentTarget.value)
    }

    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'flex-start'}}>
            <div style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
                <h2 style={{marginBottom: 5, textAlign: 'center', color: theme.btnColor, fontSize: 32, marginTop: 0}}>수면 골든타임 설정</h2>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span style={{color: theme.white, fontSize: 12, textAlign:'center', width: '100%', marginBottom: 3}}>
                        사용자가 평균적으로 희망하는 목표 수면 시간을 설정해주세요.
                    </span>
                    <span style={{color: theme.white, fontSize: 12, textAlign:'center', width: '100%', marginBottom: 50}}>
                        이는 기본값으로 통계의 기준이 되며, 설정에서 언제든 변경 가능합니다.
                    </span>
                </div>
            </div>
            <Modal>
                <Slider type='range' value={time} onChange={onChange} style={{background: `linear-gradient(
                    to right,
                    ${theme.Yellow1} 0%,
                    ${theme.Yellow2} ${time}%,
                    #A09F9C ${time}%,
                    #A09F9C 100%
                )`, marginTop: 40}}/>
                <div style={{width: '100%', margin: 'auto'}}>
                    <h2 style={{fontWeight: 700, fontSize: 32, marginBottom: 5, textAlign: 'center', marginTop: 0}}>00:30</h2>
                    <span style={{fontSize: 12, display: 'inline-block', width: '100%', textAlign: 'center'}}>목표 수면 시간 오전 12시 30분</span>
                </div>
                <span style={{color: theme.white, fontSize: 12, fontWeight: 400, display: 'inline-block', width: '100%', textAlign: 'center'}}>*목표 시간 30분 전에 PUSH 알리을 보내드립니다.</span>
            </Modal>
        </div>
    )
}

export default TimeSetting;