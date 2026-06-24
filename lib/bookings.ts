export const TOURS_VIATOR = [
  "Punta Cana/Bávaro: Saona Island Caribbean Paradise Tour",
  "Isla Catalina Paradise: Snorkel, Playa Virgen y Open Bar",
  "Punta Cana/Bávaro/La Romana Isla Catalina la mas virgen del carib",
  "Tour Punta Cana de Ron y Café y Cigarros Dominicanos",
  "Isla Saona Paradise: Catamarán, Piscina Natural y Almuerzo Típico",
  "Puerto Plata Transporte VIP Privado desde el aeropuerto al Hotel",
  "Excursión a Cayo Arena e Isla Bonita – Paraíso desde Puerto Plata",
  "Aventura 27 Charcos de Damajagua en Puerto Plata",
  "Puerto Plata 360°: Historia Cultura y Sabor Local",
  "Puerto Plata: Buggy in the mountains, free transportation",
  "Transporte VIP Privado en Punta Cana",
  "Paseos a caballo en Punta Cana",
  "Descubre Santo Domingo",
  "Party Boat Tour in Bávaro Snorkeling Natural Pool y Fun",
  "Aventura en Buggies en Punta Cana 4 Horas de Diversión Off-Road",
  "Isla Saona: Catamarán, Almuerzo Buffet y Recogida Incluida",
  "Samaná Adventure El Limón Waterfall Cayo Levantado Island Tour",
]

export const TOURS_GYG = [
  "Punta Cana: Isla Saona Todo Incluido, catamarán, bebidas y almuerzo Buffet",
  "Aventura en Cuatrimotos y Buggies en Punta Cana",
  "Punta Cana: Tour Paraíso en Isla Saona en Catamarán con Almuerzo y Bebidas",
  "Isla Catalina Todo Incluido: Snorkel, Playa Tropical y Almuerzo Buffet",
  "Punta Cana: Santo Domingo: Zona Colonial, Historia y Cultura Dominicana",
  "Punta Cana: Tour Cultural con fábrica de ron, cigarros, cacao y café",
  "Puerto Plata: City Tour guiado con el Centro Histórico y Fuerte San Felipe",
  "Puerto Plata: 27 Charcos de Damajagua Aventura y Almuerzo Típico",
]

export const ALL_TOURS = [...new Set([...TOURS_VIATOR, ...TOURS_GYG])]

export interface Booking {
  id: number
  source: "viator" | "gyg" | "direct"
  tour?: string
  date?: string
  clientName?: string
  phone?: string
  hotel?: string
  meetingPoint?: string
  time?: string
  guests?: number | string
  confirmation?: string
  amount?: string
  language?: string
  origin?: string
  productCode?: string
  commission?: string
  notes?: string
  rawText?: string
  createdAt?: string
}

export function parseViatorBooking(text: string): Partial<Booking> {
  const data: Partial<Booking> = {}

  const dateMatch = text.match(/(\w{3},?\s+\d{1,2}\s+\w{3}\s+\d{4}|lun,\s*\d+\s+\w+\s+\d{4})/i)
  if (dateMatch) data.date = dateMatch[1].trim()

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
  const confirmIdx = lines.findIndex((l) => /Confirmada|Confirmed/i.test(l))
  if (confirmIdx !== -1 && lines[confirmIdx + 1]) {
    data.tour = lines[confirmIdx + 1].trim()
  }

  const timeMatch = text.match(/(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)/i)
  if (timeMatch) data.time = timeMatch[1].trim()

  const guestMatch = text.match(/(\d+)\s+adult(?:os?|s?)/i)
  if (guestMatch) data.guests = parseInt(guestMatch[1])

  const nameMatch = text.match(/Viajero principal:\s*(.+?)(?:\n|$)/i)
  if (nameMatch) data.clientName = nameMatch[1].trim()

  const confirmMatch = text.match(/BR-(\d+)/i)
  if (confirmMatch) data.confirmation = `BR-${confirmMatch[1]}`

  const hotelMatch = text.match(/Punto de recogida:\s*(.+?)(?:,|\n|Punta Cana)/i)
  if (hotelMatch) data.hotel = hotelMatch[1].trim()

  const phoneMatch = text.match(/\+\d[\d\s\-]+(?:Show)?/)
  if (phoneMatch) data.phone = phoneMatch[0].replace("Show", "").trim()

  const amountMatch = text.match(/Importe que recibirá:\s*([\d,.]+ USD)/i)
  if (amountMatch) data.amount = amountMatch[1]

  const langMatch = text.match(/Idioma.*?:\s*[-•*]?\s*(.+?)(?:\n|$)/i)
  if (langMatch) data.language = langMatch[1].trim()

  const originMatch = text.match(/Origen de las reservas:\s*(.+?)(?:\n|$)/i)
  if (originMatch) data.origin = originMatch[1].trim()

  const productMatch = text.match(/Código del producto:\s*(.+?)(?:\n|$)/i)
  if (productMatch) data.productCode = productMatch[1].trim()

  return data
}

