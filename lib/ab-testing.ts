// A/B Testing System

export interface ABTest {
  id: string
  name: string
  description: string
  variants: ABVariant[]
  traffic: number // Porcentaje de tráfico para el test (0-100)
  status: 'draft' | 'running' | 'paused' | 'completed'
  startDate?: Date
  endDate?: Date
  goal: string
  targetMetric: string
}

export interface ABVariant {
  id: string
  name: string
  description: string
  weight: number // Porcentaje de tráfico para esta variante (0-100)
  config: Record<string, any>
}

export interface ABTestResult {
  testId: string
  variantId: string
  userId: string
  timestamp: Date
  event: string
  value?: number
}

// Tests activos
const activeTests: ABTest[] = [
  {
    id: 'hero-cta-test',
    name: 'Hero CTA Button Test',
    description: 'Probar diferentes textos en el botón principal del hero',
    variants: [
      {
        id: 'control',
        name: 'Control - Conocé el Plan',
        description: 'Texto original del botón',
        weight: 50,
        config: { buttonText: 'Conocé el Plan', buttonColor: 'bg-secondary' }
      },
      {
        id: 'variant-a',
        name: 'Variant A - Consulta Gratis',
        description: 'Enfoque en consulta gratuita',
        weight: 50,
        config: { buttonText: 'Consulta Gratis', buttonColor: 'bg-green-600' }
      }
    ],
    traffic: 100,
    status: 'running',
    goal: 'Aumentar clicks en CTA principal',
    targetMetric: 'cta_clicks'
  },
  {
    id: 'pricing-display-test',
    name: 'Pricing Display Test',
    description: 'Mostrar vs ocultar precios en las cards de servicios',
    variants: [
      {
        id: 'control',
        name: 'Control - Con Precios',
        description: 'Mostrar precios en las cards',
        weight: 50,
        config: { showPricing: true }
      },
      {
        id: 'variant-a',
        name: 'Variant A - Sin Precios',
        description: 'Ocultar precios, enfoque en beneficios',
        weight: 50,
        config: { showPricing: false }
      }
    ],
    traffic: 50,
    status: 'running',
    goal: 'Aumentar solicitudes de información',
    targetMetric: 'form_submissions'
  }
]

// Clase para manejar A/B testing
export class ABTestManager {
  private static instance: ABTestManager
  private userVariants: Map<string, Map<string, string>> = new Map()

  static getInstance(): ABTestManager {
    if (!ABTestManager.instance) {
      ABTestManager.instance = new ABTestManager()
    }
    return ABTestManager.instance
  }

  // Obtener ID único del usuario (usando localStorage o generando uno)
  private getUserId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let userId = localStorage.getItem('ab_user_id')
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('ab_user_id', userId)
    }
    return userId
  }

  // Determinar si el usuario debe participar en el test
  private shouldParticipate(test: ABTest): boolean {
    if (test.status !== 'running') return false
    
    const userId = this.getUserId()
    const hash = this.hashString(userId + test.id)
    return (hash % 100) < test.traffic
  }

  // Función hash simple para distribución consistente
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  // Asignar variante a un usuario para un test específico
  getVariant(testId: string): ABVariant | null {
    const test = activeTests.find(t => t.id === testId)
    if (!test || !this.shouldParticipate(test)) return null

    const userId = this.getUserId()
    
    // Verificar si ya tiene una variante asignada
    if (!this.userVariants.has(userId)) {
      this.userVariants.set(userId, new Map())
    }
    
    const userTestVariants = this.userVariants.get(userId)!
    if (userTestVariants.has(testId)) {
      const variantId = userTestVariants.get(testId)!
      return test.variants.find(v => v.id === variantId) || null
    }

    // Asignar nueva variante basada en pesos
    const hash = this.hashString(userId + testId)
    let cumulative = 0
    
    for (const variant of test.variants) {
      cumulative += variant.weight
      if ((hash % 100) < cumulative) {
        userTestVariants.set(testId, variant.id)
        
        // Guardar en localStorage para persistencia
        if (typeof window !== 'undefined') {
          const stored = JSON.parse(localStorage.getItem('ab_variants') || '{}')
          stored[testId] = variant.id
          localStorage.setItem('ab_variants', JSON.stringify(stored))
        }
        
        return variant
      }
    }

    // Fallback a la primera variante
    const fallback = test.variants[0]
    userTestVariants.set(testId, fallback.id)
    return fallback
  }

  // Registrar evento para análisis
  trackEvent(testId: string, event: string, value?: number) {
    const variant = this.getVariant(testId)
    if (!variant) return

    const result: ABTestResult = {
      testId,
      variantId: variant.id,
      userId: this.getUserId(),
      timestamp: new Date(),
      event,
      value
    }

    // Enviar a analytics
    this.sendToAnalytics(result)
    
    // Guardar localmente para debugging
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('ab_events') || '[]')
      stored.push(result)
      localStorage.setItem('ab_events', JSON.stringify(stored.slice(-100))) // Mantener últimos 100
    }
  }

  private sendToAnalytics(result: ABTestResult) {
    // Enviar a Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_event', {
        event_category: 'AB Testing',
        event_label: `${result.testId}_${result.variantId}`,
        value: result.value
      })
    }

    // Enviar a Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ABTestEvent', {
        test_id: result.testId,
        variant_id: result.variantId,
        event_name: result.event,
        value: result.value
      })
    }

    // Enviar a tu backend para análisis detallado
    fetch('/api/ab-test/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    }).catch(console.error)
  }

  // Obtener configuración para un test
  getTestConfig(testId: string): Record<string, any> {
    const variant = this.getVariant(testId)
    return variant?.config || {}
  }

  // Cargar variantes desde localStorage al inicializar
  loadStoredVariants() {
    if (typeof window === 'undefined') return
    
    try {
      const stored = JSON.parse(localStorage.getItem('ab_variants') || '{}')
      const userId = this.getUserId()
      
      if (!this.userVariants.has(userId)) {
        this.userVariants.set(userId, new Map())
      }
      
      const userTestVariants = this.userVariants.get(userId)!
      Object.entries(stored).forEach(([testId, variantId]) => {
        userTestVariants.set(testId, variantId as string)
      })
    } catch (error) {
      console.error('Error loading stored AB test variants:', error)
    }
  }
}

// Hook para usar A/B testing en React con soporte para hidratación
export function useABTest(testId: string) {
  const manager = ABTestManager.getInstance()

  // Solo ejecutar en el cliente para evitar problemas de hidratación
  if (typeof window === 'undefined') {
    return {
      variant: null,
      config: {},
      track: () => {},
      isInTest: false
    }
  }

  // Cargar variantes almacenadas al inicializar
  manager.loadStoredVariants()

  const variant = manager.getVariant(testId)
  const config = manager.getTestConfig(testId)

  const track = (event: string, value?: number) => {
    manager.trackEvent(testId, event, value)
  }

  return {
    variant,
    config,
    track,
    isInTest: variant !== null
  }
}

// Funciones helper
export const abTestManager = ABTestManager.getInstance()

export function getABTestVariant(testId: string) {
  return abTestManager.getVariant(testId)
}

export function trackABTestEvent(testId: string, event: string, value?: number) {
  abTestManager.trackEvent(testId, event, value)
}
