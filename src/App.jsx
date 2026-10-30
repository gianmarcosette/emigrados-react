import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import ProfileGate from './components/ProfileGate.jsx'

// Cada modo se descarga recién cuando se abre: el inicio carga rápido aunque la
// conexión sea lenta o con datos prepagos.
const Individual = lazy(() => import('./pages/Individual.jsx'))
const Grupal = lazy(() => import('./pages/Grupal.jsx'))
const Online = lazy(() => import('./pages/Online.jsx'))
const Maleta = lazy(() => import('./pages/Maleta.jsx'))
const Perfil = lazy(() => import('./pages/Perfil.jsx'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Individual, la maleta y online piden perfil. Grupal se juega sin perfil. */}
        <Route
          path="individual"
          element={
            <ProfileGate>
              <Individual />
            </ProfileGate>
          }
        />
        <Route path="grupal" element={<Grupal />} />
        <Route
          path="online"
          element={
            <ProfileGate>
              <Online />
            </ProfileGate>
          }
        />
        <Route
          path="maleta"
          element={
            <ProfileGate>
              <Maleta />
            </ProfileGate>
          }
        />
        {/* El mapa se reemplazó por la maleta; se mantiene la dirección vieja. */}
        <Route path="mapa" element={<Navigate to="/maleta" replace />} />
        {/* El diario ahora vive dentro del perfil; se mantiene la dirección vieja. */}
        <Route path="diario" element={<Navigate to="/perfil#diario" replace />} />
        <Route path="perfil" element={<Perfil />} />
        {/* Página de prueba de avatares, solo mientras se desarrolla */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
