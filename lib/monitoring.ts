// Monitoring and Health Check System

export interface HealthCheck {
  service: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  responseTime: number
  timestamp: Date
  error?: string
  details?: Record<string, any>
}

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: Date
  tags?: Record<string, string>
}

export interface ErrorReport {
  id: string
  message: string
  stack?: string
  url: string
  userAgent: string
  userId?: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, any>
}

class MonitoringService {
  private static instance: MonitoringService
  private healthChecks: HealthCheck[] = []
  private performanceMetrics: PerformanceMetric[] = []
  private errorReports: ErrorReport[] = []

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  // Health Checks
  async checkHealth(): Promise<HealthCheck[]> {
    const checks: HealthCheck[] = []

    // Check API endpoints
    checks.push(await this.checkAPIHealth())
    
    // Check external services
    checks.push(await this.checkExternalServices())
    
    // Check database (if applicable)
    checks.push(await this.checkDatabaseHealth())
    
    // Check performance
    checks.push(await this.checkPerformanceHealth())

    this.healthChecks = checks
    return checks
  }

  private async checkAPIHealth(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const responseTime = Date.now() - startTime
      
      if (response.ok) {
        return {
          service: 'API',
          status: responseTime < 1000 ? 'healthy' : 'degraded',
          responseTime,
          timestamp: new Date(),
          details: { statusCode: response.status }
        }
      } else {
        return {
          service: 'API',
          status: 'unhealthy',
          responseTime,
          timestamp: new Date(),
          error: `HTTP ${response.status}`,
          details: { statusCode: response.status }
        }
      }
    } catch (error) {
      return {
        service: 'API',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async checkExternalServices(): Promise<HealthCheck> {
    const startTime = Date.now()
    const services = []

    // Check Google Analytics
    if (process.env.NEXT_PUBLIC_GA_ID) {
      try {
        const response = await fetch('https://www.google-analytics.com/analytics.js', { method: 'HEAD' })
        services.push({ name: 'Google Analytics', status: response.ok })
      } catch {
        services.push({ name: 'Google Analytics', status: false })
      }
    }

    // Check Meta Pixel
    if (process.env.NEXT_PUBLIC_META_PIXEL_ID) {
      try {
        const response = await fetch('https://connect.facebook.net/en_US/fbevents.js', { method: 'HEAD' })
        services.push({ name: 'Meta Pixel', status: response.ok })
      } catch {
        services.push({ name: 'Meta Pixel', status: false })
      }
    }

    const allHealthy = services.every(s => s.status)
    const responseTime = Date.now() - startTime

    return {
      service: 'External Services',
      status: allHealthy ? 'healthy' : 'degraded',
      responseTime,
      timestamp: new Date(),
      details: { services }
    }
  }

  private async checkDatabaseHealth(): Promise<HealthCheck> {
    // Placeholder for database health check
    // En una implementación real, aquí verificarías la conexión a la base de datos
    return {
      service: 'Database',
      status: 'healthy',
      responseTime: 50,
      timestamp: new Date(),
      details: { type: 'file-based' }
    }
  }

  private async checkPerformanceHealth(): Promise<HealthCheck> {
    if (typeof window === 'undefined') {
      return {
        service: 'Performance',
        status: 'healthy',
        responseTime: 0,
        timestamp: new Date(),
        details: { environment: 'server' }
      }
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')
    
    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
    const lcp = navigation.loadEventEnd - navigation.loadEventStart
    
    const isHealthy = fcp < 2500 && lcp < 4000

    return {
      service: 'Performance',
      status: isHealthy ? 'healthy' : 'degraded',
      responseTime: Math.round(lcp),
      timestamp: new Date(),
      details: {
        fcp: Math.round(fcp),
        lcp: Math.round(lcp),
        ttfb: Math.round(navigation.responseStart - navigation.requestStart)
      }
    }
  }

  // Performance Monitoring
  trackPerformanceMetric(name: string, value: number, unit: string, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      tags
    }

    this.performanceMetrics.push(metric)
    
    // Send to external monitoring service
    this.sendToMonitoringService(metric)
  }

  // Error Reporting
  reportError(error: Error | string, severity: ErrorReport['severity'] = 'medium', context?: Record<string, any>) {
    const errorReport: ErrorReport = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      userId: this.getUserId(),
      timestamp: new Date(),
      severity,
      context
    }

    this.errorReports.push(errorReport)
    
    // Send to error tracking service
    this.sendToErrorTracking(errorReport)
  }

  private getUserId(): string {
    if (typeof window === 'undefined') return 'server'
    return localStorage.getItem('user_id') || 'anonymous'
  }

  private async sendToMonitoringService(metric: PerformanceMetric) {
    try {
      // Send to DataDog, New Relic, or custom monitoring
      await fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      })
    } catch (error) {
      console.error('Failed to send metric to monitoring service:', error)
    }
  }

  private async sendToErrorTracking(errorReport: ErrorReport) {
    try {
      // Send to Sentry, Bugsnag, or custom error tracking
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      })
    } catch (error) {
      console.error('Failed to send error to tracking service:', error)
    }
  }

  // Uptime Monitoring
  async checkUptime(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', { 
        method: 'GET',
        timeout: 5000 
      } as any)
      return response.ok
    } catch {
      return false
    }
  }

  // Get monitoring dashboard data
  getMonitoringData() {
    return {
      healthChecks: this.healthChecks,
      performanceMetrics: this.performanceMetrics.slice(-100), // Last 100 metrics
      errorReports: this.errorReports.slice(-50), // Last 50 errors
      uptime: this.calculateUptime()
    }
  }

  private calculateUptime(): number {
    const healthyChecks = this.healthChecks.filter(check => check.status === 'healthy').length
    const totalChecks = this.healthChecks.length
    return totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 100
  }
}

// Sentry Integration
export class SentryIntegration {
  static init(dsn: string) {
    if (typeof window === 'undefined') return

    // Sentry initialization would go here
    console.log('Sentry initialized with DSN:', dsn)
  }

  static captureException(error: Error, context?: Record<string, any>) {
    // Send to Sentry
    console.error('Sentry capture:', error, context)
  }
}

// DataDog Integration
export class DataDogIntegration {
  static init(apiKey: string, applicationId: string) {
    if (typeof window === 'undefined') return

    // DataDog RUM initialization would go here
    console.log('DataDog initialized')
  }

  static addRumGlobalContext(key: string, value: any) {
    // Add global context to DataDog RUM
    console.log('DataDog context:', key, value)
  }
}

// Auto-initialize monitoring
export const monitoring = MonitoringService.getInstance()

// Set up global error handling
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    monitoring.reportError(event.error || event.message, 'high', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    monitoring.reportError(event.reason, 'high', {
      type: 'unhandled_promise_rejection'
    })
  })

  // Track performance metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      
      const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      const lcp = navigation.loadEventEnd - navigation.loadEventStart
      
      monitoring.trackPerformanceMetric('first_contentful_paint', fcp, 'ms')
      monitoring.trackPerformanceMetric('load_complete', lcp, 'ms')
    }, 0)
  })
}
