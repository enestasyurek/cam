import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './config/chartConfig' // Initialize Chart.js
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
