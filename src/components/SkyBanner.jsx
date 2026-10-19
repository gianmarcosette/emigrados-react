// Franja de cielo del encabezado: una avioneta cruza remolcando una bandera con el lema.
// Entra por la izquierda, se detiene en el centro para que se pueda leer y sigue de largo.
export default function SkyBanner({ children }) {
  return (
    <div className="sky">
      <p className="sky__flight">
        <span className="sky__banner">{children}</span>
        <span className="sky__rope" aria-hidden="true" />
        <svg className="sky__plane" viewBox="0 0 64 32" aria-hidden="true">
          {/* Cola, fuselaje, ala y cabina en una sola línea */}
          <path d="M9 14L5 5h6l6 7" />
          <path d="M6 17c0-3 6-5 16-5h26c6 0 10 2 11 5-1 3-5 4-11 4H14c-5 0-8-1.5-8-4z" />
          <path d="M29 17l-6 10h6l9-10" />
          <path d="M44 12c1.5-3 6-3.5 8 0" />
          <g className="sky__propeller">
            <path d="M61.5 9v16" />
          </g>
        </svg>
      </p>
    </div>
  )
}
