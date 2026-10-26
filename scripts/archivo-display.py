# Genera src/assets/fonts/archivo-display.woff2: Archivo con un solo grosor (700) y un
# solo ancho (87%), recortada al alfabeto latino. Es la que usan títulos y preguntas;
# el archivo variable completo trae todos los grosores y pesa unas 4 veces más.
# Uso: python3 scripts/archivo-display.py  (necesita: pip install fonttools brotli)
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parent.parent
src = root / 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2'
out = root / 'src/assets/fonts/archivo-display.woff2'

font = TTFont(src)
instantiateVariableFont(font, {'wght': 700, 'wdth': 87}, inplace=True, updateFontNames=False)
font.flavor = 'woff2'
font.save(out)
print(f'{out.relative_to(root)}: {out.stat().st_size / 1024:.1f} KB')
