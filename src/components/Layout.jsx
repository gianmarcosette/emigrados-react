import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Wordmark from './Wordmark.jsx'

const LINKS = [
  { to: '/individual', label: 'Individual' },
  { to: '/grupal', label: 'Grupal' },
  { to: '/mapa', label: 'Mi mapa' },
  { to: '/diario', label: 'Diario' },
]

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={`app ${pathname === '/' ? 'app--home' : ''}`}>
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
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        Una activación de <strong>En Palabras</strong> · Para mayores de 16 años que emigraron de su país
      </footer>
    </div>
  )
}
