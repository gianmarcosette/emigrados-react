// Preguntas de cultura general del modo online, por país donde vive cada persona.
// Clave: código ISO alfa-2 (el mismo del perfil). `mapId`: código numérico del mapa,
// para dibujar la silueta del país. En cada pregunta la primera opción es la correcta;
// el orden se mezcla al armar el duelo.

function q(text, correct, ...wrong) {
  return { text, options: [correct, ...wrong] }
}

export const TRIVIA = {
  AR: {
    mapId: '032',
    questions: [
      q('¿Cuál es la capital de Argentina?', 'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'),
      q('¿Qué baile nació en el Río de la Plata a fines del siglo XIX?', 'Tango', 'Cumbia', 'Salsa', 'Samba'),
      q(
        '¿Cuál es la montaña más alta de América, en la provincia de Mendoza?',
        'Aconcagua',
        'Fitz Roy',
        'Lanín',
        'Tupungato',
      ),
      q('¿Qué infusión se comparte con bombilla?', 'Mate', 'Café', 'Té chai', 'Submarino'),
      q(
        '¿Cómo se llaman las cataratas de la frontera con Brasil?',
        'Cataratas del Iguazú',
        'Cataratas del Niágara',
        'Salto Ángel',
        'Cataratas Victoria',
      ),
      q(
        '¿Qué escritor argentino escribió "Rayuela"?',
        'Julio Cortázar',
        'Jorge Luis Borges',
        'Ernesto Sabato',
        'Adolfo Bioy Casares',
      ),
    ],
  },
  UY: {
    mapId: '858',
    questions: [
      q('¿Cuál es la capital de Uruguay?', 'Montevideo', 'Punta del Este', 'Salto', 'Colonia del Sacramento'),
      q('¿Qué país ganó el primer Mundial de fútbol, en 1930?', 'Uruguay', 'Argentina', 'Brasil', 'Italia'),
      q('¿Qué ritmo de tambores es patrimonio cultural de Uruguay?', 'Candombe', 'Cumbia', 'Bossa nova', 'Joropo'),
      q(
        '¿Qué río marca la frontera oeste de Uruguay con Argentina?',
        'Río Uruguay',
        'Río Amazonas',
        'Río Orinoco',
        'Río Magdalena',
      ),
      q(
        '¿Qué ciudad uruguaya, fundada por portugueses, tiene un barrio histórico declarado patrimonio por la UNESCO?',
        'Colonia del Sacramento',
        'Paysandú',
        'Rivera',
        'Maldonado',
      ),
      q('¿Cómo se llama el sándwich de carne típico de Uruguay?', 'Chivito', 'Choripán', 'Bauru', 'Barros Luco'),
    ],
  },
  CL: {
    mapId: '152',
    questions: [
      q('¿Cuál es la capital de Chile?', 'Santiago', 'Valparaíso', 'Concepción', 'Antofagasta'),
      q('¿Qué desierto chileno es uno de los más áridos del mundo?', 'Atacama', 'Sahara', 'Gobi', 'Sonora'),
      q('¿En qué isla chilena están los moáis?', 'Isla de Pascua', 'Chiloé', 'Juan Fernández', 'Isla Navarino'),
      q(
        '¿Qué poeta chileno ganó el Premio Nobel de Literatura en 1971?',
        'Pablo Neruda',
        'Vicente Huidobro',
        'Nicanor Parra',
        'Gonzalo Rojas',
      ),
      q('¿Cuál es el baile nacional de Chile?', 'Cueca', 'Tango', 'Merengue', 'Zamba'),
      q('¿Qué cordillera recorre Chile de norte a sur?', 'Los Andes', 'Los Alpes', 'El Himalaya', 'Los Urales'),
    ],
  },
  CO: {
    mapId: '170',
    questions: [
      q('¿Cuál es la capital de Colombia?', 'Bogotá', 'Medellín', 'Cali', 'Cartagena'),
      q(
        '¿Qué escritor colombiano escribió "Cien años de soledad"?',
        'Gabriel García Márquez',
        'Mario Vargas Llosa',
        'Álvaro Mutis',
        'Jorge Isaacs',
      ),
      q(
        '¿Qué producto colombiano es famoso en todo el mundo por su calidad?',
        'El café',
        'El té',
        'La vainilla',
        'El trigo',
      ),
      q('¿Qué ritmo de la costa caribe colombiana se toca con acordeón?', 'Vallenato', 'Tango', 'Flamenco', 'Bachata'),
      q('¿En qué ciudad colombiana se celebra la Feria de las Flores?', 'Medellín', 'Bogotá', 'Barranquilla', 'Pasto'),
      q(
        '¿Qué océanos bañan las costas de Colombia?',
        'Pacífico y Atlántico (mar Caribe)',
        'Pacífico e Índico',
        'Atlántico e Índico',
        'Ártico y Pacífico',
      ),
    ],
  },
  VE: {
    mapId: '862',
    questions: [
      q('¿Cuál es la capital de Venezuela?', 'Caracas', 'Maracaibo', 'Valencia', 'Mérida'),
      q(
        '¿Cuál es la cascada más alta del mundo, en Venezuela?',
        'Salto Ángel',
        'Cataratas del Iguazú',
        'Cataratas del Niágara',
        'Cataratas Victoria',
      ),
      q('¿Qué comida de masa de maíz es típica de Venezuela?', 'Arepa', 'Taco', 'Pupusa', 'Burrito'),
      q(
        '¿Qué prócer nacido en Caracas es llamado "el Libertador"?',
        'Simón Bolívar',
        'José de San Martín',
        "Bernardo O'Higgins",
        'José Martí',
      ),
      q(
        '¿Qué gran lago está en el noroeste de Venezuela?',
        'Lago de Maracaibo',
        'Lago Titicaca',
        'Lago Nahuel Huapi',
        'Lago General Carrera',
      ),
      q('¿Cuál es la moneda de Venezuela?', 'Bolívar', 'Peso', 'Sol', 'Real'),
    ],
  },
  PE: {
    mapId: '604',
    questions: [
      q('¿Cuál es la capital de Perú?', 'Lima', 'Cusco', 'Arequipa', 'Trujillo'),
      q('¿Qué ciudadela inca está en los Andes peruanos?', 'Machu Picchu', 'Tikal', 'Chichén Itzá', 'Teotihuacán'),
      q('¿Qué plato de pescado marinado en limón es emblema de Perú?', 'Ceviche', 'Paella', 'Asado', 'Feijoada'),
      q('¿Qué lago comparten Perú y Bolivia?', 'Titicaca', 'Maracaibo', 'Llanquihue', 'Nahuel Huapi'),
      q('¿Cuál es la moneda de Perú?', 'Sol', 'Peso', 'Bolívar', 'Real'),
      q(
        '¿Qué escritor peruano ganó el Premio Nobel de Literatura en 2010?',
        'Mario Vargas Llosa',
        'César Vallejo',
        'Ciro Alegría',
        'José María Arguedas',
      ),
    ],
  },
  MX: {
    mapId: '484',
    questions: [
      q('¿Cuál es la capital de México?', 'Ciudad de México', 'Guadalajara', 'Monterrey', 'Cancún'),
      q(
        '¿Qué celebración recuerda a los difuntos el 1 y el 2 de noviembre?',
        'Día de Muertos',
        'Carnaval',
        'Grito de Independencia',
        'Las Posadas',
      ),
      q(
        '¿Qué pintora mexicana es famosa por sus autorretratos?',
        'Frida Kahlo',
        'Tarsila do Amaral',
        'Gabriela Mistral',
        'Violeta Parra',
      ),
      q('¿En qué península está Chichén Itzá?', 'Yucatán', 'Baja California', 'Florida', 'Ibérica'),
      q('¿Qué bebida se elabora con agave azul en Jalisco?', 'Tequila', 'Pisco', 'Ron', 'Cachaça'),
      q(
        '¿Cómo se llaman los músicos con traje de charro típicos de México?',
        'Mariachis',
        'Murgueros',
        'Gauchos',
        'Payadores',
      ),
    ],
  },
  CU: {
    mapId: '192',
    questions: [
      q('¿Cuál es la capital de Cuba?', 'La Habana', 'Santiago de Cuba', 'Varadero', 'Camagüey'),
      q(
        '¿Cómo se llama el famoso paseo junto al mar de La Habana?',
        'El Malecón',
        'La Rambla',
        'Copacabana',
        'La Costanera',
      ),
      q(
        '¿Qué escritor y prócer cubano escribió "Versos sencillos"?',
        'José Martí',
        'Alejo Carpentier',
        'Nicolás Guillén',
        'Reinaldo Arenas',
      ),
      q(
        '¿Qué cantante cubana fue llamada "la reina de la salsa"?',
        'Celia Cruz',
        'Shakira',
        'Mercedes Sosa',
        'Rocío Jurado',
      ),
      q('¿Qué cóctel cubano lleva ron, menta, lima y soda?', 'Mojito', 'Caipiriña', 'Pisco sour', 'Sangría'),
      q('¿Qué mar baña la costa sur de Cuba?', 'Mar Caribe', 'Mar Mediterráneo', 'Mar del Norte', 'Mar Rojo'),
    ],
  },
  BR: {
    mapId: '076',
    questions: [
      q('¿Cuál es la capital de Brasil?', 'Brasilia', 'Río de Janeiro', 'São Paulo', 'Salvador'),
      q('¿Cuál es el idioma oficial de Brasil?', 'Portugués', 'Español', 'Inglés', 'Francés'),
      q(
        '¿Qué estatua está en la cima del cerro Corcovado?',
        'El Cristo Redentor',
        'La Estatua de la Libertad',
        'El Cristo de los Andes',
        'El Ángel de la Independencia',
      ),
      q(
        '¿Qué selva cubre gran parte del norte de Brasil?',
        'La Amazonia',
        'La Selva Negra',
        'El Darién',
        'La Selva Lacandona',
      ),
      q('¿Qué género musical y baile es el alma del Carnaval de Río?', 'Samba', 'Tango', 'Cueca', 'Cumbia'),
      q('¿Qué plato de porotos negros con carne es típico de Brasil?', 'Feijoada', 'Locro', 'Ajiaco', 'Mondongo'),
    ],
  },
  ES: {
    mapId: '724',
    questions: [
      q('¿Cuál es la capital de España?', 'Madrid', 'Barcelona', 'Sevilla', 'Valencia'),
      q('¿En qué ciudad está la Sagrada Familia?', 'Barcelona', 'Madrid', 'Bilbao', 'Granada'),
      q('¿Qué plato de arroz con azafrán es típico de Valencia?', 'Paella', 'Gazpacho', 'Fabada', 'Cocido'),
      q('¿En qué comunidad autónoma se habla gallego?', 'Galicia', 'Asturias', 'Navarra', 'Aragón'),
      q('¿Quién pintó "Las meninas"?', 'Diego Velázquez', 'Francisco de Goya', 'Pablo Picasso', 'El Greco'),
      q(
        '¿Qué fiesta de Pamplona es famosa por los encierros de toros?',
        'San Fermín',
        'Las Fallas',
        'La Tomatina',
        'La Feria de Abril',
      ),
    ],
  },
  PT: {
    mapId: '620',
    questions: [
      q('¿Cuál es la capital de Portugal?', 'Lisboa', 'Oporto', 'Coímbra', 'Faro'),
      q('¿Qué canción melancólica es símbolo de Portugal?', 'Fado', 'Bossa nova', 'Flamenco', 'Tango'),
      q('¿Qué dulce de hojaldre y crema es típico de Lisboa?', 'Pastel de nata', 'Alfajor', 'Churro', 'Cannoli'),
      q(
        '¿Qué navegante portugués llegó a la India por mar en 1498?',
        'Vasco da Gama',
        'Cristóbal Colón',
        'Fernando de Magallanes',
        'Pedro Álvares Cabral',
      ),
      q('¿Qué ciudad da nombre al famoso vino dulce portugués?', 'Oporto', 'Lisboa', 'Braga', 'Évora'),
      q('¿Con qué único país tiene frontera terrestre Portugal?', 'España', 'Francia', 'Marruecos', 'Italia'),
    ],
  },
  IT: {
    mapId: '380',
    questions: [
      q('¿Cuál es la capital de Italia?', 'Roma', 'Milán', 'Nápoles', 'Florencia'),
      q('¿En qué ciudad está la famosa torre inclinada?', 'Pisa', 'Venecia', 'Turín', 'Bolonia'),
      q('¿Qué ciudad italiana es famosa por sus canales y góndolas?', 'Venecia', 'Génova', 'Verona', 'Palermo'),
      q('¿Quién pintó "La última cena"?', 'Leonardo da Vinci', 'Miguel Ángel', 'Rafael', 'Caravaggio'),
      q('¿En qué ciudad nació la pizza margarita?', 'Nápoles', 'Roma', 'Milán', 'Bari'),
      q('¿Qué volcán sepultó Pompeya en el año 79?', 'Vesubio', 'Etna', 'Estrómboli', 'Teide'),
    ],
  },
  FR: {
    mapId: '250',
    questions: [
      q('¿Cuál es la capital de Francia?', 'París', 'Lyon', 'Marsella', 'Niza'),
      q('¿En qué año se inauguró la torre Eiffel?', '1889', '1789', '1914', '1950'),
      q('¿En qué museo de París está la Mona Lisa?', 'Louvre', 'Orsay', 'Prado', 'Pompidou'),
      q('¿Qué día es la fiesta nacional de Francia?', '14 de julio', '4 de julio', '1 de mayo', '25 de mayo'),
      q(
        '¿Qué carrera de ciclismo recorre Francia cada verano?',
        'Tour de Francia',
        'Giro de Italia',
        'Vuelta a España',
        'Rally Dakar',
      ),
      q('¿Cómo se llama el pan largo y fino típico de Francia?', 'Baguette', 'Croissant', 'Brioche', 'Focaccia'),
    ],
  },
  DE: {
    mapId: '276',
    questions: [
      q('¿Cuál es la capital de Alemania?', 'Berlín', 'Múnich', 'Hamburgo', 'Fráncfort'),
      q('¿En qué año cayó el Muro de Berlín?', '1989', '1961', '1945', '1991'),
      q('¿Qué ciudad celebra el Oktoberfest?', 'Múnich', 'Colonia', 'Dresde', 'Stuttgart'),
      q(
        '¿Qué compositor alemán escribió la Novena sinfonía, con el "Himno de la alegría"?',
        'Ludwig van Beethoven',
        'Wolfgang Amadeus Mozart',
        'Johann Sebastian Bach',
        'Richard Wagner',
      ),
      q('¿Qué río pasa por Colonia y es uno de los más largos de Europa?', 'Rin', 'Danubio', 'Sena', 'Támesis'),
      q('¿Cuál es la moneda de Alemania?', 'Euro', 'Marco', 'Franco', 'Libra'),
    ],
  },
  GB: {
    mapId: '826',
    questions: [
      q('¿Cuál es la capital del Reino Unido?', 'Londres', 'Mánchester', 'Edimburgo', 'Liverpool'),
      q('¿De qué ciudad eran The Beatles?', 'Liverpool', 'Londres', 'Mánchester', 'Birmingham'),
      q(
        '¿Cómo se llama la gran campana de la torre del Parlamento de Londres?',
        'Big Ben',
        'London Eye',
        'Tower Bridge',
        'Piccadilly',
      ),
      q('¿Quién escribió "Romeo y Julieta"?', 'William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Oscar Wilde'),
      q(
        '¿Qué naciones forman el Reino Unido?',
        'Inglaterra, Escocia, Gales e Irlanda del Norte',
        'Inglaterra, Escocia, Gales e Irlanda',
        'Inglaterra, Gales e Islandia',
        'Inglaterra y Escocia',
      ),
      q('¿Cuál es la moneda del Reino Unido?', 'Libra esterlina', 'Euro', 'Dólar', 'Corona'),
    ],
  },
  US: {
    mapId: '840',
    questions: [
      q('¿Cuál es la capital de Estados Unidos?', 'Washington D. C.', 'Nueva York', 'Los Ángeles', 'Chicago'),
      q('¿Cuántos estados tiene Estados Unidos?', '50', '48', '51', '52'),
      q(
        '¿Qué día se celebra la independencia de Estados Unidos?',
        '4 de julio',
        '14 de julio',
        '9 de julio',
        '25 de diciembre',
      ),
      q('¿En qué ciudad está la Estatua de la Libertad?', 'Nueva York', 'Boston', 'Filadelfia', 'Washington D. C.'),
      q('¿En qué estado está el Gran Cañón del Colorado?', 'Arizona', 'Texas', 'Florida', 'Alaska'),
      q(
        '¿Qué fiesta de noviembre se celebra con una cena de pavo?',
        'Acción de Gracias',
        'Halloween',
        'Pascua',
        'Día de la Independencia',
      ),
    ],
  },
  CA: {
    mapId: '124',
    questions: [
      q('¿Cuál es la capital de Canadá?', 'Ottawa', 'Toronto', 'Montreal', 'Vancouver'),
      q('¿Qué hoja aparece en la bandera de Canadá?', 'Arce', 'Roble', 'Olmo', 'Pino'),
      q(
        '¿Cuáles son los idiomas oficiales de Canadá?',
        'Inglés y francés',
        'Inglés y español',
        'Francés e italiano',
        'Solo inglés',
      ),
      q(
        '¿Qué jarabe dulce es típico de Canadá?',
        'Jarabe de arce',
        'Dulce de leche',
        'Melaza de caña',
        'Jarabe de agave',
      ),
      q(
        '¿Cuál es el deporte sobre hielo más popular de Canadá?',
        'Hockey sobre hielo',
        'Polo',
        'Esquí acuático',
        'Bobsleigh',
      ),
      q(
        '¿Qué cataratas comparten Canadá y Estados Unidos?',
        'Cataratas del Niágara',
        'Cataratas del Iguazú',
        'Cataratas Victoria',
        'Salto Ángel',
      ),
    ],
  },
  AU: {
    mapId: '036',
    questions: [
      q('¿Cuál es la capital de Australia?', 'Canberra', 'Sídney', 'Melbourne', 'Perth'),
      q('¿Qué animal australiano salta y lleva a su cría en una bolsa?', 'Canguro', 'Llama', 'Ciervo', 'Puma'),
      q(
        '¿Cómo se llama el sistema de arrecifes de coral más grande del mundo, en Australia?',
        'Gran Barrera de Coral',
        'Arrecife Mesoamericano',
        'Arrecife de Belice',
        'Mar de los Sargazos',
      ),
      q('¿En qué ciudad está la famosa Ópera junto al puerto?', 'Sídney', 'Melbourne', 'Brisbane', 'Adelaida'),
      q('¿En qué estación del año cae Navidad en Australia?', 'Verano', 'Invierno', 'Otoño', 'Primavera'),
      q(
        '¿Cómo se llama la gran roca roja sagrada del centro de Australia?',
        'Uluru',
        'Aconcagua',
        'Kilimanjaro',
        'Monte Fuji',
      ),
    ],
  },
}

