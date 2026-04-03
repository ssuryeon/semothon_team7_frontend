import Header from '../components/Header';
import {Container} from '../components/Container';
import { Outlet, useLocation, useNavigate } from 'react-router';
import Button from '../components/Button';


function Setting_Group(){
    const location = useLocation();
    const navigate = useNavigate();

    const onClick = () => {
        switch(location.pathname) {
            case '/setting/group':
                navigate('/setting/group/create_join');
                break;
            case '/setting/group/create_join':
                navigate('/lounge');
        }
    }
    
    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Header name='그룹 설정'/>
            <Container style={{backgroundColor: '#E7E7E7', justifyContent: 'space-between'}}>
                <Outlet />
                <Button text='완료' onClick={onClick}/>
            </Container>
        </div>
    )
}

export default Setting_Group;