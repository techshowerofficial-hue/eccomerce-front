import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreGiveProvider from './context/StoreGive.jsx'




ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
<StoreGiveProvider>
<App />
</StoreGiveProvider>
  </ BrowserRouter>
)
