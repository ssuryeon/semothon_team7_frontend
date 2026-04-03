import { GlobalStyles } from "./styles/style";
import Home from './pages/Home'
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Onboarding_Time from './pages/Onboarding_Time';
import Onboarding_Alarm from './pages/Onboarding_Alarm';
import Onboarding_Group from './pages/Onboarding_Group';
import Setting_Time from './pages/Setting_Time';
import Setting_Nickname from './pages/Setting_Nickname';
import LoungeHome from './pages/LoungeHome'; // 👈 1. 우리가 만든 라운지 화면 불러오기!
import Setting_Alarm from './pages/Setting_Alarm';
import Setting_Group from "./pages/Setting_Group";
import Setting_Group_Default from "./pages/Setting_Group_Default";
import Setting_Group_CreateOrJoin from "./pages/Setting_Group_CreateOrJoin";
import {createBrowserRouter, RouterProvider} from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/lounge', // 👈 2. 새로운 길 뚫기! 주소창에 /lounge를 치면 이 화면이 나옵니다.
    Component: LoungeHome,
  },
  {
    path: '/signup',
    Component: SignUp,
  },
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/onboarding',
    Component: Onboarding,
    children: [
      {
        index: true,
        Component: Onboarding_Time,
      },
      {
        path: 'alarm',
        Component: Onboarding_Alarm,
      },
      {
        path: 'group',
        Component: Onboarding_Group,
      }
    ]
  },
  {
    path: '/setting/time',
    Component: Setting_Time
  },
  {
    path: '/setting/nickname',
    Component: Setting_Nickname,
  },
  {
    path: '/setting/alarm',
    Component: Setting_Alarm,
  },
  {
    path: '/setting/group',
    Component: Setting_Group,
    children: [
      {
        index: true,
        Component: Setting_Group_Default,
      },
      {
        path: 'create_join',
        Component: Setting_Group_CreateOrJoin,
      }
    ]
  }
])

function App() {

  return(
    <>
      <GlobalStyles />
      <div className='app'>
        <RouterProvider router={router}/>
      </div>
    </>
  );
}

export default App