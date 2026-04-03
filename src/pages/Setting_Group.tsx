import Header from '../components/Header';
import {Container} from '../components/Container';
import { Outlet } from 'react-router';
import Button from '../components/Button';


function Setting_Group(){
    
    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Header name='알림 설정'/>
            <Container style={{backgroundColor: '#E7E7E7', justifyContent: 'space-between'}}>
                <Outlet />
                <Button text='완료'/>
            </Container>
        </div>
    )
}

export default Setting_Group;