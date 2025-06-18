import { NextRequest, NextResponse } from 'next/server'
import { sendTooCRM, type ContactData, type ScheduleData } from '@/lib/crm-integration'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos requeridos
    const { date, time, contactInfo } = body
    if (!date || !time) {
      return NextResponse.json(
        { error: 'Fecha y hora son requeridas' },
        { status: 400 }
      )
    }

    // Preparar datos de contacto si se proporcionan
    let contactData: ContactData | undefined
    if (contactInfo) {
      contactData = {
        name: contactInfo.name || 'Prospecto',
        email: contactInfo.email || '',
        phone: contactInfo.phone || '',
        company: contactInfo.company || '',
        service: 'Consulta Gratuita',
        message: `Cita agendada para ${date} a las ${time}`,
        source: 'Landing Page - Schedule Form'
      }
    }

    // Preparar datos de agendamiento
    const scheduleData: ScheduleData = {
      date,
      time,
      timezone: 'America/Argentina/Buenos_Aires',
      source: 'Landing Page'
    }

    // Enviar a CRM
    try {
      if (contactData) {
        await sendTooCRM(contactData, scheduleData)
      }
    } catch (crmError) {
      console.error('Error sending to CRM:', crmError)
    }

    // Integración con Calendly (ejemplo)
    try {
      if (process.env.CALENDLY_API_KEY) {
        await fetch('https://api.calendly.com/scheduled_events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CALENDLY_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_type: process.env.CALENDLY_EVENT_TYPE_UUID,
            start_time: new Date(`${date}T${time}`).toISOString(),
            invitee: {
              email: contactData?.email,
              name: contactData?.name
            }
          })
        })
      }
    } catch (calendlyError) {
      console.error('Error with Calendly integration:', calendlyError)
    }

    // Enviar email de confirmación
    try {
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'appointment_scheduled',
          data: { scheduleData, contactData }
        })
      })
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError)
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Cita agendada exitosamente',
        appointmentId: `apt_${Date.now()}`
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing schedule:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
