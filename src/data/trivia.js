// Preguntas de cultura general del modo online, por país donde vive cada persona.
// El modo Online está abierto solo en estos países: España, los destinos más elegidos
// (Australia, Alemania, Irlanda, Nueva Zelanda, Francia, Italia, Portugal, Reino Unido,
// Estados Unidos y Canadá) y toda Latinoamérica. Sumar un país = escribir sus preguntas.
// Clave: código ISO alfa-2 (el mismo del perfil). `mapId`: código numérico del mapa,
// para dibujar la silueta del país.
// Cada pregunta: texto, opciones (la primera es la correcta; el orden se mezcla al armar
// el duelo) y un dato curioso que se muestra después de responder.

import { countryName } from './residence.js'

function q(text, options, fact) {
  return { text, options, fact }
}

export const TRIVIA = {
  AR: {
    mapId: '032',
    // Hora de su ciudad más poblada: para mostrar qué hora es allá
    timeZone: 'America/Argentina/Buenos_Aires',
    questions: [
      q(
        '¿Cuál es la capital de Argentina?',
        ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'],
        'Buenos Aires está a orillas del Río de la Plata, uno de los estuarios más anchos del mundo.',
      ),
      q(
        '¿Qué baile nació en el Río de la Plata a fines del siglo XIX?',
        ['Tango', 'Cumbia', 'Salsa', 'Samba'],
        'En 2009 la UNESCO declaró el tango Patrimonio Inmaterial de la Humanidad, compartido por Argentina y Uruguay.',
      ),
      q(
        '¿Cuál es la montaña más alta de América, en la provincia de Mendoza?',
        ['Aconcagua', 'Fitz Roy', 'Lanín', 'Tupungato'],
        'Con casi 7.000 metros, el Aconcagua es la montaña más alta fuera de Asia.',
      ),
      q(
        '¿Qué infusión se comparte con bombilla?',
        ['Mate', 'Café', 'Té chai', 'Submarino'],
        'El mate se toma en ronda: compartir la misma bombilla es un gesto de confianza.',
      ),
      q(
        '¿Cómo se llaman las cataratas de la frontera con Brasil?',
        ['Cataratas del Iguazú', 'Cataratas del Niágara', 'Salto Ángel', 'Cataratas Victoria'],
        'Son unos 275 saltos de agua; el más impactante se llama Garganta del Diablo.',
      ),
      q(
        "¿Qué escritor argentino escribió 'Rayuela'?",
        ['Julio Cortázar', 'Jorge Luis Borges', 'Ernesto Sabato', 'Adolfo Bioy Casares'],
        "Rayuela (1963) se puede leer en distinto orden, siguiendo el 'tablero de dirección' que propone el autor.",
      ),
      q(
        '¿Cómo se llama la región del extremo sur que Argentina comparte con Chile?',
        ['Patagonia', 'La Pampa', 'La Puna', 'El Chaco'],
        'La Patagonia ocupa cerca de un millón de kilómetros cuadrados entre los dos países.',
      ),
      q(
        '¿Qué científico argentino ganó el Premio Nobel de Medicina en 1984?',
        ['César Milstein', 'Bernardo Houssay', 'Luis Federico Leloir', 'René Favaloro'],
        'Milstein desarrolló los anticuerpos monoclonales, clave en la medicina actual.',
      ),
      q(
        '¿Qué dulce untable de leche y azúcar es típico de Argentina?',
        ['Dulce de leche', 'Mermelada de durazno', 'Miel', 'Crema pastelera'],
        'Es el relleno clásico de alfajores, panqueques y facturas.',
      ),
      q(
        '¿Qué se recuerda el 25 de mayo en Argentina?',
        [
          'La Revolución de Mayo de 1810',
          'La declaración de la independencia',
          'La creación de la bandera',
          'La fundación de Buenos Aires',
        ],
        'Ese día de 1810 se formó el primer gobierno patrio; la independencia se declaró el 9 de julio de 1816.',
      ),
      q(
        '¿Cuál es la moneda de Argentina?',
        ['Peso', 'Sol', 'Real', 'Bolívar'],
        'Su símbolo es $, igual que el del dólar.',
      ),
      q(
        '¿Cómo se llama la gran llanura fértil del centro del país?',
        ['La región pampeana', 'La Puna', 'Los Llanos', 'El Gran Chaco'],
        'Es una de las zonas agrícolas más productivas del mundo.',
      ),
    ],
  },
  UY: {
    mapId: '858',
    timeZone: 'America/Montevideo',
    questions: [
      q(
        '¿Cuál es la capital de Uruguay?',
        ['Montevideo', 'Punta del Este', 'Salto', 'Colonia del Sacramento'],
        'Más de un tercio de las personas que viven en Uruguay vive en Montevideo.',
      ),
      q(
        '¿Qué país ganó el primer Mundial de fútbol, en 1930?',
        ['Uruguay', 'Argentina', 'Brasil', 'Italia'],
        'Uruguay fue el anfitrión y le ganó la final a Argentina 4 a 2.',
      ),
      q(
        '¿Qué ritmo de tambores es patrimonio cultural de Uruguay?',
        ['Candombe', 'Cumbia', 'Bossa nova', 'Joropo'],
        'Nació de las comunidades afrodescendientes y es Patrimonio Inmaterial de la Humanidad desde 2009.',
      ),
      q(
        '¿Qué río marca la frontera oeste de Uruguay con Argentina?',
        ['Río Uruguay', 'Río Amazonas', 'Río Orinoco', 'Río Magdalena'],
        'El nombre oficial, República Oriental del Uruguay, viene de estar al este de ese río.',
      ),
      q(
        '¿Qué ciudad uruguaya, fundada por portugueses, tiene un barrio histórico declarado patrimonio por la UNESCO?',
        ['Colonia del Sacramento', 'Paysandú', 'Rivera', 'Maldonado'],
        'Fue fundada en 1680, justo enfrente de Buenos Aires.',
      ),
      q(
        '¿Cómo se llama el sándwich de carne típico de Uruguay?',
        ['Chivito', 'Choripán', 'Bauru', 'Barros Luco'],
        'Aunque el nombre engañe, el chivito se hace con carne de vaca.',
      ),
      q(
        '¿En qué balneario está la escultura de una mano gigante saliendo de la arena?',
        ['Punta del Este', 'Piriápolis', 'La Paloma', 'Cabo Polonio'],
        "La escultura, conocida como 'Los Dedos', es del artista chileno Mario Irarrázabal.",
      ),
      q(
        '¿Cuál es la moneda de Uruguay?',
        ['Peso uruguayo', 'Sol', 'Real', 'Guaraní'],
        'El peso uruguayo actual circula desde 1993.',
      ),
      q(
        '¿Qué presidente uruguayo se hizo conocido en el mundo por su vida austera en una chacra?',
        ['José Mujica', 'Tabaré Vázquez', 'Luis Lacalle Pou', 'Julio María Sanguinetti'],
        "José 'Pepe' Mujica fue presidente entre 2010 y 2015.",
      ),
      q(
        "¿Qué escritor uruguayo escribió 'Las venas abiertas de América Latina'?",
        ['Eduardo Galeano', 'Mario Benedetti', 'Juan Carlos Onetti', 'Horacio Quiroga'],
        'Se publicó en 1971 y es uno de los libros más leídos sobre la historia de la región.',
      ),
      q(
        '¿Qué celebración uruguaya es considerada una de las más largas del mundo?',
        ['El Carnaval', 'La Semana de Turismo', 'La Noche de la Nostalgia', 'La Fiesta de la Patria Gaucha'],
        'El carnaval uruguayo dura más de un mes, con murgas, parodistas y desfiles de llamadas.',
      ),
      q(
        '¿Con qué países limita Uruguay?',
        ['Argentina y Brasil', 'Brasil y Paraguay', 'Argentina y Paraguay', 'Argentina y Chile'],
        'Es el segundo país más pequeño de Sudamérica, después de Surinam.',
      ),
    ],
  },
  CL: {
    mapId: '152',
    timeZone: 'America/Santiago',
    questions: [
      q(
        '¿Cuál es la capital de Chile?',
        ['Santiago', 'Valparaíso', 'Concepción', 'Antofagasta'],
        'Desde Santiago se ve la cordillera de los Andes casi todo el año.',
      ),
      q(
        '¿Qué desierto chileno es uno de los más áridos del mundo?',
        ['Atacama', 'Sahara', 'Gobi', 'Sonora'],
        'Por su cielo limpio, en Atacama hay algunos de los observatorios astronómicos más importantes del mundo.',
      ),
      q(
        '¿En qué isla chilena están los moáis?',
        ['Isla de Pascua', 'Chiloé', 'Juan Fernández', 'Isla Navarino'],
        'El pueblo rapanui talló cerca de 900 moáis; la isla está a más de 3.500 km del continente.',
      ),
      q(
        '¿Qué poeta chileno ganó el Premio Nobel de Literatura en 1971?',
        ['Pablo Neruda', 'Vicente Huidobro', 'Nicanor Parra', 'Gonzalo Rojas'],
        'En 1945, Gabriela Mistral ya había sido la primera persona latinoamericana en ganar ese premio.',
      ),
      q(
        '¿Cuál es el baile nacional de Chile?',
        ['Cueca', 'Tango', 'Merengue', 'Zamba'],
        'Se baila en pareja con un pañuelo en la mano, sobre todo en las Fiestas Patrias.',
      ),
      q(
        '¿Qué cordillera recorre Chile de norte a sur?',
        ['Los Andes', 'Los Alpes', 'El Himalaya', 'Los Urales'],
        'Chile mide más de 4.000 km de largo y, en promedio, menos de 200 km de ancho.',
      ),
      q(
        '¿Qué aguardiente de uva se disputan Chile y Perú como propio?',
        ['Pisco', 'Tequila', 'Ron', 'Grappa'],
        'Los dos países defienden desde hace décadas que el pisco nació en su tierra.',
      ),
      q(
        '¿Cuál es la moneda de Chile?',
        ['Peso chileno', 'Sol', 'Real', 'Bolívar'],
        'Su símbolo es $, como el del peso argentino.',
      ),
      q(
        '¿Qué día celebra Chile sus Fiestas Patrias?',
        ['18 de septiembre', '9 de julio', '20 de julio', '28 de julio'],
        "Se las llama 'el dieciocho' y se festejan con fondas, empanadas y cueca.",
      ),
      q(
        '¿Qué isla del sur de Chile es famosa por sus iglesias de madera?',
        ['Chiloé', 'Isla de Pascua', 'Juan Fernández', 'Isla Riesco'],
        'Dieciséis de esas iglesias son Patrimonio Mundial de la UNESCO desde el año 2000.',
      ),
      q(
        '¿Cómo se llama la bebida de verano con trigo cocido y duraznos secos?',
        ['Mote con huesillo', 'Horchata', 'Chicha morada', 'Tereré'],
        'Se vende en carritos callejeros en los días de calor.',
      ),
      q(
        '¿Qué parque nacional de la Patagonia chilena es famoso por sus torres de granito?',
        ['Torres del Paine', 'Nahuel Huapi', 'Los Glaciares', 'Lauca'],
        'Recibe visitantes de todo el mundo que lo recorren a pie durante días.',
      ),
    ],
  },
  CO: {
    mapId: '170',
    timeZone: 'America/Bogota',
    questions: [
      q(
        '¿Cuál es la capital de Colombia?',
        ['Bogotá', 'Medellín', 'Cali', 'Cartagena'],
        'Bogotá está a unos 2.600 metros sobre el nivel del mar.',
      ),
      q(
        "¿Qué escritor colombiano escribió 'Cien años de soledad'?",
        ['Gabriel García Márquez', 'Mario Vargas Llosa', 'Álvaro Mutis', 'Jorge Isaacs'],
        'García Márquez ganó el Nobel de Literatura en 1982 y es una de las grandes voces del realismo mágico.',
      ),
      q(
        '¿Qué producto colombiano es famoso en todo el mundo por su calidad?',
        ['El café', 'El té', 'La vainilla', 'El trigo'],
        'El Paisaje Cultural Cafetero de Colombia es Patrimonio Mundial desde 2011.',
      ),
      q(
        '¿Qué ritmo de la costa caribe colombiana se toca con acordeón?',
        ['Vallenato', 'Tango', 'Flamenco', 'Bachata'],
        'La música vallenata tradicional es Patrimonio Inmaterial de la Humanidad desde 2015.',
      ),
      q(
        '¿En qué ciudad colombiana se celebra la Feria de las Flores?',
        ['Medellín', 'Bogotá', 'Barranquilla', 'Pasto'],
        'Su gran momento es el desfile de silleteros, que cargan enormes arreglos de flores en la espalda.',
      ),
      q(
        '¿Qué océanos bañan las costas de Colombia?',
        ['Pacífico y Atlántico (mar Caribe)', 'Pacífico e Índico', 'Atlántico e Índico', 'Ártico y Pacífico'],
        'Es el único país de Sudamérica con costas en el Pacífico y en el Caribe.',
      ),
      q(
        '¿Qué ciudad amurallada del Caribe colombiano es Patrimonio de la Humanidad?',
        ['Cartagena de Indias', 'Santa Marta', 'Barranquilla', 'Cali'],
        'Su centro histórico amurallado es Patrimonio Mundial desde 1984.',
      ),
      q(
        '¿Qué carnaval colombiano fue reconocido por la UNESCO?',
        ['Carnaval de Barranquilla', 'Carnaval de Río', 'Carnaval de Oruro', 'Carnaval de Montevideo'],
        'Fue proclamado Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad en 2003.',
      ),
      q(
        '¿Qué piedra preciosa produce Colombia como pocos países en el mundo?',
        ['Esmeralda', 'Diamante', 'Rubí', 'Zafiro'],
        'Colombia es uno de los mayores productores de esmeraldas del mundo.',
      ),
      q(
        '¿Qué cantante colombiana hizo famosa la canción "Hips Don\'t Lie"?',
        ['Shakira', 'Karol G', 'Celia Cruz', 'Thalía'],
        'Shakira nació en Barranquilla.',
      ),
      q(
        '¿Cuál es la moneda de Colombia?',
        ['Peso colombiano', 'Sol', 'Bolívar', 'Colón'],
        'Como en otros países de la región, su símbolo es $.',
      ),
      q(
        '¿Qué sopa bogotana lleva pollo, tres tipos de papa y guascas?',
        ['Ajiaco', 'Locro', 'Pozole', 'Chupe'],
        'Se sirve con crema, alcaparras y aguacate.',
      ),
    ],
  },
  VE: {
    mapId: '862',
    timeZone: 'America/Caracas',
    questions: [
      q(
        '¿Cuál es la capital de Venezuela?',
        ['Caracas', 'Maracaibo', 'Valencia', 'Mérida'],
        'Caracas está en un valle al pie del cerro El Ávila, también llamado Waraira Repano.',
      ),
      q(
        '¿Cuál es la cascada más alta del mundo, en Venezuela?',
        ['Salto Ángel', 'Cataratas del Iguazú', 'Cataratas del Niágara', 'Cataratas Victoria'],
        'El agua cae casi 1.000 metros desde el Auyantepuy.',
      ),
      q(
        '¿Qué comida de masa de maíz es típica de Venezuela?',
        ['Arepa', 'Taco', 'Pupusa', 'Burrito'],
        "Se rellena con casi todo: la 'reina pepiada' lleva pollo y aguacate.",
      ),
      q(
        "¿Qué prócer nacido en Caracas es llamado 'el Libertador'?",
        ['Simón Bolívar', 'José de San Martín', "Bernardo O'Higgins", 'José Martí'],
        'Lideró la independencia de Venezuela, Colombia, Ecuador, Perú y Bolivia.',
      ),
      q(
        '¿Qué gran lago está en el noroeste de Venezuela?',
        ['Lago de Maracaibo', 'Lago Titicaca', 'Lago Nahuel Huapi', 'Lago General Carrera'],
        'Cerca de allí ocurre el relámpago del Catatumbo: tormentas eléctricas casi todas las noches.',
      ),
      q(
        '¿Cuál es la moneda de Venezuela?',
        ['Bolívar', 'Peso', 'Sol', 'Real'],
        'La moneda lleva el nombre de Simón Bolívar.',
      ),
      q(
        '¿Cómo se llaman las montañas de cima plana típicas de la Gran Sabana?',
        ['Tepuyes', 'Volcanes', 'Fiordos', 'Médanos'],
        "El monte Roraima, un tepuy, inspiró 'El mundo perdido' de Arthur Conan Doyle.",
      ),
      q(
        '¿Qué plato navideño venezolano se envuelve en hojas de plátano?',
        ['Hallaca', 'Empanada', 'Cachapa', 'Tequeño'],
        'Se prepara en familia y cada casa tiene su propia receta.',
      ),
      q(
        '¿Qué instrumento de cuatro cuerdas es emblema de la música venezolana?',
        ['El cuatro', 'El charango', 'El bandoneón', 'El guitarrón'],
        'Es protagonista del joropo, el baile nacional.',
      ),
      q(
        "¿Qué isla venezolana del Caribe es conocida como 'la Perla del Caribe'?",
        ['Isla Margarita', 'Isla de Pascua', 'Chiloé', 'Isla Mujeres'],
        'Es uno de los destinos de playa más visitados del país.',
      ),
      q(
        '¿Cómo se llama el programa venezolano de orquestas juveniles famoso en todo el mundo?',
        ['El Sistema', 'La Escuelita', 'Coro Andino', 'Música en la Calle'],
        'De El Sistema surgió el director de orquesta Gustavo Dudamel.',
      ),
      q(
        '¿Cómo se llama la gran llanura del centro de Venezuela?',
        ['Los Llanos', 'La Pampa', 'El Chaco', 'La Puna'],
        'Es tierra de llaneros, ganado y joropo.',
      ),
    ],
  },
  PE: {
    mapId: '604',
    timeZone: 'America/Lima',
    questions: [
      q(
        '¿Cuál es la capital de Perú?',
        ['Lima', 'Cusco', 'Arequipa', 'Trujillo'],
        'Lima fue la capital del Virreinato del Perú y su centro histórico es Patrimonio Mundial.',
      ),
      q(
        '¿Qué ciudadela inca está en los Andes peruanos?',
        ['Machu Picchu', 'Tikal', 'Chichén Itzá', 'Teotihuacán'],
        'Se construyó en el siglo XV y es una de las Nuevas Siete Maravillas del Mundo.',
      ),
      q(
        '¿Qué plato de pescado marinado en limón es emblema de Perú?',
        ['Ceviche', 'Paella', 'Asado', 'Feijoada'],
        'En 2023 la UNESCO reconoció la preparación del ceviche como Patrimonio Inmaterial de la Humanidad.',
      ),
      q(
        '¿Qué lago comparten Perú y Bolivia?',
        ['Titicaca', 'Maracaibo', 'Llanquihue', 'Nahuel Huapi'],
        'Es el lago navegable más alto del mundo, a unos 3.800 metros de altura.',
      ),
      q(
        '¿Cuál es la moneda de Perú?',
        ['Sol', 'Peso', 'Bolívar', 'Real'],
        "Antes del sol hubo una moneda llamada inti, que en quechua también significa 'sol'.",
      ),
      q(
        '¿Qué escritor peruano ganó el Premio Nobel de Literatura en 2010?',
        ['Mario Vargas Llosa', 'César Vallejo', 'Ciro Alegría', 'José María Arguedas'],
        'Vargas Llosa nació en Arequipa en 1936.',
      ),
      q(
        '¿Qué lengua originaria es oficial en Perú junto al español?',
        ['Quechua', 'Guaraní', 'Náhuatl', 'Mapudungun'],
        'Era la lengua del Imperio inca y hoy la hablan millones de personas.',
      ),
      q(
        '¿Cuál era la capital del Imperio inca?',
        ['Cusco', 'Lima', 'Quito', 'La Paz'],
        "Se suele traducir su nombre, Qosqo, como 'ombligo del mundo'.",
      ),
      q(
        '¿Qué figuras gigantes trazadas en el desierto peruano se ven mejor desde el aire?',
        ['Líneas de Nazca', 'Moáis', 'Chan Chan', 'Tiwanaku'],
        'Tienen más de 1.500 años y dibujan animales como un colibrí y un mono.',
      ),
      q(
        '¿Qué bebida se prepara hirviendo maíz morado?',
        ['Chicha morada', 'Horchata', 'Tereré', 'Agua de jamaica'],
        'Se hierve con piña, canela y clavo de olor.',
      ),
      q(
        '¿Qué animal andino da una de las lanas más finas del mundo?',
        ['Alpaca', 'Oveja merino', 'Cabra', 'Camello'],
        'Perú tiene la mayor población de alpacas del mundo.',
      ),
      q(
        "¿Qué ciudad peruana es conocida como 'la Ciudad Blanca'?",
        ['Arequipa', 'Cusco', 'Trujillo', 'Piura'],
        'Sus edificios están hechos de sillar, una piedra volcánica blanca.',
      ),
    ],
  },
  MX: {
    mapId: '484',
    timeZone: 'America/Mexico_City',
    questions: [
      q(
        '¿Cuál es la capital de México?',
        ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Cancún'],
        'Se levanta sobre Tenochtitlan, la antigua capital mexica, construida en un lago.',
      ),
      q(
        '¿Qué celebración recuerda a los difuntos el 1 y el 2 de noviembre?',
        ['Día de Muertos', 'Carnaval', 'Grito de Independencia', 'Las Posadas'],
        'Las ofrendas se decoran con flores de cempasúchil, que según la tradición guían a las almas.',
      ),
      q(
        '¿Qué pintora mexicana es famosa por sus autorretratos?',
        ['Frida Kahlo', 'Tarsila do Amaral', 'Gabriela Mistral', 'Violeta Parra'],
        'Su Casa Azul, en Coyoacán, hoy es un museo.',
      ),
      q(
        '¿En qué península está Chichén Itzá?',
        ['Yucatán', 'Baja California', 'Florida', 'Ibérica'],
        'Chichén Itzá fue elegida una de las Nuevas Siete Maravillas del Mundo en 2007.',
      ),
      q(
        '¿Qué bebida se elabora con agave azul en Jalisco?',
        ['Tequila', 'Pisco', 'Ron', 'Cachaça'],
        'Tequila también es el nombre de un pueblo de Jalisco.',
      ),
      q(
        '¿Cómo se llaman los músicos con traje de charro típicos de México?',
        ['Mariachis', 'Murgueros', 'Gauchos', 'Payadores'],
        'El mariachi es Patrimonio Inmaterial de la Humanidad desde 2011.',
      ),
      q(
        '¿Qué grano es la base de la tortilla tradicional mexicana?',
        ['Maíz', 'Arroz', 'Cebada', 'Avena'],
        'La cocina tradicional mexicana fue una de las primeras reconocidas como Patrimonio Inmaterial de la Humanidad, en 2010.',
      ),
      q(
        '¿Cuál es la pirámide más grande de Teotihuacán?',
        ['Pirámide del Sol', 'Pirámide de la Luna', 'El Castillo', 'Templo Mayor'],
        'Es una de las pirámides más grandes de América.',
      ),
      q(
        '¿Cuál es la moneda de México?',
        ['Peso mexicano', 'Sol', 'Quetzal', 'Colón'],
        'Su símbolo es $, como en varios países de América.',
      ),
      q(
        '¿Qué día celebra México su independencia?',
        ['16 de septiembre', '5 de mayo', '4 de julio', '20 de noviembre'],
        "La noche del 15 se recuerda el 'Grito de Dolores'; el 5 de mayo, en cambio, recuerda una batalla.",
      ),
      q(
        '¿Cómo se llama el espectáculo de luchadores enmascarados tan popular en México?',
        ['Lucha libre', 'Sumo', 'Capoeira', 'Esgrima'],
        'Para muchos luchadores, perder la máscara es la peor de las derrotas.',
      ),
      q(
        '¿Cómo se llaman los canales con trajineras de colores en Ciudad de México?',
        ['Xochimilco', 'Coyoacán', 'Tlatelolco', 'Chapultepec'],
        'Son Patrimonio Mundial junto con el centro histórico de la ciudad.',
      ),
    ],
  },
  CU: {
    mapId: '192',
    timeZone: 'America/Havana',
    questions: [
      q(
        '¿Cuál es la capital de Cuba?',
        ['La Habana', 'Santiago de Cuba', 'Varadero', 'Camagüey'],
        'La Habana Vieja es Patrimonio Mundial desde 1982.',
      ),
      q(
        '¿Cómo se llama el famoso paseo junto al mar de La Habana?',
        ['El Malecón', 'La Rambla', 'Copacabana', 'La Costanera'],
        'Recorre unos 8 km frente al mar.',
      ),
      q(
        "¿Qué escritor y prócer cubano escribió 'Versos sencillos'?",
        ['José Martí', 'Alejo Carpentier', 'Nicolás Guillén', 'Reinaldo Arenas'],
        "Algunos de esos versos son la letra de la canción 'Guantanamera'.",
      ),
      q(
        "¿Qué cantante cubana fue llamada 'la reina de la salsa'?",
        ['Celia Cruz', 'Shakira', 'Mercedes Sosa', 'Rocío Jurado'],
        "Su grito más famoso era '¡Azúcar!'.",
      ),
      q(
        '¿Qué cóctel cubano lleva ron, menta, lima y soda?',
        ['Mojito', 'Caipiriña', 'Pisco sour', 'Sangría'],
        'Se cuenta que Ernest Hemingway lo tomaba en La Bodeguita del Medio, en La Habana.',
      ),
      q(
        '¿Qué mar baña la costa sur de Cuba?',
        ['Mar Caribe', 'Mar Mediterráneo', 'Mar del Norte', 'Mar Rojo'],
        'Cuba es la isla más grande del Caribe.',
      ),
      q(
        '¿Qué género musical cubano popularizó el Buena Vista Social Club?',
        ['El son cubano', 'El tango', 'La cumbia', 'La bossa nova'],
        'El son mezcla raíces españolas y africanas.',
      ),
      q(
        '¿Qué cultivo hizo famosos a los habanos?',
        ['Tabaco', 'Café', 'Cacao', 'Caña de azúcar'],
        'La región de Vuelta Abajo, en Pinar del Río, es famosa por su tabaco.',
      ),
      q(
        '¿Qué valle cubano con mogotes es Patrimonio de la Humanidad?',
        ['Valle de Viñales', 'Valle de la Luna', 'Valle Sagrado', 'Valle de Elqui'],
        'Los mogotes son colinas de roca caliza con laderas casi verticales.',
      ),
      q(
        '¿Qué ciudad colonial cubana, fundada en 1514, es Patrimonio de la Humanidad?',
        ['Trinidad', 'Varadero', 'Holguín', 'Matanzas'],
        'Comparte esa distinción con el cercano Valle de los Ingenios.',
      ),
      q(
        '¿Qué bebida alcohólica es la base de los cócteles cubanos más famosos?',
        ['Ron', 'Tequila', 'Pisco', 'Vodka'],
        'El daiquirí y el mojito, dos clásicos cubanos, se preparan con ron.',
      ),
      q(
        '¿Cómo se les dice en Cuba a los autos de los años 50 que siguen circulando?',
        ['Almendrones', 'Colectivos', 'Bondis', 'Tuk-tuks'],
        'Muchos siguen andando gracias al ingenio de sus dueños para conseguir repuestos.',
      ),
    ],
  },
  BR: {
    mapId: '076',
    timeZone: 'America/Sao_Paulo',
    questions: [
      q(
        '¿Cuál es la capital de Brasil?',
        ['Brasilia', 'Río de Janeiro', 'São Paulo', 'Salvador'],
        'Brasilia se inauguró en 1960 y fue diseñada por Lúcio Costa y Oscar Niemeyer.',
      ),
      q(
        '¿Cuál es el idioma oficial de Brasil?',
        ['Portugués', 'Español', 'Inglés', 'Francés'],
        'Brasil es el país con más hablantes de portugués del mundo.',
      ),
      q(
        '¿Qué estatua está en la cima del cerro Corcovado?',
        ['El Cristo Redentor', 'La Estatua de la Libertad', 'El Cristo de los Andes', 'El Ángel de la Independencia'],
        'Se inauguró en 1931 y mide unos 38 metros con su pedestal.',
      ),
      q(
        '¿Qué selva cubre gran parte del norte de Brasil?',
        ['La Amazonia', 'La Selva Negra', 'El Darién', 'La Selva Lacandona'],
        'Alrededor del 60% de la selva amazónica está en Brasil.',
      ),
      q(
        '¿Qué género musical y baile es el alma del Carnaval de Río?',
        ['Samba', 'Tango', 'Cueca', 'Cumbia'],
        'La samba de roda de Bahía es Patrimonio Inmaterial de la Humanidad.',
      ),
      q(
        '¿Qué plato de porotos negros con carne es típico de Brasil?',
        ['Feijoada', 'Locro', 'Ajiaco', 'Mondongo'],
        'Se suele acompañar con arroz, farofa, verduras y rodajas de naranja.',
      ),
      q(
        '¿Qué arte afrobrasileño mezcla lucha, danza y música?',
        ['Capoeira', 'Judo', 'Karate', 'Esgrima'],
        'La roda de capoeira es Patrimonio Inmaterial de la Humanidad desde 2014.',
      ),
      q(
        '¿Qué playa de Río es famosa por su vereda con ondas blancas y negras?',
        ['Copacabana', 'Punta del Este', 'Varadero', 'Cancún'],
        'El diseño actual del paseo es del paisajista Roberto Burle Marx.',
      ),
      q(
        '¿De qué fruto amazónico se hace una gaseosa muy popular en Brasil?',
        ['Guaraná', 'Maracuyá', 'Açaí', 'Cupuazú'],
        'Las semillas de guaraná tienen más cafeína que los granos de café.',
      ),
      q(
        '¿Qué cóctel brasileño lleva cachaça, lima y azúcar?',
        ['Caipiriña', 'Mojito', 'Pisco sour', 'Margarita'],
        'La cachaça se destila del jugo de la caña de azúcar.',
      ),
      q(
        '¿Cuál es la moneda de Brasil?',
        ['Real', 'Peso', 'Sol', 'Bolívar'],
        'El real se lanzó en 1994 para frenar una inflación altísima.',
      ),
      q(
        '¿Cuál es la ciudad más poblada de Brasil?',
        ['São Paulo', 'Río de Janeiro', 'Brasilia', 'Salvador'],
        'São Paulo es una de las ciudades más pobladas del hemisferio sur.',
      ),
    ],
  },
  ES: {
    mapId: '724',
    timeZone: 'Europe/Madrid',
    questions: [
      q(
        '¿Cuál es la capital de España?',
        ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
        'Madrid es la capital más alta de la Unión Europea, a unos 650 metros.',
      ),
      q(
        '¿En qué ciudad está la Sagrada Familia?',
        ['Barcelona', 'Madrid', 'Bilbao', 'Granada'],
        'Su construcción empezó en 1882 y Gaudí le dedicó más de 40 años de su vida.',
      ),
      q(
        '¿Qué plato de arroz con azafrán es típico de Valencia?',
        ['Paella', 'Gazpacho', 'Fabada', 'Cocido'],
        'La paella valenciana tradicional lleva pollo, conejo y judías verdes, no mariscos.',
      ),
      q(
        '¿En qué comunidad autónoma se habla gallego?',
        ['Galicia', 'Asturias', 'Navarra', 'Aragón'],
        'El gallego tiene un origen común con el portugués.',
      ),
      q(
        "¿Quién pintó 'Las meninas'?",
        ['Diego Velázquez', 'Francisco de Goya', 'Pablo Picasso', 'El Greco'],
        'Las meninas (1656) se exhibe en el Museo del Prado, en Madrid.',
      ),
      q(
        '¿Qué fiesta de Pamplona es famosa por los encierros de toros?',
        ['San Fermín', 'Las Fallas', 'La Tomatina', 'La Feria de Abril'],
        'Se celebra cada año del 6 al 14 de julio.',
      ),
      q(
        "¿Quién escribió 'Don Quijote de la Mancha'?",
        ['Miguel de Cervantes', 'Lope de Vega', 'Francisco de Quevedo', 'Federico García Lorca'],
        'El Día del Libro, el 23 de abril, se celebra en homenaje a Cervantes y a Shakespeare.',
      ),
      q(
        '¿Qué palacio nazarí está en Granada?',
        ['La Alhambra', 'El Escorial', 'La Mezquita de Córdoba', 'El Palacio Real'],
        'Fue construido por la dinastía nazarí entre los siglos XIII y XIV.',
      ),
      q(
        '¿Qué bebida fría de verano se hace con vino tinto y frutas?',
        ['Sangría', 'Horchata', 'Cava', 'Sidra'],
        'La horchata valenciana, en cambio, se hace con chufa.',
      ),
      q(
        '¿En qué ciudad termina el Camino de Santiago?',
        ['Santiago de Compostela', 'Madrid', 'Toledo', 'Salamanca'],
        'Según la tradición, en su catedral está la tumba del apóstol Santiago.',
      ),
      q(
        '¿Qué arte de cante, baile y guitarra es Patrimonio de la Humanidad?',
        ['Flamenco', 'Fado', 'Tango', 'Jota'],
        'La UNESCO reconoció el flamenco en 2010.',
      ),
      q(
        '¿Qué islas españolas están en el Atlántico, frente a África?',
        ['Islas Canarias', 'Islas Baleares', 'Azores', 'Madeira'],
        'El Teide, en Tenerife, es la montaña más alta de España.',
      ),
    ],
  },
  PT: {
    mapId: '620',
    timeZone: 'Europe/Lisbon',
    questions: [
      q(
        '¿Cuál es la capital de Portugal?',
        ['Lisboa', 'Oporto', 'Coímbra', 'Faro'],
        'A Lisboa se la conoce como la ciudad de las siete colinas.',
      ),
      q(
        '¿Qué canción melancólica es símbolo de Portugal?',
        ['Fado', 'Bossa nova', 'Flamenco', 'Tango'],
        'El fado es Patrimonio Inmaterial de la Humanidad desde 2011.',
      ),
      q(
        '¿Qué dulce de hojaldre y crema es típico de Lisboa?',
        ['Pastel de nata', 'Alfajor', 'Churro', 'Cannoli'],
        'La receta original nació en el monasterio de los Jerónimos, en Belém.',
      ),
      q(
        '¿Qué navegante portugués llegó a la India por mar en 1498?',
        ['Vasco da Gama', 'Cristóbal Colón', 'Fernando de Magallanes', 'Pedro Álvares Cabral'],
        'Su viaje abrió la ruta marítima entre Europa y Asia rodeando África.',
      ),
      q(
        '¿Qué ciudad da nombre al famoso vino dulce portugués?',
        ['Oporto', 'Lisboa', 'Braga', 'Évora'],
        'El vino de Oporto se produce en el valle del Duero.',
      ),
      q(
        '¿Con qué único país tiene frontera terrestre Portugal?',
        ['España', 'Francia', 'Marruecos', 'Italia'],
        'Es una de las fronteras más antiguas de Europa.',
      ),
      q(
        '¿Cómo se llaman las baldosas pintadas que decoran muchas fachadas en Portugal?',
        ['Azulejos', 'Mosaicos', 'Vitrales', 'Adoquines'],
        'En Lisboa hay un Museo Nacional del Azulejo.',
      ),
      q(
        '¿Qué futbolista portugués nació en la isla de Madeira?',
        ['Cristiano Ronaldo', 'Luís Figo', 'Eusébio', 'Bruno Fernandes'],
        'El aeropuerto de Madeira lleva su nombre.',
      ),
      q(
        '¿Qué pescado seco y salado es el más típico de la cocina portuguesa?',
        ['Bacalao', 'Salmón', 'Atún', 'Merluza'],
        'Se dice que hay una receta de bacalao para cada día del año.',
      ),
      q(
        '¿Qué archipiélago portugués de origen volcánico está en medio del Atlántico?',
        ['Azores', 'Canarias', 'Baleares', 'Malvinas'],
        'Las Azores son nueve islas.',
      ),
      q(
        '¿Con qué flor se recuerda la revolución pacífica de 1974 en Portugal?',
        ['Clavel', 'Rosa', 'Tulipán', 'Girasol'],
        'Los soldados pusieron claveles en sus fusiles: así terminó la dictadura, el 25 de abril.',
      ),
      q(
        '¿Qué número tiene el tranvía amarillo más famoso de Lisboa?',
        ['28', '12', '7', '1'],
        'Recorre barrios históricos como Alfama y Graça.',
      ),
    ],
  },
  IT: {
    mapId: '380',
    timeZone: 'Europe/Rome',
    questions: [
      q(
        '¿Cuál es la capital de Italia?',
        ['Roma', 'Milán', 'Nápoles', 'Florencia'],
        'Dentro de Roma está el Vaticano, el país más pequeño del mundo.',
      ),
      q(
        '¿En qué ciudad está la famosa torre inclinada?',
        ['Pisa', 'Venecia', 'Turín', 'Bolonia'],
        'La torre empezó a inclinarse mientras la construían, en el siglo XII.',
      ),
      q(
        '¿Qué ciudad italiana es famosa por sus canales y góndolas?',
        ['Venecia', 'Génova', 'Verona', 'Palermo'],
        'Venecia se levanta sobre más de cien pequeñas islas unidas por puentes.',
      ),
      q(
        "¿Quién pintó 'La última cena'?",
        ['Leonardo da Vinci', 'Miguel Ángel', 'Rafael', 'Caravaggio'],
        'Está pintada en una pared del convento de Santa Maria delle Grazie, en Milán.',
      ),
      q(
        '¿En qué ciudad nació la pizza margarita?',
        ['Nápoles', 'Roma', 'Milán', 'Bari'],
        'Según la tradición, debe su nombre a la reina Margarita de Saboya.',
      ),
      q(
        '¿Qué volcán sepultó Pompeya en el año 79?',
        ['Vesubio', 'Etna', 'Estrómboli', 'Teide'],
        'El Vesubio sigue activo: su última erupción fue en 1944.',
      ),
      q(
        '¿Qué café con leche espumada es típico de Italia?',
        ['Capuchino', 'Cortado', 'Café de olla', 'Café irlandés'],
        'En Italia se acostumbra tomarlo solo por la mañana.',
      ),
      q(
        '¿Quién pintó la bóveda de la Capilla Sixtina?',
        ['Miguel Ángel', 'Leonardo da Vinci', 'Rafael', 'Tiziano'],
        'Trabajó en ella unos cuatro años, de 1508 a 1512.',
      ),
      q(
        '¿Qué ciudad italiana es considerada la cuna del Renacimiento?',
        ['Florencia', 'Turín', 'Bari', 'Génova'],
        'En Florencia está el David de Miguel Ángel.',
      ),
      q(
        '¿Qué camiseta usa quien lidera el Giro de Italia?',
        ['La rosa', 'La amarilla', 'La roja', 'La verde'],
        'Se la llama maglia rosa, por el color del diario que creó la carrera.',
      ),
      q(
        '¿Cuál es la isla más grande del Mediterráneo?',
        ['Sicilia', 'Cerdeña', 'Córcega', 'Creta'],
        'En Sicilia está el Etna, uno de los volcanes más activos de Europa.',
      ),
      q(
        '¿Qué colores tiene la bandera de Italia?',
        ['Verde, blanco y rojo', 'Azul, blanco y rojo', 'Rojo y blanco', 'Verde y amarillo'],
        "Los italianos la llaman 'il Tricolore'.",
      ),
    ],
  },
  FR: {
    mapId: '250',
    timeZone: 'Europe/Paris',
    questions: [
      q(
        '¿Cuál es la capital de Francia?',
        ['París', 'Lyon', 'Marsella', 'Niza'],
        'A París se la conoce como la Ciudad de la Luz.',
      ),
      q(
        '¿En qué año se inauguró la torre Eiffel?',
        ['1889', '1789', '1914', '1950'],
        'Se construyó para la Exposición Universal y la idea era desmontarla a los 20 años.',
      ),
      q(
        '¿En qué museo de París está la Mona Lisa?',
        ['Louvre', 'Orsay', 'Prado', 'Pompidou'],
        'El Louvre es uno de los museos más visitados del mundo.',
      ),
      q(
        '¿Qué día es la fiesta nacional de Francia?',
        ['14 de julio', '4 de julio', '1 de mayo', '25 de mayo'],
        'Recuerda la toma de la Bastilla, en 1789.',
      ),
      q(
        '¿Qué carrera de ciclismo recorre Francia cada verano?',
        ['Tour de Francia', 'Giro de Italia', 'Vuelta a España', 'Rally Dakar'],
        'Se corre desde 1903 y termina tradicionalmente en París.',
      ),
      q(
        '¿Cómo se llama el pan largo y fino típico de Francia?',
        ['Baguette', 'Croissant', 'Brioche', 'Focaccia'],
        'El saber hacer de la baguette es Patrimonio Inmaterial de la Humanidad desde 2022.',
      ),
      q(
        '¿Cuál es la montaña más alta de Europa occidental, en la frontera con Italia?',
        ['Mont Blanc', 'Matterhorn', 'Teide', 'Aneto'],
        'El Mont Blanc mide unos 4.800 metros.',
      ),
      q(
        "¿Quién escribió 'El principito'?",
        ['Antoine de Saint-Exupéry', 'Victor Hugo', 'Julio Verne', 'Albert Camus'],
        'Saint-Exupéry era aviador y llevó correo por la Patagonia argentina.',
      ),
      q(
        '¿Qué región francesa da nombre a un famoso vino espumoso?',
        ['Champaña', 'Provenza', 'Normandía', 'Bretaña'],
        'Solo los espumosos elaborados allí pueden llamarse champán.',
      ),
      q(
        '¿Qué palacio cercano a París fue la residencia de Luis XIV?',
        ['Versalles', 'Buckingham', 'Schönbrunn', 'El Escorial'],
        'Su Salón de los Espejos tiene 357 espejos.',
      ),
      q(
        '¿Cuál es el lema de Francia?',
        ['Libertad, igualdad, fraternidad', 'Orden y progreso', 'Unidad y libertad', 'Paz y trabajo'],
        'El lema viene de la Revolución francesa.',
      ),
      q(
        '¿Qué pan dulce de hojaldre con forma de medialuna es símbolo francés?',
        ['Croissant', 'Baguette', 'Brioche', 'Macaron'],
        'Aunque es símbolo de Francia, su antecesor sería el kipferl austríaco.',
      ),
    ],
  },
  DE: {
    mapId: '276',
    timeZone: 'Europe/Berlin',
    questions: [
      q(
        '¿Cuál es la capital de Alemania?',
        ['Berlín', 'Múnich', 'Hamburgo', 'Fráncfort'],
        'Con la reunificación de 1990, Berlín volvió a ser la capital de toda Alemania.',
      ),
      q(
        '¿En qué año cayó el Muro de Berlín?',
        ['1989', '1961', '1945', '1991'],
        'El Muro cayó el 9 de noviembre de 1989; Alemania se reunificó al año siguiente.',
      ),
      q(
        '¿Qué ciudad celebra el Oktoberfest?',
        ['Múnich', 'Colonia', 'Dresde', 'Stuttgart'],
        "Aunque se llama 'fiesta de octubre', empieza a fines de septiembre.",
      ),
      q(
        "¿Qué compositor alemán escribió la Novena sinfonía, con el 'Himno de la alegría'?",
        ['Ludwig van Beethoven', 'Wolfgang Amadeus Mozart', 'Johann Sebastian Bach', 'Richard Wagner'],
        'Beethoven la compuso cuando ya estaba prácticamente sordo.',
      ),
      q(
        '¿Qué río pasa por Colonia y es uno de los más largos de Europa?',
        ['Rin', 'Danubio', 'Sena', 'Támesis'],
        'Sus orillas están llenas de castillos y viñedos.',
      ),
      q(
        '¿Cuál es la moneda de Alemania?',
        ['Euro', 'Marco', 'Franco', 'Libra'],
        'Antes del euro, Alemania usaba el marco alemán.',
      ),
      q(
        '¿Qué castillo alemán de cuento inspiró a Disney?',
        ['Neuschwanstein', 'Versalles', 'Windsor', 'La Alhambra'],
        'Lo mandó construir el rey Luis II de Baviera en el siglo XIX.',
      ),
      q(
        '¿Qué puerta es el símbolo de Berlín?',
        ['Puerta de Brandeburgo', 'Arco del Triunfo', 'Puerta de Alcalá', 'Puerta del Sol'],
        'Durante la división de la ciudad quedó junto al Muro, en tierra de nadie.',
      ),
      q(
        '¿Qué científico nacido en Alemania formuló la teoría de la relatividad?',
        ['Albert Einstein', 'Isaac Newton', 'Charles Darwin', 'Marie Curie'],
        'Einstein nació en Ulm en 1879.',
      ),
      q(
        '¿Cómo se llaman las autopistas alemanas, famosas por tener tramos sin límite de velocidad?',
        ['Autobahn', 'Freeway', 'Autoroute', 'Panamericana'],
        'En esos tramos hay una velocidad recomendada de 130 km/h.',
      ),
      q(
        '¿Quién creó en Europa la imprenta de tipos móviles?',
        ['Johannes Gutenberg', 'Karl Benz', 'Robert Bosch', 'Werner von Siemens'],
        'La Biblia de Gutenberg, de hacia 1455, fue uno de los primeros libros impresos así.',
      ),
      q(
        '¿Qué tradición navideña de origen alemán se volvió popular en todo el mundo?',
        ['El árbol de Navidad', 'Los Reyes Magos', 'El pesebre', 'El roscón de Reyes'],
        'En diciembre, los mercados navideños llenan las plazas alemanas.',
      ),
    ],
  },
  GB: {
    mapId: '826',
    timeZone: 'Europe/London',
    questions: [
      q(
        '¿Cuál es la capital del Reino Unido?',
        ['Londres', 'Mánchester', 'Edimburgo', 'Liverpool'],
        'Londres fue fundada por los romanos con el nombre de Londinium.',
      ),
      q(
        '¿De qué ciudad eran The Beatles?',
        ['Liverpool', 'Londres', 'Mánchester', 'Birmingham'],
        'En sus comienzos tocaron cientos de veces en The Cavern Club, en Liverpool.',
      ),
      q(
        '¿Cómo se llama la gran campana de la torre del Parlamento de Londres?',
        ['Big Ben', 'London Eye', 'Tower Bridge', 'Piccadilly'],
        'En rigor, Big Ben es el nombre de la campana y no de la torre.',
      ),
      q(
        "¿Quién escribió 'Romeo y Julieta'?",
        ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Oscar Wilde'],
        'Shakespeare nació en Stratford-upon-Avon en 1564.',
      ),
      q(
        '¿Qué naciones forman el Reino Unido?',
        [
          'Inglaterra, Escocia, Gales e Irlanda del Norte',
          'Inglaterra, Escocia, Gales e Irlanda',
          'Inglaterra, Gales e Islandia',
          'Inglaterra y Escocia',
        ],
        'Cada una tiene su propia selección de fútbol.',
      ),
      q(
        '¿Cuál es la moneda del Reino Unido?',
        ['Libra esterlina', 'Euro', 'Dólar', 'Corona'],
        'Se la considera la moneda más antigua en uso continuo del mundo.',
      ),
      q(
        '¿Qué bebida caliente es un ritual de la tarde en el Reino Unido?',
        ['Té', 'Café', 'Mate', 'Chocolate'],
        'La costumbre del té de la tarde se atribuye a la duquesa Anna de Bedford, en el siglo XIX.',
      ),
      q(
        '¿Qué círculo de piedras prehistórico está en Inglaterra?',
        ['Stonehenge', 'Carnac', 'Newgrange', 'Göbekli Tepe'],
        'Sus grandes piedras se levantaron hace unos 4.500 años.',
      ),
      q(
        '¿Qué plato de pescado frito con papas es típico del Reino Unido?',
        ['Fish and chips', 'Paella', 'Ceviche', 'Schnitzel'],
        'Tradicionalmente se vendía envuelto en papel.',
      ),
      q(
        '¿Qué escritora británica creó a Harry Potter?',
        ['J. K. Rowling', 'Agatha Christie', 'Jane Austen', 'Virginia Woolf'],
        'Escribió parte del primer libro en cafés de Edimburgo.',
      ),
      q(
        '¿Qué río atraviesa Londres?',
        ['Támesis', 'Sena', 'Rin', 'Danubio'],
        'Sobre el Támesis está el famoso Tower Bridge.',
      ),
      q(
        '¿Por qué lado de la calle se maneja en el Reino Unido?',
        ['Por la izquierda', 'Por la derecha', 'Por el centro', 'Depende de la ciudad'],
        'También se maneja por la izquierda en Irlanda, Australia y Japón.',
      ),
    ],
  },
  US: {
    mapId: '840',
    timeZone: 'America/New_York',
    questions: [
      q(
        '¿Cuál es la capital de Estados Unidos?',
        ['Washington D. C.', 'Nueva York', 'Los Ángeles', 'Chicago'],
        'Washington D. C. no pertenece a ningún estado.',
      ),
      q(
        '¿Cuántos estados tiene Estados Unidos?',
        ['50', '48', '51', '52'],
        'Los últimos en sumarse fueron Alaska y Hawái, en 1959.',
      ),
      q(
        '¿Qué día se celebra la independencia de Estados Unidos?',
        ['4 de julio', '14 de julio', '9 de julio', '25 de diciembre'],
        'Recuerda la Declaración de Independencia de 1776.',
      ),
      q(
        '¿En qué ciudad está la Estatua de la Libertad?',
        ['Nueva York', 'Boston', 'Filadelfia', 'Washington D. C.'],
        'Fue un regalo de Francia y se inauguró en 1886.',
      ),
      q(
        '¿En qué estado está el Gran Cañón del Colorado?',
        ['Arizona', 'Texas', 'Florida', 'Alaska'],
        'El río Colorado tardó millones de años en tallarlo.',
      ),
      q(
        '¿Qué fiesta de noviembre se celebra con una cena de pavo?',
        ['Acción de Gracias', 'Halloween', 'Pascua', 'Día de la Independencia'],
        'Se celebra el cuarto jueves de noviembre.',
      ),
      q(
        '¿Cuál es el idioma más hablado en Estados Unidos después del inglés?',
        ['Español', 'Chino', 'Francés', 'Alemán'],
        'Más de 40 millones de personas hablan español en su casa.',
      ),
      q(
        '¿En qué ciudad está Hollywood?',
        ['Los Ángeles', 'Nueva York', 'Chicago', 'Miami'],
        "El famoso cartel decía originalmente 'Hollywoodland'.",
      ),
      q(
        '¿Cuál fue el primer parque nacional del mundo?',
        ['Yellowstone', 'Yosemite', 'Gran Cañón', 'Everglades'],
        'Yellowstone se creó en 1872.',
      ),
      q(
        '¿Qué deporte se juega en el Super Bowl?',
        ['Fútbol americano', 'Béisbol', 'Básquet', 'Hockey'],
        'Es uno de los eventos más vistos de la televisión estadounidense.',
      ),
      q(
        '¿Cuál es el estado más grande por superficie?',
        ['Alaska', 'Texas', 'California', 'Montana'],
        'Alaska es más del doble de grande que Texas.',
      ),
      q(
        "¿Qué ciudad es conocida como 'la Gran Manzana'?",
        ['Nueva York', 'Chicago', 'Boston', 'San Francisco'],
        'El apodo se hizo popular en los años 70 con una campaña de turismo.',
      ),
    ],
  },
  CA: {
    mapId: '124',
    timeZone: 'America/Toronto',
    questions: [
      q(
        '¿Cuál es la capital de Canadá?',
        ['Ottawa', 'Toronto', 'Montreal', 'Vancouver'],
        'La reina Victoria la eligió como capital en 1857.',
      ),
      q(
        '¿Qué hoja aparece en la bandera de Canadá?',
        ['Arce', 'Roble', 'Olmo', 'Pino'],
        'La bandera con la hoja de arce se adoptó recién en 1965.',
      ),
      q(
        '¿Cuáles son los idiomas oficiales de Canadá?',
        ['Inglés y francés', 'Inglés y español', 'Francés e italiano', 'Solo inglés'],
        'En la provincia de Quebec el francés es el idioma principal.',
      ),
      q(
        '¿Qué jarabe dulce es típico de Canadá?',
        ['Jarabe de arce', 'Dulce de leche', 'Melaza de caña', 'Jarabe de agave'],
        'Canadá produce la mayor parte del jarabe de arce del mundo.',
      ),
      q(
        '¿Cuál es el deporte sobre hielo más popular de Canadá?',
        ['Hockey sobre hielo', 'Polo', 'Esquí acuático', 'Bobsleigh'],
        'Por ley, el hockey sobre hielo es el deporte nacional de invierno.',
      ),
      q(
        '¿Qué cataratas comparten Canadá y Estados Unidos?',
        ['Cataratas del Niágara', 'Cataratas del Iguazú', 'Cataratas Victoria', 'Salto Ángel'],
        'Del lado canadiense están las cataratas Herradura, las más grandes del conjunto.',
      ),
      q(
        '¿Cuál es la ciudad más poblada de Canadá?',
        ['Toronto', 'Montreal', 'Vancouver', 'Ottawa'],
        'Toronto es una de las ciudades más multiculturales del mundo.',
      ),
      q(
        '¿Cómo se apoda a la Real Policía Montada de Canadá?',
        ['Mounties', 'Bobbies', 'Carabineros', 'Rangers'],
        'Su uniforme de gala es la famosa casaca roja.',
      ),
      q(
        '¿Qué océanos tocan las costas de Canadá?',
        ['Atlántico, Pacífico y Ártico', 'Solo el Atlántico', 'Pacífico e Índico', 'Atlántico e Índico'],
        'Canadá tiene la costa más larga del mundo.',
      ),
      q(
        '¿Cuál es la ciudad francófona más grande de Canadá?',
        ['Montreal', 'Toronto', 'Calgary', 'Halifax'],
        'Montreal es la segunda ciudad más poblada del país.',
      ),
      q(
        '¿Qué plato de Quebec lleva papas fritas, queso en grano y salsa gravy?',
        ['Poutine', 'Nachos', 'Hash browns', 'Tartiflette'],
        'La poutine nació en zonas rurales de Quebec en los años 50.',
      ),
      q(
        '¿Qué día es el Día de Canadá?',
        ['1 de julio', '4 de julio', '14 de julio', '24 de mayo'],
        'Recuerda la creación de la Confederación canadiense, en 1867.',
      ),
    ],
  },
  AU: {
    mapId: '036',
    timeZone: 'Australia/Sydney',
    questions: [
      q(
        '¿Cuál es la capital de Australia?',
        ['Canberra', 'Sídney', 'Melbourne', 'Perth'],
        'Canberra se eligió para resolver la rivalidad entre Sídney y Melbourne.',
      ),
      q(
        '¿Qué animal australiano salta y lleva a su cría en una bolsa?',
        ['Canguro', 'Llama', 'Ciervo', 'Puma'],
        'El canguro aparece en el escudo de Australia junto al emú.',
      ),
      q(
        '¿Cómo se llama el sistema de arrecifes de coral más grande del mundo, en Australia?',
        ['Gran Barrera de Coral', 'Arrecife Mesoamericano', 'Arrecife de Belice', 'Mar de los Sargazos'],
        'Mide más de 2.000 km y es Patrimonio Mundial desde 1981.',
      ),
      q(
        '¿En qué ciudad está la famosa Ópera junto al puerto?',
        ['Sídney', 'Melbourne', 'Brisbane', 'Adelaida'],
        'La diseñó el arquitecto danés Jørn Utzon.',
      ),
      q(
        '¿En qué estación del año cae Navidad en Australia?',
        ['Verano', 'Invierno', 'Otoño', 'Primavera'],
        'Muchas familias festejan Navidad con comida al aire libre o en la playa.',
      ),
      q(
        '¿Cómo se llama la gran roca roja sagrada del centro de Australia?',
        ['Uluru', 'Aconcagua', 'Kilimanjaro', 'Monte Fuji'],
        'Es un lugar sagrado para el pueblo anangu; desde 2019 está prohibido escalarla.',
      ),
      q(
        '¿Qué animal australiano come hojas de eucalipto y duerme gran parte del día?',
        ['Koala', 'Canguro', 'Emú', 'Dingo'],
        'Un koala puede dormir hasta 20 horas por día.',
      ),
      q(
        '¿Qué instrumento de viento aborigen es un largo tubo de madera?',
        ['Didgeridoo', 'Quena', 'Gaita', 'Bandoneón'],
        'Es uno de los instrumentos más antiguos que se siguen tocando.',
      ),
      q(
        '¿Cuántos estados tiene Australia?',
        ['6', '4', '8', '10'],
        'Además de los estados hay territorios, como el de la capital, donde está Canberra.',
      ),
      q(
        '¿Qué famosa playa de surf está en Sídney?',
        ['Bondi', 'Copacabana', 'Malibú', 'Waikiki'],
        'Bondi es una de las playas más conocidas del mundo.',
      ),
      q(
        '¿Qué ave grande que no vuela es típica de Australia?',
        ['Emú', 'Ñandú', 'Avestruz', 'Cóndor'],
        'El emú es el ave más grande de Australia y puede correr a casi 50 km/h.',
      ),
      q(
        '¿Cuál es la moneda de Australia?',
        ['Dólar australiano', 'Libra esterlina', 'Euro', 'Peso'],
        'Australia fue uno de los primeros países en usar billetes de polímero, en 1988.',
      ),
    ],
  },
  IE: {
    mapId: '372',
    timeZone: 'Europe/Dublin',
    questions: [
      q(
        '¿Cuál es la capital de Irlanda?',
        ['Dublín', 'Cork', 'Galway', 'Belfast'],
        'Dublín nació como un asentamiento vikingo en el siglo IX. Belfast es la capital de Irlanda del Norte, que es parte del Reino Unido.',
      ),
      q(
        '¿Qué santo patrono de Irlanda se celebra cada 17 de marzo?',
        ['San Patricio', 'San Jorge', 'San Andrés', 'San Columba'],
        'Según la tradición, San Patricio usaba el trébol de tres hojas para explicar la Santísima Trinidad.',
      ),
      q(
        '¿Qué instrumento musical es el símbolo oficial de Irlanda?',
        ['El arpa', 'La gaita', 'El violín', 'La flauta'],
        'Irlanda es de los pocos países cuyo emblema es un instrumento: el arpa aparece en sus monedas de euro.',
      ),
      q(
        '¿Qué idioma, además del inglés, es oficial en Irlanda?',
        ['Irlandés (gaélico)', 'Galés', 'Escocés', 'Bretón'],
        'Las zonas donde el irlandés se habla a diario se llaman Gaeltacht, y están sobre todo en la costa oeste.',
      ),
      q(
        '¿Qué cerveza negra nació en Dublín en 1759?',
        ['Guinness', 'Heineken', 'Corona', 'Stella Artois'],
        "Arthur Guinness firmó el arrendamiento de la fábrica de St. James's Gate por 9.000 años.",
      ),
      q(
        "¿Qué escritor irlandés escribió 'Ulises'?",
        ['James Joyce', 'Oscar Wilde', 'Samuel Beckett', 'Bram Stoker'],
        'La novela transcurre en un solo día en Dublín, el 16 de junio de 1904, que hoy se festeja como Bloomsday.',
      ),
      q(
        '¿Qué crisis del siglo XIX hizo emigrar a más de un millón de irlandeses?',
        ['La Gran Hambruna de la papa', 'La fiebre del oro', 'La Primera Guerra Mundial', 'La peste negra'],
        'Entre 1845 y 1852 la isla perdió cerca de una cuarta parte de su población, entre muertes y emigración.',
      ),
      q(
        '¿Qué acantilados famosos están en la costa oeste de Irlanda?',
        ['Acantilados de Moher', 'Acantilados de Dover', 'Acantilados de Los Gigantes', 'Acantilados de Étretat'],
        'En su punto más alto llegan a unos 214 metros sobre el océano Atlántico.',
      ),
      q(
        '¿Qué deporte tradicional irlandés se juega con un palo de madera llamado hurley?',
        ['Hurling', 'Críquet', 'Hockey sobre hielo', 'Lacrosse'],
        'Es uno de los deportes de campo más antiguos del mundo: se dice que tiene más de 3.000 años.',
      ),
      q(
        '¿Qué fiesta celta, que se celebraba en Irlanda, dio origen a Halloween?',
        ['Samhain', 'Beltane', 'Imbolc', 'Yule'],
        'Samhain marcaba el fin de la cosecha y el comienzo de la mitad oscura del año.',
      ),
    ],
  },
  NZ: {
    mapId: '554',
    timeZone: 'Pacific/Auckland',
    questions: [
      q(
        '¿Cuál es la capital de Nueva Zelanda?',
        ['Wellington', 'Auckland', 'Christchurch', 'Queenstown'],
        'Wellington es la capital de un país soberano más austral del mundo. Auckland es la ciudad más poblada.',
      ),
      q(
        '¿Cómo se llama el pueblo originario de Nueva Zelanda?',
        ['Maorí', 'Aborigen', 'Inuit', 'Guaraní'],
        'El te reo maorí es idioma oficial del país desde 1987.',
      ),
      q(
        '¿Qué ave que no vuela es el símbolo del país?',
        ['El kiwi', 'El emú', 'El pingüino', 'El avestruz'],
        "Por eso a los neozelandeses se les dice 'kiwis'.",
      ),
      q(
        '¿Qué danza ceremonial maorí hacen los All Blacks antes de cada partido?',
        ['Haka', 'Hula', 'Capoeira', 'Flamenco'],
        "El haka más conocido, 'Ka Mate', lo compuso el jefe maorí Te Rauparaha a principios del siglo XIX.",
      ),
      q(
        '¿Cuál es el deporte más popular de Nueva Zelanda?',
        ['Rugby', 'Fútbol', 'Béisbol', 'Básquet'],
        'Los All Blacks ganaron la Copa del Mundo de rugby tres veces: en 1987, 2011 y 2015.',
      ),
      q(
        '¿Qué trilogía de películas se filmó en los paisajes de Nueva Zelanda?',
        ['El Señor de los Anillos', 'Harry Potter', 'Star Wars', 'Matrix'],
        'El set de Hobbiton, en Matamata, quedó armado y hoy se puede visitar.',
      ),
      q(
        '¿Qué tratado de 1840 firmaron la Corona británica y jefes maoríes?',
        ['Tratado de Waitangi', 'Tratado de Versalles', 'Tratado de Tordesillas', 'Tratado de París'],
        'Se lo considera el documento fundacional del país; el 6 de febrero, día de su firma, es feriado nacional.',
      ),
      q(
        '¿En qué año Nueva Zelanda fue el primer país en dar el voto a las mujeres?',
        ['1893', '1920', '1945', '1810'],
        'Kate Sheppard encabezó la campaña; su cara aparece en el billete de 10 dólares.',
      ),
      q(
        '¿Qué neozelandés llegó a la cima del Everest en 1953?',
        ['Edmund Hillary', 'Ernest Rutherford', 'Peter Jackson', 'Russell Crowe'],
        'Lo hizo junto al sherpa Tenzing Norgay; la cara de Hillary aparece en el billete de 5 dólares.',
      ),
      q(
        '¿En qué isla vive la mayor parte de la población?',
        ['Isla Norte', 'Isla Sur', 'Isla Stewart', 'Isla Chatham'],
        'Aunque la Isla Sur es más grande, cerca de tres de cada cuatro personas viven en la Isla Norte.',
      ),
    ],
  },
  BO: {
    mapId: '068',
    timeZone: 'America/La_Paz',
    questions: [
      q(
        '¿Cuál es la capital constitucional de Bolivia?',
        ['Sucre', 'La Paz', 'Santa Cruz de la Sierra', 'Cochabamba'],
        'La Paz es la sede del gobierno: Bolivia tiene una capital constitucional y otra ciudad donde gobierna.',
      ),
      q(
        '¿Cuál es el salar más grande del mundo?',
        ['Salar de Uyuni', 'Salar de Atacama', 'Salinas Grandes', 'Salar de Coipasa'],
        'Ocupa más de 10.000 km² y, en época de lluvias, se convierte en un espejo gigante.',
      ),
      q(
        '¿Qué lago navegable, uno de los más altos del mundo, comparte Bolivia con Perú?',
        ['Titicaca', 'Poopó', 'Cocibolca', 'Maracaibo'],
        'Está a unos 3.800 metros sobre el nivel del mar.',
      ),
      q(
        '¿Qué cerro de Potosí fue la mayor mina de plata del mundo colonial?',
        ['Cerro Rico', 'Illimani', 'Sajama', 'Huayna Potosí'],
        "De ahí viene la expresión 'vale un Potosí' para algo muy valioso.",
      ),
      q(
        '¿Qué carnaval boliviano es Patrimonio de la Humanidad?',
        ['Carnaval de Oruro', 'Carnaval de Tarija', 'Carnaval de Sucre', 'Carnaval de Cobija'],
        'Su danza más famosa es la diablada, con máscaras enormes y trajes bordados.',
      ),
      q(
        '¿Qué empanada jugosa se come a media mañana en Bolivia?',
        ['Salteña', 'Arepa', 'Pupusa', 'Tamal'],
        'Su relleno es tan caldoso que comerla sin mancharse es todo un arte.',
      ),
      q(
        '¿Cómo se llama la red de teleféricos que une La Paz con El Alto?',
        ['Mi Teleférico', 'Metrocable', 'TransMiCable', 'Mukumbarí'],
        'Es la red de teleféricos urbanos más extensa del mundo y se usa como transporte público.',
      ),
      q(
        '¿Cuántos idiomas oficiales reconoce la Constitución de Bolivia?',
        ['37', '2', '5', '12'],
        'Además del castellano, reconoce 36 idiomas de pueblos indígenas, como el quechua, el aimara y el guaraní.',
      ),
      q(
        '¿Qué prócer le da nombre a Bolivia?',
        ['Simón Bolívar', 'José de San Martín', 'Antonio José de Sucre', "Bernardo O'Higgins"],
        'La ciudad de Sucre, a su vez, lleva el nombre del mariscal Antonio José de Sucre.',
      ),
      q(
        "¿Qué ruta de montaña cerca de La Paz es famosa entre ciclistas como el 'camino de la muerte'?",
        ['Camino a los Yungas', 'Ruta 40', 'Carretera Austral', 'Camino del Inca'],
        'Baja desde unos 4.650 metros hasta la selva de los Yungas en pocas horas.',
      ),
    ],
  },
  CR: {
    mapId: '188',
    timeZone: 'America/Costa_Rica',
    questions: [
      q(
        '¿Cuál es la capital de Costa Rica?',
        ['San José', 'Cartago', 'Limón', 'Alajuela'],
        'Cartago fue la capital hasta 1823, cuando se trasladó a San José.',
      ),
      q(
        '¿Qué expresión usan los costarricenses para saludar, agradecer y decir que todo está bien?',
        ['Pura vida', 'Qué chévere', 'Ahorita', 'De una'],
        'Es tan propia que se volvió una forma de presentar al país en el mundo.',
      ),
      q(
        '¿Qué abolió Costa Rica en 1948?',
        ['El ejército', 'Las elecciones', 'La moneda', 'Los impuestos'],
        'Lo abolió José Figueres Ferrer, y quedó fijado en la Constitución de 1949.',
      ),
      q(
        '¿Cómo se les dice a las personas de Costa Rica?',
        ['Ticos', 'Chapines', 'Catrachos', 'Guanacos'],
        "Viene de la costumbre de usar diminutivos terminados en '-tico', como 'chiquitico'.",
      ),
      q(
        '¿Qué plato de arroz y frijoles es el desayuno típico de Costa Rica?',
        ['Gallo pinto', 'Bandeja paisa', 'Pabellón criollo', 'Moros y cristianos'],
        'Nicaragua también lo reclama como propio: la discusión sobre quién lo inventó es eterna.',
      ),
      q(
        '¿Qué parte de la biodiversidad del mundo tiene Costa Rica, siendo un país chico?',
        ['Cerca del 5 %', 'Cerca del 30 %', 'Menos del 0,01 %', 'La mitad'],
        'Y eso que ocupa apenas el 0,03 % de la superficie del planeta.',
      ),
      q(
        '¿Qué volcán de forma cónica estuvo muy activo entre 1968 y 2010?',
        ['Arenal', 'Chimborazo', 'Popocatépetl', 'Cotopaxi'],
        'Hoy está en reposo y a sus pies hay aguas termales.',
      ),
      q(
        '¿Qué producto fue el motor de la economía costarricense en el siglo XIX?',
        ['El café', 'El petróleo', 'El cobre', 'La plata'],
        'Con las ganancias del café se construyó el Teatro Nacional, inaugurado en 1897.',
      ),
      q(
        '¿Qué animal fue declarado símbolo nacional de la fauna silvestre en 2021?',
        ['El perezoso', 'El cóndor', 'El canguro', 'El panda'],
        'En Costa Rica viven dos especies: el perezoso de dos dedos y el de tres dedos.',
      ),
      q(
        '¿Qué aguas bañan las costas de Costa Rica?',
        ['El Pacífico y el Caribe', 'Solo el Pacífico', 'Solo el Atlántico Sur', 'El Índico y el Pacífico'],
        'En su parte más angosta, entre una costa y la otra hay apenas unos 120 km.',
      ),
    ],
  },
  DO: {
    mapId: '214',
    timeZone: 'America/Santo_Domingo',
    questions: [
      q(
        '¿Cuál es la capital de República Dominicana?',
        ['Santo Domingo', 'Santiago de los Caballeros', 'Punta Cana', 'La Romana'],
        'En su Ciudad Colonial está la Catedral Primada, la primera catedral de América.',
      ),
      q(
        '¿Qué isla comparte República Dominicana con Haití?',
        ['La Española', 'Cuba', 'Jamaica', 'Puerto Rico'],
        'Cristóbal Colón llegó a la isla en su primer viaje, en 1492.',
      ),
      q(
        '¿Qué ritmo, considerado el baile nacional, se toca con acordeón, güira y tambora?',
        ['Merengue', 'Salsa', 'Tango', 'Cumbia'],
        'El merengue y la bachata son, los dos, Patrimonio Cultural Inmaterial de la UNESCO.',
      ),
      q(
        "¿Qué plato se conoce como 'la bandera dominicana'?",
        ['Arroz, habichuelas y carne', 'Arepas con queso', 'Ceviche', 'Pupusas'],
        'Se come al mediodía, en la comida fuerte del día.',
      ),
      q(
        '¿Qué deporte es pasión nacional en República Dominicana?',
        ['Béisbol', 'Fútbol', 'Rugby', 'Críquet'],
        'Después de Estados Unidos, es el país que más jugadores aporta a las Grandes Ligas.',
      ),
      q(
        '¿Cuál es la montaña más alta del Caribe?',
        ['Pico Duarte', 'Pico Turquino', 'Blue Mountain Peak', 'Monte Pelée'],
        'Mide unos 3.100 metros y está en la Cordillera Central dominicana.',
      ),
      q(
        '¿Qué piedra semipreciosa azul solo se encuentra en República Dominicana?',
        ['Larimar', 'Esmeralda', 'Ámbar', 'Turquesa'],
        'Es una variedad azul de pectolita que solo se extrae en la provincia de Barahona.',
      ),
      q(
        '¿En qué fecha celebra República Dominicana su independencia?',
        ['27 de febrero', '4 de julio', '9 de julio', '16 de septiembre'],
        'Ese día de 1844 se proclamó la independencia frente a Haití.',
      ),
      q(
        '¿Con qué se hace el mangú, el puré del desayuno dominicano?',
        ['Plátano verde', 'Yuca', 'Papa', 'Batata'],
        "Se sirve con cebolla roja, salami, huevo y queso frito: 'los tres golpes'.",
      ),
      q(
        '¿Cómo se le dice en República Dominicana al autobús?',
        ['Guagua', 'Colectivo', 'Micro', 'Camión'],
        'La palabra también se usa en Cuba, Puerto Rico y las Islas Canarias.',
      ),
    ],
  },
  EC: {
    mapId: '218',
    timeZone: 'America/Guayaquil',
    questions: [
      q(
        '¿Cuál es la capital de Ecuador?',
        ['Quito', 'Guayaquil', 'Cuenca', 'Manta'],
        'Quito y Cracovia fueron las primeras ciudades declaradas Patrimonio de la Humanidad, en 1978.',
      ),
      q(
        '¿Qué islas ecuatorianas inspiraron a Charles Darwin?',
        ['Islas Galápagos', 'Isla de Pascua', 'Islas Canarias', 'Islas Juan Fernández'],
        'Darwin las visitó en 1835 y lo que observó ahí lo ayudó a pensar la evolución.',
      ),
      q(
        '¿De dónde viene el nombre de Ecuador?',
        ['De la línea del ecuador', 'De un río', 'De un conquistador', 'De una palabra quechua'],
        'Cerca de Quito, el monumento Mitad del Mundo marca el paso de la línea.',
      ),
      q(
        '¿Qué moneda usa Ecuador desde el año 2000?',
        ['El dólar estadounidense', 'El sucre', 'El peso', 'El euro'],
        'Antes usaba el sucre, que llevaba el nombre del mariscal Antonio José de Sucre.',
      ),
      q(
        '¿Con qué nombre se conoce en el mundo el sombrero de paja toquilla tejido en Ecuador?',
        ["'Panamá'", "'Mexicano'", "'Cordobés'", "'Texano'"],
        'Se hizo famoso entre los trabajadores del Canal de Panamá; su tejido es Patrimonio Inmaterial de la UNESCO.',
      ),
      q(
        '¿Qué volcán ecuatoriano es el punto de la Tierra más alejado de su centro?',
        ['Chimborazo', 'Cotopaxi', 'Everest', 'Aconcagua'],
        'Por el abultamiento de la Tierra en el ecuador, su cima está más lejos del centro que la del Everest.',
      ),
      q(
        '¿De qué fruta Ecuador es el mayor exportador del mundo?',
        ['Banana', 'Manzana', 'Uva', 'Kiwi'],
        'La costa ecuatoriana tiene el clima ideal para las plantaciones de banana.',
      ),
      q(
        '¿Qué plato de mariscos se acompaña en Ecuador con canguil (pochoclo)?',
        ['Ceviche', 'Paella', 'Sushi', 'Locro'],
        'A diferencia del peruano, el ceviche ecuatoriano suele llevar más jugo y salsa de tomate.',
      ),
      q(
        '¿Qué región selvática ocupa casi la mitad del territorio de Ecuador?',
        ['La Amazonía', 'El Chaco', 'La Patagonia', 'El Darién'],
        'Ecuador tiene cuatro regiones: Costa, Sierra, Amazonía y Galápagos.',
      ),
      q(
        '¿Qué ciudad colonial del sur de Ecuador es famosa por las cúpulas azules de su catedral?',
        ['Cuenca', 'Cartagena', 'Antigua', 'Cusco'],
        'Su centro histórico es Patrimonio de la Humanidad desde 1999.',
      ),
    ],
  },
  SV: {
    mapId: '222',
    timeZone: 'America/El_Salvador',
    questions: [
      q(
        '¿Cuál es la capital de El Salvador?',
        ['San Salvador', 'Santa Ana', 'San Miguel', 'La Libertad'],
        'Está al pie del volcán de San Salvador, también llamado Quezaltepeque.',
      ),
      q(
        '¿Qué plato de masa de maíz rellena es el emblema de El Salvador?',
        ['Pupusa', 'Arepa', 'Salteña', 'Empanada'],
        'El segundo domingo de noviembre se celebra el Día Nacional de la Pupusa.',
      ),
      q(
        '¿Qué apodo le dio Gabriela Mistral a El Salvador?',
        ['El Pulgarcito de América', 'La Suiza de América', 'La Tierra del Fuego', 'El Gigante del Norte'],
        'Lo dijo por su tamaño: es el país más chico de la América continental.',
      ),
      q(
        '¿Qué arzobispo salvadoreño, asesinado en 1980, fue declarado santo?',
        ['Óscar Arnulfo Romero', 'Oscar Niemeyer', 'José Martí', 'Rubén Darío'],
        'Fue canonizado por el papa Francisco en 2018.',
      ),
      q(
        '¿Qué moneda se usa en El Salvador en la vida diaria?',
        ['El dólar estadounidense', 'El quetzal', 'El peso', 'La lempira'],
        'Hasta 2001 se usaba el colón, nombrado en honor a Cristóbal Colón.',
      ),
      q(
        "¿Qué sitio maya es llamado 'la Pompeya de América'?",
        ['Joya de Cerén', 'Tikal', 'Copán', 'Chichén Itzá'],
        'Una erupción volcánica lo cubrió de ceniza hacia el año 600 y conservó las casas de una aldea maya.',
      ),
      q(
        '¿Cómo se les dice cariñosamente a las personas de El Salvador?',
        ['Guanacos', 'Ticos', 'Chapines', 'Catrachos'],
        'Ticos son los costarricenses, chapines los guatemaltecos y catrachos los hondureños.',
      ),
      q(
        '¿Cuál es el lago más grande de El Salvador, en la caldera de un volcán?',
        ['Ilopango', 'Coatepeque', 'Atitlán', 'Titicaca'],
        'Se formó tras una enorme erupción ocurrida hace unos 1.500 años.',
      ),
      q(
        '¿Qué bebida caliente de maíz tierno es típica de El Salvador?',
        ['Atol de elote', 'Mate cocido', 'Tereré', 'Chicha morada'],
        'Se prepara con maíz tierno, leche y azúcar, y se toma bien caliente.',
      ),
      q(
        '¿En qué fecha celebra El Salvador su independencia?',
        ['15 de septiembre', '25 de mayo', '9 de julio', '20 de julio'],
        'Ese día de 1821 se independizaron también Guatemala, Honduras, Nicaragua y Costa Rica.',
      ),
    ],
  },
  GT: {
    mapId: '320',
    timeZone: 'America/Guatemala',
    questions: [
      q(
        '¿Cuál es la capital de Guatemala?',
        ['Ciudad de Guatemala', 'Antigua Guatemala', 'Quetzaltenango', 'Flores'],
        'Antigua fue la capital hasta que los terremotos de 1773 obligaron a trasladarla.',
      ),
      q(
        '¿Qué ave le da nombre a la moneda de Guatemala?',
        ['El quetzal', 'El cóndor', 'El colibrí', 'El tucán'],
        'El quetzal también aparece en el escudo, en el centro de la bandera.',
      ),
      q(
        '¿Qué gran ciudad maya está en la selva de Petén?',
        ['Tikal', 'Machu Picchu', 'Teotihuacán', 'Copán'],
        'Sus templos asoman por encima de la selva; el más alto llega a unos 70 metros.',
      ),
      q(
        '¿Qué lago guatemalteco está rodeado por tres volcanes?',
        ['Lago de Atitlán', 'Lago de Nicaragua', 'Lago Titicaca', 'Lago de Ilopango'],
        'Los volcanes que lo rodean son el Atitlán, el Tolimán y el San Pedro.',
      ),
      q(
        '¿Qué escritor guatemalteco ganó el Premio Nobel de Literatura en 1967?',
        ['Miguel Ángel Asturias', 'Gabriel García Márquez', 'Pablo Neruda', 'Octavio Paz'],
        "Su novela más conocida es 'El señor presidente'.",
      ),
      q(
        "¿Qué activista maya k'iche' ganó el Premio Nobel de la Paz en 1992?",
        ['Rigoberta Menchú', 'Frida Kahlo', 'Violeta Parra', 'Gabriela Mistral'],
        'Fue reconocida por su lucha por los derechos de los pueblos indígenas.',
      ),
      q(
        '¿Cómo se les dice a las personas de Guatemala?',
        ['Chapines', 'Ticos', 'Guanacos', 'Catrachos'],
        'El origen más citado es el chapín, un calzado que se usaba en la época colonial.',
      ),
      q(
        '¿Cuántos idiomas mayas se reconocen oficialmente en Guatemala?',
        ['22', '2', '5', '60'],
        'Además del español y los 22 idiomas mayas, se reconocen el garífuna y el xinka.',
      ),
      q(
        '¿Qué ciudad guatemalteca es famosa por sus alfombras de aserrín de colores en Semana Santa?',
        ['Antigua Guatemala', 'Sevilla', 'Cusco', 'Puebla'],
        'Las alfombras se arman durante la noche y se deshacen al paso de las procesiones.',
      ),
      q(
        '¿Qué volcán cercano a Antigua es uno de los más activos de Centroamérica?',
        ['Volcán de Fuego', 'Chimborazo', 'Popocatépetl', 'Osorno'],
        'Desde el vecino volcán Acatenango se lo puede ver lanzar lava de noche.',
      ),
    ],
  },
  HN: {
    mapId: '340',
    timeZone: 'America/Tegucigalpa',
    questions: [
      q(
        '¿Cuál es la capital de Honduras?',
        ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba', 'Comayagua'],
        'Comayagua fue la capital hasta 1880.',
      ),
      q(
        '¿Qué ciudad maya de Honduras es famosa por su escalinata jeroglífica?',
        ['Copán', 'Tikal', 'Palenque', 'Chichén Itzá'],
        'La escalinata tiene más de 2.000 glifos: es el texto maya más largo que se conoce.',
      ),
      q(
        '¿Cómo se les dice a las personas de Honduras?',
        ['Catrachos', 'Ticos', 'Chapines', 'Guanacos'],
        'El apodo viene del general Florencio Xatruch, que luchó contra el filibustero William Walker.',
      ),
      q(
        '¿Qué tortilla de harina doblada, con frijoles, queso y crema, es la comida callejera más típica?',
        ['Baleada', 'Pupusa', 'Arepa', 'Quesadilla'],
        "Se le pueden sumar huevo, aguacate o carne: así es una 'baleada con todo'.",
      ),
      q(
        '¿Qué islas del Caribe hondureño son famosas por el buceo?',
        ['Islas de la Bahía', 'Islas Galápagos', 'Islas del Rosario', 'Isla Margarita'],
        'Están sobre el Sistema Arrecifal Mesoamericano, la segunda barrera de coral más grande del mundo.',
      ),
      q(
        '¿Cómo se llama la moneda de Honduras?',
        ['Lempira', 'Quetzal', 'Córdoba', 'Colón'],
        'Lleva el nombre de un cacique lenca que resistió a los conquistadores españoles.',
      ),
      q(
        '¿Qué pueblo afrodescendiente vive en la costa caribeña de Honduras?',
        ['Garífuna', 'Mapuche', 'Guaraní', 'Aimara'],
        'Su lengua, su música y su danza son Patrimonio Inmaterial de la Humanidad.',
      ),
      q(
        "¿En qué departamento de Honduras se cuenta que cada año 'llueven peces'?",
        ['Yoro', 'Olancho', 'Cortés', 'Atlántida'],
        'La lluvia de peces de Yoro llega con las tormentas de la temporada de lluvias y es toda una tradición local.',
      ),
      q(
        "¿Qué región selvática del este de Honduras se conoce como la 'Amazonía de Centroamérica'?",
        ['La Mosquitia', 'El Darién', 'El Petén', 'Los Yungas'],
        'Ahí está la Reserva de la Biosfera del Río Plátano, Patrimonio de la Humanidad.',
      ),
      q(
        '¿Cuál es el lago natural más grande de Honduras?',
        ['Lago de Yojoa', 'Lago de Nicaragua', 'Lago de Atitlán', 'Lago de Güija'],
        'Es uno de los mejores lugares del país para ver aves: se registraron cientos de especies.',
      ),
    ],
  },
  NI: {
    mapId: '558',
    timeZone: 'America/Managua',
    questions: [
      q(
        '¿Cuál es la capital de Nicaragua?',
        ['Managua', 'León', 'Granada', 'Masaya'],
        'León y Granada se disputaban la capital; en 1852 se eligió Managua, que quedaba en el medio.',
      ),
      q(
        '¿Cuál es el lago más grande de Centroamérica?',
        ['Lago de Nicaragua (Cocibolca)', 'Lago de Atitlán', 'Lago Titicaca', 'Lago de Ilopango'],
        'Tiene tiburones que llegan desde el Caribe remontando el río San Juan.',
      ),
      q(
        '¿Qué poeta nicaragüense es considerado el padre del modernismo?',
        ['Rubén Darío', 'Pablo Neruda', 'Jorge Luis Borges', 'Octavio Paz'],
        "Su libro 'Azul...' (1888) renovó la poesía en español.",
      ),
      q(
        '¿Cómo se les dice a las personas de Nicaragua?',
        ['Nicas', 'Ticos', 'Catrachos', 'Chapines'],
        'En Costa Rica vive una de las comunidades nicaragüenses más grandes fuera del país.',
      ),
      q(
        '¿Qué tamal grande, envuelto en hoja de plátano, se come los fines de semana en Nicaragua?',
        ['Nacatamal', 'Pupusa', 'Salteña', 'Arepa'],
        'Lleva masa de maíz, cerdo, arroz, papa y chile, y se cocina durante horas.',
      ),
      q(
        '¿Qué isla, formada por dos volcanes, está en medio del lago Cocibolca?',
        ['Ometepe', 'Roatán', 'Isla de Pascua', 'Isla del Coco'],
        'Sus volcanes son el Concepción y el Maderas.',
      ),
      q(
        '¿Cómo se llama la moneda de Nicaragua?',
        ['Córdoba', 'Lempira', 'Quetzal', 'Colón'],
        'Lleva el nombre de Francisco Hernández de Córdoba, fundador de Granada y León.',
      ),
      q(
        '¿Qué volcán cercano a Managua deja ver lava en su cráter?',
        ['Masaya', 'Fuego', 'Arenal', 'Cotopaxi'],
        "Los españoles lo llamaron 'la boca del infierno'.",
      ),
      q(
        '¿Qué ciudad colonial a orillas del lago Cocibolca es una de las más antiguas de América?',
        ['Granada', 'Cartagena', 'Antigua', 'Quito'],
        'Fue fundada en 1524 por Francisco Hernández de Córdoba.',
      ),
      q(
        '¿Cuál es el deporte más popular de Nicaragua?',
        ['Béisbol', 'Fútbol americano', 'Rugby', 'Hockey'],
        "Dennis Martínez, 'El Presidente', fue el primer nicaragüense en las Grandes Ligas y lanzó un juego perfecto en 1991.",
      ),
    ],
  },
  PA: {
    mapId: '591',
    timeZone: 'America/Panama',
    questions: [
      q(
        '¿Cuál es la capital de Panamá?',
        ['Ciudad de Panamá', 'Colón', 'David', 'Bocas del Toro'],
        'Panamá Viejo, fundada en 1519, fue la primera ciudad europea en la costa del Pacífico de América.',
      ),
      q(
        '¿Qué océanos une el Canal de Panamá?',
        ['Atlántico y Pacífico', 'Pacífico e Índico', 'Atlántico e Índico', 'Ártico y Atlántico'],
        'Se inauguró en 1914 y en 1999 pasó a manos de Panamá.',
      ),
      q(
        '¿De qué país se separó Panamá en 1903?',
        ['Colombia', 'España', 'Costa Rica', 'México'],
        'Tras independizarse de España en 1821, se había unido a la Gran Colombia.',
      ),
      q(
        '¿Qué moneda usa Panamá junto con el dólar estadounidense?',
        ['Balboa', 'Colón', 'Córdoba', 'Lempira'],
        'Lleva el nombre de Vasco Núñez de Balboa, el primer europeo en ver el Pacífico desde América.',
      ),
      q(
        '¿Qué pueblo indígena vive en el archipiélago de Guna Yala (San Blas)?',
        ['Guna', 'Maya', 'Quechua', 'Mapuche'],
        'Las mujeres gunas cosen las molas, telas hechas con capas de colores.',
      ),
      q(
        '¿Qué región selvática, sin carreteras, separa Panamá de Colombia?',
        ['El Darién', 'La Mosquitia', 'El Petén', 'El Chaco'],
        'Es el único tramo sin terminar de la Carretera Panamericana entre Alaska y la Patagonia.',
      ),
      q(
        '¿Cómo se llama el vestido típico de las mujeres panameñas?',
        ['La pollera', 'El huipil', 'El sari', 'El kimono'],
        'Una pollera de gala puede llevar meses de trabajo hecho a mano.',
      ),
      q(
        "¿Qué cantante panameño de salsa compuso 'Pedro Navaja'?",
        ['Rubén Blades', 'Marc Anthony', 'Héctor Lavoe', 'Celia Cruz'],
        'Además de músico, estudió Derecho en Harvard y fue ministro de Turismo de Panamá.',
      ),
      q(
        '¿Qué sopa de gallina con ñame es el plato nacional de Panamá?',
        ['Sancocho', 'Ajiaco', 'Locro', 'Pozole'],
        'El sancocho panameño se perfuma con culantro.',
      ),
      q(
        '¿Qué puente, inaugurado en 1962, cruza el Canal de Panamá?',
        ['Puente de las Américas', 'Golden Gate', 'Puente de Brooklyn', 'Puente Vasco da Gama'],
        'Fue el único puente fijo sobre el canal hasta 2004.',
      ),
    ],
  },
  PY: {
    mapId: '600',
    timeZone: 'America/Asuncion',
    questions: [
      q(
        '¿Cuál es la capital de Paraguay?',
        ['Asunción', 'Ciudad del Este', 'Encarnación', 'Concepción'],
        "Se la llama 'madre de ciudades': de ahí partieron expediciones que fundaron otras, como Buenos Aires en 1580.",
      ),
      q(
        '¿Cuáles son los idiomas oficiales de Paraguay?',
        ['Español y guaraní', 'Español y portugués', 'Solo español', 'Español y quechua'],
        'La mayoría de la población habla guaraní, también en las ciudades.',
      ),
      q(
        '¿Qué infusión fría con yerba mate es Patrimonio de la Humanidad?',
        ['Tereré', 'Mate cocido', 'Chicha', 'Café'],
        'Se prepara con agua helada y yuyos; la UNESCO la reconoció en 2020.',
      ),
      q(
        '¿Qué gran represa comparten Paraguay y Brasil?',
        ['Itaipú', 'Yacyretá', 'Hoover', 'Tres Gargantas'],
        'Es una de las centrales hidroeléctricas que más energía producen en el mundo. Yacyretá la comparte con Argentina.',
      ),
      q(
        '¿Qué panecito de almidón de mandioca y queso es típico de Paraguay?',
        ['Chipa', 'Medialuna', 'Arepa', 'Salteña'],
        'En Semana Santa se hornea chipa en cantidades enormes.',
      ),
      q(
        "¿Qué plato típico se llama 'sopa' aunque es sólido?",
        ['Sopa paraguaya', 'Locro', 'Puchero', 'Ajiaco'],
        'Es un pan de maíz con queso y cebolla: según la leyenda, nació de un error de cocina.',
      ),
      q(
        '¿Cómo se llama la moneda de Paraguay?',
        ['Guaraní', 'Peso', 'Real', 'Boliviano'],
        'Lleva el nombre del pueblo y el idioma guaraní.',
      ),
      q(
        "¿Qué encaje, cuyo nombre significa 'telaraña' en guaraní, es típico de Paraguay?",
        ['Ñandutí', 'Mola', 'Huipil', 'Poncho'],
        'Se teje sobre todo en Itauguá, cerca de Asunción.',
      ),
      q(
        '¿Qué tiene en común Paraguay con Bolivia?',
        ['No tienen salida al mar', 'Tienen el mismo único idioma oficial', 'Usan la misma moneda', 'Son islas'],
        'Igual, por los ríos Paraná y Paraguay, tiene una de las flotas de barcazas más grandes del mundo.',
      ),
      q(
        '¿Qué región semiárida ocupa más de la mitad de Paraguay, pero tiene muy poca población?',
        ['El Chaco', 'La Patagonia', 'La Puna', 'El Darién'],
        'El Chaco es más del 60 % del territorio y vive ahí menos del 3 % de la población.',
      ),
    ],
  },
  PR: {
    mapId: '630',
    timeZone: 'America/Puerto_Rico',
    questions: [
      q(
        '¿Cuál es la capital de Puerto Rico?',
        ['San Juan', 'Ponce', 'Mayagüez', 'Bayamón'],
        'En el Viejo San Juan está el castillo de San Felipe del Morro, del siglo XVI.',
      ),
      q(
        '¿Qué es Puerto Rico respecto de Estados Unidos?',
        [
          'Un territorio (Estado Libre Asociado)',
          'Uno de sus 50 estados',
          'Un país independiente',
          'Una provincia de España',
        ],
        'Los puertorriqueños tienen ciudadanía estadounidense desde 1917.',
      ),
      q(
        '¿Qué género musical popularizaron artistas puertorriqueños como Daddy Yankee?',
        ['Reguetón', 'Tango', 'Cumbia', 'Bossa nova'],
        "'Gasolina', de 2004, fue uno de los primeros grandes éxitos mundiales del género.",
      ),
      q(
        '¿Qué ranita, cuyo canto se escucha de noche, es el símbolo de la isla?',
        ['El coquí', 'El ajolote', 'La iguana', 'El quetzal'],
        "Su nombre imita su canto: 'co-quí'.",
      ),
      q(
        '¿Qué plato de plátano verde frito y majado con ajo es típico de Puerto Rico?',
        ['Mofongo', 'Pupusa', 'Arepa', 'Salteña'],
        'Se prepara en un pilón de madera y se suele rellenar con carne o mariscos.',
      ),
      q(
        '¿Qué bosque de Puerto Rico es el único bosque tropical lluvioso del sistema forestal de Estados Unidos?',
        ['El Yunque', 'Monteverde', 'El Darién', 'La Mosquitia'],
        'Llueve tanto que algunas zonas reciben más de 5.000 mm al año.',
      ),
      q(
        '¿Cómo se llamaba la isla en la lengua de los taínos?',
        ['Borinquen', 'Quisqueya', 'Xaymaca', 'Anáhuac'],
        'Por eso los puertorriqueños también se dicen boricuas.',
      ),
      q(
        '¿Qué tiene de especial la bahía Mosquito, en la isla de Vieques?',
        ['Brilla de noche por unos microorganismos', 'Es de agua dulce', 'Se congela en invierno', 'Tiene arena negra'],
        'Fue reconocida como la bahía bioluminiscente más brillante del mundo.',
      ),
      q(
        '¿Qué bebida navideña con coco y ron es típica de Puerto Rico?',
        ['Coquito', 'Ponche crema', 'Rompope', 'Chicha'],
        'Cada familia tiene su receta y en diciembre se regala en botellas.',
      ),
      q(
        '¿Qué beisbolista puertorriqueño fue el primer latinoamericano en el Salón de la Fama?',
        ['Roberto Clemente', 'Pelé', 'Diego Maradona', 'Michael Jordan'],
        'Murió en 1972 en un avión que llevaba ayuda a Nicaragua después de un terremoto.',
      ),
    ],
  },
}

