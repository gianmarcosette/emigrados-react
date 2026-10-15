import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Grupal from './pages/Grupal.jsx'
import Home from './pages/Home.jsx'
import Individual from './pages/Individual.jsx'
import Mapa from './pages/Mapa.jsx'
import NotFound from './pages/NotFound.jsx'
import Perfil from './pages/Perfil.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="individual" element={<Individual />} />
        <Route path="grupal" element={<Grupal />} />
        <Route path="mapa" element={<Mapa />} />
        {/* El diario ahora vive dentro del perfil; se mantiene la dirección vieja. */}
        <Route path="diario" element={<Navigate to="/perfil#diario" replace />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
