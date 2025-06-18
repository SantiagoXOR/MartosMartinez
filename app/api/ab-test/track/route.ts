import { NextRequest, NextResponse } from 'next/server'
import { type ABTestResult } from '@/lib/ab-testing'

// En una implementación real, esto se conectaría a una base de datos
const testResults: ABTestResult[] = []

export async function POST(request: NextRequest) {
  try {
    const result: ABTestResult = await request.json()
    
    // Validar datos
    if (!result.testId || !result.variantId || !result.event) {
      return NextResponse.json(
        { error: 'Datos de test incompletos' },
        { status: 400 }
      )
    }

    // Agregar timestamp si no existe
    if (!result.timestamp) {
      result.timestamp = new Date()
    }

    // Guardar resultado (en producción, usar base de datos)
    testResults.push(result)

    // Enviar a servicios de analytics externos
    await Promise.allSettled([
      sendToMixpanel(result),
      sendToAmplitude(result),
      sendToCustomAnalytics(result)
    ])

    return NextResponse.json(
      { success: true, message: 'Evento de A/B test registrado' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error tracking A/B test event:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('testId')
    
    if (!testId) {
      return NextResponse.json(
        { error: 'testId es requerido' },
        { status: 400 }
      )
    }

    // Filtrar resultados por test
    const filteredResults = testResults.filter(r => r.testId === testId)
    
    // Calcular estadísticas básicas
    const stats = calculateTestStats(filteredResults)
    
    return NextResponse.json({
      testId,
      totalEvents: filteredResults.length,
      stats,
      results: filteredResults.slice(-100) // Últimos 100 eventos
    })

  } catch (error) {
    console.error('Error getting A/B test results:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Funciones helper para enviar a servicios externos
async function sendToMixpanel(result: ABTestResult) {
  if (!process.env.MIXPANEL_TOKEN) return

  try {
    const response = await fetch('https://api.mixpanel.com/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'AB Test Event',
        properties: {
          token: process.env.MIXPANEL_TOKEN,
          distinct_id: result.userId,
          test_id: result.testId,
          variant_id: result.variantId,
          event_name: result.event,
          event_value: result.value,
          time: Math.floor(result.timestamp.getTime() / 1000)
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Mixpanel API error: ${response.status}`)
    }
  } catch (error) {
    console.error('Error sending to Mixpanel:', error)
  }
}

async function sendToAmplitude(result: ABTestResult) {
  if (!process.env.AMPLITUDE_API_KEY) return

  try {
    const response = await fetch('https://api2.amplitude.com/2/httpapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.AMPLITUDE_API_KEY,
        events: [{
          user_id: result.userId,
          event_type: 'AB Test Event',
          event_properties: {
            test_id: result.testId,
            variant_id: result.variantId,
            event_name: result.event,
            event_value: result.value
          },
          time: result.timestamp.getTime()
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Amplitude API error: ${response.status}`)
    }
  } catch (error) {
    console.error('Error sending to Amplitude:', error)
  }
}

async function sendToCustomAnalytics(result: ABTestResult) {
  // Implementar integración con tu sistema de analytics personalizado
  console.log('Custom analytics:', result)
}

// Calcular estadísticas del test
function calculateTestStats(results: ABTestResult[]) {
  const variantStats = new Map()
  
  results.forEach(result => {
    if (!variantStats.has(result.variantId)) {
      variantStats.set(result.variantId, {
        variantId: result.variantId,
        totalEvents: 0,
        uniqueUsers: new Set(),
        eventTypes: new Map(),
        totalValue: 0
      })
    }
    
    const stats = variantStats.get(result.variantId)
    stats.totalEvents++
    stats.uniqueUsers.add(result.userId)
    
    if (!stats.eventTypes.has(result.event)) {
      stats.eventTypes.set(result.event, 0)
    }
    stats.eventTypes.set(result.event, stats.eventTypes.get(result.event) + 1)
    
    if (result.value) {
      stats.totalValue += result.value
    }
  })
  
  // Convertir a formato serializable
  const serializedStats = Array.from(variantStats.values()).map(stats => ({
    variantId: stats.variantId,
    totalEvents: stats.totalEvents,
    uniqueUsers: stats.uniqueUsers.size,
    eventTypes: Object.fromEntries(stats.eventTypes),
    totalValue: stats.totalValue,
    avgValue: stats.totalEvents > 0 ? stats.totalValue / stats.totalEvents : 0
  }))
  
  return serializedStats
}
