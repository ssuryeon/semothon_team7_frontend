import { GlobalStyles } from "./styles/style";
import Home from './pages/Home'
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import TimeSetting from './pages/TimeSetting';
import AlarmSetting from './pages/AlarmSetting';
import GroupSetting from './pages/GroupSetting';
import {createBrowserRouter, RouterProvider} from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
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
