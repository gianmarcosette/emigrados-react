# Pitch — Emigrados (2 a 3 minutos)

> Sugerencia: mostrar el juego corriendo con `npm run dev` mientras se habla.

**1. Gancho (20 s)**
"¿Recordás cuándo dejaste de sentirte un turista?" Quienes emigramos tenemos muchas respuestas a preguntas que nadie nos hace. En la rutina casi nunca encontramos el espacio para hablar de eso.

**2. Concepto (40 s)**
*Emigrados* es un juego de preguntas para la marca *En Palabras*. Tiene 208 preguntas que recorren todo el proceso: antes de partir, la despedida, los primeros días, el idioma, los vínculos, la identidad, reinventarse y el futuro. No hay respuestas correctas ni puntos: el objetivo es conocernos y entender por qué estamos donde estamos.

**3. Público (15 s)**
Mayores de 16 años que hayan vivido al menos seis meses fuera de su país, sin importar el destino.

**4. Cómo se juega — demo (60 s)**
- **Individual:** sale una pregunta al azar, como una tarjeta de embarque con una escala en un país. Escribo y guardo: la respuesta queda con fecha y se marca su país en el mapa. Responder todas es dar la vuelta al mundo. Si una pregunta vuelve, veo lo que contesté antes y puedo comparar cómo cambié.
- **Grupal:** cargamos los nombres y las preguntas rotan por turnos. No se guarda nada: está pensado para que fluya la conversación entre amigos.
- **Mapa y Diario:** mi recorrido y todas mis respuestas en un solo lugar.

**5. Cómo está hecho (20 s)**
React con React Router (cinco pantallas), estado con `useReducer` y Context, guardado local en el navegador y un mapa dibujado con d3-geo. Lo fui iterando con un agente de IA: el registro está en los commits y en `docs/PROMPTS.md`.

**6. Plan al 100% (25 s)**
Modo Online para responder preguntas de otras personas del mundo, identidad visual por país, logros por continente, testeo con migrantes reales y publicarlo para jugar desde el celular.

**Cierre (5 s)**
"Emigrados: para que lo que vivimos lejos también se pueda poner en palabras."
