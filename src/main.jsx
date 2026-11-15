import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import { JourneyProvider } from './state/JourneyContext.jsx'
import { applyTextSize, readTextSize } from './lib/textSize.js'
import { watchInstall } from './state/install.js'
// Solo el alfabeto latino: alcanza para español, portugués, inglés, francés e italiano.
// Montserrat normal y Archivo (títulos y preguntas) se registran en fonts.css.
import '@fontsource/montserrat/latin-500-italic.css'
import '@fontsource/montserrat/latin-600-italic.css'
import './fonts.css'
import './styles.css'

// El tamaño de letra elegido se aplica antes de dibujar, para que no salte
applyTextSize(readTextSize())

// Escucha si el celular ofrece instalar el juego (lo muestra el aviso del inicio)
watchInstall()

// Con el juego publicado, queda guardado en el dispositivo para abrir sin conexión
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
}

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
