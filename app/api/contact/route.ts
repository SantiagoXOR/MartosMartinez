import { NextRequest, NextResponse } from 'next/server'
import { sendTooCRM, sendToEmailMarketing, type ContactData } from '@/lib/crm-integration'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos requeridos
    const { name, email, phone, service, message } = body
    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Preparar datos para CRM
    const contactData: ContactData = {
      name,
      email,
      phone,
      company: body.company || '',
      service,
      message,
      source: 'Landing Page - Contact Form'
    }

    // Enviar a CRM
    try {
      await sendTooCRM(contactData)
    } catch (crmError) {
      console.error('Error sending to CRM:', crmError)
      // No fallar si el CRM falla, continuar con email marketing
    }

    // Enviar a email marketing
    try {
      await sendToEmailMarketing(contactData)
    } catch (emailError) {
      console.error('Error sending to email marketing:', emailError)
    }

    // Enviar email de notificación al equipo
    try {
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_contact',
          data: contactData
        })
      })
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError)
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contacto procesado exitosamente' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing contact:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
