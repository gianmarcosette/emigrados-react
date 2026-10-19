// Charla guiada del modo online: preguntas para después del duelo, en tres momentos.
// Mezclan lo introspectivo con el país donde vive cada persona: {pais} se reemplaza por
// el país donde vive quien responde.
// `sample` es la respuesta de las personas simuladas de la versión de prueba.

export const TALK_STAGES = [
  {
    key: 'abrir',
    label: 'Para abrir',
    prompts: [
      {
        id: 'sorpresa',
        text: '¿Qué fue lo primero que te sorprendió al llegar a {pais}?',
        sample: 'Lo amable que era la gente en la calle. Esperaba lo contrario y me desarmó.',
      },
      {
        id: 'palabra',
        text: '¿Qué palabra o expresión de {pais} adoptaste sin darte cuenta?',
        sample: 'Una que uso todo el tiempo, hasta cuando hablo con mi familia. Se ríen de mí, pero ya es mía.',
      },
      {
        id: 'rincon',
        text: '¿Cuál es tu rincón favorito de la ciudad donde vivís?',
        sample: 'Un banco frente al agua donde voy cuando necesito pensar. Ahí me siento de acá y de allá a la vez.',
      },
      {
        id: 'comida',
        text: '¿Qué comida de {pais} ya no podrías dejar?',
        sample: 'Una que al principio ni quería probar. Ahora la cocino para las visitas y me da orgullo.',
      },
      {
        id: 'explicar',
        text: '¿Cómo le explicarías {pais} a alguien que nunca fue?',
        sample: 'Que es un lugar que al principio parece cerrado, pero cuando te abre la puerta, es para siempre.',
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
      },
      {
        id: 'casa',
        text: '¿En qué momento sentiste que {pais} empezaba a ser tu casa?',
        sample: 'El día que volví de un viaje y dije "llegué a casa" sin pensarlo. Me quedé un rato en silencio.',
      },
      {
        id: 'cambio',
        text: '¿Qué parte de vos cambió desde que vivís en {pais}?',
        sample: 'Aprendí a pedir ayuda. Antes me parecía una derrota; ahora sé que es lo que me sostiene.',
      },
      {
        id: 'dejar',
        text: '¿Qué fue lo que más te costó dejar atrás?',
        sample: 'Los domingos en familia. Todavía a esa hora me agarra una nostalgia que no sé dónde poner.',
      },
      {
        id: 'mirada',
        text: '¿Hay algo de tu país de origen que ahora mires distinto?',
        sample: 'Sí, lo valoro más. Cosas que me molestaban ahora las cuento con cariño cuando alguien pregunta.',
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
      },
      {
        id: 'mensaje',
        text: 'Si pudieras hablarle a quien eras el día que llegaste, ¿qué le dirías?',
        sample: 'Que no tenga tanto miedo. Que va a estar bien, aunque no se parezca a lo que imaginaba.',
      },
      {
        id: 'hogar',
        text: '¿Qué te hace sentir en casa, estés donde estés?',
        sample: 'Un café a la mañana y una llamada con mi mamá. Con eso, cualquier lugar se vuelve un poco mío.',
      },
      {
        id: 'saber',
        text: '¿Qué te gustaría que la gente de {pais} supiera de quienes llegan de afuera?',
        sample: 'Que venimos con todo lo que somos, no solo con lo que nos falta. También tenemos mucho para dar.',
      },
    ],
  },
]

// Reacciones cortas a una respuesta (sin emojis, como el resto del juego)
export const REACTIONS = ['Me pasa igual', 'Gracias por contarlo', 'Qué lindo', 'Te entiendo', 'Me quedo pensando']
