import { WindowVignette } from './Vignettes.jsx'

const ROW = ['sleeper', 'reader', 'mate', 'shade', 'waver', 'writer', 'headphones', 'kid']

// El costado de un avión que pasa: una fila de ventanillas con pasajeros, en loop.
export default function WindowRow() {
  return (
    <div className="window-row" aria-hidden="true">
      <div className="window-row__track">
        {[...ROW, ...ROW].map((name, i) => (
          <WindowVignette key={i} name={name} animated className="window-row__item" />
        ))}
      </div>
    </div>
  )
}
