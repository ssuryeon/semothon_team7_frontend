import styled, {useTheme} from 'styled-components';
import Button from '../components/Button';
import Input from '../components/Input';

const Modal = styled.div`
    background-color: ${props =>props.theme.ContentColor};
    border: 2px solid ${props => props.theme.BorderColor};
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
    flex: 1;
    border-radius: 20px;
`;


function GroupSetting(){
    const theme = useTheme();
    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: 'calc(100vh - 220px)'}}>
            <div style={{flexDirection: 'column', justifyContent: 'flex-start', marginBottom: 16, height: 60}}>
                <h2 style={{marginBottom: 5, textAlign: 'center', color: theme.btnColor, fontSize: 32, marginTop: 0}}>그룹 설정</h2>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span style={{color: theme.white, fontSize: 12, textAlign:'center', width: '100%', marginBottom: 3}}>
                        그룹 생성 및 초대 또는 그룹 가입
                    </span>
                </div>
            </div>
            <div style={{overflowY: 'scroll', flex: 1}}>
                <Modal style={{marginBottom: 20}}>
                    <span style={{color: theme.btnColor, fontSize: 20, fontWeight: 700, marginBottom: 10, display:'inline-block'}}>그룹 생성하기</span>
                    <Input placeholder='그룹명 입력' style={{backgroundColor: theme.white, marginBottom: 10}}/>
                    <Input placeholder='최대 인원 수 입력' style={{backgroundColor: theme.white, marginBottom: 10}}/>
                    <Button text='생성'/>
                </Modal>
                <Modal>
                    <span style={{color: theme.btnColor, fontSize: 20, fontWeight: 700, marginBottom: 10, display:'inline-block'}}>그룹 가입하기</span>
                    <Input placeholder='초대 코드 입력' style={{backgroundColor: theme.white, marginBottom: 10}}/>
                    <Button text='생성'/>
                </Modal>
            </div>
        </div>
    )
}

export default GroupSetting;