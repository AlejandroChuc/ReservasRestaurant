import { validateEmailConfig, sendReservationConfirmationEmail } from '../services/emailService'
import { EMAIL_CONFIG } from '../config/emailConfig'

export const testEmailConfiguration = async () => {
  console.log('🔍 Diagnóstico de configuración EmailJS')
  
  // 1. Validar configuración
  const validation = validateEmailConfig()
  console.log('1. Validación de configuración:', validation)
  
  if (!validation.isValid) {
    console.error('❌ Configuración inválida:', validation.errors)
    return {
      success: false,
      error: 'Configuración inválida: ' + validation.errors.join(', ')
    }
  }
  
  // 2. Mostrar configuración (sin revelar keys completas)
  console.log('2. Configuración actual:', {
    SERVICE_ID: EMAIL_CONFIG.SERVICE_ID,
    TEMPLATE_ID: EMAIL_CONFIG.TEMPLATE_ID,
    PUBLIC_KEY: EMAIL_CONFIG.PUBLIC_KEY ? `***${EMAIL_CONFIG.PUBLIC_KEY.slice(-4)}` : 'NO_KEY'
  })
  
  // 3. Probar envío de email
  const testEmailData = {
    customerName: 'Usuario de Prueba',
    customerEmail: 'test@example.com', // Cambiar por tu email para pruebas
    restaurant: 'FRIDA',
    date: new Date().toLocaleDateString('es-ES'),
    time: '19:00',
    numberOfPeople: '2',
    roomNumber: '101',
    reservationNumber: 'TEST-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    specialRequests: 'Prueba de configuración'
  }
  
  console.log('3. Probando envío con datos:', testEmailData)
  
  try {
    const result = await sendReservationConfirmationEmail(testEmailData)
    if (result) {
      console.log('✅ Email de prueba enviado exitosamente')
      return { success: true }
    } else {
      console.log('❌ Error enviando email de prueba')
      return { success: false, error: 'Email no pudo ser enviado' }
    }
  } catch (error) {
    console.error('❌ Error en prueba:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export const showEmailJSInstructions = () => {
  console.log(`
🚀 INSTRUCCIONES PARA CONFIGURAR EMAILJS:

1. Ve a https://www.emailjs.com/
2. Crea una cuenta (plan gratuito permite 200 emails/mes)
3. Configura un servicio de email:
   - Ve a "Email Services" 
   - Click "Add New Service"
   - Selecciona Gmail (recomendado)
   - Autoriza tu cuenta de Gmail
   - Copia el SERVICE_ID generado

4. Crea una plantilla:
   - Ve a "Email Templates"
   - Click "Create New Template"
   - Subject: "Confirmación de Reserva - {{reservation_number}} - {{hotel_name}}"
   - Content: Usa el HTML del archivo CONFIGURACION_EMAIL.md
   - Copia el TEMPLATE_ID generado

5. Obtén tu Public Key:
   - Ve a "Account" → "General"
   - Copia tu Public Key

6. Actualiza src/config/emailConfig.ts con tus credenciales

7. Verifica que USE_SIMULATION = false

PROBLEMAS COMUNES:
- Error 403: Public Key incorrecto
- Error 404: Service ID o Template ID incorrecto  
- Error 400: Variables de template mal configuradas
- Email no llega: Revisar spam, o servicio de email no autorizado
  `)
}
