"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { testimonials, services, siteConfig, type Testimonial, type Service } from "@/lib/content"
import { Trash2, Edit, Plus, Save } from "lucide-react"

export default function ContentManager() {
  const [activeTab, setActiveTab] = useState("testimonials")
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleSaveTestimonial = (testimonial: Testimonial) => {
    // En una implementación real, esto se conectaría a una API
    console.log("Guardando testimonial:", testimonial)
    setEditingTestimonial(null)
  }

  const handleSaveService = (service: Service) => {
    // En una implementación real, esto se conectaría a una API
    console.log("Guardando servicio:", service)
    setEditingService(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Gestión de Contenido
          </h1>
          <p className="text-gray-600">
            Administra testimonios, servicios y configuración del sitio
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="config">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gestión de Testimonios</h2>
              <Button onClick={() => setEditingTestimonial({
                id: '',
                name: '',
                company: '',
                text: '',
                rating: 5,
                color: 'from-blue-ribbon-400 to-blue-ribbon-600',
                featured: false
              })}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Testimonio
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <p className="text-sm text-gray-600">{testimonial.company}</p>
                      </div>
                      <div className="flex gap-2">
                        {testimonial.featured && (
                          <Badge variant="secondary">Destacado</Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTestimonial(testimonial)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-2">"{testimonial.text}"</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Rating: {testimonial.rating}/5</span>
                      <span>ID: {testimonial.id}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {editingTestimonial && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>
                    {editingTestimonial.id ? 'Editar' : 'Nuevo'} Testimonio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={editingTestimonial.name}
                        onChange={(e) => setEditingTestimonial({
                          ...editingTestimonial,
                          name: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={editingTestimonial.company}
                        onChange={(e) => setEditingTestimonial({
                          ...editingTestimonial,
                          company: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="text">Testimonio</Label>
                    <Textarea
                      id="text"
                      value={editingTestimonial.text}
                      onChange={(e) => setEditingTestimonial({
                        ...editingTestimonial,
                        text: e.target.value
                      })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Select
                        value={editingTestimonial.rating.toString()}
                        onValueChange={(value) => setEditingTestimonial({
                          ...editingTestimonial,
                          rating: parseInt(value)
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating} estrella{rating > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Select
                        value={editingTestimonial.color}
                        onValueChange={(value) => setEditingTestimonial({
                          ...editingTestimonial,
                          color: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="from-blue-ribbon-400 to-blue-ribbon-600">Azul Claro</SelectItem>
                          <SelectItem value="from-blue-ribbon-500 to-blue-ribbon-700">Azul Medio</SelectItem>
                          <SelectItem value="from-blue-ribbon-600 to-blue-ribbon-800">Azul Oscuro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={editingTestimonial.featured}
                        onCheckedChange={(checked) => setEditingTestimonial({
                          ...editingTestimonial,
                          featured: checked
                        })}
                      />
                      <Label htmlFor="featured">Destacado</Label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => handleSaveTestimonial(editingTestimonial)}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={() => setEditingTestimonial(null)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gestión de Servicios</h2>
              <Button onClick={() => setEditingService({
                id: '',
                title: '',
                description: '',
                features: [],
                price: '',
                duration: '',
                results: '',
                icon: 'Target',
                color: 'from-blue-ribbon-400 to-blue-ribbon-600',
                order: services.length + 1
              })}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Servicio
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <Badge variant="outline">Etapa {service.order}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingService(service)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-2">{service.description}</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p><strong>Precio:</strong> {service.price}</p>
                      <p><strong>Duración:</strong> {service.duration}</p>
                      <p><strong>Resultados:</strong> {service.results}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sitio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre del sitio</Label>
                    <Input value={siteConfig.name} readOnly />
                  </div>
                  <div>
                    <Label>URL del sitio</Label>
                    <Input value={siteConfig.url} readOnly />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input value={siteConfig.phone} readOnly />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={siteConfig.email} readOnly />
                  </div>
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea value={siteConfig.description} readOnly />
                </div>
                <p className="text-sm text-gray-600">
                  Para editar la configuración, modifica el archivo lib/content.ts
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
