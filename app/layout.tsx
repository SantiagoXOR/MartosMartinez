import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { MetaPixelNoscript } from '@/lib/meta-pixel'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    default: 'Martos Martinez - Marketing Inmobiliario Especializado',
    template: '%s | Martos Martinez'
  },
  description: 'Potenciá tu marca inmobiliaria en 3 pasos: Branding & Posicionamiento, Captación de Prospectos y Fidelización. Especialistas en marketing digital para el sector inmobiliario en Argentina.',
  keywords: [
    'marketing inmobiliario',
    'branding inmobiliario',
    'captación leads inmobiliarios',
    'fidelización clientes inmobiliarios',
    'marketing digital inmobiliario',
    'publicidad inmobiliaria',
    'redes sociales inmobiliarias',
    'Meta Ads inmobiliario',
    'WhatsApp inmobiliario',
    'CRM inmobiliario'
  ],
  authors: [{ name: 'Martos Martinez', url: 'https://martosmarketing.com' }],
  creator: 'Martos Martinez',
  publisher: 'Martos Martinez',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://martosmarketing.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Martos Martinez - Marketing Inmobiliario Especializado',
    description: 'Potenciá tu marca inmobiliaria en 3 pasos. Especialistas en marketing digital para el sector inmobiliario.',
    url: 'https://martosmarketing.com',
    siteName: 'Martos Martinez',
    images: [
      {
        url: '/logo-martos-martinez.png',
        width: 1200,
        height: 630,
        alt: 'Martos Martinez - Marketing Inmobiliario',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Martos Martinez - Marketing Inmobiliario',
    description: 'Especialistas en marketing digital para el sector inmobiliario',
    images: ['/logo-martos-martinez.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Agregar código real
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Martos Martinez",
    "description": "Especialistas en marketing digital para el sector inmobiliario",
    "url": "https://martosmarketing.com",
    "logo": "https://martosmarketing.com/logo-martos-martinez.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+54-9-11-1234-5678",
      "contactType": "customer service",
      "availableLanguage": "Spanish"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AR",
      "addressLocality": "Buenos Aires"
    },
    "sameAs": [
      "https://www.instagram.com/martosmarketing",
      "https://www.facebook.com/martosmarketing",
      "https://www.linkedin.com/company/martosmarketing"
    ],
    "offers": {
      "@type": "Service",
      "name": "Marketing Inmobiliario",
      "description": "Servicios de marketing digital especializados para el sector inmobiliario"
    }
  }

  return (
    <html lang="es">
      <head>
        {/* Preload de fuentes críticas para mejorar performance */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;0,900;1,300;1,400;1,600;1,700;1,900&display=swap"
          as="style"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          as="style"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <MetaPixelNoscript />

        {children}
        <Toaster />
      </body>
    </html>
  )
}
