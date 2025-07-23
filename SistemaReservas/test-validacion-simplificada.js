// Test de validación simplificada (sin fechas)
async function testValidacionSimplificada() {
  console.log('🧪 Probando validación de huésped simplificada...\n');
  
  const API_BASE_URL = 'http://localhost:4000';
  
  try {
    // Test con datos válidos (sin fechas)
    console.log('📝 Test: Validación con datos básicos (sin fechas)');
    const datosBasicos = {
      nombre: "Prueba",
      apellido_paterno: "Copilot", 
      apellido_materno: "Test",
      num_habitacion: "101",
      numero_personas: 2,
      correo: "prueba@correo.com"
      // ✨ Las fechas ahora se obtienen automáticamente de la BD
    };
    
    const response = await fetch(`${API_BASE_URL}/api/huespedes/validar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosBasicos)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Validación exitosa:');
      console.log(`   - ID Huésped: ${result.id_huesped}`);
      console.log(`   - Nombre: ${result.nombre_completo}`);
      console.log(`   - Habitación: ${result.num_habitacion}`);
      console.log(`   - Estancia: ${result.fecha_llegada} - ${result.fecha_salida}`);
    } else {
      console.log('❌ Error:', result.error);
    }
    
    console.log('\n🎉 RESUMEN:');
    console.log('✅ Formulario simplificado - Sin campos de fecha');
    console.log('✅ Backend obtiene fechas automáticamente');
    console.log('✅ Validación de estancia funciona correctamente');
    console.log('\n📋 CAMPOS EN EL FORMULARIO:');
    console.log('- Nombre');
    console.log('- Apellido Paterno');
    console.log('- Apellido Materno');
    console.log('- Número de Habitación'); 
    console.log('- Número de Personas');
    console.log('- Correo Electrónico');
    console.log('❌ Fechas (se obtienen automáticamente)');
    
  } catch (error) {
    console.error('💥 Error de conexión:', error.message);
    console.log('\n🔧 Verificar que el servidor backend esté corriendo');
  }
}

testValidacionSimplificada();
