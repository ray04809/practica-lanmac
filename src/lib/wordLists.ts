// Word lists for vocabulary games, grouped by category
// Each word is appropriate for ESL learners (4-8 letters)

export interface WordEntry {
  word: string
  hint: string // Spanish translation or simple hint
}

export interface WordCategory {
  name: string
  nameEs: string
  words: WordEntry[]
}

export const CATEGORIES: WordCategory[] = [
  {
    name: 'Animals',
    nameEs: 'Animales',
    words: [
      { word: 'BEAR', hint: 'Oso' },
      { word: 'BIRD', hint: 'Pajaro' },
      { word: 'CATS', hint: 'Gatos' },
      { word: 'DEER', hint: 'Ciervo' },
      { word: 'DUCK', hint: 'Pato' },
      { word: 'FISH', hint: 'Pez' },
      { word: 'FROG', hint: 'Rana' },
      { word: 'GOAT', hint: 'Cabra' },
      { word: 'HORSE', hint: 'Caballo' },
      { word: 'LION', hint: 'Leon' },
      { word: 'MOUSE', hint: 'Raton' },
      { word: 'RABBIT', hint: 'Conejo' },
      { word: 'SHARK', hint: 'Tiburon' },
      { word: 'SNAKE', hint: 'Serpiente' },
      { word: 'TIGER', hint: 'Tigre' },
      { word: 'WHALE', hint: 'Ballena' },
      { word: 'WOLF', hint: 'Lobo' },
      { word: 'EAGLE', hint: 'Aguila' },
    ],
  },
  {
    name: 'Food',
    nameEs: 'Comida',
    words: [
      { word: 'APPLE', hint: 'Manzana' },
      { word: 'BREAD', hint: 'Pan' },
      { word: 'CAKE', hint: 'Pastel' },
      { word: 'CHEESE', hint: 'Queso' },
      { word: 'CORN', hint: 'Maiz' },
      { word: 'GRAPE', hint: 'Uva' },
      { word: 'LEMON', hint: 'Limon' },
      { word: 'MANGO', hint: 'Mango' },
      { word: 'MEAT', hint: 'Carne' },
      { word: 'MILK', hint: 'Leche' },
      { word: 'ONION', hint: 'Cebolla' },
      { word: 'PASTA', hint: 'Pasta' },
      { word: 'PEACH', hint: 'Durazno' },
      { word: 'PIZZA', hint: 'Pizza' },
      { word: 'RICE', hint: 'Arroz' },
      { word: 'SALAD', hint: 'Ensalada' },
      { word: 'SUGAR', hint: 'Azucar' },
      { word: 'TOAST', hint: 'Tostada' },
    ],
  },
  {
    name: 'Colors',
    nameEs: 'Colores',
    words: [
      { word: 'BLACK', hint: 'Negro' },
      { word: 'BLUE', hint: 'Azul' },
      { word: 'BROWN', hint: 'Marron' },
      { word: 'CREAM', hint: 'Crema' },
      { word: 'GOLD', hint: 'Dorado' },
      { word: 'GRAY', hint: 'Gris' },
      { word: 'GREEN', hint: 'Verde' },
      { word: 'IVORY', hint: 'Marfil' },
      { word: 'NAVY', hint: 'Azul marino' },
      { word: 'OLIVE', hint: 'Oliva' },
      { word: 'ORANGE', hint: 'Naranja' },
      { word: 'PINK', hint: 'Rosa' },
      { word: 'PURPLE', hint: 'Morado' },
      { word: 'RED', hint: 'Rojo' },
      { word: 'SILVER', hint: 'Plateado' },
      { word: 'WHITE', hint: 'Blanco' },
      { word: 'YELLOW', hint: 'Amarillo' },
    ],
  },
  {
    name: 'Body',
    nameEs: 'Cuerpo',
    words: [
      { word: 'ARMS', hint: 'Brazos' },
      { word: 'BACK', hint: 'Espalda' },
      { word: 'BONE', hint: 'Hueso' },
      { word: 'CHIN', hint: 'Barbilla' },
      { word: 'EARS', hint: 'Orejas' },
      { word: 'ELBOW', hint: 'Codo' },
      { word: 'EYES', hint: 'Ojos' },
      { word: 'FACE', hint: 'Cara' },
      { word: 'FOOT', hint: 'Pie' },
      { word: 'HAIR', hint: 'Cabello' },
      { word: 'HAND', hint: 'Mano' },
      { word: 'HEAD', hint: 'Cabeza' },
      { word: 'HEART', hint: 'Corazon' },
      { word: 'KNEE', hint: 'Rodilla' },
      { word: 'MOUTH', hint: 'Boca' },
      { word: 'NECK', hint: 'Cuello' },
      { word: 'NOSE', hint: 'Nariz' },
      { word: 'THUMB', hint: 'Pulgar' },
    ],
  },
  {
    name: 'House',
    nameEs: 'Casa',
    words: [
      { word: 'BATH', hint: 'Bano' },
      { word: 'BED', hint: 'Cama' },
      { word: 'CHAIR', hint: 'Silla' },
      { word: 'CLOCK', hint: 'Reloj' },
      { word: 'COUCH', hint: 'Sofa' },
      { word: 'DOOR', hint: 'Puerta' },
      { word: 'FLOOR', hint: 'Piso' },
      { word: 'GLASS', hint: 'Vaso' },
      { word: 'LAMP', hint: 'Lampara' },
      { word: 'MIRROR', hint: 'Espejo' },
      { word: 'PLATE', hint: 'Plato' },
      { word: 'ROOF', hint: 'Techo' },
      { word: 'SHELF', hint: 'Estante' },
      { word: 'SINK', hint: 'Lavabo' },
      { word: 'STOVE', hint: 'Estufa' },
      { word: 'TABLE', hint: 'Mesa' },
      { word: 'TOWEL', hint: 'Toalla' },
      { word: 'WALL', hint: 'Pared' },
    ],
  },
  {
    name: 'School',
    nameEs: 'Escuela',
    words: [
      { word: 'BELL', hint: 'Campana' },
      { word: 'BOARD', hint: 'Pizarra' },
      { word: 'BOOK', hint: 'Libro' },
      { word: 'CLASS', hint: 'Clase' },
      { word: 'DESK', hint: 'Escritorio' },
      { word: 'ERASER', hint: 'Borrador' },
      { word: 'EXAM', hint: 'Examen' },
      { word: 'GLOBE', hint: 'Globo' },
      { word: 'GRADE', hint: 'Nota' },
      { word: 'LEARN', hint: 'Aprender' },
      { word: 'NOTES', hint: 'Notas' },
      { word: 'PAPER', hint: 'Papel' },
      { word: 'RULER', hint: 'Regla' },
      { word: 'STUDY', hint: 'Estudiar' },
      { word: 'TEACH', hint: 'Ensenar' },
      { word: 'TEST', hint: 'Prueba' },
    ],
  },
  {
    name: 'Travel',
    nameEs: 'Viaje',
    words: [
      { word: 'BEACH', hint: 'Playa' },
      { word: 'BOAT', hint: 'Bote' },
      { word: 'CAMP', hint: 'Campamento' },
      { word: 'CITY', hint: 'Ciudad' },
      { word: 'DRIVE', hint: 'Conducir' },
      { word: 'FERRY', hint: 'Ferry' },
      { word: 'GUIDE', hint: 'Guia' },
      { word: 'HOTEL', hint: 'Hotel' },
      { word: 'LAKE', hint: 'Lago' },
      { word: 'MAP', hint: 'Mapa' },
      { word: 'PARK', hint: 'Parque' },
      { word: 'PLANE', hint: 'Avion' },
      { word: 'ROAD', hint: 'Camino' },
      { word: 'TAXI', hint: 'Taxi' },
      { word: 'TICKET', hint: 'Boleto' },
      { word: 'TRAIN', hint: 'Tren' },
      { word: 'TRIP', hint: 'Viaje' },
    ],
  },
  {
    name: 'Weather',
    nameEs: 'Clima',
    words: [
      { word: 'CLEAR', hint: 'Despejado' },
      { word: 'CLOUD', hint: 'Nube' },
      { word: 'COLD', hint: 'Frio' },
      { word: 'FLOOD', hint: 'Inundacion' },
      { word: 'FOG', hint: 'Niebla' },
      { word: 'FROST', hint: 'Escarcha' },
      { word: 'HEAT', hint: 'Calor' },
      { word: 'HUMID', hint: 'Humedo' },
      { word: 'RAIN', hint: 'Lluvia' },
      { word: 'SLEET', hint: 'Aguanieve' },
      { word: 'SNOW', hint: 'Nieve' },
      { word: 'STORM', hint: 'Tormenta' },
      { word: 'SUNNY', hint: 'Soleado' },
      { word: 'WARM', hint: 'Calido' },
      { word: 'WIND', hint: 'Viento' },
      { word: 'WINDY', hint: 'Ventoso' },
    ],
  },
  {
    name: 'Family',
    nameEs: 'Familia',
    words: [
      { word: 'AUNT', hint: 'Tia' },
      { word: 'BABY', hint: 'Bebe' },
      { word: 'CHILD', hint: 'Nino' },
      { word: 'COUSIN', hint: 'Primo' },
      { word: 'DAD', hint: 'Papa' },
      { word: 'FAMILY', hint: 'Familia' },
      { word: 'FATHER', hint: 'Padre' },
      { word: 'GRAND', hint: 'Abuelo' },
      { word: 'MOTHER', hint: 'Madre' },
      { word: 'NEPHEW', hint: 'Sobrino' },
      { word: 'NIECE', hint: 'Sobrina' },
      { word: 'PARENT', hint: 'Padre/Madre' },
      { word: 'SISTER', hint: 'Hermana' },
      { word: 'SON', hint: 'Hijo' },
      { word: 'UNCLE', hint: 'Tio' },
      { word: 'WIFE', hint: 'Esposa' },
    ],
  },
  {
    name: 'Clothing',
    nameEs: 'Ropa',
    words: [
      { word: 'BELT', hint: 'Cinturon' },
      { word: 'BOOTS', hint: 'Botas' },
      { word: 'CAP', hint: 'Gorra' },
      { word: 'COAT', hint: 'Abrigo' },
      { word: 'DRESS', hint: 'Vestido' },
      { word: 'GLOVES', hint: 'Guantes' },
      { word: 'JACKET', hint: 'Chaqueta' },
      { word: 'JEANS', hint: 'Jeans' },
      { word: 'PANTS', hint: 'Pantalones' },
      { word: 'SCARF', hint: 'Bufanda' },
      { word: 'SHIRT', hint: 'Camisa' },
      { word: 'SHOES', hint: 'Zapatos' },
      { word: 'SKIRT', hint: 'Falda' },
      { word: 'SOCKS', hint: 'Calcetines' },
      { word: 'SUIT', hint: 'Traje' },
      { word: 'VEST', hint: 'Chaleco' },
    ],
  },
  {
    name: 'Sports',
    nameEs: 'Deportes',
    words: [
      { word: 'BALL', hint: 'Pelota' },
      { word: 'CATCH', hint: 'Atrapar' },
      { word: 'CLIMB', hint: 'Escalar' },
      { word: 'COACH', hint: 'Entrenador' },
      { word: 'DIVE', hint: 'Bucear' },
      { word: 'GOLF', hint: 'Golf' },
      { word: 'JUMP', hint: 'Saltar' },
      { word: 'MATCH', hint: 'Partido' },
      { word: 'POOL', hint: 'Piscina' },
      { word: 'RACE', hint: 'Carrera' },
      { word: 'RUN', hint: 'Correr' },
      { word: 'SCORE', hint: 'Puntuacion' },
      { word: 'SKATE', hint: 'Patinar' },
      { word: 'SWIM', hint: 'Nadar' },
      { word: 'TEAM', hint: 'Equipo' },
      { word: 'THROW', hint: 'Lanzar' },
    ],
  },
  {
    name: 'Emotions',
    nameEs: 'Emociones',
    words: [
      { word: 'ANGER', hint: 'Enojo' },
      { word: 'BRAVE', hint: 'Valiente' },
      { word: 'CALM', hint: 'Tranquilo' },
      { word: 'ENVY', hint: 'Envidia' },
      { word: 'FEAR', hint: 'Miedo' },
      { word: 'GLAD', hint: 'Contento' },
      { word: 'HAPPY', hint: 'Feliz' },
      { word: 'HOPE', hint: 'Esperanza' },
      { word: 'JOY', hint: 'Alegria' },
      { word: 'LOVE', hint: 'Amor' },
      { word: 'PAIN', hint: 'Dolor' },
      { word: 'PEACE', hint: 'Paz' },
      { word: 'PRIDE', hint: 'Orgullo' },
      { word: 'SAD', hint: 'Triste' },
      { word: 'SHAME', hint: 'Verguenza' },
      { word: 'TRUST', hint: 'Confianza' },
    ],
  },
  {
    name: 'Jobs',
    nameEs: 'Trabajos',
    words: [
      { word: 'ACTOR', hint: 'Actor' },
      { word: 'BAKER', hint: 'Panadero' },
      { word: 'CHEF', hint: 'Chef' },
      { word: 'CLERK', hint: 'Cajero' },
      { word: 'COOK', hint: 'Cocinero' },
      { word: 'DIVER', hint: 'Buzo' },
      { word: 'JUDGE', hint: 'Juez' },
      { word: 'MINER', hint: 'Minero' },
      { word: 'NURSE', hint: 'Enfermera' },
      { word: 'PILOT', hint: 'Piloto' },
      { word: 'SMITH', hint: 'Herrero' },
      { word: 'TUTOR', hint: 'Tutor' },
      { word: 'GUARD', hint: 'Guardia' },
      { word: 'WRITER', hint: 'Escritor' },
      { word: 'DOCTOR', hint: 'Doctor' },
      { word: 'FARMER', hint: 'Granjero' },
    ],
  },
  {
    name: 'Nature',
    nameEs: 'Naturaleza',
    words: [
      { word: 'BLOOM', hint: 'Florecer' },
      { word: 'CREEK', hint: 'Arroyo' },
      { word: 'EARTH', hint: 'Tierra' },
      { word: 'FIELD', hint: 'Campo' },
      { word: 'FLAME', hint: 'Llama' },
      { word: 'GRASS', hint: 'Hierba' },
      { word: 'HILL', hint: 'Colina' },
      { word: 'LEAF', hint: 'Hoja' },
      { word: 'MOON', hint: 'Luna' },
      { word: 'OCEAN', hint: 'Oceano' },
      { word: 'PLANT', hint: 'Planta' },
      { word: 'RIVER', hint: 'Rio' },
      { word: 'ROCK', hint: 'Roca' },
      { word: 'SEED', hint: 'Semilla' },
      { word: 'STAR', hint: 'Estrella' },
      { word: 'TREE', hint: 'Arbol' },
      { word: 'WAVE', hint: 'Ola' },
    ],
  },
  {
    name: 'Technology',
    nameEs: 'Tecnologia',
    words: [
      { word: 'APP', hint: 'Aplicacion' },
      { word: 'BLOG', hint: 'Blog' },
      { word: 'BYTE', hint: 'Byte' },
      { word: 'CHIP', hint: 'Chip' },
      { word: 'CODE', hint: 'Codigo' },
      { word: 'DATA', hint: 'Datos' },
      { word: 'DISK', hint: 'Disco' },
      { word: 'EMAIL', hint: 'Correo' },
      { word: 'FILE', hint: 'Archivo' },
      { word: 'GAME', hint: 'Juego' },
      { word: 'ICON', hint: 'Icono' },
      { word: 'LINK', hint: 'Enlace' },
      { word: 'MOUSE', hint: 'Raton' },
      { word: 'PIXEL', hint: 'Pixel' },
      { word: 'ROBOT', hint: 'Robot' },
      { word: 'SCREEN', hint: 'Pantalla' },
      { word: 'VIRUS', hint: 'Virus' },
      { word: 'WIFI', hint: 'Wifi' },
    ],
  },
]

