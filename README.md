# Emigrados — En Palabras

**Emigrados** es un juego de preguntas creado para la activación de la marca **En Palabras**. Su objetivo es hablar de todo el proceso que implica emigrar: lo que pensábamos antes de irnos, lo que sentimos en el nuevo lugar y cómo nos reinventamos. Un espacio seguro, en medio de la rutina, para conocernos más y entender por qué estamos donde estamos.

- **Público:** mayores de 18 años (pensado para personas de 18 a 55) que hayan vivido al menos 6 meses fuera de su país.
- **Objetivo del juego:** responder las **208 preguntas** y así "dar la vuelta al mundo".
- **Referentes:** Trivial, Preguntados, P.A.P.A.

Proyecto Integrador · Contenidos y Creatividad III — Videojuegos: Experiencias Interactivas (UP).

## Cómo correrlo

```bash
npm install
npm run dev      # abre http://localhost:5173
```

Otros comandos: `npm run build` (versión de producción), `npm test` (tests con Vitest), `npm run lint` (oxlint), `npm run shapes` (vuelve a calcular las siluetas de los países después de sumar uno).

## Pantallas (React Router)

| Ruta          | Pantalla   | Qué hace |
|---------------|------------|----------|
| `/`           | Inicio     | Elegís modo: Individual, Grupal u Online (versión de prueba). La primera vez se abre el **primer vuelo**: tres pantallas sobre qué es el juego, cómo funciona cada modo y para qué se pide el país; se puede volver a ver desde el pie de cada pantalla. Ventanilla con el despegue y fila de pasajeros animados. |
| `/individual` | Individual | Cada pregunta es una tarjeta de embarque (vuelo, etapa, puerta, asiento y talón con pasajero, sello, silueta del país y código de barras). La respuesta se escribe como en una app de notas (letra grande, la hora arriba, modo noche opcional), se guarda con fecha y pega la pegatina de su país en la maleta. Lo que estás escribiendo se guarda solo como borrador y se retoma al volver. Si la pregunta se repite, ves lo que respondiste antes. |
| `/grupal`     | Grupal     | Cargás jugadores y etapas; cada pregunta la contesta toda la mesa, de a uno, y quien la abre va rotando. Letra grande y reloj opcional. **No se guarda nada.** |
| `/online`     | Online     | **Versión de prueba.** Elegís sobre qué país querés saber, te conecta con alguien que vive ahí y juegan un duelo de 5 preguntas de cultura general (12 por país, cada una con un dato curioso): vos sobre su país, esa persona sobre el tuyo. Se puede jugar "sin apuro", sin límite de tiempo. Al terminar, si los dos aceptan, sigue una **charla guiada** en tres momentos (abrir, ir más hondo, cerrar): cada intercambio parte de una pregunta, con reacciones cortas, filtro de datos de contacto y botones para bloquear y denunciar. Al terminar, la charla se puede guardar en el diario. Por ahora las personas conectadas son simuladas (`src/online/mockServer.js`). |
| `/maleta`     | Mi maleta  | Maleta de cuero con una pegatina por cada país al que se respondió. Los países con afiche de viaje (`components/posters.jsx`: Argentina, Brasil, Italia, Francia, México, Japón, España y Marruecos, se suman por tandas) se pegan en blanco y negro y se imprimen a color al responder sus 4 preguntas; el resto usa una pegatina simple con la silueta del país, que se ilumina al completarse. Tocar una pegatina abre las respuestas de ese país; "Por pegar" lista los países que faltan. La dirección vieja `/mapa` lleva acá. |
| `/perfil`     | Mi perfil  | Nombre, edad, país donde vivís, descripción, foto y código de pasajero (localizador de 6 caracteres). Incluye el **diario de viaje**, al estilo de una app de notas: entradas por mes con buscador (resalta lo encontrado) y filtro por etapa; cada entrada se abre con la fecha, la pregunta y la respuesta en letra grande, lo respondido antes y la escala de la maleta. Tiene modo noche, que sigue al del teléfono o se elige a mano. `/diario` redirige acá. |

