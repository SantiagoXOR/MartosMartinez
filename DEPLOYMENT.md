# 🚀 GUÍA DE DEPLOYMENT - LANDING PAGE MARTOS MARTINEZ

## 📋 RESUMEN

Esta guía te ayudará a deployar la landing page de marketing inmobiliario en producción con todas las funcionalidades y monitoreo configurado.

**✅ ESTADO ACTUAL:** Todos los errores de compilación han sido resueltos. El proyecto compila correctamente y está listo para deployment.

---

## 🔧 ERRORES RESUELTOS

**Fecha de resolución:** 18 de Junio, 2025

Antes del deployment, se identificaron y resolvieron los siguientes errores de compilación:

### Errores Principales Corregidos:
- ✅ **JSX en archivos .ts** - Corregido cambiando extensiones a .tsx
- ✅ **Tags HTML mal cerrados** - Corregido en landing-page.tsx
- ✅ **Tipos TypeScript** - Corregido manejo de errores en APIs
- ✅ **Configuración de librerías** - Corregido Google Analytics y FullStory

**Resultado:** Build exitoso con 0 errores de TypeScript.

Para detalles completos, ver: `ERRORES_RESUELTOS.md`

---

## 🔧 PREREQUISITOS

### Cuentas Necesarias
- [ ] **Vercel** (recomendado) o Netlify para hosting
- [ ] **Google Analytics** para tracking
- [ ] **Meta Business** para Facebook Pixel
- [ ] **HubSpot/Salesforce** para CRM (opcional)
- [ ] **SendGrid/Mailchimp** para email marketing (opcional)
- [ ] **Sentry** para error tracking (opcional)

### Dominios y DNS
- [ ] Dominio registrado (ej: martosmarketing.com)
- [ ] Acceso a configuración DNS

---

## 🚀 DEPLOYMENT EN VERCEL (RECOMENDADO)

### 1. Preparación del Repositorio

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd landing-page-martos-martinez

# Instalar dependencias
npm install

# Verificar que todo funcione localmente
npm run dev
```

### 2. Configurar Variables de Entorno

Crear archivo `.env.local` con las siguientes variables:

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Meta Pixel
NEXT_PUBLIC_META_PIXEL_ID=123456789

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5491112345678

# Site URL
NEXT_PUBLIC_SITE_URL=https://martosmarketing.com

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CRM Integration (opcional)
HUBSPOT_API_KEY=your-hubspot-api-key
HUBSPOT_PORTAL_ID=your-portal-id
SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com
SALESFORCE_ACCESS_TOKEN=your-access-token

# Email Marketing (opcional)
SENDGRID_API_KEY=your-sendgrid-api-key
MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_LIST_ID=your-list-id

# Monitoring (opcional)
SENTRY_DSN=your-sentry-dsn
DATADOG_API_KEY=your-datadog-api-key
```

### 3. Deploy en Vercel

#### Opción A: Desde GitHub
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. Deploy automático en cada push

#### Opción B: Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 4. Configurar Dominio Personalizado

1. En Vercel Dashboard → Settings → Domains
2. Agregar tu dominio: `martosmarketing.com`
3. Configurar DNS según las instrucciones de Vercel

---

## 🌐 DEPLOYMENT EN NETLIFY

### 1. Build Settings
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Deploy
1. Conectar repositorio en Netlify
2. Configurar variables de entorno
3. Deploy automático

---

## 📊 CONFIGURACIÓN DE ANALYTICS

### Google Analytics 4
1. Crear propiedad en Google Analytics
2. Obtener Measurement ID (G-XXXXXXXXXX)
3. Configurar en variables de entorno

### Meta Pixel
1. Crear pixel en Meta Business Manager
2. Obtener Pixel ID
3. Configurar en variables de entorno

### Eventos Personalizados
Los siguientes eventos se trackean automáticamente:
- `form_submit` - Envío de formularios
- `whatsapp_click` - Clicks en WhatsApp
- `download_click` - Descargas de contenido
- `ab_test_event` - Eventos de A/B testing

---

## 🔗 INTEGRACIÓN CON CRM

### HubSpot
1. Crear cuenta en HubSpot
2. Generar API key en Settings → Integrations
3. Configurar en variables de entorno

### Salesforce
1. Crear Connected App en Salesforce
2. Obtener tokens de acceso
3. Configurar en variables de entorno

---

## 📧 EMAIL MARKETING

### SendGrid
1. Crear cuenta en SendGrid
2. Generar API key
3. Configurar templates de email

### Mailchimp
1. Crear cuenta en Mailchimp
2. Generar API key
3. Crear lista de contactos

---

## 🔍 MONITOREO Y ALERTAS

### Health Checks
- Endpoint: `/api/health`
- Monitoreo automático cada 5 minutos
- Alertas por email/Slack en caso de fallas

### Error Tracking con Sentry
```bash
# Instalar Sentry
npm install @sentry/nextjs

# Configurar
npx @sentry/wizard -i nextjs
```

### Uptime Monitoring
Servicios recomendados:
- **UptimeRobot** (gratuito)
- **Pingdom**
- **StatusCake**

---

## 🔒 SEGURIDAD

### Headers de Seguridad
Configurados automáticamente en `next.config.mjs`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

### SSL/TLS
- Vercel/Netlify proporcionan SSL automático
- Verificar que HTTPS esté habilitado

### Variables de Entorno
- Nunca commitear archivos `.env`
- Usar variables de entorno para datos sensibles
- Rotar API keys regularmente

---

## 📈 OPTIMIZACIÓN POST-DEPLOYMENT

### Performance
1. Verificar Core Web Vitals en PageSpeed Insights
2. Optimizar imágenes si es necesario
3. Configurar CDN para assets estáticos

### SEO
1. Verificar sitemap.xml: `/sitemap.xml`
2. Verificar robots.txt: `/robots.txt`
3. Configurar Google Search Console
4. Configurar Bing Webmaster Tools

### A/B Testing
1. Configurar tests en `lib/ab-testing.ts`
2. Monitorear resultados en analytics
3. Iterar basado en datos

---

## 🚨 TROUBLESHOOTING

### Problemas Comunes

#### Build Failures
```bash
# Limpiar cache
npm run clean
rm -rf .next node_modules
npm install
npm run build
```

#### Variables de Entorno
- Verificar que todas las variables estén configuradas
- Reiniciar deployment después de cambios

#### Performance Issues
- Verificar bundle size: `npm run analyze`
- Optimizar imágenes
- Revisar Core Web Vitals

### Logs y Debugging
```bash
# Ver logs en Vercel
vercel logs

# Ver logs en tiempo real
vercel logs --follow
```

---

## 📞 SOPORTE

### Contactos de Emergencia
- **Desarrollador**: [tu-email@ejemplo.com]
- **Hosting**: Soporte de Vercel/Netlify
- **Dominio**: Soporte del registrar

### Documentación Adicional
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Analytics Setup](https://support.google.com/analytics)

---

## ✅ CHECKLIST POST-DEPLOYMENT

- [ ] Sitio accesible en dominio principal
- [ ] SSL/HTTPS funcionando
- [ ] Google Analytics recibiendo datos
- [ ] Meta Pixel funcionando
- [ ] Formularios enviando emails
- [ ] WhatsApp integration funcionando
- [ ] Health checks pasando
- [ ] Sitemap.xml accesible
- [ ] Robots.txt configurado
- [ ] Error tracking configurado
- [ ] Monitoreo de uptime activo
- [ ] Backups configurados
- [ ] DNS configurado correctamente

---

**¡Deployment Completado! 🎉**

Tu landing page está ahora en producción y lista para generar leads.
