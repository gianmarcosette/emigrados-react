import PassengerAvatar from '../components/PassengerAvatar.jsx'
import { AVATAR_OPTIONS } from '../lib/avatar.js'

// Página de prueba (solo en desarrollo): 8 combinaciones de avatares en varios tamaños.
const PRESETS = [
  {
    name: 'Lucía, 24',
    avatar: {
      skin: 'p2',
      hair: 'largo',
      hairColor: 'castano',
      item: 'auriculares',
      expression: 'sonrisa',
      shirt: 'amarillo',
      scene: 'nubes',
    },
  },
  {
    name: 'Andrés, 38',
    avatar: {
      skin: 'p4',
      hair: 'corto',
      hairColor: 'negro',
      facialHair: 'barba',
      item: 'cafe',
      expression: 'sereno',
      shirt: 'salvia',
      scene: 'mar',
    },
  },
  {
    name: 'Marta, 52',
    avatar: {
      skin: 'p1',
      hair: 'rodete',
      hairColor: 'canas',
      glasses: 'redondos',
      item: 'libro',
      expression: 'sonrisa',
      shirt: 'arena',
      scene: 'atardecer',
    },
  },
  {
    name: 'Amina, 31',
    avatar: { skin: 'p5', headwear: 'panuelo', item: 'carta', expression: 'sereno', shirt: 'salvia', scene: 'nubes' },
  },
  {
    name: 'Kofi, 27',
    avatar: {
      skin: 'p6',
      hair: 'rapado',
      hairColor: 'negro',
      item: 'camara',
      expression: 'sonrisa',
      shirt: 'papel',
      scene: 'mar',
    },
  },
  {
    name: 'Mateo, 33',
    avatar: {
      skin: 'p3',
      hair: 'rulos',
      hairColor: 'negro',
      item: 'mate',
      expression: 'sonrisa',
      shirt: 'amarillo',
      scene: 'atardecer',
    },
  },
  {
    name: 'Valentina, 22',
    avatar: {
      skin: 'p1',
      hair: 'largo',
      hairColor: 'cobrizo',
      headwear: 'gorro',
      item: 'mochila',
      expression: 'pensativo',
      shirt: 'tinta',
      scene: 'nubes',
    },
  },
  {
    name: 'Joaquín, 47',
    avatar: {
      skin: 'p3',
      hair: 'pelado',
      hairColor: 'castano',
      facialHair: 'bigote',
      glasses: 'cuadrados',
      headwear: 'gorra',
      item: 'cafe',
      expression: 'sereno',
      shirt: 'arena',
      scene: 'noche',
    },
  },
]

const BASE = { skin: 'p3', hair: 'largo', expression: 'sonrisa', shirt: 'arena', scene: 'nubes' }

export default function AvatarPreview() {
  return (
    <div className="page page--wide">
      <header className="page__header">
        <p className="kicker">Prueba</p>
        <h1 className="title">Pasajeros del vuelo</h1>
      </header>
      <ul className="avatar-preview">
        {PRESETS.map((p) => (
          <li key={p.name}>
            <PassengerAvatar avatar={p.avatar} size={150} label={p.name} />
            <strong>{p.name}</strong>
            <span className="avatar-preview__small">
              <PassengerAvatar avatar={p.avatar} size={56} label="" />
              <PassengerAvatar avatar={p.avatar} size={28} label="" />
            </span>
          </li>
        ))}
      </ul>

      <h2 className="avatar-preview__title">Color de pelo</h2>
      <div className="avatar-preview__row">
        {AVATAR_OPTIONS.hairColor.map((c) => (
          <figure key={c.id}>
            <PassengerAvatar avatar={{ ...BASE, hairColor: c.id }} size={96} label={c.label} />
            <figcaption>{c.label}</figcaption>
          </figure>
        ))}
      </div>

      <h2 className="avatar-preview__title">Fondos de la ventanilla</h2>
      <div className="avatar-preview__row">
        {AVATAR_OPTIONS.scene.map((sc) => (
          <figure key={sc.id}>
            <PassengerAvatar
              avatar={{ ...BASE, hair: 'corto', hairColor: 'negro', scene: sc.id }}
              size={96}
              label={sc.label}
            />
            <figcaption>{sc.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
