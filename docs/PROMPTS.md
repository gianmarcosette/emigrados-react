# Registro del proceso con IA

Emigrados se desarrolló iterando con **Claude Code**, el agente de IA de Anthropic, que trabaja directamente sobre el repositorio.

## Cómo trabajamos

1. **Pedido:** yo describía lo que quería, a veces con imágenes de referencia (mockups, capturas, cuadros de Matisse, fotos), y la IA proponía cómo hacerlo.
2. **Maqueta antes que código:** en las decisiones de diseño, la IA armaba primero propuestas en el navegador (capturas o páginas de prueba) sin tocar el juego. Yo elegía, pedía cambios o descartaba.
3. **Rama y verificación:** cada cambio se hizo en una rama. Antes de subirlo, la IA corría los tests (Vitest), el lint (oxlint) y el build, y sacaba capturas en celular y compu para revisarlo.
4. **Revisión y merge:** yo lo probaba en VS Code y, cuando me convencía, pedía "pásalo a main". La IA abría el pull request y lo integraba.

Resultado: más de 30 pull requests, más de 100 commits y 130 tests automáticos.

## Prompt inicial

> Necesito que cumplamos con las siguientes indicaciones del profesor para aprobar esta materia [consigna del Momento 2]. De igual manera esto es lo mínimo, si podemos tenerlo más avanzado no hay problema con ello. El objetivo es crear un videojuego que se desenvuelva en React. La base de mi videojuego es la siguiente: "Emigrados" – En Palabras [concepto, público objetivo, objetivos, secciones Inicio / Individual / Grupal, juegos similares]. A su vez te voy a dar un poco los mockups, aunque la verdad mejor si te doy libertad en mejorarlo según tu opinión, ya que no me gusta mucho.

Archivos adjuntos: guía de evaluación del Momento 2 y mockups de Emigrados (PDF).

## Momento 2 · Base del juego (PR #1 a #3)

| Pedido / decisión | Resultado |
|---|---|
| Armar la base en React con React Router | Vite + React 19 + React Router 7 |
| Escribir al menos 200 preguntas y asociar cada una a un país | 208 preguntas en 8 etapas, 52 países y tests que lo verifican |
| Guardar respuestas con fecha y poder compararlas al repetir | Reducer con `localStorage` e historial por pregunta |
| Mejorar los mockups | Cada pregunta como **tarjeta de embarque**, el país como sello de pasaporte |
| Modo grupal sin guardado | Jugadores con turnos, filtro por etapas y mazo mezclado |
| Sin emojis y con la tipografía de En Palabras | Íconos dibujados y Montserrat |

## Momento 3 · Del avance al juego completo

### Perfil, diario y celular (PR #4 y #5)

| Pedido / decisión | Resultado |
|---|---|
| Perfil de usuario con nombre, edad, descripción y foto | Perfil con código de pasajero (localizador de 6 caracteres) |
| El diario dentro del perfil | Diario de viaje con buscador y filtro por etapa |
| Que funcione bien en el celular | Barra de navegación inferior y diseño adaptado |

### Modos de juego (PR #9 a #16)

| Pedido / decisión | Resultado |
|---|---|
| Perfil obligatorio, salvo en Grupal | Grupal se juega sin perfil y no guarda nada |
| Un modo Online para conectar migrantes de distintos países | Duelo de cultura general sobre el país del otro, con marcador y resultado (ganaste, perdiste o empate), seguido de una **charla guiada** con filtro de datos de contacto, bloqueo y denuncia |
| No perder lo escrito | Borrador automático en Individual |
| Explicar el juego al entrar | **Primer vuelo**: bienvenida en varias pantallas que se puede volver a ver |
| Auditoría de experiencia de uso | Confirmaciones claras antes de borrar, accesibilidad (teclado, foco, contraste) y señales más claras |
| Avatares | Creador de avatar en el perfil y edad mínima de 18 años |
| Grupal con un solo teléfono en la mesa | Cada pregunta la contesta toda la mesa, de a uno, con letra grande y reloj opcional |
| Tamaño de letra | Se elige partiendo del que tiene el dispositivo |

