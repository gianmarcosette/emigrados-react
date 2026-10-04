import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { JourneyProvider } from './state/JourneyContext.jsx'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/800.css'
import '@fontsource/montserrat/500-italic.css'
import '@fontsource/montserrat/600-italic.css'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <JourneyProvider>
        <App />
      </JourneyProvider>
    </BrowserRouter>
  </StrictMode>,
)
