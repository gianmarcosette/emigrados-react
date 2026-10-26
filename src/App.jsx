import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Grupal from './pages/Grupal.jsx'
import Home from './pages/Home.jsx'
import Individual from './pages/Individual.jsx'
import Mapa from './pages/Mapa.jsx'
import Online from './pages/Online.jsx'
import NotFound from './pages/NotFound.jsx'
import Perfil from './pages/Perfil.jsx'
import AvatarPreview from './pages/AvatarPreview.jsx'
import ProfileGate from './components/ProfileGate.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Individual, el mapa y online piden perfil. Grupal se juega sin perfil. */}
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
          path="mapa"
          element={
            <ProfileGate>
              <Mapa />
            </ProfileGate>
          }
        />
        {/* El diario ahora vive dentro del perfil; se mantiene la dirección vieja. */}
        <Route path="diario" element={<Navigate to="/perfil#diario" replace />} />
        <Route path="perfil" element={<Perfil />} />
        {/* Página de prueba de avatares, solo mientras se desarrolla */}
        {import.meta.env.DEV && <Route path="prueba-avatares" element={<AvatarPreview />} />}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
