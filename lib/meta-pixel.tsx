// Meta Pixel (Facebook Pixel) integration
import React from 'react'

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '123456789'

// Declaración de tipos para fbq
declare global {
  interface Window {
    fbq: any
    _fbq: any
  }
}

// Inicializar Meta Pixel
export const initMetaPixel = () => {
  if (typeof window !== 'undefined' && !window.fbq) {
    // Cargar el script de Meta Pixel
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)

    // Inicializar fbq
    window.fbq = function() {
      if (window.fbq.callMethod) {
        window.fbq.callMethod.apply(window.fbq, arguments)
      } else {
        window.fbq.queue.push(arguments)
      }
    }
    
    if (!window._fbq) window._fbq = window.fbq
    window.fbq.push = window.fbq
    window.fbq.loaded = true
    window.fbq.version = '2.0'
    window.fbq.queue = []

    // Inicializar con el ID del pixel
    window.fbq('init', META_PIXEL_ID)
    window.fbq('track', 'PageView')
  }
}

// Eventos estándar de Meta Pixel
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

export const trackLead = (data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', data)
  }
}

export const trackContact = (data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact', data)
  }
}

export const trackSchedule = (data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Schedule', data)
  }
}

export const trackCompleteRegistration = (data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', data)
  }
}

// Eventos personalizados
export const trackWhatsAppClick = (data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'WhatsAppClick', {
      content_name: 'WhatsApp CTA',
      ...data
    })
  }
}

export const trackDownloadClick = (data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'DownloadClick', {
      content_name: 'Plan Completo Download',
      ...data
    })
  }
}

export const trackServiceInterest = (serviceName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ServiceInterest', {
      content_name: serviceName,
      content_category: 'Marketing Service',
      ...data
    })
  }
}

// Componente para insertar el noscript del pixel
export const MetaPixelNoscript = () => (
  <noscript>
    <img
      height={1}
      width={1}
      style={{ display: 'none' }}
      src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
      alt=""
    />
  </noscript>
)
