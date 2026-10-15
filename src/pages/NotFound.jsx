import { Link } from 'react-router-dom'
import { useWindowScene } from '../state/scene.js'

export default function NotFound() {
  useWindowScene('clouds')
  return (
    <div className="page page--narrow center">
      <h1>Este destino no figura en el mapa</h1>
      <p className="muted">La página que buscás no existe.</p>
      <Link to="/" className="btn btn--primary">
        Volver al inicio
      </Link>
    </div>
  )
}
