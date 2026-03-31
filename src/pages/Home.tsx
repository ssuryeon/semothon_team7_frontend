import {useTheme} from 'styled-components';
import {useNavigate} from 'react-router';

function Home() {
    const theme = useTheme();
    const navigate = useNavigate()
    const onClick = () => {
        navigate('/signup')
    }

    return (
        <div style={{width: '100%', height: '100%', boxSizing: 'border-box', background: 'url(/background.png) no-repeat center / cover', position: 'relative'}} onClick={onClick}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 205, width: 170, position: 'absolute', top: 'calc(50% - 205px)', left: 'calc(50% - 85px)'}}>
                <img src='/moon.png' style={{marginBottom: 20}}/>
                <img src='/logo_white.png' />
            </div>
            <div style={{color: theme.white, fontWeight: 400, fontSize: 10, width: '100%', textAlign: 'center', position: 'absolute', bottom: 185}}>
                모두 함께 잠드는 밤, 슬립메이트
            </div>
            <img src='/town.png' width='100%' style={{position: 'absolute', bottom: 0}}/>
        </div>
    )
}

export default Home;