// Sistema de gestión de contenido dinámico

export interface Testimonial {
  id: string
  name: string
  company: string
  text: string
  rating: number
  image?: string
  color: string
  featured: boolean
}

export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  price: string
  duration: string
  results: string
  icon: string
  color: string
  order: number
}

export interface Pricing {
  id: string
  name: string
  price: number
  currency: string
  period: string
  features: string[]
  popular: boolean
  cta: string
}

export interface CaseStudy {
  id: string
  title: string
  client: string
  industry: string
  challenge: string
  solution: string
  results: {
    metric: string
    value: string
    improvement: string
  }[]
  image?: string
  featured: boolean
}

// Datos de testimonios
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "María Rodríguez",
    company: "Inmobiliaria Premium",
    text: "El branding profesional transformó completamente nuestra imagen. Ahora los clientes nos perciben como líderes del mercado.",
    rating: 5,
    color: "from-blue-ribbon-400 to-blue-ribbon-600",
    featured: true
  },
  {
    id: "2",
    name: "Carlos López",
    company: "Propiedades del Sur",
    text: "Las campañas de captación nos trajeron 60% más consultas calificadas. El ROI superó todas nuestras expectativas.",
    rating: 5,
    color: "from-blue-ribbon-500 to-blue-ribbon-700",
    featured: true
  },
  {
    id: "3",
    name: "Ana García",
    company: "Inmobiliaria Moderna",
    text: "La automatización de WhatsApp y las campañas de fidelización generaron 35% más referidos. Increíble resultado.",
    rating: 5,
    color: "from-blue-ribbon-600 to-blue-ribbon-800",
    featured: true
  },
  {
    id: "4",
    name: "Roberto Martínez",
    company: "Desarrollos del Norte",
    text: "En 6 meses duplicamos nuestras ventas gracias a la estrategia digital completa.",
    rating: 5,
    color: "from-blue-ribbon-300 to-blue-ribbon-500",
    featured: false
  }
]

// Datos de servicios
export const services: Service[] = [
  {
    id: "branding",
    title: "Branding & Posicionamiento",
    description: "Optimización de perfiles sociales, identidad visual profesional y plan de contenido estratégico",
    features: [
      "Optimización de perfiles sociales",
      "Identidad visual profesional", 
      "Plan de contenido estratégico"
    ],
    price: "USD 250/mes",
    duration: "1-2 meses",
    results: "+35% alcance orgánico",
    icon: "Megaphone",
    color: "from-blue-ribbon-400 to-blue-ribbon-600",
    order: 1
  },
  {
    id: "captacion",
    title: "Captación de Prospectos",
    description: "Campañas Meta segmentadas, contenido persuasivo y gestión de leads en tiempo real",
    features: [
      "Campañas Meta segmentadas",
      "Contenido persuasivo",
      "Gestión de leads en tiempo real"
    ],
    price: "USD 350/mes",
    duration: "3-6 meses", 
    results: "+60% consultas calificadas",
    icon: "Target",
    color: "from-blue-ribbon-500 to-blue-ribbon-700",
    order: 2
  },
  {
    id: "fidelizacion",
    title: "Fidelización & Referidos",
    description: "Automatización WhatsApp, campañas personalizadas y reactivación de leads fríos",
    features: [
      "Automatización WhatsApp",
      "Campañas personalizadas",
      "Reactivación de leads fríos"
    ],
    price: "USD 500/mes",
    duration: "3 meses",
    results: "+35% referidos",
    icon: "Heart",
    color: "from-blue-ribbon-600 to-blue-ribbon-800",
    order: 3
  }
]

// Datos de precios
export const pricing: Pricing[] = [
  {
    id: "starter",
    name: "Plan Starter",
    price: 250,
    currency: "USD",
    period: "mes",
    features: [
      "Branding & Posicionamiento",
      "Optimización de perfiles",
      "Plan de contenido básico",
      "Soporte por email"
    ],
    popular: false,
    cta: "Comenzar ahora"
  },
  {
    id: "professional",
    name: "Plan Professional",
    price: 350,
    currency: "USD", 
    period: "mes",
    features: [
      "Todo lo del Plan Starter",
      "Captación de Prospectos",
      "Campañas Meta Ads",
      "Gestión de leads",
      "Soporte prioritario"
    ],
    popular: true,
    cta: "Más popular"
  },
  {
    id: "enterprise",
    name: "Plan Enterprise",
    price: 500,
    currency: "USD",
    period: "mes", 
    features: [
      "Todo lo del Plan Professional",
      "Fidelización & Referidos",
      "Automatización WhatsApp",
      "Campañas personalizadas",
      "Consultor dedicado"
    ],
    popular: false,
    cta: "Contactar ventas"
  }
]

// Funciones helper
export const getFeaturedTestimonials = () => testimonials.filter(t => t.featured)
export const getServiceById = (id: string) => services.find(s => s.id === id)
export const getServicesByOrder = () => services.sort((a, b) => a.order - b.order)
export const getPopularPricing = () => pricing.find(p => p.popular)

// Configuración del sitio
export const siteConfig = {
  name: "Martos Martinez",
  description: "Especialistas en marketing digital para el sector inmobiliario",
  url: "https://martosmarketing.com",
  phone: "+54 9 11 1234-5678",
  email: "info@martosmarketing.com",
  address: "Buenos Aires, Argentina",
  social: {
    instagram: "https://instagram.com/martosmarketing",
    facebook: "https://facebook.com/martosmarketing", 
    linkedin: "https://linkedin.com/company/martosmarketing"
  }
}
