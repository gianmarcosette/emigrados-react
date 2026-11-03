import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import { JourneyProvider } from './state/JourneyContext.jsx'
import { applyTextSize, readTextSize } from './lib/textSize.js'
// Solo el alfabeto latino: alcanza para español, portugués, inglés, francés e italiano.
// Montserrat normal y Archivo (títulos y preguntas) se registran en fonts.css.
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
    {/* Visitas anónimas, sin cookies (Vercel Web Analytics). Solo se manda la pantalla, nunca
        lo que se escribe: se saca todo lo que va después de "?" (pregunta o país elegidos). */}
    <Analytics beforeSend={(event) => ({ ...event, url: event.url.split('?')[0] })} />
  </StrictMode>,
)
