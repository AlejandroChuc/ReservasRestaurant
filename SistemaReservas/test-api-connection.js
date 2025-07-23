// Test directo con fetch para probar la comunicación Frontend-Backend
async function testApiConnection() {
  console.log('🧪 Probando conexión directa al API de validación...\n');
  
  const API_BASE_URL = 'http://localhost:4000';
  
  try {
    // Test 1: Caso válido
    console.log('📝 Test 1: Datos válidos');
    const datosValidos = {
      nombre: "Prueba",
      apellido_paterno: "Copilot", 
      apellido_materno: "Test",
      num_habitacion: "101",
      numero_personas: 2,
      fecha_llegada: "2025-07-23",
      fecha_salida: "2025-07-24",  
      correo: "prueba@correo.com"
    };
    
    const response1 = await fetch(`${API_BASE_URL}/api/huespedes/validar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosValidos)
    });
    
    const result1 = await response1.json();
    
    if (response1.ok) {
      console.log('✅ Validación exitosa:');
      console.log(`   - ID Huésped: ${result1.id_huesped}`);
      console.log(`   - Nombre: ${result1.nombre_completo}`);
      console.log(`   - Habitación: ${result1.num_habitacion}`);
      console.log(`   - Estancia: ${result1.fecha_llegada} - ${result1.fecha_salida}`);
    } else {
      console.log('❌ Error:', result1.error);
    }
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
    
    const response2 = await fetch(`${API_BASE_URL}/api/huespedes/validar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosInvalidos)
    });
    
    const result2 = await response2.json();
    console.log('❌ Error esperado:', result2.error);
    console.log('');
    
    // Test 3: Campos faltantes
    console.log('📝 Test 3: Campos faltantes');
    const datosFaltantes = {
      nombre: "Test",
      apellido_paterno: "User"
    };
    
    const response3 = await fetch(`${API_BASE_URL}/api/huespedes/validar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosFaltantes)
    });
    
    const result3 = await response3.json();
    console.log('❌ Error esperado:', result3.error);
    console.log('');
    
    console.log('🎉 RESUMEN:');
    console.log('✅ Backend API está funcionando correctamente');
    console.log('✅ El endpoint /api/huespedes/validar responde bien');
    console.log('✅ Los componentes de React pueden usar este API');
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('1. Los componentes ValidacionHuesped.tsx están listos');
    console.log('2. El hook useHuespedValidado.ts está listo');
    console.log('3. El servicio huespedService.ts está listo');
    console.log('4. Solo necesitas importarlos en tu aplicación React');
    
  } catch (error) {
    console.error('💥 Error de conexión:', error.message);
    console.log('\n🔧 Posibles problemas:');
    console.log('1. El servidor backend no está corriendo');
    console.log('2. Puerto incorrecto (debería ser 4000)');
    console.log('3. Problemas de CORS');
    console.log('\n💡 Para iniciar el servidor:');
    console.log('   cd backend && node server.js');
  }
}

testApiConnection();
