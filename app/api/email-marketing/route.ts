import { NextRequest, NextResponse } from 'next/server'

// Integración con SendGrid
async function addToSendGrid(data: any) {
  const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contacts: [
        {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          custom_fields: {
            company: data.company,
            service_interest: data.serviceInterest,
            source: data.source
          }
        }
      ]
    })
  })

  if (!response.ok) {
    throw new Error(`SendGrid API error: ${response.status}`)
  }

  return response.json()
}

// Integración con Mailchimp
async function addToMailchimp(data: any) {
  const listId = process.env.MAILCHIMP_LIST_ID
  const apiKey = process.env.MAILCHIMP_API_KEY
  const serverPrefix = apiKey?.split('-')[1]

  const response = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: data.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: data.firstName,
          LNAME: data.lastName,
          COMPANY: data.company,
          SERVICE: data.serviceInterest
        },
        tags: [data.source, 'landing-page']
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Mailchimp API error: ${response.status} - ${error.detail}`)
  }

  return response.json()
}

// Integración con HubSpot Marketing
async function addToHubSpotMarketing(data: any) {
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        email: data.email,
        firstname: data.firstName,
        lastname: data.lastName,
        company: data.company,
        hs_marketing_source: data.source,
        service_interest: data.serviceInterest,
        hs_lead_status: 'NEW'
      }
    })
  })

  if (!response.ok) {
    throw new Error(`HubSpot API error: ${response.status}`)
  }

  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validar email
    if (!data.email || !data.email.includes('@')) {
      return NextResponse.json(
        { error: 'Email válido es requerido' },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    // Intentar agregar a SendGrid
    if (process.env.SENDGRID_API_KEY) {
      try {
        const result = await addToSendGrid(data)
        results.push({ service: 'SendGrid', success: true, data: result })
      } catch (error) {
        errors.push({ service: 'SendGrid', error: error instanceof Error ? error.message : 'Error desconocido' })
      }
    }

    // Intentar agregar a Mailchimp
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
      try {
        const result = await addToMailchimp(data)
        results.push({ service: 'Mailchimp', success: true, data: result })
      } catch (error) {
        errors.push({ service: 'Mailchimp', error: error instanceof Error ? error.message : 'Error desconocido' })
      }
    }

    // Intentar agregar a HubSpot Marketing
    if (process.env.HUBSPOT_API_KEY) {
      try {
        const result = await addToHubSpotMarketing(data)
        results.push({ service: 'HubSpot', success: true, data: result })
      } catch (error) {
        errors.push({ service: 'HubSpot', error: error instanceof Error ? error.message : 'Error desconocido' })
      }
    }

    // Si no hay servicios configurados
    if (results.length === 0 && errors.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No hay servicios de email marketing configurados' 
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        success: results.length > 0,
        message: `Procesado en ${results.length} servicio(s) exitosamente`,
        results,
        errors: errors.length > 0 ? errors : undefined
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in email marketing integration:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
