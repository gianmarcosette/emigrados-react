import { Link } from 'react-router-dom'
import Title from '../components/Title.jsx'

export default function NotFound() {
  return (
    <div className="page page--narrow center">
      <Title>Este destino no figura en ningún vuelo</Title>
      <p className="muted">La página que buscás no existe.</p>
      <Link to="/" className="btn btn--primary">
        Volver al inicio
      </Link>
    </div>
  )
}
