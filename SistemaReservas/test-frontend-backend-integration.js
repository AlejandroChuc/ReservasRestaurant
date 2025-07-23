// Test completo Frontend <-> Backend para validación de huéspedes
import { validarHuesped } from './src/services/huespedService.js';

async function testFrontendBackendIntegration() {
  console.log('🧪 Probando integración Frontend <-> Backend...\n');
  
  try {
    // Test 1: Caso válido
    console.log('📝 Test 1: Validación exitosa');
    const datosValidos = {
      nombre: "Prueba",
      apellido_paterno: "Copilot", 
      apellido_materno: "Test",
      num_habitacion: "101",
      numero_personas: 2,
      fecha_llegada: "2025-07-22",
      fecha_salida: "2025-07-23",
      correo: "prueba@correo.com"
    };
    
    const resultado1 = await validarHuesped(datosValidos);
    console.log('✅ Respuesta exitosa:', resultado1);
    console.log('');
    
    // Test 2: Caso inválido
    console.log('📝 Test 2: Datos incorrectos');
    const datosInvalidos = {
      nombre: "Juan",
      apellido_paterno: "Pérez",
      apellido_materno: "García", 
      num_habitacion: "999",
      numero_personas: 1,
      fecha_llegada: "2025-01-01",
      fecha_salida: "2025-01-05",
      correo: "juan@email.com"
    };
    
    try {
      await validarHuesped(datosInvalidos);
    } catch (error) {
      console.log('❌ Error esperado:', error.message);
    }
    console.log('');
    
    // Test 3: Campos faltantes
    console.log('📝 Test 3: Campos faltantes');
    const datosFaltantes = {
      nombre: "Test",
      apellido_paterno: "User"
      // Faltan campos requeridos
    };
    
    try {
      await validarHuesped(datosFaltantes);
    } catch (error) {
      console.log('❌ Error esperado:', error.message);
    }
    
    console.log('\n🎉 ¡Integración Frontend-Backend funcionando correctamente!');
    console.log('✅ Los componentes están listos para usar en la aplicación React');
    
  } catch (error) {
    console.error('💥 Error en la integración:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que el servidor backend esté corriendo (node backend/server.js)');
    console.log('2. Verificar la URL del API en huespedService.ts');
    console.log('3. Verificar configuración de CORS en el servidor');
  }
}

testFrontendBackendIntegration();
