import { useState } from 'react';
import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Setting from './pages/Setting';

import UserContextProvider from './context/user/UserContextProvider';
import AllTodosContextProvider from './context/allTodosData/AllTodosContextProvider';

import './App.css';
import Navbar from './components/Navbar';

// const MainLayout = () => {
//   return (
//     <div className="main-layout">
//       <Navbar />
//       <div className="content">
//         <Switch>
//           <Route path="/dashboard" component={Dashboard} />
//           <Route path="/analytics" component={Analytics} />
//           <Route path="/settings" component={Setting} />
//         </Switch>
//       </div>
//     </div>
//   );
// };

// const App =() => {
//   return (
//     <UserContextProvider>
//       <AllTodosContextProvider>
//         <Router>
//           <Switch>
//             <Route path="/register" component={RegisterPage} />
//             <Route path='/login' component={LoginPage} />
//             <Route path='/' component={MainLayout} />
//           </Switch>
//           <Toaster />
//         </Router >
//       </AllTodosContextProvider>
//     </UserContextProvider>
//   );
// }

function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Setting />} />
            </MainLayout>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App

