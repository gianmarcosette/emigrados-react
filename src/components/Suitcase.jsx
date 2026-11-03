import { useId, useRef } from 'react'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { SUITCASE_H, SUITCASE_W, clampPlace } from '../lib/suitcase.js'
import { suitcaseColor } from '../state/suitcaseLook.js'
import CountryPoster from './posters.jsx'

const W = SUITCASE_W
const H = SUITCASE_H - 40
const STRAPS = [W * 0.3, W * 0.7]
// Con las flechas del teclado: un paso chico, o uno grande con Mayúscula
const STEP = 6
const BIG_STEP = 24

// Maleta de papel recortado con los afiches de los países, en el color que elegiste. Las
// correas pasan por encima, como en una valija de verdad.
// - Con `onSelect`, cada afiche es un botón que abre lo que se escribió en ese país.
// - Con `editing`, los afiches se arrastran (con el dedo, el mouse o las flechas del teclado):
//   `onPick` marca cuál se está moviendo y `onMove(countryId, lugar, terminado)` avisa dónde quedó.
// - Sin ninguno de los dos, la maleta es solo un dibujo (en el inicio, por ejemplo).
export default function Suitcase({
  stickers,
  look,
  selectedId,
  onSelect,
  freshId,
  label,
  className = '',
  editing = false,
  pickedId,
  onPick,
  onMove,
}) {
  const baseId = useId()
  const svgRef = useRef(null)
  const drag = useRef(null)
  const colors = look ?? suitcaseColor()
  const artId = (countryId) => `${baseId}-sticker-${countryId}`
  const onTop = editing ? pickedId : selectedId

  // Del lugar del puntero en la pantalla al de la maleta
  function toSvg(e) {
    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    return pt.matrixTransform(svg.getScreenCTM().inverse())
  }

  function startDrag(e, s) {
    onPick?.(s.countryId)
    const p = toSvg(e)
    drag.current = {
      id: s.countryId,
      pointer: e.pointerId,
      dx: s.x - p.x,
      dy: s.y - p.y,
      rotate: s.rotate,
      moved: false,
    }
    svgRef.current.setPointerCapture(e.pointerId)
  }

  function moveDrag(e) {
    const d = drag.current
    if (!d || d.pointer !== e.pointerId) return
    const p = toSvg(e)
    d.moved = true
    onMove?.(d.id, clampPlace({ x: p.x + d.dx, y: p.y + d.dy, rotate: d.rotate }), false)
  }

  function endDrag(e) {
    const d = drag.current
    if (!d || d.pointer !== e.pointerId) return
    drag.current = null
    if (d.moved) {
      const p = toSvg(e)
      onMove?.(d.id, clampPlace({ x: p.x + d.dx, y: p.y + d.dy, rotate: d.rotate }), true)
    }
  }

  function nudge(e, s) {
    const step = e.shiftKey ? BIG_STEP : STEP
    const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
    if (!move) return
    e.preventDefault()
    onPick?.(s.countryId)
    onMove?.(s.countryId, clampPlace({ x: s.x + move[0], y: s.y + move[1], rotate: s.rotate }), true)
  }

  return (
    <svg
      ref={svgRef}
      className={`suitcase ${onSelect || editing ? 'suitcase--interactive' : ''} ${editing ? 'suitcase--editing' : ''} ${className}`}
      viewBox={`0 0 ${W} ${SUITCASE_H}`}
      // Sin texto (dibujo de adorno, como en el inicio) la maleta no se anuncia
      {...(label ? { role: onSelect || editing ? 'group' : 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...(editing && { onPointerMove: moveDrag, onPointerUp: endDrag, onPointerCancel: endDrag })}
    >
      <defs>
        {/* Afiche recién pegado: en blanco y negro hasta completar el país */}
        <filter id={`${baseId}-mono`}>
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      {/* manija, cuerpo y costura: papeles con borde de tijera */}
      <path
        className="suitcase__handle"
        stroke={colors.handle}
        filter="url(#papel-corte)"
        d={`M${W / 2 - 54} 56 V30 q0 -18 18 -18 h72 q18 0 18 18 V56`}
      />
      <rect
        className="suitcase__body"
        fill={colors.body}
        filter="url(#papel-corte)"
        x="14"
        y="48"
        width={W - 28}
        height={H - 30}
        rx="34"
      />
      <rect className="suitcase__seam" stroke={colors.strap} x="30" y="64" width={W - 60} height={H - 62} rx="22" />

      {stickers.map((s) => {
        const country = COUNTRY_BY_ID[s.countryId]
        const selected = s.countryId === selectedId
        const status = s.complete ? 'completa' : `${s.answered} de ${s.total} preguntas`
        const interaction = editing
          ? {
              role: 'button',
              tabIndex: 0,
              'aria-pressed': s.countryId === pickedId,
              'aria-label': `Mover el afiche de ${country.name}`,
              onPointerDown: (e) => startDrag(e, s),
              onFocus: () => onPick?.(s.countryId),
              onKeyDown: (e) => nudge(e, s),
            }
          : onSelect && {
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
            }
        return (
          <g key={s.countryId} transform={`translate(${s.x} ${s.y}) rotate(${s.rotate}) scale(${s.scale})`}>
            <g
              id={artId(s.countryId)}
              className={`suitcase__sticker ${selected ? 'is-selected' : ''} ${s.countryId === freshId ? 'is-fresh' : ''}`}
              {...interaction}
            >
              <CountryPoster
                countryId={s.countryId}
                uid={`${baseId}-p-${s.countryId}`}
                complete={s.complete}
                monoId={`${baseId}-mono`}
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
            fill={colors.strap}
            filter="url(#papel-corte)"
            x={x - 15}
            y="44"
            width="30"
            height={H - 22}
            rx="6"
          />
          <rect
            className="suitcase__buckle"
            fill={colors.handle}
            x={x - 11}
            y={H / 2 + 16}
            width="22"
            height="26"
            rx="5"
          />
        </g>
      ))}
      {/* El afiche elegido, recién pegado o que se está moviendo se ve también por encima de
          las correas (una copia solo visual: la original no se mueve, así no se pierde el foco) */}
      {stickers
        .filter((s) => s.countryId === freshId || s.countryId === onTop)
        .map((s) => (
          <g
            key={`top-${s.countryId}`}
            className="suitcase__top"
            transform={`translate(${s.x} ${s.y}) rotate(${s.rotate}) scale(${s.scale})`}
          >
            <use href={`#${artId(s.countryId)}`} />
          </g>
        ))}
      {/* Al acomodar: cada afiche con un borde punteado, y el que se mueve, en amarillo */}
      {editing &&
        stickers.map((s) => (
          <rect
            key={`borde-${s.countryId}`}
            className={`suitcase__outline ${s.countryId === pickedId ? 'is-picked' : ''}`}
            x="-36"
            y="-46"
            width="72"
            height="92"
            rx="5"
            transform={`translate(${s.x} ${s.y}) rotate(${s.rotate}) scale(${s.scale})`}
          />
        ))}
    </svg>
  )
}
