import { Login } from './Compomemt/Login/Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'remixicon/fonts/remixicon.css';
import { NotFound } from './Compomemt/NotFound';
import { SignUp } from './Compomemt/SignUp/SignUp'
import { Dashboard } from './Compomemt/dashboard/Dashboard';
import { Home } from './Compomemt/dashboard/Home';
import { InvoicesRecord } from './Compomemt/dashboard/InvoicesRecord';
import { NewInvoice } from './Compomemt/dashboard/NewInvoice';
import { Settings } from './Compomemt/dashboard/Settings';
import {InvoiceDetail } from './Compomemt/dashboard/InvoiceDetail'

export default function App() {
  return ( <>
    
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login dashboard*/}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/Login "/>}/> 
          <Route path="/not-found" element={ <NotFound/>  } />
          <Route path="/signup" element={    < SignUp/>     }  />
          

          {/* Dashboard and its nested routes */}
          <Route path="/dashboard" element={<Dashboard />} >
            <Route path="home" element={<Home />} />
            <Route path="new-invoice" element={<NewInvoice />} />
            <Route path="invoices" element={<InvoicesRecord />} />
            <Route path="settings" element={<Settings />} />
            <Route path="Invoice-detail" element={<InvoiceDetail />} />
          </Route>
          {/* Redirect any unmatched routes to NotFound */}
          <Route path="*" element={<NotFound/>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}
