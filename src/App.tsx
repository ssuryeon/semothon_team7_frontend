import { GlobalStyles } from "./styles/style";
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';

function App() {
  return(
    <>
      <GlobalStyles />
      <div className='app'>
        <Onboarding />
      </div>
    </>
  );
}

export default App
