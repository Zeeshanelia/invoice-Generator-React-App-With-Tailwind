import { Login } from './Compomemt/Login/Login';
import { Register } from './Compomemt/Register/Register';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'remixicon/fonts/remixicon.css';
import { NotFound } from './Compomemt/NotFound';
import { SignUp } from './Compomemt/SignUp/SignUp'
import { Dashboard } from './Compomemt/dashboard/Dashboard';

export default function App() {
  return (
    <>
    
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login dashboard*/}
          <Route path="/" element={<Navigate to="/dashboard"/>}/> 

          <Route path="/login" element={<Login />} />
          <Route path="/not-found" element={ <NotFound/>  } />
          <Route path="/signup" element={    < SignUp/>     }  />
          <Route path="/dashboard" element={ <Dashboard />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
