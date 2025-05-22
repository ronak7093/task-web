import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
// import Verify from './components/Verify';
import Dashboard from './components/Dashboard';
import Task from './components/Task';
import OtpModel from './components/OtpModel';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/OtpModel' element={<PrivateRoute><OtpModel /> </PrivateRoute>} />
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
        <Route path='/task' element={<PrivateRoute><Task /> </PrivateRoute>} />
        <Route path='/logout' element={<PrivateRoute> <Logout /> </PrivateRoute>} />
        {/* <Route path='/verify/:token' element={<Verify />} /> */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
