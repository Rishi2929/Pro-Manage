import { useState } from 'react'
import './App.css'
import RegisterPage from './Pages/RegisterPage'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import { Toaster } from 'react-hot-toast'
import LoginPage from './Pages/LoginPage';
import Dashboard from './Pages/Dashboard';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />


      </Routes>
      <Toaster />

    </Router >
  )
}

export default App

