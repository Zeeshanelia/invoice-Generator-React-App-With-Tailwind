import { Login } from './Compomemt/Login/Login';
import { Register } from './Compomemt/Register/Register';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'remixicon/fonts/remixicon.css';
import { NotFound } from './Compomemt/NotFound';

export default function App() {
  return (
    <>
      <h1>Invoice Generator</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> // Redirect root to login
          <Route path="/login" element={<Login />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}