// Si el país de una persona todavía no tiene preguntas, su rival responde de cultura general.
export const GENERAL = [
  q('¿Cuál es el océano más grande del mundo?', 'Pacífico', 'Atlántico', 'Índico', 'Ártico'),
  q('¿Cuál es la montaña más alta del mundo?', 'Everest', 'Aconcagua', 'Kilimanjaro', 'Mont Blanc'),
  q('¿En qué continente está Egipto?', 'África', 'Asia', 'Europa', 'Oceanía'),
  q('¿Cuál es la capital de Japón?', 'Tokio', 'Kioto', 'Osaka', 'Seúl'),
  q('¿Cuál es el desierto cálido más grande del mundo?', 'Sahara', 'Atacama', 'Gobi', 'Kalahari'),
  q(
    '¿Qué línea imaginaria divide la Tierra en hemisferio norte y sur?',
    'El ecuador',
    'El trópico de Cáncer',
    'El meridiano de Greenwich',
    'El círculo polar',
  ),
  q('¿Cuál es el país más grande del mundo por superficie?', 'Rusia', 'Canadá', 'China', 'Brasil'),
  q('¿Cuál es el río más caudaloso del mundo?', 'Amazonas', 'Nilo', 'Misisipi', 'Danubio'),
]

export function hasTrivia(code) {
  return Boolean(TRIVIA[code])
}

/** Preguntas sobre el país (o de cultura general si todavía no hay). */
export function triviaFor(code) {
  return TRIVIA[code]?.questions ?? GENERAL
}
