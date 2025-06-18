"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Target,
  Users,
  MessageCircle,
  Instagram,
  Facebook,
  Linkedin,
  BarChart3,
  Heart,
  CheckCircle,
  Calendar,
  Download,
  Star,
  Megaphone,
  Globe,
  Brain,
  Lightbulb,
  Phone,
  Mail,
  User,
  Building,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Eye,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { testimonials, services, siteConfig, getFeaturedTestimonials, getServicesByOrder } from "@/lib/content"
import { trackFormSubmission, trackWhatsAppClick, trackDownloadClick } from "@/lib/analytics"
import { useABTest } from "@/lib/ab-testing"

// Esquema de validación para el formulario de contacto
const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  company: z.string().optional(),
  service: z.string().min(1, "Selecciona un servicio"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  acceptTerms: z.boolean().refine(val => val === true, "Debes aceptar los términos y condiciones")
})

type ContactFormData = z.infer<typeof contactFormSchema>

// Componente de formulario de contacto
function ContactForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
      acceptTerms: false
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      // Tracking de analytics
      trackFormSubmission('contact')

      // Simular envío del formulario (aquí integrarías con tu backend)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // En una implementación real, aquí enviarías los datos a:
      // - Tu CRM (HubSpot, Salesforce, etc.)
      // - Servicio de email (SendGrid, Mailchimp)
      // - Base de datos
      // - Webhook de automatización

      // Mostrar mensaje de éxito
      toast({
        title: "¡Mensaje enviado!",
        description: "Te contactaremos pronto para agendar tu consulta gratuita.",
      })

      // Limpiar formulario y cerrar modal
      form.reset()
      onClose()

    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu mensaje. Intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input placeholder="tu@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono *</FormLabel>
                <FormControl>
                  <Input placeholder="+54 9 11 1234-5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa/Inmobiliaria</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de tu empresa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servicio de interés *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="branding">Branding & Posicionamiento</SelectItem>
                  <SelectItem value="captacion">Captación de Prospectos</SelectItem>
                  <SelectItem value="fidelizacion">Fidelización & Referidos</SelectItem>
                  <SelectItem value="completo">Plan Completo (3 Etapas)</SelectItem>
                  <SelectItem value="consultoria">Consultoría Personalizada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cuéntanos sobre tu proyecto y objetivos..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  Acepto los términos y condiciones y autorizo el tratamiento de mis datos personales *
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-blue-ribbon-700 hover:bg-blue-ribbon-800 transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </div>
            ) : (
              "Enviar mensaje"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}

