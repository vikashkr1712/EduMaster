import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './components/Theme/ThemeProvider.jsx'
import './styles/variables.css'
import './styles/global.css'
import './styles/responsive.css'
import './styles/svg-motion.css'
import './styles/interactions.css'
import './styles/dark.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
