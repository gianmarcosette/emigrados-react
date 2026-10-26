import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SceneContext } from '../state/scene.js'
import { useJourney } from '../state/useJourney.js'
import {
  FirstFlightContext,
  hasSeenFirstFlight,
  markFirstFlightSeen,
  shouldShowFirstFlight,
} from '../state/firstFlight.js'
import Avatar from './Avatar.jsx'
import ConfirmProvider from './ConfirmDialog.jsx'
import FirstFlight from './FirstFlight.jsx'
import { TAB_ICONS } from './icons.jsx'
import Wallpaper from './illustrations/Wallpaper.jsx'
import PlaneWindow from './PlaneWindow.jsx'
import SkyBanner, { MOTTO } from './SkyBanner.jsx'
import Wordmark from './Wordmark.jsx'

// Título de la pestaña del navegador en cada pantalla (lo leen también los lectores de pantalla)
const TITLES = {
  '/': 'Emigrados · En Palabras',
  '/individual': 'Individual · Emigrados',
  '/grupal': 'Grupal · Emigrados',
  '/online': 'Online · Emigrados',
  '/mapa': 'Mi mapa · Emigrados',
  '/perfil': 'Mi perfil · Emigrados',
}

const LINKS = [
  { to: '/individual', label: 'Individual' },
  { to: '/grupal', label: 'Grupal' },
  { to: '/online', label: 'Online' },
  { to: '/mapa', label: 'Mi mapa', short: 'Mapa' },
]

export default function Layout() {
  const { pathname, hash } = useLocation()
  const { profile, answeredCount } = useJourney()
  const [scene, setScene] = useState('clouds')
  const isHome = pathname === '/'
  // La primera vez que alguien nuevo entra al inicio, la bienvenida se abre sola
  const [flightOpen, setFlightOpen] = useState(() =>
    shouldShowFirstFlight({ pathname, profile, answeredCount, seen: hasSeenFirstFlight() }),
  )

  function closeFlight() {
    setFlightOpen(false)
    markFirstFlightSeen()
  }

  useEffect(() => {
    document.title = TITLES[pathname] ?? 'Emigrados · En Palabras'
  }, [pathname])

  // Al cambiar de pantalla se vuelve arriba, salvo que el link apunte a una sección (#diario).
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <SceneContext.Provider value={setScene}>
      <FirstFlightContext.Provider value={() => setFlightOpen(true)}>
        <ConfirmProvider>
          <div className={`app ${isHome ? 'app--home' : ''}`}>
            {/* Para teclado y lectores de pantalla: ir directo al contenido sin pasar por el menú */}
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <Wallpaper />
            {/* Logo y menú arriba; en las secciones, el lema cruza la franja de cielo */}
            <header className="topbar">
              <div className="topbar__row">
                <NavLink to="/" className="brand" aria-label="Emigrados, volver al inicio">
                  <Wordmark />
                </NavLink>
                <nav className="topbar__nav" aria-label="Secciones">
                  {LINKS.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className={({ isActive }) => `navlink ${isActive ? 'navlink--active' : ''}`}
                    >
                      {l.label}
                    </NavLink>
                  ))}
                  <NavLink
                    to="/perfil"
                    className={({ isActive }) => `navlink navlink--profile ${isActive ? 'navlink--active' : ''}`}
                  >
                    {profile ? <Avatar profile={profile} size="nav" /> : null}
                    {profile ? 'Mi perfil' : 'Crear perfil'}
                  </NavLink>
                </nav>
              </div>
              {/* En el inicio la avioneta no va acá: es la protagonista de la pantalla */}
              {!isHome && <SkyBanner>{MOTTO}</SkyBanner>}
            </header>
            <div className={isHome ? 'shell shell--home' : 'shell'}>
              {/* En el inicio la ventanilla forma parte del hero */}
              {!isHome && (
                <aside className="shell__window" aria-label="Vista por la ventanilla">
                  <PlaneWindow scene={scene} />
                </aside>
              )}
              <main className="main" id="contenido" tabIndex={-1}>
                <Outlet />
              </main>
            </div>
            {/* Menú inferior, solo en el celular */}
            <nav className="tabbar" aria-label="Secciones">
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className={({ isActive }) => `tab ${isActive ? 'tab--active' : ''}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {TAB_ICONS[l.to]}
                  </svg>
                  {l.short ?? l.label}
                </NavLink>
              ))}
              <NavLink to="/perfil" className={({ isActive }) => `tab ${isActive ? 'tab--active' : ''}`}>
                {profile ? (
                  <Avatar profile={profile} size="nav" />
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="3.6" />
                    <path d="M4.5 20c.8-4 3.8-6.2 7.5-6.2s6.7 2.2 7.5 6.2" />
                  </svg>
                )}
                Perfil
              </NavLink>
            </nav>
            <footer className="footer">
              {/* La ayuda siempre en el mismo lugar, en todas las pantallas */}
              <button type="button" className="footer__help" onClick={() => setFlightOpen(true)}>
                ¿Cómo funciona? Ver el primer vuelo
              </button>
              <span>
                Una activación de <strong>En Palabras</strong> · Para mayores de 18 años que emigraron de su país
              </span>
            </footer>
            <FirstFlight open={flightOpen} hasProfile={Boolean(profile)} onClose={closeFlight} />
          </div>
        </ConfirmProvider>
      </FirstFlightContext.Provider>
    </SceneContext.Provider>
  )
}
