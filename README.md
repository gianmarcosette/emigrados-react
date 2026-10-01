# 📍 Emigrados — En Palabras

**Emigrados** es un juego de preguntas creado para la activación de la marca **En Palabras**. Su objetivo es hablar de todo el proceso que implica emigrar: lo que pensábamos antes de irnos, lo que sentimos en el nuevo lugar y cómo nos reinventamos. Un espacio seguro, en medio de la rutina, para conocernos más y entender por qué estamos donde estamos.

- **Público:** mayores de 16 años que hayan vivido al menos 6 meses fuera de su país.
- **Objetivo del juego:** responder las **208 preguntas** y así "dar la vuelta al mundo".
- **Referentes:** Trivial, Preguntados, P.A.P.A.

Proyecto Integrador · Contenidos y Creatividad III — Videojuegos: Experiencias Interactivas (UP).

## Cómo correrlo

```bash
npm install
npm run dev      # abre http://localhost:5173
```

Otros comandos: `npm run build` (versión de producción), `npm test` (tests con Vitest), `npm run lint` (oxlint).

## Pantallas (React Router)

| Ruta          | Pantalla   | Qué hace |
|---------------|------------|----------|
| `/`           | Inicio     | Elegís modo: Individual, Grupal (y Online, próximamente). Input controlado para tu nombre. |
| `/individual` | Individual | Pregunta al azar con su país y etapa. La respuesta se guarda con fecha y clava un 📍 en el mapa. Si la pregunta se repite, ves y comparás lo que respondiste antes. |
| `/grupal`     | Grupal     | Cargás jugadores y etapas; las preguntas rotan por turnos. **No se guarda nada.** |
| `/mapa`       | Mi mapa    | Mapa del mundo con los países visitados, la ruta del viaje y el detalle de las respuestas por país. |
| `/diario`     | Diario     | Todas tus respuestas con su historial de fechas, búsqueda, filtro por etapa y descarga en `.txt`. |

## Mecánica

- **208 preguntas** en 8 etapas del proceso migratorio: *Antes de partir, La despedida, Los primeros días, Idioma y costumbres, Vínculos, Identidad, Reinventarse, Hogar y futuro*.
- Cada pregunta está asociada a uno de **52 países** (4 preguntas por país). Al responderla, el país queda "visitado" en el mapa.
- El modo individual prioriza las preguntas que todavía no respondiste; con "Repetir una anterior" (o al terminar todas) vuelven preguntas ya respondidas para comparar.
- Las respuestas se guardan en el navegador (`localStorage`), sin cuentas ni servidores.

## Estructura

```
src/
├── App.jsx                 # Rutas
├── main.jsx                # BrowserRouter + JourneyProvider
├── components/             # Layout, QuestionCard (tarjeta de embarque), WorldMap, ProgressBar, CountryStamp
├── pages/                  # Home, Individual, Grupal, Mapa, Diario, NotFound
├── data/                   # questions.js (208 preguntas), countries.js (52 países)
├── state/                  # journey.js (reducer + persistencia), JourneyContext.jsx, useJourney.js
├── lib/format.js           # Fechas en español
└── __tests__/              # Tests del banco de preguntas y del estado
```

Tecnologías: React 19, React Router 7, Vite, d3-geo + world-atlas (mapa), Vitest.

## Consigna del Momento 2 (avance 50%)

| Requisito | Dónde se cumple |
|-----------|-----------------|
| Estructura React con navegación entre al menos 2 pantallas usando React Router | `src/App.jsx`: 5 pantallas + 404, navegación en `Layout.jsx` |
| Al menos una interacción: evento conectado a un cambio de estado | Textarea controlada + "Guardar respuesta" (`useReducer`), alta de jugadores y turnos en Grupal, filtros, mapa clickeable |
| Evidencia de iteración con un agente de IA | Historial de commits y [`docs/PROMPTS.md`](docs/PROMPTS.md) |
| Presentación y pitch de 2–3 minutos | Guion en [`docs/PITCH.md`](docs/PITCH.md) |

## Plan hacia el Momento 3 (100%)

1. **Modo Online:** "escribí tu pregunta y alguien, en algún lugar del mundo, la responderá" (requiere backend, p. ej. Firebase/Supabase) y perfiles con usuario.
2. **Identidad visual En Palabras:** ilustraciones/fotos por país para el fondo de cada tarjeta, sonidos suaves.
3. **Logros y estadísticas:** continentes completos, etapas completas, "aniversarios" de respuestas.
4. **Testeo con usuarios migrantes** para ajustar el tono de las preguntas y sumar nuevas.
5. **Deploy** (Vercel / GitHub Pages) para jugarlo desde el celular.