// Componente para agendar citas
function ScheduleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
  ]

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Por favor selecciona fecha y hora",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Tracking de analytics
      trackFormSubmission('schedule')

      // Simular agendamiento (aquí integrarías con Calendly, Google Calendar, etc.)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // En una implementación real, aquí integrarías con:
      // - Calendly API
      // - Google Calendar API
      // - Microsoft Outlook API
      // - Tu sistema de CRM

      toast({
        title: "¡Cita agendada!",
        description: `Tu consulta está programada para el ${selectedDate} a las ${selectedTime}. Te enviaremos un recordatorio.`,
      })

      onClose()

    } catch (error) {
      toast({
        title: "Error",
        description: "No pudimos agendar tu cita. Intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-ribbon-700">
            Agendá tu Consulta Gratuita
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="date" className="text-sm font-medium">
              Fecha preferida
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">
              Horario preferido
            </Label>
            <Select onValueChange={setSelectedTime}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona un horario" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time} hs
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-ribbon-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-ribbon-700 mb-2">
              En esta consulta gratuita:
            </h4>
            <ul className="text-sm text-blue-ribbon-600 space-y-1">
              <li>• Analizaremos tu situación actual</li>
              <li>• Identificaremos oportunidades de mejora</li>
              <li>• Te mostraremos casos de éxito similares</li>
              <li>• Diseñaremos una estrategia personalizada</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSchedule}
              className="flex-1 bg-blue-ribbon-700 hover:bg-blue-ribbon-800 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Agendando...
                </div>
              ) : (
                "Confirmar cita"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente para mostrar detalles de cada etapa en popup
function StageDetailsModal({
  isOpen,
  onClose,
  stageNumber
}: {
  isOpen: boolean;
  onClose: () => void;
  stageNumber: number | null;
}) {
  if (!stageNumber) return null;

  const stageData = {
    1: {
      title: "Branding & Posicionamiento",
      subtitle: "Construimos tu identidad digital desde cero",
      actions: [
        "Envío de contrato y método de pago",
        "Creación de grupo de WhatsApp y minuta inicial",
        "Envío de formularios: público objetivo, propuesta de valor, identidad visual",
        "Análisis de estado de cuentas, accesos y conexión con administrador Meta",
        "Desarrollo de identidad visual: logo, paleta, tipografía, moodboard",
        "Optimización o creación de perfiles en redes sociales",
        "Configuración de seguridad, biografías, links y gráficas"
      ],
      color: "from-blue-ribbon-600 to-blue-ribbon-700"
    },
    2: {
      title: "Captación de Prospectos",
      subtitle: "Generamos leads calificados para tu negocio",
      actions: [
        "Planificación mensual de campañas publicitarias",
        "Diseño de anuncios según etapa del embudo (TOFU, MOFU, BOFU)",
        "Segmentación basada en públicos objetivos definidos",
        "Diseño de piezas gráficas (flyers, reels, stories)",
        "Calendarización y seguimiento diario de anuncios",
        "Reportes periódicos con métricas, ROI, CPL",
        "Gestión de leads en planilla compartida",
        "Asesoramiento en respuesta rápida y seguimiento"
      ],
      color: "from-blue-ribbon-700 to-blue-ribbon-800"
    },
    3: {
      title: "Fidelización & Referidos",
      subtitle: "Convertimos clientes en embajadores de tu marca",
      actions: [
        "Implementación de WhatsApp Business: etiquetas, catálogos, respuestas",
        "Segmentación de contactos, descarga y organización en planilla",
        "Diseño y programación de campañas personalizadas",
        "Calendarización según tipo de contacto (prospecto, referido, cliente activo)",
        "Apoyo para publicar propiedades en Facebook Marketplace",
        "Atención diaria, soporte técnico y coordinación continua"
      ],
      color: "from-blue-ribbon-800 to-blue-ribbon-900"
    }
  };

  const stage = stageData[stageNumber as keyof typeof stageData];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className={`bg-gradient-to-r ${stage.color} text-white p-6 -m-6 mb-6 rounded-t-lg`}>
            <div>
              <Badge className="bg-white/20 text-white border-0 mb-3">
                Etapa {stageNumber}
              </Badge>
              <DialogTitle className="text-2xl font-bold mb-2">
                {stage.title}
              </DialogTitle>
              <p className="text-blue-ribbon-100 text-lg">
                {stage.subtitle}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Todas las acciones incluidas en este sprint:
          </h3>

          <div className="space-y-3">
            {stage.actions.map((action, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-ribbon-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-ribbon-700 font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {action}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-ribbon-50 rounded-lg border border-blue-ribbon-200">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-blue-ribbon-600 mr-2" />
              <h4 className="font-semibold text-blue-ribbon-800">
                ¿Listo para implementar esta etapa?
              </h4>
            </div>
            <p className="text-blue-ribbon-700 text-sm mb-4">
              Cada acción está diseñada para maximizar resultados y generar un impacto medible en tu negocio.
            </p>
            <div className="flex gap-3">
              <Button
                className="bg-blue-ribbon-700 hover:bg-blue-ribbon-800 text-white"
                onClick={() => {
                  onClose();
                  // Aquí podrías abrir el modal de contacto o redirigir a WhatsApp
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Consultar por esta etapa
              </Button>
              <Button
                variant="outline"
                className="border-blue-ribbon-300 text-blue-ribbon-700 hover:bg-blue-ribbon-50"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Component() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Estado para controlar qué popup de detalles está abierto
  const [detailsModalOpen, setDetailsModalOpen] = useState<number | null>(null)

  // A/B Testing hooks - solo se ejecutan en el cliente
  const heroCTATest = useABTest('hero-cta-test')
  const pricingTest = useABTest('pricing-display-test')

  // Efecto para detectar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Función para abrir WhatsApp
  const openWhatsApp = () => {
    trackWhatsAppClick()
    const message = encodeURIComponent("¡Hola! Me interesa conocer más sobre sus servicios de marketing inmobiliario.")
    const phoneNumber = siteConfig.phone.replace(/\s+/g, '').replace('+', '')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-ribbon-950 via-blue-ribbon-800 to-blue-ribbon-950 font-sans">
      {/* Skip Links for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-blue-ribbon-700 px-4 py-2 rounded-md font-medium z-50"
      >
        Saltar al contenido principal
      </a>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/Recurso 3.svg"
              alt="Martos Martinez Logo"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="#servicios"
              className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-sm"
            >
              Servicios
            </Link>
            <Link
              href="#testimonios"
              className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-sm"
            >
              Testimonios
            </Link>
            <Link
              href="#contacto"
              className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-sm"
            >
              Contacto
            </Link>
            <Button
              size="sm"
              className="bg-cyan-500 text-white hover:bg-cyan-600 font-bold transition-all duration-300"
              onClick={() => setIsContactModalOpen(true)}
            >
              Consulta Gratis
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20 animate-in slide-in-from-top duration-200">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="#servicios"
                className="block text-blue-ribbon-700 hover:text-blue-ribbon-900 font-medium py-2 border-b border-blue-ribbon-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  Servicios
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
              <Link
                href="#testimonios"
                className="block text-blue-ribbon-700 hover:text-blue-ribbon-900 font-medium py-2 border-b border-blue-ribbon-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  Testimonios
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
              <Link
                href="#contacto"
                className="block text-blue-ribbon-700 hover:text-blue-ribbon-900 font-medium py-2 border-b border-blue-ribbon-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  Contacto
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
              <Button
                className="w-full bg-cyan-500 text-white hover:bg-cyan-600 font-bold transition-all duration-300"
                onClick={() => {
                  setIsContactModalOpen(true)
                  setIsMobileMenuOpen(false)
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Consulta Gratuita
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Bento Grid Layout */}
      <main id="main-content" className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Hero Section - Large Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="lg:col-span-9 bg-gradient-to-br from-blue-ribbon-700 to-blue-ribbon-800 text-white border-0 overflow-hidden relative animate-in fade-in slide-in-from-left duration-700 drop-shadow-2xl ring-1 ring-white/20">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <div className="relative z-10">
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4 ui-label">
                  Marketing Inmobiliario Especializado
                </Badge>
                <h1 className="heading-hero mb-4 text-balance">
                  Potenciá tu marca inmobiliaria en <span className="text-secondary">3 pasos</span>
                </h1>
                <p className="subheading-large text-white/90 mb-8 max-w-2xl text-pretty">
                  Una estrategia digital especializada para <strong className="text-secondary text-emphasis">captar, posicionar y fidelizar</strong> clientes
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className={`${isClient ? (heroCTATest.config.buttonColor || 'bg-secondary') : 'bg-secondary'} hover:bg-secondary/90 text-accent button-text`}
                        onClick={() => isClient && heroCTATest.track('hero_cta_click')}
                      >
                        <Target className="mr-2 h-5 w-5" />
                        {isClient ? (heroCTATest.config.buttonText || 'Quiero conocer el plan') : 'Quiero conocer el plan'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-blue-ribbon-700">
                          Solicita tu Consulta Gratuita
                        </DialogTitle>
                      </DialogHeader>
                      <ContactForm onClose={() => setIsContactModalOpen(false)} />
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-blue-800 border-white hover:bg-blue-100 font-semibold transition-all duration-300"
                    onClick={() => setIsScheduleModalOpen(true)}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Agendá una llamada
                  </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 bg-gradient-to-br from-secondary to-secondary/80 text-accent border-0 animate-in fade-in slide-in-from-right duration-700 delay-200 drop-shadow-lg">
            <CardContent className="p-4 h-full flex flex-col justify-center">
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto mb-3 text-accent" />
                <h3 className="text-2xl font-bold mb-1">+85%</h3>
                <p className="text-accent/80 font-medium text-sm">comienza online</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Overview - 3 Steps Summary - Simplified */}
        <section className="mb-8">
          <div className="text-center mb-8">
            <h2 className="heading-section text-white mb-4 text-balance">
              Nuestro Sistema en <span className="text-secondary">3 Etapas</span>
            </h2>
            <p className="body-large text-slate-200 max-w-2xl mx-auto text-pretty">
              Un proceso probado que transforma tu presencia digital
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {getServicesByOrder().map((service, index) => {
              const IconComponent = service.icon === 'Megaphone' ? Megaphone :
                                  service.icon === 'Target' ? Target : Heart
              return (
                <div key={service.id} className="relative">
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:ring-1 hover:ring-secondary/30 hover:scale-102 hover:shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-secondary/20 rounded-full p-3 group-hover:bg-secondary/30 transition-colors">
                          <IconComponent className="h-8 w-8 text-secondary" />
                        </div>
                      </div>

                      <Badge className="bg-secondary/20 text-secondary border-secondary/30 ui-label mb-3">
                        Etapa {service.order}
                      </Badge>

                      <h3 className="heading-small mb-2">{service.title}</h3>

                      <div className="bg-secondary/10 rounded-lg p-3 mb-3">
                        <p className="body-small text-emphasis text-secondary">{service.results}</p>
                      </div>

                      <div className="text-center">
                        <p className="ui-caption text-slate-200 mb-1">{service.duration}</p>
                        <p className="text-emphasis text-secondary">{service.price}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow connector for desktop */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-secondary" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>


        </section>

        {/* Services Grid - Detailed View */}
        <section id="servicios" className="mb-8">
          <div className="text-center mb-8">
            <h2 className="heading-section text-white mb-4 text-balance">
              Detalle de cada <span className="text-secondary">Etapa</span>
            </h2>
            <p className="body-large text-slate-200 max-w-3xl mx-auto text-pretty">
              Conocé exactamente qué incluye cada fase de nuestro proceso
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {getServicesByOrder().map((service, index) => {
              const IconComponent = service.icon === 'Megaphone' ? Megaphone :
                                  service.icon === 'Target' ? Target : Heart
              return (
                <Card key={service.id} className={`bg-gradient-to-br ${service.color} text-white border-0 hover:scale-105 hover:shadow-2xl transition-all duration-300 group cursor-pointer drop-shadow-lg ring-1 ring-white/10 relative overflow-hidden`}>
                  {/* Elemento visual conceptual de fondo */}
                  <div className="absolute right-2 top-2 opacity-20 pointer-events-none">
                    {service.order === 1 && (
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white/30 rounded-full relative">
                          <div className="absolute inset-1 border border-white/20 rounded-full"></div>
                        </div>
                      </div>
                    )}
                    {service.order === 2 && (
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/30 rounded-full relative">
                          <div className="absolute inset-0.5 bg-white/20 rounded-full"></div>
                        </div>
                      </div>
                    )}
                    {service.order === 3 && (
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-6 bg-white/30 rounded-full"></div>
                          <div className="w-2 h-6 bg-white/20 rounded-full"></div>
                          <div className="w-2 h-6 bg-white/30 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-white/20 text-white border-0 ui-label group-hover:bg-white/30 transition-colors">
                        Etapa {service.order}
                      </Badge>
                      <IconComponent className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardTitle className="heading-card">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-emphasis ui-caption mb-2 text-white/90">✅ Acciones concretas:</h4>
                      <div className="space-y-2 body-small">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/20 rounded-lg p-3 space-y-2">
                      <div>
                        <p className="ui-caption text-emphasis text-white/80">🎯 BENEFICIO PRINCIPAL</p>
                        <p className="body-small text-strong">{service.results}</p>
                      </div>
                      <div>
                        <p className="ui-caption text-emphasis text-white/80">💬 RESULTADO ESPERADO</p>
                        <p className="body-small">Mejora significativa en {service.order === 1 ? 'visibilidad y reconocimiento' : service.order === 2 ? 'generación de leads calificados' : 'retención y referidos'}</p>
                      </div>
                    </div>

                    {(!isClient || pricingTest.config.showPricing !== false) && (
                      <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-white/70">🕒 Tiempo</p>
                          <p className="font-bold text-sm">{service.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/70">💰 Precio</p>
                          <p className="font-bold text-sm">{service.price}</p>
                        </div>
                      </div>
                    )}

                    {/* Botón para abrir popup de detalles */}
                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setDetailsModalOpen(service.order)
                        }}
                        className="flex items-center text-cyan-300 hover:text-cyan-100 text-sm font-medium transition-colors duration-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver todas las acciones del sprint
                      </button>


                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Botón para ver detalles completos - al final de la sección */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-accent font-bold text-lg py-6 px-8 shadow-2xl hover:shadow-secondary/25 transition-all duration-300 hover:scale-105 ring-2 ring-secondary/30 hover:ring-secondary/50"
              onClick={() => setIsContactModalOpen(true)}
            >
              <Calendar className="mr-3 h-6 w-6" />
              Quiero implementar este sistema completo
            </Button>
            <p className="text-blue-ribbon-200 text-sm mt-3 font-medium">
              Consulta gratuita • Sin compromiso • Resultados garantizados
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-8">
          <div className="text-center mb-8">
            <h2 className="heading-section text-white mb-4 text-balance">
              ¿Por qué elegirnos?
            </h2>
            <p className="body-large text-blue-ribbon-200 max-w-3xl mx-auto text-pretty">
              Ventajas que nos diferencian en el mercado inmobiliario
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 transition-all duration-300 hover:scale-102">
              <CardContent className="p-5 text-center">
                <Target className="h-10 w-10 mx-auto mb-3 text-secondary/80" />
                <h3 className="text-lg font-semibold mb-2">Especialización</h3>
                <p className="text-slate-200 text-sm">100% enfocados en el sector inmobiliario</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 transition-all duration-300 hover:scale-102">
              <CardContent className="p-5 text-center">
                <BarChart3 className="h-10 w-10 mx-auto mb-3 text-secondary/80" />
                <h3 className="text-lg font-semibold mb-2">Resultados Medibles</h3>
                <p className="text-slate-200 text-sm">Métricas claras y reportes detallados</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 transition-all duration-300 hover:scale-102">
              <CardContent className="p-5 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-secondary/80" />
                <h3 className="text-lg font-semibold mb-2">Acompañamiento</h3>
                <p className="text-slate-200 text-sm">Soporte personalizado en cada etapa</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 transition-all duration-300 hover:scale-102">
              <CardContent className="p-5 text-center">
                <Lightbulb className="h-10 w-10 mx-auto mb-3 text-secondary/80" />
                <h3 className="text-lg font-semibold mb-2">Innovación</h3>
                <p className="text-slate-200 text-sm">Últimas tendencias y tecnologías</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Strategic Research Section - Optional/Expandible */}
        <section className="mb-8">
          <Card className="bg-white/5 backdrop-blur-md border-white/10 text-white">
            <CardHeader className="cursor-pointer hover:bg-white/5 transition-all duration-300 rounded-lg" onClick={() => {
              const content = document.getElementById('research-content')
              const icon = document.getElementById('research-icon')
              if (content && icon) {
                content.classList.toggle('hidden')
                if (!content.classList.contains('hidden')) {
                  content.classList.add('animate-in', 'slide-in-from-top-2', 'fade-in', 'duration-300')
                }
                icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)'
              }
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    ¿Por qué este plan funciona?
                  </CardTitle>
                  <p className="text-blue-ribbon-200 text-sm font-medium mt-1">
                    Fundamentos estratégicos y análisis de mercado
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-semibold">
                    Respaldo Estratégico
                  </Badge>
                  <ArrowRight
                    id="research-icon"
                    className="h-5 w-5 text-secondary transition-transform duration-300"
                    style={{transform: 'rotate(0deg)'}}
                  />
                </div>
              </div>
            </CardHeader>

            <div id="research-content" className="hidden">
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Perfil Demográfico */}
                  <Card className="bg-blue-ribbon-600/20 border-blue-ribbon-400/30 text-white relative overflow-hidden">
                    {/* Ícono conceptual de demografía */}
                    <div className="absolute right-2 top-2 opacity-20 pointer-events-none">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-0.5">
                          <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">Perfil Demográfico</CardTitle>
                        <Users className="h-5 w-5 text-secondary" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <p className="font-bold text-secondary">Edad:</p>
                        <p className="opacity-90 font-medium">25-35 años</p>
                      </div>
                      <div>
                        <p className="font-bold text-secondary">Estado civil:</p>
                        <p className="opacity-90 font-medium">Parejas jóvenes o individuos solteros</p>
                      </div>
                      <div>
                        <p className="font-bold text-secondary">Ingresos:</p>
                        <p className="opacity-90 font-medium">Medios a bajos, acceso limitado a créditos</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Perfil Psicográfico */}
                  <Card className="bg-blue-ribbon-600/20 border-blue-ribbon-400/30 text-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">Perfil Psicográfico</CardTitle>
                        <Brain className="h-5 w-5 text-secondary" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <p className="font-bold text-secondary">Motivaciones:</p>
                        <ul className="space-y-1 text-xs opacity-90">
                          <li>• Independencia habitacional</li>
                          <li>• Construir hogar desde cero</li>
                          <li>• Soluciones económicas</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-secondary">Frustraciones:</p>
                        <ul className="space-y-1 text-xs opacity-90">
                          <li>• Dificultad para créditos</li>
                          <li>• Seguridad jurídica</li>
                          <li>• Falta de información</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Estadísticas Clave */}
                  <Card className="bg-blue-ribbon-600/20 border-blue-ribbon-400/30 text-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">Estadísticas Clave</CardTitle>
                        <BarChart3 className="h-5 w-5 text-secondary" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><strong className="text-secondary">85%</strong> comienza online</p>
                      <p><strong className="text-secondary">42.9%</strong> déficit cuantitativo</p>
                      <p><strong className="text-secondary">52.9%</strong> jóvenes sin vivienda propia</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </div>
          </Card>
        </section>

        {/* Testimonials */}
        <section id="testimonios" className="mb-8">
          <div className="text-center mb-8">
            <h2 className="heading-section text-white mb-4 text-balance">
              Casos de <span className="text-secondary">Éxito</span>
            </h2>
            <p className="body-large text-blue-ribbon-200 max-w-3xl mx-auto text-pretty">
              Resultados reales de inmobiliarias que confiaron en nuestro proceso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getFeaturedTestimonials().map((testimonial, index) => {
              const etapaLabels = ['Branding', 'Captación', 'Fidelización']
              return (
                <Card key={index} className={`bg-gradient-to-br ${testimonial.color} text-white border-0 hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
                  {/* Silueta de cliente estilo Trustpilot */}
                  <div className="absolute right-4 bottom-4 opacity-15 pointer-events-none">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-white/30 rounded-full relative">
                        <div className="absolute top-1 left-1.5 w-3 h-2 bg-white/40 rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-3 bg-white/40 rounded-b-full"></div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-white/20 text-white border-0 font-semibold">
                        Etapa {index + 1}: {etapaLabels[index]}
                      </Badge>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-secondary fill-current" />
                        ))}
                      </div>
                    </div>

                    <blockquote className="text-sm mb-4 font-medium leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>

                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                        <span className="text-sm font-bold">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{testimonial.name}</p>
                        <p className="text-xs opacity-90 font-medium">{testimonial.company}</p>
                        <div className="flex items-center mt-1">
                          <Building className="h-3 w-3 mr-1 opacity-70" />
                          <span className="text-xs opacity-70">Inmobiliaria</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Final CTA - Enhanced */}
        <section id="contacto" className="mb-8">
          <Card className="bg-gradient-to-r from-blue-ribbon-700 via-blue-ribbon-800 to-blue-ribbon-900 text-white border-0 relative overflow-hidden">
            <CardContent className="p-8 lg:p-16 text-center relative z-10">
              <div className="max-w-4xl mx-auto">
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-6 ui-label text-lg px-4 py-2">
                  🚀 Transformá tu negocio HOY
                </Badge>

                <h2 className="heading-hero mb-6 text-balance">
                  ¿Listo para <span className="text-secondary">transformar</span> tu presencia digital?
                </h2>

                <p className="subheading-large text-blue-ribbon-100 mb-4 max-w-3xl mx-auto text-pretty">
                  Cada día sin estrategia es una oportunidad perdida.
                </p>

                <p className="body-large text-blue-ribbon-200 mb-10 max-w-2xl mx-auto text-pretty">
                  Únete a las inmobiliarias que ya están dominando el mercado digital
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="bg-secondary hover:bg-secondary/90 text-accent button-text text-lg py-6 px-8 shadow-2xl hover:shadow-secondary/25 transition-all duration-300 hover:scale-105"
                      >
                        <Calendar className="mr-3 h-6 w-6" />
                        Agendá una reunión gratuita
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  <Button
                    size="lg"
                    className="bg-blue-ribbon-600 hover:bg-blue-ribbon-500 button-text text-lg py-6 px-8 shadow-2xl hover:shadow-blue-ribbon-500/25 transition-all duration-300 hover:scale-105"
                    onClick={openWhatsApp}
                  >
                    <MessageCircle className="mr-3 h-6 w-6" />
                    WhatsApp Directo
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-blue-800 border-white hover:bg-blue-100 button-text text-lg py-6 px-8 transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      trackDownloadClick()
                      // Aquí puedes agregar la lógica para descargar un PDF
                      alert("Funcionalidad de descarga próximamente disponible")
                    }}
                  >
                    <Download className="mr-3 h-6 w-6" />
                    Descargá el plan completo
                  </Button>
                </div>

                <div className="mt-8 flex items-center justify-center space-x-6 text-slate-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                    <span className="text-sm font-medium">Consulta 100% gratuita</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                    <span className="text-sm font-medium">Sin compromiso</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                    <span className="text-sm font-medium">Resultados garantizados</span>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -translate-y-48 translate-x-48"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* CTA Fijo Móvil */}
      <div className="fixed bottom-4 inset-x-4 sm:hidden z-50">
        <Button
          className="w-full bg-cyan-600 text-white py-4 rounded-xl shadow-2xl hover:bg-cyan-700 transition-all duration-300 font-bold text-lg"
          onClick={() => setIsContactModalOpen(true)}
        >
          <Calendar className="mr-2 h-5 w-5" />
          Agendá una reunión
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-blue-ribbon-950 text-white py-12 px-4 mt-12 mb-20 sm:mb-0">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/Recurso 3.svg"
                  alt="Martos Martinez Logo"
                  width={160}
                  height={48}
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-slate-200 body-small">
                {siteConfig.description}
              </p>
            </div>

            <div>
              <h3 className="text-emphasis mb-4">Servicios</h3>
              <ul className="space-y-2 body-small text-slate-200">
                {getServicesByOrder().map((service) => (
                  <li key={service.id}>{service.title}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-emphasis mb-4">Contacto</h3>
              <ul className="space-y-2 body-small text-slate-200">
                <li>📧 {siteConfig.email}</li>
                <li>📱 {siteConfig.phone}</li>
                <li>📍 {siteConfig.address}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-emphasis mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 hover:text-white transition-all duration-200 hover:scale-110"
                  aria-label="Síguenos en Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 hover:text-white transition-all duration-200 hover:scale-110"
                  aria-label="Síguenos en Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 hover:text-white transition-all duration-200 hover:scale-110"
                  aria-label="Síguenos en LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-ribbon-800 mt-8 pt-8 text-center text-sm text-slate-200">
            <p className="font-medium">
              &copy; {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de agendamiento */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* Modal de detalles de etapas */}
      <StageDetailsModal
        isOpen={detailsModalOpen !== null}
        onClose={() => setDetailsModalOpen(null)}
        stageNumber={detailsModalOpen}
      />
    </div>
  )
}
