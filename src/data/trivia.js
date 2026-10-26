// Preguntas de cultura general del modo online, por país donde vive cada persona.
// Clave: código ISO alfa-2 (el mismo del perfil). `mapId`: código numérico del mapa,
// para dibujar la silueta del país.
// Cada pregunta: texto, opciones (la primera es la correcta; el orden se mezcla al armar
// el duelo) y un dato curioso que se muestra después de responder.

function q(text, options, fact) {
  return { text, options, fact }
}

export const TRIVIA = {
  AR: {
    mapId: '032',
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
