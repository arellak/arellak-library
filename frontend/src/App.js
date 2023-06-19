import React from 'react';
import "./styles/App.css";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Entries from './pages/entries/entries';
import Start from './pages/start';
import Account from './pages/account/account';
import Register from './pages/account/register';
import Login from './pages/account/login';
import Uploader from './pages/uploadPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/entries" element={<Entries />} />
        <Route path="/account" element={<Account />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Uploader   />} />
        <Route path="/entries" element={<Entries />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
