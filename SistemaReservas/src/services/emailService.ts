import emailjs from '@emailjs/browser'
import { EMAIL_CONFIG, USE_SIMULATION } from '../config/emailConfig'

export interface EmailData {
  customerName: string
  customerEmail: string
  restaurant: string
  date: string
  time: string
  numberOfPeople: string
  roomNumber: string
  reservationNumber: string
  specialRequests?: string
}

export const sendReservationConfirmationEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    console.log('Enviando email de confirmación...', emailData)
    
    // Validar configuración antes de intentar enviar
    const configValidation = validateEmailConfig()
    if (!configValidation.isValid) {
      console.error('Configuración EmailJS inválida:', configValidation.errors)
      return false
    }
    
    // Template parameters para EmailJS
    const templateParams = {
      to_name: emailData.customerName,
      to_email: emailData.customerEmail,
      customer_name: emailData.customerName,
      restaurant: emailData.restaurant,
      reservation_date: emailData.date,
      reservation_time: emailData.time,
      number_of_people: emailData.numberOfPeople,
      room_number: emailData.roomNumber,
      reservation_number: emailData.reservationNumber,
      special_requests: emailData.specialRequests || 'Ninguna',
      hotel_name: EMAIL_CONFIG.HOTEL_INFO.name,
      hotel_phone: EMAIL_CONFIG.HOTEL_INFO.phone,
      hotel_address: EMAIL_CONFIG.HOTEL_INFO.address
    }

    if (USE_SIMULATION) {
      // Simular envío de email para desarrollo/testing
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Email simulado enviado exitosamente para:', emailData.customerEmail)
      return true
    } else {
      // Envío real de email usando EmailJS
      console.log('Configuración EmailJS:', {
        serviceId: EMAIL_CONFIG.SERVICE_ID,
        templateId: EMAIL_CONFIG.TEMPLATE_ID,
        publicKey: EMAIL_CONFIG.PUBLIC_KEY ? '***' + EMAIL_CONFIG.PUBLIC_KEY.slice(-4) : 'NO_KEY'
      })
      
      const response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      )
      
      console.log('Email enviado exitosamente:', response.status, response.text)
      return true
    }
  } catch (error) {
    console.error('Error enviando email:', error)
    
    // Información adicional para debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 3)
      })
    }
    
    return false
  }
}

// Función para validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para validar la configuración de EmailJS
export const validateEmailConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!EMAIL_CONFIG.SERVICE_ID || EMAIL_CONFIG.SERVICE_ID === 'service_rcd_hotels') {
    errors.push('SERVICE_ID no está configurado correctamente')
  }
  
  if (!EMAIL_CONFIG.TEMPLATE_ID || EMAIL_CONFIG.TEMPLATE_ID === 'template_reservation') {
    errors.push('TEMPLATE_ID no está configurado correctamente')
  }
  
  if (!EMAIL_CONFIG.PUBLIC_KEY || EMAIL_CONFIG.PUBLIC_KEY === 'tu_public_key_aqui') {
    errors.push('PUBLIC_KEY no está configurado correctamente')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Template de email en HTML (para referencia)
export const getEmailTemplate = (data: EmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3A4A5C, #4A5A6C); color: white; padding: 30px; text-align: center; }
        .logo { font-size: 2em; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 20px; background: #f9f9f9; }
        .reservation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 0.9em; }
        .button { background: #FF8C00; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${EMAIL_CONFIG.HOTEL_INFO.name}</div>
          <p>Confirmación de Reserva</p>
        </div>
        
        <div class="content">
          <h2>¡Reserva Confirmada!</h2>
          <p>Estimado/a ${data.customerName},</p>
          <p>Nos complace confirmar su reserva en nuestro restaurante. A continuación encontrará los detalles:</p>
          
          <div class="reservation-details">
            <h3>Detalles de la Reserva</h3>
            <div class="detail-row">
              <strong>Número de Confirmación:</strong>
              <span>${data.reservationNumber}</span>
            </div>
            <div class="detail-row">
              <strong>Restaurante:</strong>
              <span>${data.restaurant}</span>
            </div>
            <div class="detail-row">
              <strong>Fecha:</strong>
              <span>${data.date}</span>
            </div>
            <div class="detail-row">
              <strong>Hora:</strong>
              <span>${data.time}</span>
            </div>
            <div class="detail-row">
              <strong>Número de Personas:</strong>
              <span>${data.numberOfPeople}</span>
            </div>
            <div class="detail-row">
              <strong>Habitación:</strong>
              <span>${data.roomNumber}</span>
            </div>
            ${data.specialRequests ? `
            <div class="detail-row">
              <strong>Solicitudes Especiales:</strong>
              <span>${data.specialRequests}</span>
            </div>` : ''}
          </div>
          
          <p><strong>Importante:</strong> Por favor presente este número de confirmación al llegar al restaurante.</p>
          
          <a href="#" class="button">Ver Reserva Online</a>
        </div>
        
        <div class="footer">
          <p><strong>${EMAIL_CONFIG.HOTEL_INFO.name}</strong></p>
          <p>${EMAIL_CONFIG.HOTEL_INFO.address}</p>
          <p>Reservaciones: ${EMAIL_CONFIG.HOTEL_INFO.phone}</p>
          <p>© 2025 Corporación Inmobiliaria KTRC, S.A. de C.V.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/*
INSTRUCCIONES PARA CONFIGURAR EMAILJS:

1. Ve a https://www.emailjs.com/ y crea una cuenta
2. Crea un nuevo servicio (Gmail, Outlook, etc.)
3. Crea una plantilla de email con las variables especificadas en CONFIGURACION_EMAIL.md
4. Ve al archivo src/config/emailConfig.ts y actualiza:
   - SERVICE_ID: Tu Service ID de EmailJS
   - TEMPLATE_ID: Tu Template ID de EmailJS  
   - PUBLIC_KEY: Tu Public Key de EmailJS
5. Cambia USE_SIMULATION de true a false para envío real

IMPORTANTE: Mientras USE_SIMULATION esté en true, los emails se simularán.
Para enviar emails reales, configura tus credenciales y cambia USE_SIMULATION a false.
*/
