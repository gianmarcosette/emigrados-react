// Borradores del modo individual: lo que se está escribiendo se guarda solo,
// así no se pierde si salís de la pantalla antes de tocar "Guardar respuesta".
// Se guardan aparte de las respuestas, en este dispositivo.

export const DRAFTS_KEY = 'emigrados:borradores'

/** { [questionId]: { text, date } } */
export function loadDrafts(storage = globalThis.localStorage) {
  try {
    const data = JSON.parse(storage?.getItem(DRAFTS_KEY) ?? '{}')
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  } catch {
    return {}
  }
}

function write(drafts, storage) {
  try {
    if (Object.keys(drafts).length) storage?.setItem(DRAFTS_KEY, JSON.stringify(drafts))
    else storage?.removeItem(DRAFTS_KEY)
  } catch {
    // Sin almacenamiento disponible: el borrador vive solo mientras la pantalla esté abierta.
  }
}

export function getDraft(questionId, storage = globalThis.localStorage) {
  const draft = loadDrafts(storage)[questionId]
  return typeof draft?.text === 'string' ? draft : null
}

/** Guarda el texto; si queda vacío, borra el borrador. */
export function saveDraft(questionId, text, storage = globalThis.localStorage, date = new Date().toISOString()) {
  const drafts = loadDrafts(storage)
  if (text.trim()) drafts[questionId] = { text, date }
  else delete drafts[questionId]
  write(drafts, storage)
}

export function clearDraft(questionId, storage = globalThis.localStorage) {
  const drafts = loadDrafts(storage)
  delete drafts[questionId]
  write(drafts, storage)
}

export function clearAllDrafts(storage = globalThis.localStorage) {
  write({}, storage)
}

/** El borrador más reciente ({ questionId, text, date }), para retomarlo al volver. */
export function latestDraft(storage = globalThis.localStorage) {
  const entries = Object.entries(loadDrafts(storage)).filter(([, d]) => typeof d?.text === 'string' && d.text.trim())
  if (!entries.length) return null
  const [questionId, draft] = entries.sort((a, b) => String(b[1].date).localeCompare(String(a[1].date)))[0]
  return { questionId: Number(questionId), ...draft }
}
