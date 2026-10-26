import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { JourneyProvider } from './state/JourneyContext.jsx'
import { applyTextSize, readTextSize } from './lib/textSize.js'
// Solo el alfabeto latino: alcanza para español, portugués, inglés, francés e italiano.
// Montserrat normal viene en un solo archivo variable (ver fonts.css).
import '@fontsource/caveat/latin-500.css'
import '@fontsource/caveat/latin-700.css'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import '@fontsource/montserrat/latin-500-italic.css'
import '@fontsource/montserrat/latin-600-italic.css'
import './fonts.css'
import './styles.css'

// El tamaño de letra elegido se aplica antes de dibujar, para que no salte
applyTextSize(readTextSize())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <JourneyProvider>
        <App />
      </JourneyProvider>
    </BrowserRouter>
  </StrictMode>,
)
