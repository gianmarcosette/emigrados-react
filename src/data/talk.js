// Charla guiada del modo online: preguntas para después del duelo, en tres momentos.
// Mezclan lo introspectivo con el país donde vive cada persona: {pais} se reemplaza por
// el país donde vive quien responde.
// - `echo`: el eco propio de esa pregunta, para responder a lo que la otra persona contó
// - `sample`: la respuesta de las personas simuladas de la versión de prueba

export const TALK_STAGES = [
  {
    key: 'abrir',
    label: 'Para abrir',
    prompts: [
      {
        id: 'sorpresa',
        text: '¿Qué fue lo primero que te sorprendió al llegar a {pais}?',
        sample: 'Lo amable que era la gente en la calle. Esperaba lo contrario y me desarmó.',
        echo: 'Es lindo cuando un lugar te sorprende para bien. Ojalá te siga pasando.',
      },
      {
        id: 'palabra',
        text: '¿Qué palabra o expresión de {pais} adoptaste sin darte cuenta?',
        sample: 'Una que uso todo el tiempo, hasta cuando hablo con mi familia. Se ríen de mí, pero ya es mía.',
        echo: 'Las palabras que adoptamos son como sellos en el pasaporte: cuentan por dónde pasamos.',
      },
      {
        id: 'rincon',
        text: '¿Cuál es tu rincón favorito de la ciudad donde vivís?',
        sample: 'Un banco frente al agua donde voy cuando necesito pensar. Ahí me siento de acá y de allá a la vez.',
        echo: 'Tener un rincón propio en una ciudad nueva es empezar a echar raíces.',
      },
      {
        id: 'comida',
        text: '¿Qué comida de {pais} ya no podrías dejar?',
        sample: 'Una que al principio ni quería probar. Ahora la cocino para las visitas y me da orgullo.',
        echo: 'La comida es la forma más rica de empezar a pertenecer a un lugar.',
      },
      {
        id: 'explicar',
        text: '¿Cómo le explicarías {pais} a alguien que nunca fue?',
        sample: 'Que es un lugar que al principio parece cerrado, pero cuando te abre la puerta, es para siempre.',
        echo: 'Me dieron ganas de conocer {pais} con tus ojos.',
      },
    ],
  },
  {
    key: 'profundizar',
    label: 'Para ir más hondo',
    prompts: [
      {
        id: 'extranar',
        text: '¿Qué extrañás que no esperabas extrañar?',
        sample: 'El ruido de mi barrio. Los vecinos, la radio prendida, las bocinas. Acá el silencio me pesaba.',
        echo: 'A veces lo que más se extraña es lo que nunca miramos con atención.',
      },
      {
        id: 'casa',
        text: '¿En qué momento sentiste que {pais} empezaba a ser tu casa?',
        sample: 'El día que volví de un viaje y dije "llegué a casa" sin pensarlo. Me quedé un rato en silencio.',
        echo: 'Ese momento en que "casa" cambia de lugar es de los más fuertes del viaje.',
      },
      {
        id: 'cambio',
        text: '¿Qué parte de vos cambió desde que vivís en {pais}?',
        sample: 'Aprendí a pedir ayuda. Antes me parecía una derrota; ahora sé que es lo que me sostiene.',
        echo: 'Qué valiente reconocer en quién te estás convirtiendo.',
      },
      {
        id: 'dejar',
        text: '¿Qué fue lo que más te costó dejar atrás?',
        sample: 'Los domingos en familia. Todavía a esa hora me agarra una nostalgia que no sé dónde poner.',
        echo: 'Lo que cuesta dejar habla de lo mucho que importa. Gracias por compartirlo.',
      },
      {
        id: 'mirada',
        text: '¿Hay algo de tu país de origen que ahora mires distinto?',
        sample: 'Sí, lo valoro más. Cosas que me molestaban ahora las cuento con cariño cuando alguien pregunta.',
        echo: 'Irse también es una forma de volver a mirar lo que uno era.',
      },
    ],
  },
  {
    key: 'cerrar',
    label: 'Para cerrar',
    prompts: [
      {
        id: 'consejo',
        text: '¿Qué consejo le darías a alguien que llega mañana a {pais}?',
        sample: 'Que se dé tiempo. El primer año no es la medida de nada; es solo el comienzo.',
        echo: 'Me lo guardo. Seguro alguien lo va a necesitar tanto como yo.',
      },
      {
        id: 'mensaje',
        text: 'Si pudieras hablarle a quien eras el día que llegaste, ¿qué le dirías?',
        sample: 'Que no tenga tanto miedo. Que va a estar bien, aunque no se parezca a lo que imaginaba.',
        echo: 'Ojalá esa versión tuya del primer día pudiera leerte hoy.',
      },
      {
        id: 'hogar',
        text: '¿Qué te hace sentir en casa, estés donde estés?',
        sample: 'Un café a la mañana y una llamada con mi mamá. Con eso, cualquier lugar se vuelve un poco mío.',
        echo: 'Qué lindo saber que el hogar también se puede llevar puesto.',
      },
      {
        id: 'saber',
        text: '¿Qué te gustaría que la gente de {pais} supiera de quienes llegan de afuera?',
        sample: 'Que venimos con todo lo que somos, no solo con lo que nos falta. También tenemos mucho para dar.',
        echo: 'Ojalá mucha gente en {pais} pudiera leer esto.',
      },
    ],
  },
]

// Ecos de cada momento: frases para devolverle algo a quien compartió su respuesta.
// No inventan experiencias: reconocen, agradecen o dejan pensando.
export const STAGE_ECHOES = {
  abrir: [
    'Me encanta descubrir un lugar a través de lo que otra persona encontró ahí.',
    'Qué lindo cómo lo contás: se nota que {pais} ya es un poco tuyo.',
    'Me dio curiosidad por ese lado de {pais} que no sale en las guías.',
    'Me hiciste viajar un ratito sin moverme de acá.',
  ],
  profundizar: [
    'Me reconozco en lo que contás. Gracias por ponerlo en palabras.',
    'No es fácil abrir esa puerta. Gracias por la confianza.',
    'Me dejaste pensando en mi propia historia.',
    'Hay cosas que solo entiende quien también se fue. Te leo y te entiendo.',
  ],
  cerrar: [
    'Me llevo tus palabras para los días difíciles.',
    'Ojalá alguien me lo hubiera dicho cuando llegué.',
    'Qué bueno haber cruzado caminos en este viaje.',
    'Hablar con vos me hizo sentir un poco más en casa.',
  ],
}
