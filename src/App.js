
import { Route,  Routes } from 'react-router-dom';
import './App.css';
import DashboardPage from './component/DashboardPage';
import LoginPage from './component/LoginPage';
import RegisterPage from './component/RegisterPage';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <Routes>
    <Route  path='/' element ={<DashboardPage/>} />
    <Route path='/login' element ={<LoginPage/>} />
    <Route path='/register' element ={<RegisterPage/>} />
    </Routes>
     <ToastContainer  autoClose={2000} transition={Slide} />
    </>
  );
}

export default App;
