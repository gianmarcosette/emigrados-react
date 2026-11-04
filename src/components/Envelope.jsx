// Sobre de papel recortado: cerrado con un sello coral, o abierto con la carta asomando.
export default function Envelope({ open = false, className = '' }) {
  return (
    <svg viewBox="0 -30 200 160" className={`envelope ${className}`} aria-hidden="true" focusable="false">
      <g filter="url(#papel-corte)">
        {open && (
          <rect x="30" y="-18" width="140" height="100" rx="4" fill="#fbf9f5" stroke="#161616" strokeWidth="3" />
        )}
        {open &&
          [0, 1, 2, 3].map((i) => (
            <path key={i} d={`M46 ${4 + i * 16} H154`} stroke="#d9d2c4" strokeWidth="3" strokeLinecap="round" />
          ))}
        <rect x="10" y="20" width="180" height="104" rx="6" fill="#f3ede0" stroke="#161616" strokeWidth="3" />
        {open ? (
          <path d="M10 26 L100 78 L190 26" fill="none" stroke="#161616" strokeWidth="3" strokeLinejoin="round" />
        ) : (
          <>
            <path d="M10 22 L100 84 L190 22" fill="#fff3b3" stroke="#161616" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="100" cy="82" r="15" fill="#e8664a" stroke="#161616" strokeWidth="2.5" />
            <path d="M93 82 L100 75 L107 82 L100 89 Z" fill="#f3ede0" />
          </>
        )}
      </g>
    </svg>
  )
}
