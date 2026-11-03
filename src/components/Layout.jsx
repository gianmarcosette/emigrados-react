import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import { suitcaseColor, useSuitcaseLook } from '../state/suitcaseLook.js'
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
import { PaperFilters, TabIcon } from './paper.jsx'
import TextSize from './TextSize.jsx'
import Wordmark from './Wordmark.jsx'

// Título de la pestaña del navegador en cada pantalla (lo leen también los lectores de pantalla)
const TITLES = {
  '/': 'Emigrados · En Palabras',
  '/individual': 'Individual · Emigrados',
  '/grupal': 'Grupal · Emigrados',
  '/online': 'Online · Emigrados',
  '/maleta': 'Mi maleta · Emigrados',
  '/perfil': 'Mi perfil · Emigrados',
}

const TABS = [
  { to: '/', label: 'Inicio', icon: 'inicio' },
  { to: '/individual', label: 'Individual', icon: 'individual' },
  { to: '/maleta', label: 'Maleta', icon: 'maleta' },
  { to: '/perfil', label: 'Perfil', icon: 'perfil' },
]

const LINKS = [
  { to: '/individual', label: 'Individual' },
  { to: '/grupal', label: 'Grupal' },
  { to: '/online', label: 'Online' },
  { to: '/maleta', label: 'Mi maleta' },
]

export default function Layout() {
  const { pathname, hash } = useLocation()
  const { profile, answeredCount } = useJourney()
  const [suitcase] = useSuitcaseLook()
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
    <FirstFlightContext.Provider value={() => setFlightOpen(true)}>
      <ConfirmProvider>
        <div className={`app ${isHome ? 'app--home' : ''}`}>
          {/* Para teclado y lectores de pantalla: ir directo al contenido sin pasar por el menú */}
          <a href="#contenido" className="skip-link">
            Saltar al contenido
          </a>
          {/* Los filtros que le dan a los dibujos el borde de papel cortado */}
          <PaperFilters />
          {/* Logo y menú arriba, sobre papel crema */}
          <header className="topbar">
            <div className="topbar__row">
              <NavLink to="/" className="brand" aria-label="Emigrados, volver al inicio">
                <Wordmark className="brand__word" compact />
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
              <TextSize />
            </div>
          </header>
          <div className={isHome ? 'shell shell--home' : 'shell'}>
            <main className="main" id="contenido" tabIndex={-1}>
              <Suspense
                fallback={
                  <p className="page-loading" role="status">
                    Cargando…
                  </p>
                }
              >
                <Outlet />
              </Suspense>
            </main>
          </div>
          {/* Menú inferior, solo en el celular: lo de todos los días. Grupal y Online están a un
              toque desde las tarjetas del inicio. */}
          <nav className="tabbar" aria-label="Secciones">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) => `tab ${isActive ? 'tab--active' : ''}`}
              >
                {t.icon === 'perfil' && profile ? (
                  <Avatar profile={profile} size="nav" />
                ) : (
                  <TabIcon name={t.icon} suitcase={suitcaseColor(suitcase.color)} />
                )}
                {t.label}
              </NavLink>
            ))}
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
          <FirstFlight open={flightOpen} onClose={closeFlight} />
        </div>
      </ConfirmProvider>
    </FirstFlightContext.Provider>
  )
}
