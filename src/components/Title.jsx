import { useLayoutEffect, useRef, useState } from 'react'

const MAX_CENTERED_LINES = 3

// Título que se centra si entra en hasta 3 líneas; si es más largo se alinea a la izquierda.
// Mide las líneas reales en pantalla, así se adapta al ancho (celular o escritorio).
export default function Title({ as: Tag = 'h1', className = '', children, ...rest }) {
  const ref = useRef(null)
  const [long, setLong] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const measure = () => {
      const style = getComputedStyle(el)
      const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2
      const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      setLong(Math.round((el.clientHeight - padding) / lineHeight) > MAX_CENTERED_LINES)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [children])

  return (
    <Tag ref={ref} className={`title ${long ? 'title--left' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
