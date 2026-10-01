# Registro de iteración con IA

Este proyecto se desarrolló iterando con **Claude Code** (agente de IA de Anthropic). Cada etapa quedó registrada como un commit en el repositorio.

## Prompt inicial

> Necesito que cumplamos con las siguientes indicaciones del profesor para aprobar esta materia [consigna del Momento 2]. De igual manera esto es lo mínimo, si podemos tenerlo más avanzado no hay problema con ello. El objetivo es crear un videojuego que se desenvuelva en React. La base de mi videojuego es la siguiente: "Emigrados" – En Palabras [concepto, público objetivo, objetivos, secciones Inicio / Individual / Grupal, juegos similares]. A su vez te voy a dar un poco los mockups, aunque la verdad mejor si te doy libertad en mejorarlo según tu opinión, ya que no me gusta mucho.

Archivos adjuntos: guía de evaluación del Momento 2 y mockups de Emigrados (PDF).

## Iteraciones

| # | Qué se pidió / decidió | Resultado (commit) |
|---|------------------------|--------------------|
| 1 | Armar la base del proyecto en React con React Router | Proyecto Vite + React 19 + React Router 7 |
| 2 | Escribir al menos 200 preguntas y asociar cada una a un país | 208 preguntas en 8 etapas, 52 países, tests que lo verifican |
| 3 | Guardar respuestas con fecha y permitir comparar al repetir | Reducer `journeyReducer` + `localStorage` con historial por pregunta |
| 4 | Mapa del mundo con un 📍 por cada país "visitado" | `WorldMap` con d3-geo, ruta del viaje y panel por país |
| 5 | Mejorar los mockups | Rediseño: tarjeta de embarque, sellos de pasaporte, paleta verde azulado + amarillo del mockup original |
| 6 | Modo grupal sin guardado | Jugadores con turnos, filtro por etapas, mazo mezclado |
| 7 | Extras | Diario con búsqueda y descarga, modo Online marcado como "próximamente" |
| 8 | Verificación | Pruebas en navegador (escritorio y celular), lint, build y tests |

## Decisiones de diseño tomadas con la IA

- Se conservó la paleta del mockup (verde azulado + amarillo) pero se reemplazaron las fotos de fondo por una estética de viaje propia: cada pregunta es una **tarjeta de embarque** y el país aparece como un **sello de pasaporte**.
- El login del mockup se reemplazó por un nombre opcional: no hace falta crear cuenta para el Momento 2. Los perfiles quedan para el modo Online.
- El modo Online del mockup se muestra como "Próximamente" y forma parte del plan para el Momento 3.