## Mecánica

- **208 preguntas** en 8 etapas del proceso migratorio: *Antes de partir, La despedida, Los primeros días, Idioma y costumbres, Vínculos, Identidad, Reinventarse, Hogar y futuro*.
- Cada pregunta está asociada a uno de **52 países** (4 preguntas por país). Al responderla por primera vez en un país, su pegatina se pega en la maleta.
- El modo individual prioriza las preguntas que todavía no respondiste; con "Repetir una anterior" (o al terminar todas) vuelven preguntas ya respondidas para comparar.
- **Sin perfil solo se juega el modo Grupal**, que no guarda nada. Individual, la maleta y el diario piden crear el perfil primero (`components/ProfileGate.jsx`).
- El perfil (nombre, edad, descripción, foto y código de pasajero) y las respuestas se guardan en el navegador (`localStorage`). La foto se recorta y se reduce a 320 px antes de guardarse.
- El fondo de todo el sitio es un cielo azul con nubes en trama de puntos, como impreso en una imprenta vieja (hecho con CSS, sin imágenes). El texto que va directo sobre el cielo es crema, con contraste AA.

## Diseño

- Estilo minimalista: tinta negra sobre crema, con el amarillo como único acento.
- Tipografías: Archivo (títulos, preguntas y números, gruesa y un poco angosta; una versión recortada de 14 KB que se genera con `npm run fonts`) y Montserrat (textos y logo). Incluidas con Fontsource, funcionan sin internet.

## Estructura

```
src/
├── App.jsx                 # Rutas
├── main.jsx                # BrowserRouter + JourneyProvider
├── components/             # Layout, QuestionCard (tarjeta de embarque), Diary (estilo notas), Suitcase y Sticker (maleta), ProfileForm…
├── pages/                  # Home, Individual, Grupal, Online, Maleta, Perfil, NotFound
├── online/                 # duel.js (reglas del duelo), talk.js (charla guiada) y mockServer.js (servidor simulado)
├── data/                   # questions.js (208 preguntas), countries.js (52 países), trivia.js (cultura general), talk.js (preguntas de la charla), residence.js (países donde vivir)
├── state/                  # journey.js (reducer + persistencia), profile.js, scene.js, JourneyContext.jsx
├── lib/                    # Fechas, fotos de perfil y siluetas de países
└── __tests__/              # Tests del banco de preguntas y del estado
```

Tecnologías: React 19, React Router 7, Vite, Vitest. Las siluetas de los países se calculan una vez con d3-geo + world-atlas (`npm run shapes`) y se guardan en `src/data/countryShapes.json`: el juego no descarga el mapa del mundo.

## Consigna del Momento 2 (avance 50%)

| Requisito | Dónde se cumple |
|-----------|-----------------|
| Estructura React con navegación entre al menos 2 pantallas usando React Router | `src/App.jsx`: 5 pantallas + 404 y redirección de `/diario`, navegación en `Layout.jsx` |
| Al menos una interacción: evento conectado a un cambio de estado | Textarea controlada + "Guardar respuesta" (`useReducer`), alta de jugadores y turnos en Grupal, filtros, pegatinas de la maleta |
| Evidencia de iteración con un agente de IA | Historial de commits y [`docs/PROMPTS.md`](docs/PROMPTS.md) |

## Plan hacia el Momento 3 (100%)

1. **Modo Online real:** reemplazar `src/online/mockServer.js` por un servidor (p. ej. Supabase Realtime o Firebase) con cuentas de usuario, presencia ("quién está conectado") y duelos en tiempo real. Las pantallas y las reglas del duelo ya están listas.
2. **Identidad visual En Palabras:** ilustraciones/fotos por país para el fondo de cada tarjeta, sonidos suaves.
3. **Logros y estadísticas:** continentes completos, etapas completas, "aniversarios" de respuestas.
4. **Testeo con usuarios migrantes** para ajustar el tono de las preguntas y sumar nuevas.
5. **Deploy** (Vercel / GitHub Pages) para jugarlo desde el celular.
