// Logotipo con el mismo recurso que "DESCONECTADOS" de En Palabras:
// el prefijo en negrita recta y el resto en itálica espaciada.
export default function Wordmark({ className = '' }) {
  return (
    <span className={`wordmark ${className}`}>
      <strong>E</strong>
      <em>MIGRADOS</em>
    </span>
  )
}
