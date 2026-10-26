import { useId, useState } from 'react'
import { AVATAR_OPTIONS, randomAvatar } from '../lib/avatar.js'
import PassengerAvatar from './PassengerAvatar.jsx'

// Creador de tu pasajero: cada opción se ve dibujada sobre tu propio avatar,
// así se elige viendo y no imaginando. Los colores se eligen con muestras.
const TABS = [
  { id: 'pelo', label: 'Pelo', groups: ['hair', 'hairColor'] },
  { id: 'piel', label: 'Piel', groups: ['skin'] },
  { id: 'cabeza', label: 'Cabeza', groups: ['headwear'] },
  { id: 'cara', label: 'Cara', groups: ['expression', 'glasses', 'facialHair'] },
  { id: 'objeto', label: 'Objeto', groups: ['item'] },
  { id: 'ropa', label: 'Ropa', groups: ['shirt'] },
  { id: 'ventanilla', label: 'Ventanilla', groups: ['scene'] },
]

const GROUP_TITLES = {
  hair: 'Peinado',
  hairColor: 'Color',
  skin: 'Tono de piel',
  headwear: 'En la cabeza',
  expression: 'Expresión',
  glasses: 'Anteojos',
  facialHair: 'Barba o bigote',
  item: 'Tu objeto de viaje',
  shirt: 'Color de la remera',
  scene: 'Lo que se ve por tu ventanilla',
}

const SWATCHES = ['hairColor', 'skin', 'shirt']

export default function AvatarEditor({ value, onChange }) {
  const [tab, setTab] = useState('pelo')
  const id = useId()
  const current = TABS.find((t) => t.id === tab)

  function set(part, option) {
    onChange({ ...value, [part]: option })
  }

  return (
    <div className="avatar-editor">
      <div className="avatar-editor__preview">
        <PassengerAvatar avatar={value} size={150} label="Así se ve tu pasajero" />
        <button type="button" className="btn btn--ghost avatar-editor__random" onClick={() => onChange(randomAvatar())}>
          Sorprendeme
        </button>
      </div>

      <div className="avatar-editor__tabs" role="tablist" aria-label="Partes del avatar">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`${id}-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`${id}-panel`}
            className={`avatar-editor__tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="avatar-editor__panel" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${tab}`}>
        {current.groups.map((part) => (
          <fieldset key={part} className="avatar-editor__group">
            <legend>{GROUP_TITLES[part]}</legend>
            {part === 'hair' && value.headwear === 'panuelo' && (
              <p className="avatar-editor__note">Con el pañuelo el pelo no se ve.</p>
            )}
            <div className={`avatar-editor__options ${SWATCHES.includes(part) ? 'is-swatches' : ''}`}>
              {AVATAR_OPTIONS[part].map((option) => {
                const selected = value[part] === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`avatar-editor__option ${selected ? 'is-selected' : ''}`}
                    aria-pressed={selected}
                    aria-label={option.label}
                    title={option.label}
                    onClick={() => set(part, option.id)}
                  >
                    {SWATCHES.includes(part) ? (
                      <span className="avatar-editor__swatch" style={{ background: option.color }} />
                    ) : (
                      <PassengerAvatar avatar={{ ...value, [part]: option.id }} size={58} decorative />
                    )}
                    {!SWATCHES.includes(part) && <span className="avatar-editor__label">{option.label}</span>}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  )
}
