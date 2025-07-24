// Test directo del endpoint de validación
// Usando fetch nativo de Node.js

const testData = {
  nombre: 'Fernando',
  apellido_paterno: 'May',
  apellido_materno: 'Bustos',
  num_habitacion: '456',
  numero_personas: 2,
  correo: 'fernando.may@test.com'
};

async function testValidation() {
  try {
    console.log('🧪 Probando endpoint /api/huespedes/validar...');
    console.log('📤 Datos enviados:', testData);
    
    const response = await fetch('http://localhost:4000/api/huespedes/validar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log(`📡 Status: ${response.status} ${response.statusText}`);
    
    const responseData = await response.json();
    console.log('📥 Respuesta del servidor:', responseData);

    if (responseData.success) {
      console.log('✅ Validación exitosa!');
    } else {
      console.log('❌ Validación falló:', responseData.error);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

// También probar el endpoint de prueba
async function testSimpleEndpoint() {
  try {
    console.log('\n🧪 Probando endpoint /api/test...');
    
    const response = await fetch('http://localhost:4000/api/test');
    const data = await response.json();
    
    console.log('✅ Test endpoint funciona:', data);
  } catch (error) {
    console.error('❌ Error en test endpoint:', error.message);
  }
}

async function runTests() {
  await testSimpleEndpoint();
  await testValidation();
}

runTests();
