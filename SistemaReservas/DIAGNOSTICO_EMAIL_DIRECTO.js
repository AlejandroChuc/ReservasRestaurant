// DIAGNÓSTICO DIRECTO DE EMAILJS
// Copia y pega este código en la consola del navegador (F12)

console.log("🔍 INICIANDO DIAGNÓSTICO EMAILJS...");

// 1. Verificar que EmailJS esté cargado
if (typeof window.emailjs === "undefined") {
  console.error("❌ EmailJS no está cargado globalmente");
  console.log("📝 Agregando EmailJS...");

  // Cargar EmailJS si no está disponible
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  script.onload = () => {
    console.log("✅ EmailJS cargado correctamente");
    runEmailTest();
  };
  document.head.appendChild(script);
} else {
  console.log("✅ EmailJS está disponible");
  runEmailTest();
}

function runEmailTest() {
  // 2. Configuración actual
  const config = {
    SERVICE_ID: "service_vnxzbve",
    TEMPLATE_ID: "template_ak3zt54",
    PUBLIC_KEY: "92WWAi23dAonXJ8zF",
  };

  console.log("📋 Configuración actual:", {
    SERVICE_ID: config.SERVICE_ID,
    TEMPLATE_ID: config.TEMPLATE_ID,
    PUBLIC_KEY: config.PUBLIC_KEY
      ? "***" + config.PUBLIC_KEY.slice(-4)
      : "NO_KEY",
  });

  // 3. Validar configuración
  const errors = [];
  if (!config.SERVICE_ID || config.SERVICE_ID === "service_rcd_hotels") {
    errors.push("SERVICE_ID no configurado");
  }
  if (!config.TEMPLATE_ID || config.TEMPLATE_ID === "template_reservation") {
    errors.push("TEMPLATE_ID no configurado");
  }
  if (!config.PUBLIC_KEY || config.PUBLIC_KEY === "tu_public_key_aqui") {
    errors.push("PUBLIC_KEY no configurado");
  }

  if (errors.length > 0) {
    console.error("❌ Errores de configuración:", errors);
    return;
  }

  console.log("✅ Configuración válida");

  // 4. Probar envío de email
  const testData = {
    to_name: "Usuario de Prueba",
    to_email: "test@example.com", // CAMBIAR POR TU EMAIL REAL
    customer_name: "Usuario de Prueba",
    restaurant: "FRIDA",
    reservation_date: new Date().toLocaleDateString("es-ES"),
    reservation_time: "19:00",
    number_of_people: "2",
    room_number: "101",
    reservation_number:
      "TEST-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
    special_requests: "Prueba de diagnóstico",
    hotel_name: "RCD Hotels",
    hotel_phone: "800-681-9205",
    hotel_address:
      "Blvd. Kukulcan Km 14, Zona Hotelera, Cancun, Quintana Roo 77500, Mexico",
  };

  console.log("📤 Enviando email de prueba...", testData);

  // Usar EmailJS directamente
  window.emailjs
    .send(config.SERVICE_ID, config.TEMPLATE_ID, testData, config.PUBLIC_KEY)
    .then((response) => {
      console.log("✅ EMAIL ENVIADO EXITOSAMENTE!", response);
      console.log("📊 Status:", response.status);
      console.log("📝 Text:", response.text);
      alert("✅ Email enviado correctamente! Revisa tu bandeja de entrada.");
    })
    .catch((error) => {
      console.error("❌ ERROR ENVIANDO EMAIL:", error);

      // Análisis específico del error
      if (error.status === 400) {
        console.error("🔧 Error 400: Problema con los parámetros del template");
        console.log(
          "💡 Solución: Verifica que todas las variables en tu template EmailJS coincidan"
        );
      } else if (error.status === 403) {
        console.error(
          "🔧 Error 403: Public Key incorrecto o servicio no autorizado"
        );
        console.log("💡 Solución: Verifica tu Public Key en EmailJS");
      } else if (error.status === 404) {
        console.error("🔧 Error 404: Service ID o Template ID no encontrado");
        console.log("💡 Solución: Verifica tus IDs en EmailJS");
      } else if (error.status === 422) {
        console.error("🔧 Error 422: Variables de template inválidas");
        console.log("💡 Solución: Revisa las variables en tu template EmailJS");
      }

      alert(
        "❌ Error enviando email: " +
          error.text +
          " (Status: " +
          error.status +
          ")"
      );
    });
}

// INSTRUCCIONES:
// 1. Abre la consola del navegador (F12)
// 2. Pega este código completo
// 3. Presiona Enter
// 4. Revisa los mensajes en la consola
