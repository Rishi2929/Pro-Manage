import { useState } from 'react';
import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import Dashboard from './Pages/Dashboard';
import Analytics from './Pages/Analytics';
import Setting from './Pages/Setting';

import UserContextProvider from './context/user/UserContextProvider';
import AllTodosContextProvider from './context/allTodosData/AllTodosContextProvider';

import './App.css';
import Navbar from './components/Navbar';
import SharePage from './Pages/SharePage';

function MainLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <div style={{ height: '100vh', width: '15rem' }}>
        <Navbar />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', width: '85rem' }}>
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <UserContextProvider>
      <AllTodosContextProvider>
        <Router>
          <Routes>
            <Route path="/home" element={<MainLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Setting />} />
            </Route>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="sharePage/:id" element={<SharePage />} />
          </Routes>
          <Toaster />
        </Router>
      </AllTodosContextProvider>
    </UserContextProvider>
  );
}

export default App

