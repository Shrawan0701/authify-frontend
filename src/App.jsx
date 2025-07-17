import Home from './pages/Home.jsx';
import EmailVerify from './pages/EmailVerify.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Login from './pages/Login.jsx';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  ) 
  
}



export default App