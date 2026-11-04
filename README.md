# Emigrados

**Emigrados** es un videojuego web de preguntas para hablar de todo lo que implica emigrar: lo que pensabas antes de irte, lo que sentís en tu nuevo lugar y cómo te fuiste reinventando. Un espacio seguro para conocerte más y entender **por qué estás donde estás**.

Proyecto Integrador · Contenidos y Creatividad III — Videojuegos: Experiencias Interactivas (UP). La idea nació inspirada en los juegos de preguntas de En Palabras, pero el juego no está asociado a esa marca.

- **Jugar:** [emigrados-react.vercel.app](https://emigrados-react.vercel.app)
- **Público:** mayores de 18 años (pensado para personas de 18 a 55) que vivieron al menos 6 meses fuera de su país.
- **Objetivo:** responder las **208 preguntas** y "dar la vuelta al mundo", juntando en la maleta el afiche de cada uno de los **52 países** del viaje.
- **Referentes:** Trivial, Preguntados, P.A.P.A.

## Concepto

Cada pregunta es un **vuelo**: se presenta como una tarjeta de embarque que sale de tu casa y hace escala en un país. Al responder, el afiche de ese país se pega en tu **maleta** (en gris) y se pinta de color cuando respondés sus 4 preguntas. Lo que escribís queda en tu **diario de viaje**, con fecha, para releerlo y ver cómo cambiaste.

No hay respuestas correctas en las preguntas de migración: el juego invita a contar lo propio. Las preguntas se revisaron con un enfoque clínico del duelo migratorio: piden momentos concretos en lugar de respuestas de sí o no, dejan lugar a lo que no salió bien y también incluyen a quien se fue sin poder elegir. Cada una tiene una intensidad (liviana, media o profunda): el juego no arranca con una profunda ni pone dos seguidas. La competencia está en el modo **Online**, un duelo de cultura general sobre el país del otro que termina en una charla.

## Cómo se juega

| Modo | Para qué | Cómo |
|---|---|---|
| **Individual** | Escribir a solas | Te toca una pregunta al azar (podés filtrar por etapa). Escribís lo que sentís, como en una app de notas, y se guarda con fecha. Si la pregunta vuelve, ves lo que respondiste antes. |
| **Grupal** | Charlar en una mesa, con un solo teléfono | Cargan los nombres (o juegan sin nombres) y eligen etapas. Cada pregunta la contesta toda la mesa, de a uno, y quien la abre va rotando. Letra grande y reloj opcional. **No se guarda nada.** No hace falta perfil. |
| **Online** _(versión de prueba)_ | Conectar con alguien que vive en otro país | Elegís un país y se arma un duelo: cada uno responde 5 preguntas de cultura general **sobre el país del otro**, a su ritmo, con 3 días de plazo y hasta 3 duelos abiertos. Cuando terminan los dos se ve el resultado y se abre una **charla guiada**. |

### Puntuación, victoria y derrota

- **Individual — la vuelta al mundo:** el progreso cuenta las preguntas respondidas (de 208) y los países completos (de 52). Al responder las 208 aparece **"¡Diste la vuelta al mundo!"**. Después de cada respuesta, un aviso cuenta qué pasó en tu maleta: *Nuevo afiche*, *Una escala más* o *¡Completaste [país]!*.
- **Online — el duelo:** cada acierto suma un punto. El resultado es **"¡Ganaste!"** (_Sabés más de [país] que [rival] de [tu país]_), **"Ganó [rival]"** o **"¡Empate!"**, con el marcador y la revisión de cada pregunta con su dato curioso. Si se vence el plazo, el duelo vence sin culpa de nadie.

## Pantallas (React Router)

| Ruta | Pantalla | Qué tiene |
|---|---|---|
| `/` | Inicio | Logo, invitación a crear el perfil o saludo al pasajero, los tres modos y "¿Cómo se juega?". La primera vez se abre el **primer vuelo**: cuatro pantallas (bienvenida, cada pregunta es una escala, privacidad y elegir cómo viajar). Se puede volver a ver desde el pie de cada pantalla. |
| `/individual` | Individual | Tarjeta de embarque con la pregunta, escritura con borrador automático y modo noche, y pantalla de "respuesta guardada" con la maleta, **Preguntale a alguien de allá** y **Compartir**. |
| `/pregunta/:id` | Una pregunta para vos | Lo que abre quien recibe "Preguntale a alguien de allá": la pregunta en la tarjeta de embarque y el botón para contestarle por WhatsApp a quien la mandó. No hace falta perfil. |
| `/carta` | Carta al futuro | Escribís una carta, elegís cuándo se abre (3, 6 o 12 meses, o un día propio) y queda cerrada hasta ese día. Se puede agregar al calendario para que avise. El día que llega se abre y se le contesta. |
| `/grupal` | Grupal | Armado de la ronda, turnos y reloj. |
| `/online` | Online | Lista de duelos, nuevo duelo, preguntas, resultado y charla guiada. Abierto en 31 países; desde otro país se ve una lista de espera. |
| `/maleta` | Mi maleta | La maleta con los afiches, contadores y "Por pegar". Tocar un afiche abre lo que escribiste en ese país. Con **"Acomodar mi maleta"** elegís el color de la maleta y arrastrás cada afiche donde quieras (también se puede girar o mover con el teclado). |
| `/perfil` | Mi perfil | Avatar de recorte, datos del pasajero, código de pasajero y el **diario de viaje** con buscador y filtro por etapa. |
| `*` | 404 | "Este destino no figura en ningún vuelo". |

`/diario` y `/mapa` redirigen a su lugar actual.

## Diseño

- **Recortes de papel al estilo Matisse sobre un fondo azul cobalto.** Tarjetas en papel crema con tinta negra, coral y amarillo como acentos, y un papel de color para cada modo (durazno, verde claro y amarillo). Las figuras tienen el borde irregular de la tijera gracias a filtros SVG.
- **Marca:** la palabra EMIGRADOS en Montserrat ExtraBold, con la **S hecha de pájaros**, algunos de los cuales se sueltan y se van volando. El ícono es la S sobre cobalto.
- **Los pájaros como hilo:** una golondrina que vuela sola (Individual), una bandada en V (Grupal) y dos pájaros que llegan de lugares distintos y se encuentran (Online). De fondo, en todas las pantallas, una ruta punteada sale de una casa, cruza la pantalla con una bandada de golondrinas y llega a un barrio nuevo.
- **Tarjeta de embarque:** banda cobalto con el logo, ruta de tu casa a la escala, la pregunta sobre el papel de color de su etapa y, en el talón, tu avatar, tu código de pasajero y el afiche del país.
- **52 afiches de viaje ilustrados**, uno por país, con su lugar emblemático (`components/posters.jsx`).
- **Avatares de recorte** con dos ojos de tinta y nada más en la cara, para que cualquiera pueda verse ahí: piel, pelo, mirada (abiertos, sonrientes, serenos o sin rasgos), ropa, accesorios, papel de fondo y un adorno.
- **Barra de abajo en el celular** con recortes a color: Inicio (la casa), Individual (la golondrina), Maleta (tu maleta, en el color que elegiste) y Perfil (tu avatar).
- **Tipografías:** Archivo angosta para títulos y preguntas, y Montserrat para los textos. Están incluidas en el proyecto y funcionan sin internet.

## Compartir en historias

Después de responder (o en cada pregunta de Grupal), **Compartir** arma imágenes para Instagram, TikTok o WhatsApp:

- **La tarjeta sola, con fondo transparente** (estilo Strava), para pegar sobre una foto propia. Hay tres versiones: blanca con sombra, negra y a color. Lleva solo la palabra Emigrados, la pregunta como gancho y la invitación "Tu turno: ¿Y vos qué responderías?", en formato de billete.
- **Una historia lista** (1080 × 1920), con la tarjeta a color sobre el cobalto.
- **La respuesta se comparte solo si la persona lo pide:** el interruptor arranca apagado cada vez. La foto nunca pasa por el juego: todo se dibuja en el dispositivo (`lib/shareCard.js`).

## Volver y conectar

- **Preguntale a alguien de allá:** después de responder, la pregunta sale armada para WhatsApp para mandársela a alguien querido (o a alguien con quien hace tiempo no hablás). El mensaje se puede editar y la respuesta propia solo viaja si se suma. Quien la recibe abre la pregunta sin perfil y le contesta a la persona, no al juego.
- **Carta al futuro:** un motivo para volver con sentido. Mientras está cerrada, el inicio muestra el sobre y los días que faltan; el día que se abre, avisa. El aviso lo da el calendario de cada persona (un archivo `.ics`), así el juego sigue sin servidor.

## Cuidado y privacidad

- Las respuestas de Individual y el perfil se guardan **solo en el dispositivo** (`localStorage`). Grupal no guarda nada.
- Borrar el perfil borra también las respuestas, los borradores y los duelos, con una confirmación clara.
- En el Online, la otra persona ve tu nombre, tu edad y el país donde vivís. Dónde naciste se muestra solo si lo elegís. La charla filtra datos de contacto y permite bloquear y denunciar.
- **Accesibilidad:** navegación con teclado, foco visible, textos alternativos, contraste AA sobre el cobalto, tamaño de letra a elección y menús que no se agrandan de más.

## Tecnologías

React 19, React Router 7, Vite 8, Vitest (128 tests) y oxlint. Sin backend: el modo Online usa un servidor simulado (`src/online/mockServer.js`) con las reglas del duelo ya listas para conectarse a uno real. Las siluetas de los países se calculan una vez con d3-geo y world-atlas (`npm run shapes`).

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # tests
npm run lint     # oxlint
npm run build    # versión de producción en dist/
```

## Estructura

```
src/
├── App.jsx            # Rutas
├── main.jsx           # BrowserRouter + JourneyProvider
├── pages/             # Home, Individual, Grupal, Online, Maleta, Perfil, NotFound
├── components/        # Layout, QuestionCard (tarjeta de embarque), Suitcase y posters (maleta), Diary,
│                      # FirstFlight, ShareSheet, PassengerAvatar y AvatarEditor, HomeBackdrop, paper (recortes)
├── online/            # duel.js (reglas del duelo), talk.js (charla guiada), mockServer.js (servidor simulado)
├── data/              # questions.js (208 preguntas con su intensidad), countries.js (52 países), trivia.js (346 preguntas de
│                      # cultura general de 31 países), logo.js (contornos del logo), talk.js, residence.js
├── state/             # journey.js (reducer + guardado), profile.js, duels.js, drafts.js, firstFlight.js
├── lib/               # shareCard.js (imágenes para compartir), suitcase.js, ticket.js, avatar.js, paper.js…
└── __tests__/         # 17 archivos de tests
docs/
├── PROMPTS.md         # Registro del proceso con IA
└── USABILIDAD.md      # Prueba de usabilidad con una persona externa
```

## Proceso con IA

El juego se desarrolló iterando con **Claude Code**, el agente de IA de Anthropic. Cada pedido se trabajó en una rama, se verificó (tests, lint, build y capturas en celular y compu) y se integró a `main` con un pull request: hay más de 30 pull requests y más de 100 commits. Las decisiones de diseño se probaron primero con maquetas en el navegador, sin tocar el juego, y se aplicaron recién cuando estuvieron aprobadas. El detalle está en [`docs/PROMPTS.md`](docs/PROMPTS.md).

## Consigna del Momento 3

| Requisito | Dónde se cumple |
|---|---|
| Mecánica completa, pantallas, puntuación, victoria o derrota y navegación con React Router | 6 pantallas más 404 en `src/App.jsx`. La vuelta al mundo y los afiches en Individual, y el duelo con marcador y "¡Ganaste! / Ganó [rival] / ¡Empate!" en Online. |
| Diseño visual pulido | Recortes de papel con filtros SVG, paleta coherente, animaciones, modo noche y versión para celular. |
| Personalización narrativa y estética | Metáfora del viaje en todo el juego (vuelos, escalas, pasajero, maleta, diario) y mensajes propios. Sin textos de plantilla. |
| Pruebas de usabilidad | [`docs/USABILIDAD.md`](docs/USABILIDAD.md) |
| Despliegue en Vercel | [emigrados-react.vercel.app](https://emigrados-react.vercel.app). `vercel.json` hace que cualquier dirección abra el juego, también al recargar. |
| Repositorio y README | Este archivo y [`docs/PROMPTS.md`](docs/PROMPTS.md) |
