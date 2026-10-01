import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page page--narrow center">
      <h1>Este destino no figura en el mapa 🧭</h1>
      <p className="muted">La página que buscás no existe.</p>
      <Link to="/" className="btn btn--primary">
        Volver al inicio
      </Link>
    </div>
  )
}
