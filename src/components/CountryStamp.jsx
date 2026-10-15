import CountryShape from './CountryShape.jsx'

// Sello de pasaporte: nombre del país y sus coordenadas.
// Con `shape` suma el contorno del país debajo ("below") o al lado ("side").
function formatCoords([lon, lat]) {
  const ns = `${Math.abs(lat).toFixed(1)}° ${lat >= 0 ? 'N' : 'S'}`
  const ew = `${Math.abs(lon).toFixed(1)}° ${lon >= 0 ? 'E' : 'O'}`
  return `${ns} · ${ew}`
}

export default function CountryStamp({ country, size = 'md', shape }) {
  const stamp = (
    <span className={`stamp stamp--${size}`} aria-label={`País: ${country.name}`}>
      <span className="stamp__name">{country.name}</span>
      {size !== 'sm' && <span className="stamp__coords">{formatCoords(country.coords)}</span>}
    </span>
  )
  if (!shape) return stamp
  return (
    <span className={`stamp-group stamp-group--${shape}`}>
      {stamp}
      <CountryShape country={country} />
    </span>
  )
}
