import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AllProviders from './AllProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AllProviders>
    <App />
    </AllProviders>
  </StrictMode>,
)
