// Heatmap and User Behavior Tracking

export interface ClickEvent {
  id: string
  timestamp: Date
  x: number
  y: number
  elementTag: string
  elementId?: string
  elementClass?: string
  elementText?: string
  pageUrl: string
  viewportWidth: number
  viewportHeight: number
  userId: string
  sessionId: string
}

export interface ScrollEvent {
  id: string
  timestamp: Date
  scrollY: number
  maxScroll: number
  pageHeight: number
  viewportHeight: number
  pageUrl: string
  userId: string
  sessionId: string
}

export interface HoverEvent {
  id: string
  timestamp: Date
  x: number
  y: number
  elementTag: string
  elementId?: string
  elementClass?: string
  duration: number
  pageUrl: string
  userId: string
  sessionId: string
}

class HeatmapTracker {
  private static instance: HeatmapTracker
  private userId: string
  private sessionId: string
  private isTracking: boolean = false
  private clickEvents: ClickEvent[] = []
  private scrollEvents: ScrollEvent[] = []
  private hoverEvents: HoverEvent[] = []
  private hoverStartTime: number = 0
  private lastScrollTime: number = 0

  constructor() {
    this.userId = this.getUserId()
    this.sessionId = this.getSessionId()
  }

  static getInstance(): HeatmapTracker {
    if (!HeatmapTracker.instance) {
      HeatmapTracker.instance = new HeatmapTracker()
    }
    return HeatmapTracker.instance
  }

  private getUserId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let userId = localStorage.getItem('heatmap_user_id')
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('heatmap_user_id', userId)
    }
    return userId
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let sessionId = sessionStorage.getItem('heatmap_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('heatmap_session_id', sessionId)
    }
    return sessionId
  }

  startTracking() {
    if (typeof window === 'undefined' || this.isTracking) return

    this.isTracking = true
    
    // Track clicks
    document.addEventListener('click', this.handleClick.bind(this))
    
    // Track scrolling
    document.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })
    
    // Track mouse movements and hovers
    document.addEventListener('mouseenter', this.handleMouseEnter.bind(this), true)
    document.addEventListener('mouseleave', this.handleMouseLeave.bind(this), true)
    
    // Send data periodically
    setInterval(() => {
      this.sendBatchData()
    }, 30000) // Every 30 seconds
    
    // Send data before page unload
    window.addEventListener('beforeunload', () => {
      this.sendBatchData()
    })
  }

  stopTracking() {
    if (!this.isTracking) return
    
    this.isTracking = false
    document.removeEventListener('click', this.handleClick.bind(this))
    document.removeEventListener('scroll', this.handleScroll.bind(this))
    document.removeEventListener('mouseenter', this.handleMouseEnter.bind(this), true)
    document.removeEventListener('mouseleave', this.handleMouseLeave.bind(this), true)
    
    // Send remaining data
    this.sendBatchData()
  }

  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (!target) return

    const clickEvent: ClickEvent = {
      id: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      x: event.clientX,
      y: event.clientY,
      elementTag: target.tagName.toLowerCase(),
      elementId: target.id || undefined,
      elementClass: target.className || undefined,
      elementText: target.textContent?.slice(0, 100) || undefined,
      pageUrl: window.location.href,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      userId: this.userId,
      sessionId: this.sessionId
    }

    this.clickEvents.push(clickEvent)
    
    // Send immediately for important elements
    if (target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' ||
        target.getAttribute('role') === 'button') {
      this.sendClickEvent(clickEvent)
    }
  }

  private handleScroll() {
    const now = Date.now()
    if (now - this.lastScrollTime < 100) return // Throttle to every 100ms
    this.lastScrollTime = now

    const scrollEvent: ScrollEvent = {
      id: `scroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      scrollY: window.scrollY,
      maxScroll: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight,
      pageHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      viewportHeight: window.innerHeight,
      pageUrl: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId
    }

    this.scrollEvents.push(scrollEvent)
  }

  private handleMouseEnter(event: MouseEvent) {
    this.hoverStartTime = Date.now()
  }

  private handleMouseLeave(event: MouseEvent) {
    if (this.hoverStartTime === 0) return

    const target = event.target as HTMLElement
    if (!target) return

    const duration = Date.now() - this.hoverStartTime
    if (duration < 500) return // Only track hovers longer than 500ms

    const hoverEvent: HoverEvent = {
      id: `hover_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      x: event.clientX,
      y: event.clientY,
      elementTag: target.tagName.toLowerCase(),
      elementId: target.id || undefined,
      elementClass: target.className || undefined,
      duration,
      pageUrl: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId
    }

    this.hoverEvents.push(hoverEvent)
    this.hoverStartTime = 0
  }

  private async sendClickEvent(event: ClickEvent) {
    try {
      await fetch('/api/heatmap/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Error sending click event:', error)
    }
  }

  private async sendBatchData() {
    if (this.clickEvents.length === 0 && 
        this.scrollEvents.length === 0 && 
        this.hoverEvents.length === 0) return

    try {
      await fetch('/api/heatmap/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clicks: this.clickEvents,
          scrolls: this.scrollEvents,
          hovers: this.hoverEvents
        })
      })

      // Clear sent events
      this.clickEvents = []
      this.scrollEvents = []
      this.hoverEvents = []
    } catch (error) {
      console.error('Error sending batch data:', error)
    }
  }

  // Get analytics data for admin dashboard
  async getAnalytics(timeRange: 'day' | 'week' | 'month' = 'week') {
    try {
      const response = await fetch(`/api/heatmap/analytics?range=${timeRange}`)
      return await response.json()
    } catch (error) {
      console.error('Error getting analytics:', error)
      return null
    }
  }
}

