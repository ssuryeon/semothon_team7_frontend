import { GlobalStyles } from "./styles/style";
import Home from './pages/Home'
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import TimeSetting from './pages/TimeSetting';
import AlarmSetting from './pages/AlarmSetting';
import GroupSetting from './pages/GroupSetting';
import LoungeHome from './pages/LoungeHome'; // 👈 1. 우리가 만든 라운지 화면 불러오기!
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
        Component: TimeSetting,
      },
      {
        path: 'alarm',
        Component: AlarmSetting,
      },
      {
        path: 'group',
        Component: GroupSetting,
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