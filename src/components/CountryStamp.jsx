export default function CountryStamp({ country, size = 'md' }) {
  return (
    <span className={`stamp stamp--${size}`} aria-label={`País: ${country.name}`}>
      <span className="stamp__flag" aria-hidden="true">{country.flag}</span>
      <span className="stamp__name">{country.name}</span>
    </span>
  )
}
