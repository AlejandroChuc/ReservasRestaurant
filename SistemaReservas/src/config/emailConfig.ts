// Configuración de EmailJS
// IMPORTANTE: Reemplaza estos valores con tus credenciales de EmailJS

export const EMAIL_CONFIG = {
  // Servicio de EmailJS (ej: service_xxxxxxx)
  SERVICE_ID: 'service_vnxzbve',
  
  // Template ID de EmailJS (ej: template_xxxxxxx)
  TEMPLATE_ID: 'template_x1y1d9p',
  
  // Public Key de EmailJS (ej: user_xxxxxxxxxxxxxxxx)
  PUBLIC_KEY: '92WWAi23dAonXJ8zF',
  
  // Configuración del hotel
  HOTEL_INFO: {
    name: 'RCD Hotels',
    phone: '800-681-9205',
    address: 'Blvd. Kukulcan Km 14, Zona Hotelera, Cancun, Quintana Roo 77500, Mexico'
  }
}

// Para configurar EmailJS:
// 1. Ve a https://www.emailjs.com/
// 2. Crea una cuenta y configura tu servicio de email
// 3. Crea una plantilla con las variables especificadas en CONFIGURACION_EMAIL.md
// 4. Reemplaza los valores arriba con tus credenciales reales
// 5. Cambia USE_SIMULATION a false para enviar emails reales

export const USE_SIMULATION = false // Cambiar a false para envío real

// BOTÓN DE PRUEBA TEMPORAL - ELIMINAR EN PRODUCCIÓN
export const testEmailJSDirectly = async () => {
  console.log('🧪 PRUEBA DIRECTA DE EMAILJS...');
  
  try {
    // Importar EmailJS dinámicamente
    const emailjs = await import('@emailjs/browser');
    
    const testData = {
      to_name: 'Usuario de Prueba',
      to_email: 'Alejandrochuc3001@gmail.com', // TU EMAIL REAL
      customer_name: 'Usuario de Prueba',
      restaurant: 'FRIDA',
      reservation_date: new Date().toLocaleDateString('es-ES'),
      reservation_time: '19:00',
      number_of_people: '2',
      room_number: '101',
      reservation_number: 'TEST-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      special_requests: 'Prueba directa desde la app',
      hotel_name: 'RCD Hotels',
      hotel_phone: '800-681-9205',
      hotel_address: 'Blvd. Kukulcan Km 14, Zona Hotelera, Cancun, Quintana Roo 77500, Mexico'
    };

    console.log('📤 Enviando con datos:', testData);
    
    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      testData,
      EMAIL_CONFIG.PUBLIC_KEY
    );
    
    console.log('✅ ÉXITO:', response);
    alert('✅ Email enviado correctamente! Status: ' + response.status);
    return true;
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    const errorMessage = error instanceof Error ? error.message : (error as any)?.text || 'Error desconocido';
    alert('❌ Error: ' + errorMessage);
    return false;
  }
};

// FUNCIÓN DE PRUEBA PARA DEBUGGING DE ENTREGA
export const testEmailDelivery = async () => {
  console.log('🧪 PROBANDO ENTREGA DE EMAIL...');
  
  try {
    const emailjs = await import('@emailjs/browser');
    
    // Email de prueba dirigido específicamente a tu email
    const testData = {
      to_name: 'Alejandro Chuc',
      to_email: 'Alejandrochuc3001@gmail.com', // TU EMAIL REAL
      customer_name: 'Alejandro Chuc (PRUEBA)',
      restaurant: 'FRIDA - Test',
      reservation_date: new Date().toLocaleDateString('es-ES'),
      reservation_time: '19:00',
      number_of_people: '2',
      room_number: '101',
      reservation_number: 'TEST-DELIVERY-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      special_requests: 'Esta es una prueba de entrega de email',
      hotel_name: EMAIL_CONFIG.HOTEL_INFO.name,
      hotel_phone: EMAIL_CONFIG.HOTEL_INFO.phone,
      hotel_address: EMAIL_CONFIG.HOTEL_INFO.address
    };

    console.log('📤 Enviando email de prueba a:', testData.to_email);
    console.log('📋 Datos completos:', testData);
    
    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      testData,
      EMAIL_CONFIG.PUBLIC_KEY
    );
    
    console.log('✅ RESPUESTA DE EMAILJS:', response);
    console.log('📊 Status:', response.status);
    console.log('📝 Mensaje:', response.text);
    
    // Instrucciones específicas
    alert(`✅ Email enviado exitosamente!
    
Status: ${response.status}
Mensaje: ${response.text}

AHORA REVISA:
1. Tu bandeja de entrada principal
2. Carpeta de SPAM/Correo no deseado  
3. Carpeta Promociones (si usas Gmail)
4. Espera 1-2 minutos para la entrega

Si no llega, revisa la configuración del servicio de email en EmailJS.`);
    
    return true;
    
  } catch (error) {
    console.error('❌ ERROR EN PRUEBA:', error);
    const errorMsg = error instanceof Error ? error.message : (error as any)?.text || 'Error desconocido';
    alert('❌ Error en prueba: ' + errorMsg);
    return false;
  }
};