### Maleta y diario (PR #17 a #26)

| Pedido / decisión | Resultado |
|---|---|
| Reemplazar el mapa por algo más lindo de juntar | **Mi maleta**: cada país suma un afiche |
| Diario como app de notas | Escritura limpia, modo noche y la tipografía Archivo |
| Un afiche de viaje por país | 52 afiches ilustrados con su lugar emblemático. Rehicimos El Salvador, Islandia y Trinidad y Tobago porque no me convencían |
| Perfil más completo | Dónde naciste y dónde viviste antes (opcionales, solo visibles si lo elegís) |
| Online sin depender del horario | Duelos asincrónicos: cada uno responde a su ritmo, con 3 días de plazo y hasta 3 duelos abiertos |
| Compartir para llegar a más gente | Tarjeta con fondo transparente para pegar sobre una foto propia, estilo Strava, e historia lista. La respuesta solo se comparte si la persona lo pide |

### Identidad visual nueva (PR #27 a #30)

Exploramos con la IA varias direcciones a partir de cuadros de Matisse y de mi pedido de algo sentimental (el viaje, la identidad):

| Pedido / decisión | Resultado |
|---|---|
| Probar el estilo de los recortes de Matisse | **Fondo cobalto**, papeles de color y bordes de tijera hechos con filtros SVG |
| Un logo con fuerza, sin frase debajo | EMIGRADOS con la **S hecha de pájaros que se vuelan**. Descartamos varias frases ("¿Querés? ¿Dónde? ¿Estás?", "¿Querés jugar?") porque la palabra sola ya alcanza |
| Íconos de los modos | Al principio eran figuras humanas, pero "parecían otra cosa", así que pasamos a **pájaros**: una golondrina sola (Individual), una bandada en V (Grupal) y dos pájaros que se encuentran (Online). Un corazón en Online "parecía una app de citas" y lo sacamos |
| Avatares | Avatares de recorte sin rasgos en la cara |
| Rediseño de la tarjeta de embarque, la maleta y el primer vuelo | Elegí entre dos propuestas de cada uno: tarjeta crema con banda cobalto, maleta azul noche y primer vuelo con un recorte por pantalla |
| Imágenes para Instagram más simples | Solo el logo, la pregunta (el gancho) y el formato de billete. Sacamos la ruta, la etapa y el asiento porque a quien ve la historia no le interesan |
| El ícono del pájaro en el corazón "recordaba a una iglesia" | Sacamos el corazón: la marca es la palabra, y el ícono es la S sobre cobalto |
| Rellenar el fondo del inicio | Una ruta punteada sale de una casa y cruza el fondo con una bandada de golondrinas hasta un barrio nuevo. Sacamos a Ícaro, la figura anterior, porque no se entendía |

### Después de probarlo en clase

Ideas que surgieron al mostrar el juego. Las vimos primero en maquetas y después las aplicamos:

| Pedido / decisión | Resultado |
|---|---|
| Poder acomodar los afiches de la maleta | **"Acomodar mi maleta"**: los afiches se arrastran con el dedo, se giran y también se mueven con el teclado. "Ordenar sola" vuelve al orden automático. Es un modo aparte, para que tocar un afiche siga abriendo lo que escribiste |
| Elegir el color de la maleta | Seis colores de la paleta del juego, cada uno con sus correas |
| Volver al inicio desde el celular | La barra de abajo pasa a ser Inicio, Individual, Maleta y Perfil |
| Los íconos de la barra "no se correspondían" con los recortes | Íconos de papel a color: la casa, la golondrina, tu maleta y tu avatar, con la pestaña activa en papel amarillo |
| Ponerle ojos a los avatares | Dos ojos de tinta, en tres miradas, que vienen abiertos por defecto |
| El fondo de casas y golondrinas en todas las pantallas | Queda fijo detrás de todo |

### Revisión clínica de las preguntas

