import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Diario from './pages/Diario.jsx'
import Grupal from './pages/Grupal.jsx'
import Home from './pages/Home.jsx'
import Individual from './pages/Individual.jsx'
import Mapa from './pages/Mapa.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="individual" element={<Individual />} />
        <Route path="grupal" element={<Grupal />} />
        <Route path="mapa" element={<Mapa />} />
        <Route path="diario" element={<Diario />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
