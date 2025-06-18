// CRM Integration - Ejemplo con HubSpot

export interface ContactData {
  name: string
  email: string
  phone: string
  company?: string
  service: string
  message: string
  source: string
}

export interface ScheduleData {
  date: string
  time: string
  timezone?: string
  source: string
}

// HubSpot Integration
export class HubSpotCRM {
  private apiKey: string
  private portalId: string

  constructor() {
    this.apiKey = process.env.HUBSPOT_API_KEY || ''
    this.portalId = process.env.HUBSPOT_PORTAL_ID || ''
  }

  async createContact(data: ContactData) {
    try {
      const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          properties: {
            firstname: data.name.split(' ')[0],
            lastname: data.name.split(' ').slice(1).join(' '),
            email: data.email,
            phone: data.phone,
            company: data.company || '',
            hs_lead_status: 'NEW',
            lifecyclestage: 'lead',
            lead_source: data.source,
            service_interest: data.service,
            message: data.message
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating contact in HubSpot:', error)
      throw error
    }
  }

  async createMeeting(contactId: string, data: ScheduleData) {
    try {
      const response = await fetch(`https://api.hubapi.com/crm/v3/objects/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          properties: {
            hs_meeting_title: 'Consulta Gratuita - Marketing Inmobiliario',
            hs_meeting_body: 'Consulta gratuita para discutir estrategias de marketing inmobiliario',
            hs_meeting_start_time: new Date(`${data.date}T${data.time}`).toISOString(),
            hs_meeting_end_time: new Date(new Date(`${data.date}T${data.time}`).getTime() + 60 * 60 * 1000).toISOString(),
            hs_meeting_outcome: 'SCHEDULED'
          },
          associations: [
            {
              to: { id: contactId },
              types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 194 }]
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating meeting in HubSpot:', error)
      throw error
    }
  }
}

// Salesforce Integration (ejemplo básico)
export class SalesforceCRM {
  private instanceUrl: string
  private accessToken: string

  constructor() {
    this.instanceUrl = process.env.SALESFORCE_INSTANCE_URL || ''
    this.accessToken = process.env.SALESFORCE_ACCESS_TOKEN || ''
  }

  async createLead(data: ContactData) {
    try {
      const response = await fetch(`${this.instanceUrl}/services/data/v58.0/sobjects/Lead/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({
          FirstName: data.name.split(' ')[0],
          LastName: data.name.split(' ').slice(1).join(' ') || 'Unknown',
          Email: data.email,
          Phone: data.phone,
          Company: data.company || 'Unknown',
          LeadSource: data.source,
          Status: 'Open - Not Contacted',
          Description: `Servicio de interés: ${data.service}\n\nMensaje: ${data.message}`
        })
      })

      if (!response.ok) {
        throw new Error(`Salesforce API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating lead in Salesforce:', error)
      throw error
    }
  }
}

// Factory para crear instancia de CRM
export function createCRMInstance(type: 'hubspot' | 'salesforce' = 'hubspot') {
  switch (type) {
    case 'hubspot':
      return new HubSpotCRM()
    case 'salesforce':
      return new SalesforceCRM()
    default:
      throw new Error(`Unsupported CRM type: ${type}`)
  }
}

// Función helper para enviar datos a CRM
export async function sendTooCRM(contactData: ContactData, scheduleData?: ScheduleData) {
  const crmType = process.env.CRM_TYPE as 'hubspot' | 'salesforce' || 'hubspot'
  const crm = createCRMInstance(crmType)

  try {
    if (crmType === 'hubspot') {
      const hubspot = crm as HubSpotCRM
      const contact = await hubspot.createContact(contactData)
      
      if (scheduleData && contact.id) {
        await hubspot.createMeeting(contact.id, scheduleData)
      }
      
      return contact
    } else if (crmType === 'salesforce') {
      const salesforce = crm as SalesforceCRM
      return await salesforce.createLead(contactData)
    }
  } catch (error) {
    console.error('Error sending data to CRM:', error)
    throw error
  }
}

// Email Marketing Integration (ejemplo con SendGrid)
export async function sendToEmailMarketing(data: ContactData) {
  try {
    const response = await fetch('/api/email-marketing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ').slice(1).join(' '),
        company: data.company,
        serviceInterest: data.service,
        source: data.source
      })
    })

    if (!response.ok) {
      throw new Error(`Email marketing API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending to email marketing:', error)
    throw error
  }
}
