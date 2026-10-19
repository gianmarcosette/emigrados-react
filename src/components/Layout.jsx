import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SceneContext } from '../state/scene.js'
import { useJourney } from '../state/useJourney.js'
import Avatar from './Avatar.jsx'
import Wallpaper from './illustrations/Wallpaper.jsx'
import PlaneWindow from './PlaneWindow.jsx'
import SkyBanner, { MOTTO } from './SkyBanner.jsx'
import Wordmark from './Wordmark.jsx'

const LINKS = [
  { to: '/individual', label: 'Individual' },
  { to: '/grupal', label: 'Grupal' },
  { to: '/online', label: 'Online' },
  { to: '/mapa', label: 'Mi mapa', short: 'Mapa' },
]

// Íconos de línea para el menú inferior del celular
const TAB_ICONS = {
  '/individual': <path d="M5 19l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L9 18zM14.5 6.5l3 3M4 21h16" />,
  '/grupal': (
    <>
      <circle cx="8.5" cy="8" r="3.2" />
      <circle cx="16.5" cy="9" r="2.6" />
      <path d="M3 19c.6-3.6 2.8-5.5 5.5-5.5s4.9 1.9 5.5 5.5M14.5 14c2.8-.4 5.4 1.2 6 4.5" />
    </>
  ),
  '/online': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c-3 3-3 14 0 17M12 3.5c3 3 3 14 0 17" />
    </>
  ),
  '/mapa': (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
}

export default function Layout() {
  const { pathname, hash } = useLocation()
  const { profile } = useJourney()
  const [scene, setScene] = useState('clouds')
  const isHome = pathname === '/'

  // Al cambiar de pantalla se vuelve arriba, salvo que el link apunte a una sección (#diario).
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <SceneContext.Provider value={setScene}>
      <div className={`app ${isHome ? 'app--home' : ''}`}>
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
          <main className="main">
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
          Una activación de <strong>En Palabras</strong> · Para mayores de 16 años que emigraron de su país
        </footer>
      </div>
    </SceneContext.Provider>
  )
}