// Integration with popular heatmap services
export class HotjarIntegration {
  static init(siteId: string) {
    if (typeof window === 'undefined') return

    // Hotjar tracking code
    ;(function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments) }
      h._hjSettings = { hjid: siteId, hjsv: 6 }
      a = o.getElementsByTagName('head')[0]
      r = o.createElement('script')
      r.async = 1
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
      a.appendChild(r)
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
  }

  static trackEvent(eventName: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).hj) {
      ;(window as any).hj('event', eventName, properties)
    }
  }
}

export class FullStoryIntegration {
  static init(orgId: string) {
    if (typeof window === 'undefined') return

    // FullStory tracking code
    ;(function(m: any, n: any, e: any, t: any, l: any) {
      let o: any, g: any, y: any
      if (e in m) { if (m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].') } return }
      g = m[e] = function(a: any, b: any, s: any) { g.q ? g.q.push([a, b, s]) : g._api(a, b, s) }
      g.q = []
      o = n.createElement(t)
      o.async = 1
      o.crossOrigin = 'anonymous'
      o.src = 'https://edge.fullstory.com/s/fs.js'
      y = n.getElementsByTagName(t)[0]
      y.parentNode.insertBefore(o, y)
      g.identify = function(i: any, v: any, s: any) { g(l, { uid: i }, s); if (v) g(l, v, s) }
      g.setUserVars = function(v: any, s: any) { g(l, v, s) }
      g.event = function(i: any, v: any, s: any) { g('event', { n: i, p: v }, s) }
      g.anonymize = function() { g.identify(false) }
      g.shutdown = function() { g('rec', false) }
      g.restart = function() { g('rec', true) }
      g.log = function(a: any, s: any) { g('log', [a], s) }
      g.consent = function(a: any) { g('consent', !arguments.length || a) }
      g.identifyAccount = function(i: any, v: any) { o = 'account'; v = v || {}; v.acctId = i; g(o, v) }
      g.clearUserCookie = function() {}
      g.setVars = function(n: any, p: any) { g('setVars', [n, p]) }
      g._w = {}
      y = 'XMLHttpRequest'
      g._w[y] = m[y]
      y = 'fetch'
      g._w[y] = m[y]
      if (m[y]) m[y] = function() { return g._w[y].apply(this, arguments) }
      g._v = '1.3.0'
    })(window, document, (window as any)['_fs_namespace'] || 'FS', 'script', 'user')
  }

  static trackEvent(eventName: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).FS) {
      ;(window as any).FS('event', eventName, properties)
    }
  }
}

// Export singleton instance
export const heatmapTracker = HeatmapTracker.getInstance()

// Auto-start tracking when module loads (in browser)
if (typeof window !== 'undefined') {
  // Start tracking after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      heatmapTracker.startTracking()
    })
  } else {
    heatmapTracker.startTracking()
  }
}
