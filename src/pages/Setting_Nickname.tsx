import {useTheme} from 'styled-components';
import Header from '../components/Header';
import {Container} from '../components/Container';
import Button from '../components/Button';
import {Modal} from '../components/Modal';
import Input from '../components/Input';


function Setting_Nickname(){
    const theme = useTheme();

    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Header name='닉네임 설정'/>
            <Container style={{backgroundColor: '#E7E7E7'}}>
                    <Modal style={{backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '2px solid rgba(42, 50, 71, 0.3)'}}>
                        <span style={{marginBottom: 16, fontSize: 20, fontWeight: 700, color: theme.btnColor}}>닉네임 변경하기</span>
                        <Input placeholder='기존 닉네임 입력' style={{backgroundColor: theme.white, border: `1px solid ${theme.GreyText}`}}/>
                        <Input placeholder='새로운 닉네임 입력' style={{backgroundColor: theme.white, border: `1px solid ${theme.GreyText}`}}/>
                        <Button text='변경' style={{backgroundColor: 'rgba(42, 50, 71, 0.35)'}}/>
                    </Modal>
                    <Button text='완료'/>
            </Container>
        </div>
    )
}

export default Setting_Nickname;