# Prueba de usabilidad

Registro de la prueba con personas externas al proyecto y de los ajustes hechos a partir de ella.

## Datos de la prueba

| | |
|---|---|
| **Fecha** | 3 de noviembre de 2026 |
| **Personas** | Compañeros de la cursada de Contenidos y Creatividad III, externos al desarrollo del juego. _Completar: cuántos fueron y sus iniciales._ |
| **Dispositivo** | Cada persona jugó desde su propio celular, con el link publicado en Vercel. |
| **Dónde** | En clase. |
| **Segunda verificación** | El autor instaló el juego en su iPhone desde Safari ("Agregar a inicio") y lo usó a pantalla completa. |

## Cómo se hizo

- Se compartió el link sin explicar el juego: solo que es un juego para personas que emigraron.
- Cada persona jugó por su cuenta. Quien observaba no ayudaba: anotaba dónde dudaban y qué decían.
- La prueba se concentró en el modo Online, que es el que necesita a dos personas a la vez, y en el recorrido de entrada (primer vuelo, perfil y primera pregunta).

## Qué se observó

| Parte del juego | Resultado | Comentarios |
|---|---|---|
| Entrar y entender de qué se trata | Sin dificultades | El primer vuelo explica de qué se trata el juego. |
| Crear el perfil y responder una pregunta | Sin dificultades | El recorrido se sintió fluido. |
| Jugar un duelo Online | Con una dificultad | Después de contestar, el botón "Siguiente pregunta" quedaba fuera de la pantalla y había que hacer scroll para encontrarlo. |

## Opinión general

- El juego se sintió fluido.
- Se entiende sin explicación: cada pantalla dice qué hacer.
- Después del ajuste en el modo Online, quienes lo habían señalado vieron el cambio aplicado.

## Hallazgos

| Problema observado | Gravedad (alta, media o baja) | Pantalla |
|---|---|---|
| En el celular, "Siguiente pregunta" quedaba debajo del borde de la pantalla y obligaba a hacer scroll en cada pregunta del duelo. | Media: no impedía jugar, pero cortaba el ritmo en todas las preguntas. | Online (duelo) |

## Ajustes realizados

| Hallazgo | Ajuste | Commit o PR |
|---|---|---|
| "Siguiente pregunta" quedaba fuera de la pantalla | El botón ahora queda fijo sobre la barra de abajo, siempre a la vista. | [#37](https://github.com/gianmarcosette/emigrados-react/pull/37) |

## Lo que quedó para una próxima prueba

- Probar con personas que hayan emigrado y no conozcan el proyecto, que son el público del juego.
- Observar los modos Individual y Grupal completos, la carta al futuro y "Preguntale a alguien de allá".
- Probar la instalación en Android (en iPhone ya se verificó).