Le pedí a la IA que analizara las 208 preguntas "con un ojo clínico y psicológico especialista en procesos migratorios", sin tocar el juego. Usó como referencia los siete duelos migratorios de Achotegui, el trabajo de León y Rebeca Grinberg sobre migración y exilio, la pérdida ambigua de Pauline Boss y las estrategias de aculturación de Berry. Primero vimos el análisis y la lista completa corregida; cuando la aprobé, la aplicamos.

| Pedido / decisión | Resultado |
|---|---|
| Que las preguntas evoquen respuestas sinceras | 43 reescritas: menos preguntas de sí o no y más momentos concretos con un giro emocional ("¿Dónde dormiste la primera noche? ¿Qué sentiste al apagar la luz?") |
| Incluir a quien no eligió irse | Fuera las preguntas que suponían ilusión, pasaje de avión o poder volver de visita |
| Dejar lugar a lo que no salió bien | "¿Hubo un momento en que sentiste que valió la pena? ¿Y uno en que sentiste que no?", y agradecer y también reclamar al lugar que te recibió |
| Temas que faltaban | 14 preguntas nuevas: una mala noticia a la distancia, la familia que envejece lejos, los papeles, la discriminación, lo que se espera de quien se fue y lo que se perdió sin que nadie lo vea |
| Preguntas que se pisaban o no se entendían al salir al azar | 7 fusiones ("¿Y qué palabra…?" y "ese trabajo" ya no dependen de otra) |
| Dosificar | Cada pregunta tiene intensidad. Individual y Grupal no arrancan con una profunda ni ponen dos seguidas, y en Grupal no sale la que puede polarizar la mesa |
| No perder lo ya escrito | Lo que alguien respondió a una pregunta que cambió queda en su diario con la pregunta original |

### Que la gente vuelva y se conecte

Le pedí a la IA un nuevo análisis: cómo lograr que la gente vuelva y cómo acompañar a quien juega porque quiere remover algo o porque se siente solo. Propuso notificaciones sin culpa, una red de cuidado, tarjetas que ponen nombre a lo que se siente, mandar la pregunta a alguien querido y una carta al futuro. Vimos maquetas y elegí:

| Pedido / decisión | Resultado |
|---|---|
| Ayudar a retomar vínculos y animarse a conversaciones pendientes | **Preguntale a alguien de allá**: la pregunta sale por WhatsApp con un link que la abre sin perfil, y quien la recibe le contesta a la persona |
| Un motivo para volver que tenga sentido | **Carta al futuro**: se escribe hoy, se abre en la fecha elegida y se le puede contestar. El aviso va al calendario de cada persona, sin servidor |
| La carta con el mismo estilo de notas que las preguntas | Misma hoja, fecha arriba, letra grande sin caja, modo noche y borrador automático |
| ¿Por qué hay un límite de caracteres si se trata de reflexionar? | No había un motivo: era un valor por defecto. Se sacó el contador y el tope visible, y el juego ahora avisa si el celular se queda sin espacio |
| Recursos de ayuda y tarjetas "Lo que te pasa tiene nombre" | En pausa: necesitan la revisión de un profesional de salud mental antes de publicarse |

### Cierre

| Pedido / decisión | Resultado |
|---|---|
| Revisar la consigna del Momento 3 | Evaluación punto por punto de lo que estaba y lo que faltaba |
| Limpiar el repositorio | Borramos capturas sueltas, la pegatina vieja y más de 300 líneas de estilos del diseño anterior, comprobando con capturas que nada cambiara |
| Documentar | Este registro, el README y la guía de la prueba de usabilidad |

## Qué aportó la IA y qué decidí yo

- **La IA:** escribió el código y los tests, propuso alternativas de diseño en maquetas, verificó cada cambio en celular y compu, y señaló riesgos (privacidad al compartir, contraste del texto, cómo se leía un ícono en tamaño chico).
- **Yo:** definí el concepto, el público y el tono, elegí entre las propuestas, descarté lo que no me representaba (frases, íconos, colores) y decidí cuándo algo estaba listo para pasar a `main`.
