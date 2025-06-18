import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Basic health checks
    const checks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        api: true,
        database: await checkDatabase(),
        external_services: await checkExternalServices(),
        environment_variables: checkEnvironmentVariables()
      }
    }

    const responseTime = Date.now() - startTime
    
    // Determine overall health
    const allChecksHealthy = Object.values(checks.checks).every(check => check === true)
    
    return NextResponse.json(
      {
        ...checks,
        status: allChecksHealthy ? 'healthy' : 'degraded',
        response_time_ms: responseTime
      },
      { 
        status: allChecksHealthy ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        response_time_ms: Date.now() - startTime
      },
      { status: 503 }
    )
  }
}

async function checkDatabase(): Promise<boolean> {
  try {
    // En una implementación real, aquí verificarías la conexión a la base de datos
    // Por ejemplo, con Prisma: await prisma.$queryRaw`SELECT 1`
    // Por ahora, simulamos que está funcionando
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

async function checkExternalServices(): Promise<boolean> {
  try {
    const checks = []

    // Check if we can reach Google Analytics
    if (process.env.NEXT_PUBLIC_GA_ID) {
      try {
        const response = await fetch('https://www.google-analytics.com/analytics.js', {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        })
        checks.push(response.ok)
      } catch {
        checks.push(false)
      }
    }

    // Check if we can reach Meta Pixel
    if (process.env.NEXT_PUBLIC_META_PIXEL_ID) {
      try {
        const response = await fetch('https://connect.facebook.net/en_US/fbevents.js', {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        })
        checks.push(response.ok)
      } catch {
        checks.push(false)
      }
    }

    // If no external services configured, consider it healthy
    if (checks.length === 0) return true

    // Return true if at least 80% of services are healthy
    const healthyServices = checks.filter(check => check).length
    return (healthyServices / checks.length) >= 0.8

  } catch (error) {
    console.error('External services health check failed:', error)
    return false
  }
}

function checkEnvironmentVariables(): boolean {
  const requiredVars: string[] = [
    // Add your required environment variables here
    // 'DATABASE_URL',
    // 'NEXTAUTH_SECRET',
  ]

  const optionalVars: string[] = [
    'NEXT_PUBLIC_GA_ID',
    'NEXT_PUBLIC_META_PIXEL_ID',
    'HUBSPOT_API_KEY',
    'SENDGRID_API_KEY'
  ]

  // Check required variables
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`Required environment variable ${varName} is missing`)
      return false
    }
  }

  // Log missing optional variables (but don't fail)
  for (const varName of optionalVars) {
    if (!process.env[varName]) {
      console.warn(`Optional environment variable ${varName} is missing`)
    }
  }

  return true
}

// Detailed health check endpoint
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const { detailed = false } = body

    if (!detailed) {
      return GET(request)
    }

    // Detailed health checks
    const detailedChecks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      system: {
        platform: process.platform,
        arch: process.arch,
        node_version: process.version,
        cpu_usage: await getCPUUsage(),
        load_average: process.platform !== 'win32' ? require('os').loadavg() : null
      },
      checks: {
        api: true,
        database: await checkDatabase(),
        external_services: await checkExternalServices(),
        environment_variables: checkEnvironmentVariables(),
        disk_space: await checkDiskSpace(),
        network: await checkNetworkConnectivity()
      },
      performance: {
        response_time_ms: Date.now() - startTime,
        requests_per_minute: await getRequestsPerMinute(),
        error_rate: await getErrorRate()
      }
    }

    const allChecksHealthy = Object.values(detailedChecks.checks).every(check => check === true)
    
    return NextResponse.json(
      {
        ...detailedChecks,
        status: allChecksHealthy ? 'healthy' : 'degraded'
      },
      { 
        status: allChecksHealthy ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    )

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        response_time_ms: Date.now() - startTime
      },
      { status: 503 }
    )
  }
}

async function getCPUUsage(): Promise<number> {
  return new Promise((resolve) => {
    const startUsage = process.cpuUsage()
    setTimeout(() => {
      const endUsage = process.cpuUsage(startUsage)
      const totalUsage = endUsage.user + endUsage.system
      const percentage = (totalUsage / 1000000) * 100 // Convert to percentage
      resolve(Math.round(percentage * 100) / 100)
    }, 100)
  })
}

async function checkDiskSpace(): Promise<boolean> {
  try {
    // En un entorno real, verificarías el espacio en disco
    // Por ahora, simulamos que está bien
    return true
  } catch {
    return false
  }
}

async function checkNetworkConnectivity(): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000)
    })
    return response.ok
  } catch {
    return false
  }
}

async function getRequestsPerMinute(): Promise<number> {
  // En una implementación real, esto vendría de tu sistema de métricas
  return Math.floor(Math.random() * 100) + 50
}

async function getErrorRate(): Promise<number> {
  // En una implementación real, esto vendría de tu sistema de métricas
  return Math.random() * 5 // 0-5% error rate
}