export function parseGYGBooking(text: string): Partial<Booking> {
  const data: Partial<Booking> = {}

  // Tour name - Look for the title at the beginning
  const tourMatch = text.match(/^([^\n]+?)(?:\n|$)/)
  if (tourMatch && !tourMatch[1].includes("predeterminado") && !tourMatch[1].includes("default")) {
    data.tour = tourMatch[1].trim()
  }

  // Date - Spanish or English format
  // Spanish: "23 de junio de 2026" or "23 junio 2026"
  // English: "Jun 23, 2026" or "June 23, 2026"
  const dateMatchES = text.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/)
  const dateMatchEN = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}/)
  const dateMatchENShort = text.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}/)

  if (dateMatchES) {
    data.date = `${dateMatchES[1]} de ${dateMatchES[2]} de ${dateMatchES[3]}`
  } else if (dateMatchEN) {
    data.date = dateMatchEN[0]
  } else if (dateMatchENShort) {
    data.date = dateMatchENShort[0]
  }

  // Confirmation code - Alphanumeric string in brackets or standalone
  const codeMatch = text.match(/([A-Z0-9]{10,20})(?:\n|$)/m)
  if (codeMatch) {
    data.confirmation = codeMatch[1]
  }

  // Participants/Travelers count - Check for adults and children separately
  const participantsMatchES = text.match(/(\d+)\s+participantes?/)
  const participantsMatchEN = text.match(/(\d+)\s+participants?/)
  const adultsMatch = text.match(/(\d+)\s+(?:adultos?|adults?)\s*\(/)
  const childrenMatch = text.match(/(\d+)\s+(?:niño|child|children|niños)\s*\(/i)

  let totalGuests = 0

  if (participantsMatchES) {
    totalGuests = parseInt(participantsMatchES[1])
  } else if (participantsMatchEN) {
    totalGuests = parseInt(participantsMatchEN[1])
  } else {
    // Count adults and children separately
    if (adultsMatch) {
      totalGuests += parseInt(adultsMatch[1])
    }
    if (childrenMatch) {
      totalGuests += parseInt(childrenMatch[1])
    }
  }

  if (totalGuests > 0) {
    data.guests = totalGuests
  }

  // Pickup time - Spanish or English
  // Spanish: "entre las 6:30 y las 7:00 de la mañana"
  // English: "between 6:30 AM and 7:00 AM"
  const timeMatchES = text.match(/entre\s+las\s+(\d{1,2}):(\d{2})\s+y\s+las\s+(\d{1,2}):(\d{2})/)
  const timeMatchEN = text.match(/between\s+(\d{1,2}):(\d{2})\s+(?:AM|PM|am|pm)?\s+and\s+(\d{1,2}):(\d{2})\s+(?:AM|PM|am|pm)?/)
  const timeMatchSimple = text.match(/(\d{1,2}):(\d{2})\s*(?:AM|PM|am|pm)?/)

  if (timeMatchES) {
    data.time = `${timeMatchES[1]}:${timeMatchES[2]}`
  } else if (timeMatchEN) {
    data.time = `${timeMatchEN[1]}:${timeMatchEN[2]}`
  } else if (timeMatchSimple) {
    data.time = `${timeMatchSimple[1]}:${timeMatchSimple[2]}`
  }

  // Lead traveler/Viajero principal
  const nameMatchES = text.match(/Viajero\s+principal\s*\n\s*([^\n(]+)/)
  const nameMatchEN = text.match(/Lead\s+traveler\s*\n\s*([^\n(]+)/)

  if (nameMatchES) {
    data.clientName = nameMatchES[1].trim()
  } else if (nameMatchEN) {
    data.clientName = nameMatchEN[1].trim()
  }

  // Phone number
  const phoneMatch = text.match(/\+\d[\d\s\-()]+/)
  if (phoneMatch) {
    data.phone = phoneMatch[0].trim()
  }

  // Hotel/Location - Spanish or English
  const locationMatchES = text.match(/Ubicación\s*\n\s*([^\n]+)/)
  const locationMatchEN = text.match(/Location\s*\n\s*([^\n]+)/)

  if (locationMatchES) {
    data.hotel = locationMatchES[1].trim()
  } else if (locationMatchEN) {
    data.hotel = locationMatchEN[1].trim()
  }

  // Amount/Price
  const amountMatch = text.match(/\$\s*([\d,.]+)/)
  if (amountMatch) {
    data.amount = `$${amountMatch[1]}`
  }

  // Commission - Spanish or English
  const commissionMatchES = text.match(/(\d+[.,]\d+)\s*%/)
  const commissionMatchEN = text.match(/(\d+\.\d+)\s*%/)

  if (commissionMatchES) {
    data.commission = `${commissionMatchES[1]}%`
  } else if (commissionMatchEN) {
    data.commission = `${commissionMatchEN[1]}%`
  }

  // Language - Spanish or English
  const languageMatchES = text.match(/Guía\s+en\s+directo:\s*([^\n]+)/)
  const languageMatchEN = text.match(/Live\s+guide:\s*([^\n]+)/)

  if (languageMatchES) {
    data.language = languageMatchES[1].trim()
  } else if (languageMatchEN) {
    data.language = languageMatchEN[1].trim()
  }

  return data
}

export function generateDriverMessage(b: Booking): string {
  return `🏨 Hotel: ${b.hotel || "___"}
📍 Meeting point: ${b.meetingPoint || "Lobby"}
🕖 Pick-up time: ${b.time || "___"}
👤 Client: ${b.clientName || "___"} (${b.guests || "?"} people)
📞 Phone: ${b.phone || "___"}`
}

export function generateClientMessage(b: Booking): string {
  const firstName = b.clientName?.split(" ")[0] || "there"
  return `Hello ${firstName},

Thank you so much for booking with us! We're very excited to have you on the tour.

Here are your confirmed pickup details:
📅 Tour date: ${b.date || "___"}
🏨 Hotel: ${b.hotel || "___"}
📍 Pickup point: ${b.meetingPoint || "Lobby"}
🕐 Pickup time: ${b.time || "___"}

If you have any questions, feel free to reach out. See you soon! 🌊
– Puntaca Tours Team`
}

export const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 1,
    source: "viator",
    tour: "Aventura en Buggies en Punta Cana 4 Horas de Diversión Off-Road",
    date: "lun, 15 jun 2026",
    clientName: "Isabella Tamayo",
    phone: "+1 ***-***-****",
    hotel: "Ocean El Faro El Beso",
    meetingPoint: "Lobby",
    time: "09:00",
    guests: 2,
    confirmation: "BR-1403413075",
    amount: "45,22 USD",
    language: "Inglés",
    origin: "Tripadvisor",
    productCode: "5587607P14",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    source: "gyg",
    tour: "Punta Cana: Isla Saona Todo Incluido, catamarán, bebidas y almuerzo Buffet",
    date: "lunes, 15 de junio de 2026",
    clientName: "Ruby Adshead",
    phone: "+447967144103",
    hotel: "whala!bavaro",
    meetingPoint: "Lobby",
    time: "7:30 AM",
    guests: 2,
    confirmation: "GYGWZAV7N6W8",
    amount: "$118.00",
    language: "Inglés",
    commission: "25,00%",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    source: "direct",
    tour: "Isla Saona Paradise: Catamarán, Piscina Natural y Almuerzo Típico",
    date: "mar, 16 jun 2026",
    clientName: "Carlos Mendez",
    phone: "+1 809-555-1234",
    hotel: "Hard Rock Hotel Punta Cana",
    meetingPoint: "Lobby principal",
    time: "07:30",
    guests: 4,
    confirmation: "DIR-001234",
    amount: "240.00 USD",
    createdAt: new Date().toISOString(),
  },
]
