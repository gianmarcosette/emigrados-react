import { Link } from 'react-router-dom'
import { useWindowScene } from '../state/scene.js'
import Title from '../components/Title.jsx'

export default function NotFound() {
  useWindowScene('clouds')
  return (
    <div className="page page--narrow center">
      <Title>Este destino no figura en el mapa</Title>
      <p className="muted">La página que buscás no existe.</p>
      <Link to="/" className="btn btn--primary">
        Volver al inicio
      </Link>
    </div>
  )
}
