import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// export const server = "http://localhost:3000/api/v1";
export const server = "https://pro-manage-fp5z.onrender.com/api/v1";


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
)
