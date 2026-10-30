import { useId } from 'react'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { SUITCASE_H, SUITCASE_W } from '../lib/suitcase.js'
import CountryPoster from './posters.jsx'
import Sticker, { SunsetGradient } from './Sticker.jsx'

const W = SUITCASE_W
const H = SUITCASE_H - 40
const STRAPS = [W * 0.3, W * 0.7]

// Maleta de papel recortado, azul noche, con los afiches de los países. Las correas
// amarillas pasan por encima, como en una valija de verdad. Con `onSelect`, cada pegatina es un botón que abre lo que se
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
        {/* Afiche recién pegado: en blanco y negro hasta completar el país */}
        <filter id={`${baseId}-mono`}>
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      {/* manija, cuerpo y costura: papeles con borde de tijera */}
      <path
        className="suitcase__handle"
        filter="url(#papel-corte)"
        d={`M${W / 2 - 54} 56 V30 q0 -18 18 -18 h72 q18 0 18 18 V56`}
      />
      <rect
        className="suitcase__body"
        filter="url(#papel-corte)"
        x="14"
        y="48"
        width={W - 28}
        height={H - 30}
        rx="34"
      />
      <rect className="suitcase__seam" x="30" y="64" width={W - 60} height={H - 62} rx="22" />

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
              <CountryPoster
                countryId={s.countryId}
                uid={`${baseId}-p-${s.countryId}`}
                complete={s.complete}
                monoId={`${baseId}-mono`}
                fallback={<Sticker country={country} kind={s.kind} complete={s.complete} gradientId={gradientId} />}
              />
            </g>
          </g>
        )
      })}

      {/* correas y hebillas, por encima de las pegatinas */}
      {STRAPS.map((x) => (
        <g key={x} className="suitcase__strap-group">
          <rect
            className="suitcase__strap"
            filter="url(#papel-corte)"
            x={x - 15}
            y="44"
            width="30"
            height={H - 22}
            rx="6"
          />
          <rect className="suitcase__buckle" x={x - 11} y={H / 2 + 16} width="22" height="26" rx="5" />
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
    </svg>
  )
}
