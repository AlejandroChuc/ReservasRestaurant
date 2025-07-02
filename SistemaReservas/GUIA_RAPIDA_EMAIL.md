
## Estado Actual

✅ **EmailJS está instalado y configurado**  
⚠️ **Actualmente en modo simulación** - Los emails no se envían realmente

## Para activar el envío real de emails:

### Paso 1: Crear cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Confirma tu email

### Paso 2: Configurar servicio de email

1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor (Gmail recomendado)
4. Sigue las instrucciones para conectar tu email
5. **Copia el Service ID** (ej: `service_abc123`)

### Paso 3: Crear plantilla

1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Usa esta configuración:

**Template Name**: `Confirmacion Reserva RCD`

**Subject**: `Confirmación de Reserva - {{reservation_number}} - {{hotel_name}}`

**Content**: Copia el HTML del archivo `CONFIGURACION_EMAIL.md`

4. **Copia el Template ID** (ej: `template_xyz789`)

### Paso 4: Obtener Public Key

1. Ve a **"Account"** → **"General"**
2. Copia tu **Public Key** (ej: `user_abcdefg123`)

### Paso 5: Configurar en la aplicación

1. Abre el archivo: `src/config/emailConfig.ts`
2. Reemplaza estos valores:
   ```typescript
   SERVICE_ID: 'tu_service_id_aqui',
   TEMPLATE_ID: 'tu_template_id_aqui',
   PUBLIC_KEY: 'tu_public_key_aqui',
   ```
3. Cambia: `USE_SIMULATION = false`

### Paso 6: Probar

1. Haz una reserva en la aplicación
2. El email se enviará automáticamente al completar la reserva

## Variables disponibles en el template

Estas variables se sustituyen automáticamente:

- `{{customer_name}}` - Nombre del cliente
- `{{to_email}}` - Email del cliente
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

## Límites del plan gratuito

- 200 emails por mes
- Para más emails, necesitarás un plan pagado

## Problemas comunes

- **Error 403**: Verifica que el Public Key sea correcto
- **Error 404**: Verifica Service ID y Template ID
- **Email no llega**: Revisa la carpeta de spam del destinatario