// Si el país de una persona todavía no tiene preguntas, su rival responde de cultura general.
export const GENERAL = [
  q(
    '¿Cuál es el océano más grande del mundo?',
    ['Pacífico', 'Atlántico', 'Índico', 'Ártico'],
    'El Pacífico ocupa casi un tercio de la superficie de la Tierra.',
  ),
  q(
    '¿Cuál es la montaña más alta del mundo?',
    ['Everest', 'Aconcagua', 'Kilimanjaro', 'Mont Blanc'],
    'El Everest mide unos 8.849 metros.',
  ),
  q(
    '¿En qué continente está Egipto?',
    ['África', 'Asia', 'Europa', 'Oceanía'],
    'Una pequeña parte, la península del Sinaí, está en Asia.',
  ),
  q(
    '¿Cuál es la capital de Japón?',
    ['Tokio', 'Kioto', 'Osaka', 'Seúl'],
    'Tokio fue sede de los Juegos Olímpicos en 1964 y en 2021.',
  ),
  q(
    '¿Cuál es el desierto cálido más grande del mundo?',
    ['Sahara', 'Atacama', 'Gobi', 'Kalahari'],
    'El Sahara es casi tan grande como Estados Unidos.',
  ),
  q(
    '¿Qué línea imaginaria divide la Tierra en hemisferio norte y sur?',
    ['El ecuador', 'El trópico de Cáncer', 'El meridiano de Greenwich', 'El círculo polar'],
    'Un país sudamericano lleva su nombre porque esa línea lo atraviesa.',
  ),
  q(
    '¿Cuál es el país más grande del mundo por superficie?',
    ['Rusia', 'Canadá', 'China', 'Brasil'],
    'Rusia tiene 11 husos horarios.',
  ),
  q(
    '¿Cuál es el río más caudaloso del mundo?',
    ['Amazonas', 'Nilo', 'Misisipi', 'Danubio'],
    'El Amazonas lleva más agua que los siete ríos que le siguen juntos.',
  ),
]

export function hasTrivia(code) {
  return Boolean(TRIVIA[code])
}

/** Preguntas sobre el país (o de cultura general si todavía no hay). */
export function triviaFor(code) {
  return TRIVIA[code]?.questions ?? GENERAL
}

/** Países donde está abierto el modo Online, en orden alfabético. */
export const ONLINE_COUNTRIES = Object.keys(TRIVIA).sort((a, b) => countryName(a).localeCompare(countryName(b), 'es'))

export function isOnlineCountry(code) {
  return hasTrivia(code)
}
