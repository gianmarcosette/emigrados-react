import { dismissInstall, promptInstall, useInstallMode } from '../state/install.js'

// En el inicio: invita a dejar Emigrados en la pantalla del celular. Solo aparece si el
// dispositivo lo permite y el juego todavía no está instalado; con "Ahora no" no vuelve.
export default function InstallCard() {
  const mode = useInstallMode()
  if (!mode) return null

  return (
    <section className="install-card" aria-label="Instalar Emigrados">
      <img src="/icon-192.png" alt="" width="56" height="56" />
      <span className="install-card__text">
        <strong>Llevá Emigrados en tu celular</strong>
        <small>
          {mode === 'ios'
            ? 'En Safari, tocá Compartir y elegí «Agregar a inicio».'
            : 'Queda con su ícono, se abre a pantalla completa y funciona sin conexión.'}
        </small>
      </span>
      <span className="install-card__actions">
        {mode === 'prompt' && (
          <button type="button" className="btn btn--primary" onClick={promptInstall}>
            Instalar
          </button>
        )}
        <button type="button" className="btn btn--text" onClick={dismissInstall}>
          Ahora no
        </button>
      </span>
    </section>
  )
}
