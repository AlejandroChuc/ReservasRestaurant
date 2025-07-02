# Configuración de EmailJS para RCD Hotels

## ¿Qué es EmailJS?

EmailJS es un servicio que permite enviar emails directamente desde aplicaciones frontend sin necesidad de un servidor backend.

## Pasos para configurar EmailJS:

### 1. Crear cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en "Sign Up" y crea tu cuenta
3. Confirma tu email

### 2. Configurar un servicio de email

1. En el dashboard de EmailJS, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, Yahoo, etc.)
4. Sigue las instrucciones para conectar tu cuenta de email
5. **Importante**: Copia el `Service ID` que se genera

### 3. Crear una plantilla de email

1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa el siguiente contenido como base:

**Subject**: Confirmación de Reserva - {{reservation_number}} - {{hotel_name}}

**Content**:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #3a4a5c, #4a5a6c);
        color: white;
        padding: 30px;
        text-align: center;
      }
      .logo {
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .content {
        padding: 20px;
        background: #f9f9f9;
      }
      .reservation-details {
        background: white;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      .footer {
        background: #333;
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 0.9em;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">{{hotel_name}}</div>
        <p>Confirmación de Reserva</p>
      </div>

      <div class="content">
        <h2>¡Reserva Confirmada!</h2>
        <p>Estimado/a {{customer_name}},</p>
        <p>
          Nos complace confirmar su reserva en nuestro restaurante. A
          continuación encontrará los detalles:
        </p>

        <div class="reservation-details">
          <h3>Detalles de la Reserva</h3>
          <div class="detail-row">
            <strong>Número de Confirmación:</strong>
            <span>{{reservation_number}}</span>
          </div>
          <div class="detail-row">
            <strong>Restaurante:</strong>
            <span>{{restaurant}}</span>
          </div>
          <div class="detail-row">
            <strong>Fecha:</strong>
            <span>{{reservation_date}}</span>
          </div>
          <div class="detail-row">
            <strong>Hora:</strong>
            <span>{{reservation_time}}</span>
          </div>
          <div class="detail-row">
            <strong>Número de Personas:</strong>
            <span>{{number_of_people}}</span>
          </div>
          <div class="detail-row">
            <strong>Habitación:</strong>
            <span>{{room_number}}</span>
          </div>
          <div class="detail-row">
            <strong>Solicitudes Especiales:</strong>
            <span>{{special_requests}}</span>
          </div>
        </div>

        <p>
          <strong>Importante:</strong> Por favor presente este número de
          confirmación al llegar al restaurante.
        </p>
      </div>

      <div class="footer">
        <p><strong>{{hotel_name}}</strong></p>
        <p>{{hotel_address}}</p>
        <p>Reservaciones: {{hotel_phone}}</p>
        <p>© 2025 Corporación Inmobiliaria KTRC, S.A. de C.V.</p>
      </div>
    </div>
  </body>
</html>
```

service_vnxzbve

4. **Importante**: Copia el `Template ID` que se genera

### 4. Obtener la Public Key

1. Ve a "Account" en el menú
2. En la sección "API Keys", copia tu `Public Key`

### 5. Configurar en la aplicación

1. Abre el archivo `src/services/emailService.ts`
2. Reemplaza las siguientes constantes con tus valores reales:

```javascript
const EMAILJS_SERVICE_ID = "tu_service_id_aqui";
const EMAILJS_TEMPLATE_ID = "tu_template_id_aqui";
const EMAILJS_PUBLIC_KEY = "tu_public_key_aqui";
```

### 6. Activar el envío real

1. En el mismo archivo `emailService.ts`, encuentra las líneas comentadas:

```javascript
// Descomentar esta línea cuando configures EmailJS

const response = await emailjs.send(
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  templateParams,
  EMAILJS_PUBLIC_KEY
)

console.log('Email enviado exitosamente:', response.status, response.text)
*/
```

2. Descomenta ese bloque y comenta la línea de simulación:

```javascript
// console.log('Email simulado enviado exitosamente para:', emailData.customerEmail)
```

### 7. Variables disponibles en la plantilla

Las siguientes variables están disponibles para usar en tu plantilla de EmailJS:

- `{{to_name}}` - Nombre del destinatario
- `{{to_email}}` - Email del destinatario
- `{{customer_name}}` - Nombre del cliente
- `{{restaurant}}` - Nombre del restaurante
- `{{reservation_date}}` - Fecha de la reserva
- `{{reservation_time}}` - Hora de la reserva
- `{{number_of_people}}` - Número de personas
- `{{room_number}}` - Número de habitación
- `{{reservation_number}}` - Número de confirmación
- `{{special_requests}}` - Solicitudes especiales
- `{{hotel_name}}` - Nombre del hotel
- `{{hotel_phone}}` - Teléfono del hotel
- `{{hotel_address}}` - Dirección del hotel

### 8. Límites del plan gratuito

- 200 emails por mes
- Para mayor volumen, considera actualizar a un plan de pago

### 9. Alternativas si no quieres usar EmailJS

Si prefieres otra solución, puedes usar:

- **Resend**: Muy fácil de usar, API moderna
- **SendGrid**: Más robusto para empresas
- **Nodemailer**: Requiere backend propio

## Notas importantes:

- Los emails pueden tardar unos minutos en llegar
- Revisa la carpeta de spam si no aparece el email
- La aplicación actualmente simula el envío (se ve en la consola del navegador)
- Una vez configurado EmailJS, los emails se enviarán realmente

## Soporte

Si tienes problemas configurando EmailJS:

1. Revisa la documentación oficial: https://www.emailjs.com/docs/
2. Verifica que todas las credenciales sean correctas
3. Revisa la consola del navegador para ver errores
