// Convierte la foto elegida en un cuadrado chico (JPEG) para guardarla sin ocupar
// mucho espacio: recorta al centro y escala a `size` píxeles.
export const PHOTO_MAX_BYTES = 10 * 1024 * 1024

export async function photoToDataUrl(file, size = 320) {
  if (!file.type.startsWith('image/')) throw new Error('Elegí un archivo de imagen.')
  if (file.size > PHOTO_MAX_BYTES) throw new Error('La imagen es muy pesada (máximo 10 MB).')

  const bitmap = await loadImage(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  canvas
    .getContext('2d')
    .drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size)
  return canvas.toDataURL('image/jpeg', 0.85)
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No pudimos leer esa imagen. Probá con otra.'))
    }
    img.src = url
  })
}
