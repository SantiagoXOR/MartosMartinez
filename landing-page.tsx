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

export default function Component() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

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
              src="/logo-martos-martinez.png"
              alt="Martos Martinez Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="#servicios"
              className="text-white/80 hover:text-white transition-colors font-medium hover:scale-105 transform duration-200"
            >
              Servicios
            </Link>
            <Link
              href="#testimonios"
              className="text-white/80 hover:text-white transition-colors font-medium hover:scale-105 transform duration-200"
            >
              Testimonios
            </Link>
            <Link
              href="#contacto"
              className="text-white/80 hover:text-white transition-colors font-medium hover:scale-105 transform duration-200"
            >
              Contacto
            </Link>
            <Button
              size="sm"
              className="bg-secondary hover:bg-secondary/90 text-accent font-bold"
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
                className="w-full bg-blue-ribbon-700 hover:bg-blue-ribbon-800 text-white font-bold"
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
      <main id="main-content" className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section - Large Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <Card className="lg:col-span-8 bg-gradient-to-br from-blue-ribbon-700 to-blue-ribbon-800 text-white border-0 overflow-hidden relative animate-in fade-in slide-in-from-left duration-700">
            <CardContent className="p-8 lg:p-12">
              <div className="relative z-10">
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4 font-semibold">
                  Marketing Inmobiliario Especializado
                </Badge>
                <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                  🎯 Potenciá tu Marca Inmobiliaria en <span className="text-secondary">3 pasos</span>
                </h1>
                <p className="text-lg text-blue-ribbon-100 mb-8 max-w-2xl font-medium">
                  Te ayudamos a posicionarte, captar prospectos y fidelizar clientes con una estrategia digital hecha
                  para vos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className={`${isClient ? (heroCTATest.config.buttonColor || 'bg-secondary') : 'bg-secondary'} hover:bg-secondary/90 text-accent font-bold`}
                        onClick={() => isClient && heroCTATest.track('hero_cta_click')}
                      >
                        <Target className="mr-2 h-5 w-5" />
                        {isClient ? (heroCTATest.config.buttonText || 'Consulta Gratis') : 'Consulta Gratis'}
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
                    className="border-white/30 text-white hover:bg-white/10 font-semibold"
                    onClick={() => setIsScheduleModalOpen(true)}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Agendá tu llamada
                  </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 bg-gradient-to-br from-secondary to-secondary/80 text-accent border-0 animate-in fade-in slide-in-from-right duration-700 delay-200">
            <CardContent className="p-6 h-full flex flex-col justify-center">
              <div className="text-center">
                <Globe className="h-16 w-16 mx-auto mb-4 text-accent" />
                <h3 className="text-3xl font-bold mb-2">+85%</h3>
                <p className="text-accent/80 font-medium">de los compradores comienzan online</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <section id="servicios" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <h2 className="sr-only">Nuestros Servicios de Marketing Inmobiliario</h2>
          {getServicesByOrder().map((service, index) => {
            const IconComponent = service.icon === 'Megaphone' ? Megaphone :
                                service.icon === 'Target' ? Target : Heart
            return (
              <Card key={service.id} className={`bg-gradient-to-br ${service.color} text-white border-0 hover:scale-105 hover:shadow-2xl transition-all duration-300 group cursor-pointer`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-white/20 text-white border-0 font-semibold group-hover:bg-white/30 transition-colors">
                      Etapa {service.order}
                    </Badge>
                    <IconComponent className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm font-medium">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-sm font-bold">📈 {service.results}</p>
                    {(!isClient || pricingTest.config.showPricing !== false) && (
                      <p className="text-xs opacity-90 font-medium">💰 {service.price} | 🕒 {service.duration}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

        {/* Mixed Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Perfil Demográfico */}
          <Card className="lg:col-span-4 bg-gradient-to-br from-blue-ribbon-600 to-blue-ribbon-700 text-white border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Perfil Demográfico</CardTitle>
                <Users className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-bold">Edad:</p>
                <p className="opacity-90 font-medium">25-35 años</p>
              </div>
              <div>
                <p className="font-bold">Estado civil:</p>
                <p className="opacity-90 font-medium">Parejas jóvenes o individuos solteros</p>
              </div>
              <div>
                <p className="font-bold">Ingresos:</p>
                <p className="opacity-90 font-medium">Medios a bajos, acceso limitado a créditos tradicionales</p>
              </div>
            </CardContent>
          </Card>

          {/* Público Objetivo */}
          <Card className="lg:col-span-5 bg-gradient-to-br from-secondary to-secondary/80 text-accent border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Público Objetivo</CardTitle>
                <Target className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">
                Jóvenes o parejas de ingresos medios/bajos buscando su primer terreno.
              </p>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card className="lg:col-span-3 bg-white text-blue-ribbon-950 border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Estadísticas</CardTitle>
                <BarChart3 className="h-6 w-6 text-blue-ribbon-700" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm font-medium">
              <p>
                <strong className="text-blue-ribbon-700">42.9%</strong> déficit cuantitativo
              </p>
              <p>
                <strong className="text-blue-ribbon-700">57.1%</strong> déficit cualitativo
              </p>
              <p>
                <strong className="text-blue-ribbon-700">52.9%</strong> jóvenes sin vivienda propia
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Perfil Psicográfico - Large Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <Card className="lg:col-span-8 bg-white text-blue-ribbon-950 border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">Perfil Psicográfico</CardTitle>
                <Brain className="h-8 w-8 text-blue-ribbon-700" />
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-blue-ribbon-700 mb-2">Motivaciones:</h4>
                <ul className="space-y-1 text-sm font-medium">
                  <li>• Obtener independencia habitacional</li>
                  <li>• Construir hogar desde cero</li>
                  <li>• Buscar soluciones económicas</li>
                  <li>• Invertir en patrimonio a largo plazo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-blue-ribbon-700 mb-2">Frustraciones:</h4>
                <ul className="space-y-1 text-sm font-medium">
                  <li>• Dificultad para acceder a créditos</li>
                  <li>• Preocupaciones sobre seguridad jurídica</li>
                  <li>• Falta de información clara</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 bg-gradient-to-br from-blue-ribbon-700 to-blue-ribbon-800 text-white border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Mapa de Empatía</CardTitle>
                <Heart className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-bold">Qué piensa:</p>
                <p className="opacity-90 font-medium">"Quiero un lugar propio para mi familia"</p>
              </div>
              <div>
                <p className="font-bold">Qué ve:</p>
                <p className="opacity-90 font-medium">Publicidades de desarrollos con planes accesibles</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Objeciones */}
          <Card className="bg-gradient-to-br from-blue-ribbon-300 to-blue-ribbon-500 text-white border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Objeciones Frecuentes</CardTitle>
                <MessageCircle className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm font-medium">
              <p>• ¿Cómo financio sin crédito hipotecario?</p>
              <p>• ¿Qué garantías tengo?</p>
              <p>• ¿Cuánto tiempo tomará construir?</p>
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          <Card className="bg-gradient-to-br from-blue-ribbon-500 to-blue-ribbon-700 text-white border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Recomendaciones</CardTitle>
                <Lightbulb className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm font-medium">
              <p>• Guías paso a paso</p>
              <p>• Videos explicativos</p>
              <p>• Testimonios de clientes</p>
              <p>• Comparativas de financiamiento</p>
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-accent border-0">
            <CardContent className="p-6 text-center h-full flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-4">¿Listo para empezar?</h3>
              <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-ribbon-700 text-white hover:bg-blue-ribbon-800 font-bold">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendá tu consulta
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <section id="testimonios" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <h2 className="sr-only">Testimonios de Clientes</h2>
          {getFeaturedTestimonials().map((testimonial, index) => (
            <Card key={index} className={`bg-gradient-to-br ${testimonial.color} text-white border-0`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-secondary fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm mb-4 font-medium">"{testimonial.text}"</blockquote>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{testimonial.name}</p>
                    <p className="text-xs opacity-90 font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Final CTA */}
        <section id="contacto">
        <Card className="bg-gradient-to-r from-blue-ribbon-700 to-blue-ribbon-800 text-white border-0">
          <CardContent className="p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">¿Listo para transformar tu presencia digital?</h2>
            <p className="text-xl text-blue-ribbon-100 mb-8 max-w-2xl mx-auto font-medium">
              No esperes más. Cada día que pasa sin una estrategia digital es una oportunidad perdida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-accent font-bold">
                    <Calendar className="mr-2 h-5 w-5" />
                    Agendá una reunión gratuita
                  </Button>
                </DialogTrigger>
              </Dialog>

              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold"
                onClick={() => {
                  trackDownloadClick()
                  // Aquí puedes agregar la lógica para descargar un PDF
                  alert("Funcionalidad de descarga próximamente disponible")
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Descargá el plan completo
              </Button>

              <Button
                size="lg"
                className="bg-blue-ribbon-600 hover:bg-blue-ribbon-700 font-bold"
                onClick={openWhatsApp}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Directo
              </Button>
            </div>
          </CardContent>
        </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-ribbon-950 text-white py-12 px-4 mt-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/logo-martos-martinez.png"
                  alt="Martos Martinez Logo"
                  width={96}
                  height={32}
                  className="h-8 w-auto brightness-0 invert"
                />
                <span className="text-xl font-bold">{siteConfig.name}</span>
              </div>
              <p className="text-blue-ribbon-200 text-sm font-medium">
                {siteConfig.description}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Servicios</h3>
              <ul className="space-y-2 text-sm text-blue-ribbon-200 font-medium">
                {getServicesByOrder().map((service) => (
                  <li key={service.id}>{service.title}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-blue-ribbon-200 font-medium">
                <li>📧 {siteConfig.email}</li>
                <li>📱 {siteConfig.phone}</li>
                <li>📍 {siteConfig.address}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-ribbon-200 hover:text-white transition-all duration-200 hover:scale-110"
                  aria-label="Síguenos en Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-ribbon-200 hover:text-white transition-all duration-200 hover:scale-110"
                  aria-label="Síguenos en Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-ribbon-200 hover:text-white transition-all duration-200 hover:scale-110"
                  aria-label="Síguenos en LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-ribbon-800 mt-8 pt-8 text-center text-sm text-blue-ribbon-200">
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
    </div>
  )
}
