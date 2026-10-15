import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SceneContext } from '../state/scene.js'
import { useJourney } from '../state/useJourney.js'
import Avatar from './Avatar.jsx'
import PlaneWindow from './PlaneWindow.jsx'
import Wordmark from './Wordmark.jsx'

const LINKS = [
  { to: '/individual', label: 'Individual' },
  { to: '/grupal', label: 'Grupal' },
  { to: '/mapa', label: 'Mi mapa' },
]

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
        <header className="topbar">
          <NavLink to="/" className="brand" aria-label="Emigrados, volver al inicio">
            <Wordmark />
          </NavLink>
          <nav className="topbar__nav" aria-label="Secciones">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `navlink ${isActive ? 'navlink--active' : ''}`}>
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
        <footer className="footer">
          Una activación de <strong>En Palabras</strong> · Para mayores de 16 años que emigraron de su país
        </footer>
      </div>
    </SceneContext.Provider>
  )
}