/**
 * Deterministic pseudo-random number generator from a string seed.
 * Returns a function that produces values in [0, 1).
 */
function seededRandom(seed: string): () => number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1)
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61)
    h = ((h ^ (h >>> 14)) >>> 0) / 4294967296
    return h
  }
}

/**
 * Returns the daily category based on the date.
 * Cycles through categories deterministically.
 */
export function getDailyCategory(date: Date): WordCategory {
  const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  const rng = seededRandom(dateStr)
  const idx = Math.floor(rng() * CATEGORIES.length)
  return CATEGORIES[idx]
}

/**
 * Deterministically selects `count` words from the daily category.
 * Uses date as seed so everyone gets the same words each day.
 */
export function getDailyWords(date: Date, count: number): WordEntry[] {
  const category = getDailyCategory(date)
  const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-words`
  const rng = seededRandom(dateStr)

  // Shuffle category words deterministically
  const shuffled = [...category.words]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * Get words filtered by length for difficulty levels.
 */
export function getWordsByDifficulty(
  date: Date,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number
): WordEntry[] {
  const category = getDailyCategory(date)
  const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${difficulty}`
  const rng = seededRandom(dateStr)

  const lengthRange: Record<string, [number, number]> = {
    easy: [3, 5],
    medium: [5, 6],
    hard: [6, 8],
  }

  const [min, max] = lengthRange[difficulty]
  const filtered = category.words.filter(
    (w) => w.word.length >= min && w.word.length <= max
  )

  // If not enough words match the filter, fall back to all words
  const pool = filtered.length >= count ? filtered : category.words

  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, Math.min(count, shuffled.length))
}
