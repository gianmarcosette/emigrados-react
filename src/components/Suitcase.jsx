import { useId } from 'react'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { SUITCASE_H, SUITCASE_W } from '../lib/suitcase.js'
import Sticker, { SunsetGradient } from './Sticker.jsx'

const W = SUITCASE_W
const H = SUITCASE_H - 40
const STRAPS = [W * 0.3, W * 0.7]
const CORNERS = [
  [14, 48, 0],
  [W - 14, 48, 90],
  [W - 14, H + 18, 180],
  [14, H + 18, 270],
]

// Maleta de cuero con las pegatinas de los países. Las correas pasan por encima, como
// en una valija de verdad. Con `onSelect`, cada pegatina es un botón que abre lo que se
// escribió en ese país; sin él, la maleta es solo un dibujo (en el inicio, por ejemplo).
export default function Suitcase({ stickers, selectedId, onSelect, freshId, label, className = '' }) {
  const baseId = useId()
  const gradientId = `${baseId}-sunset`
  const artId = (countryId) => `${baseId}-sticker-${countryId}`
  return (
    <svg
      className={`suitcase ${onSelect ? 'suitcase--interactive' : ''} ${className}`}
      viewBox={`0 0 ${W} ${SUITCASE_H}`}
      // Sin texto (dibujo de adorno, como en el inicio) la maleta no se anuncia
      {...(label ? { role: onSelect ? 'group' : 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <defs>
        <SunsetGradient id={gradientId} />
      </defs>
      {/* manija */}
      <path className="suitcase__handle-out" d={`M${W / 2 - 50} 52 V30 q0 -14 14 -14 h72 q14 0 14 14 V52`} />
      <path className="suitcase__handle-in" d={`M${W / 2 - 50} 52 V30 q0 -14 14 -14 h72 q14 0 14 14 V52`} />
      {/* cuerpo y costura */}
      <rect className="suitcase__body" x="14" y="48" width={W - 28} height={H - 30} rx="26" />
      <rect className="suitcase__seam" x="26" y="60" width={W - 52} height={H - 54} rx="18" />
      {CORNERS.map(([x, y, r]) => (
        <path
          key={r}
          className="suitcase__corner"
          transform={`translate(${x} ${y}) rotate(${r})`}
          d="M0 30 V14 Q0 0 14 0 H30"
        />
      ))}

      {stickers.map((s) => {
        const country = COUNTRY_BY_ID[s.countryId]
        const selected = s.countryId === selectedId
        const status = s.complete ? 'completa' : `${s.answered} de ${s.total} preguntas`
        return (
          <g key={s.countryId} transform={`translate(${s.x} ${s.y}) rotate(${s.rotate}) scale(${s.scale})`}>
            <g
              id={artId(s.countryId)}
              className={`suitcase__sticker ${selected ? 'is-selected' : ''} ${s.countryId === freshId ? 'is-fresh' : ''}`}
              {...(onSelect && {
                role: 'button',
                tabIndex: 0,
                'aria-pressed': selected,
                'aria-label': `${country.name}, ${status}`,
                onClick: () => onSelect(s.countryId),
                onKeyDown: (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(s.countryId)
                  }
                },
              })}
            >
              <Sticker country={country} kind={s.kind} complete={s.complete} gradientId={gradientId} />
            </g>
          </g>
        )
      })}

      {/* correas y hebillas, por encima de las pegatinas */}
      {STRAPS.map((x) => (
        <g key={x} className="suitcase__strap-group">
          <rect className="suitcase__strap" x={x - 13} y="44" width="26" height={H - 18} rx="4" />
          <rect className="suitcase__buckle" x={x - 17} y={H / 2 + 20} width="34" height="26" rx="4" />
          <rect className="suitcase__strap" x={x - 9} y={H / 2 + 27} width="18" height="12" rx="2" />
        </g>
      ))}
      {/* La pegatina elegida o recién pegada se ve también por encima de las correas
          (una copia solo visual: la original no se mueve, así no se pierde el foco) */}
      {stickers
        .filter((s) => s.countryId === freshId || s.countryId === selectedId)
        .map((s) => (
          <g
            key={`top-${s.countryId}`}
            className="suitcase__top"
            transform={`translate(${s.x} ${s.y}) rotate(${s.rotate}) scale(${s.scale})`}
          >
            <use href={`#${artId(s.countryId)}`} />
          </g>
        ))}
      <rect className="suitcase__foot" x="70" y={H + 18} width="34" height="10" rx="4" />
      <rect className="suitcase__foot" x={W - 104} y={H + 18} width="34" height="10" rx="4" />
    </svg>
  )
}
