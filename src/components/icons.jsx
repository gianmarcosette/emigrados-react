// Íconos de línea de cada sección: los usan el menú del celular y el primer vuelo,
// así cada modo se reconoce siempre por el mismo dibujo.
export const TAB_ICONS = {
  '/individual': <path d="M5 19l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L9 18zM14.5 6.5l3 3M4 21h16" />,
  '/grupal': (
    <>
      <circle cx="8.5" cy="8" r="3.2" />
      <circle cx="16.5" cy="9" r="2.6" />
      <path d="M3 19c.6-3.6 2.8-5.5 5.5-5.5s4.9 1.9 5.5 5.5M14.5 14c2.8-.4 5.4 1.2 6 4.5" />
    </>
  ),
  '/online': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c-3 3-3 14 0 17M12 3.5c3 3 3 14 0 17" />
    </>
  ),
  '/maleta': (
    <>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2.5" />
      <path d="M9 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5v2M8 7.5v12.5M16 7.5v12.5" />
    </>
  ),
}
