import { db } from './backend/db/db.js';

async function testHuespedValidation() {
  try {
    console.log('🧪 Probando la validación de huéspedes...\n');
    
    const connection = await db.getConnection();
    
    // Primero, verificar si hay huéspedes en la base de datos
    const [huespedes] = await connection.execute('SELECT * FROM Huesped LIMIT 3');
    
    if (huespedes.length === 0) {
      console.log('⚠️ No hay huéspedes en la base de datos. Creando uno de prueba...');
      
      // Crear un huésped de prueba
      const [result] = await connection.execute(
        `INSERT INTO Huesped (nombre, apellido_paterno, apellido_materno, num_habitacion, numero_personas, fecha_llegada, fecha_salida, correo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['Juan', 'Pérez', 'García', '101', 2, '2025-07-20', '2025-07-30', 'juan.perez@email.com']
      );
      
      console.log('✅ Huésped de prueba creado con ID:', result.insertId);
    }
    
    // Mostrar huéspedes disponibles
    const [huespedes_actualizados] = await connection.execute('SELECT * FROM Huesped');
    console.log('📊 Huéspedes en la base de datos:');
    huespedes_actualizados.forEach((huesped, index) => {
      console.log(`\n${index + 1}. ${huesped.nombre} ${huesped.apellido_paterno} ${huesped.apellido_materno}`);
      console.log(`   Habitación: ${huesped.num_habitacion}`);
      console.log(`   Personas: ${huesped.numero_personas}`);
      console.log(`   Estancia: ${huesped.fecha_llegada} - ${huesped.fecha_salida}`);
      console.log(`   Email: ${huesped.correo}`);
    });
    
    // Probar casos de validación
    console.log('\n🔍 Casos de prueba para validación:\n');
    
    if (huespedes_actualizados.length > 0) {
      const huesped_prueba = huespedes_actualizados[0];
      
      console.log('1. ✅ Caso válido (datos correctos):');
      console.log('   POST /api/huespedes/validar');
      console.log('   Body:', JSON.stringify({
        nombre: huesped_prueba.nombre,
        apellido_paterno: huesped_prueba.apellido_paterno,
        apellido_materno: huesped_prueba.apellido_materno,
        num_habitacion: huesped_prueba.num_habitacion,
        numero_personas: huesped_prueba.numero_personas,
        fecha_llegada: huesped_prueba.fecha_llegada,
        fecha_salida: huesped_prueba.fecha_salida,
        correo: huesped_prueba.correo
      }, null, 2));
      
      console.log('\n2. ❌ Caso inválido (datos incorrectos):');
      console.log('   POST /api/huespedes/validar');
      console.log('   Body:', JSON.stringify({
        nombre: 'María',
        apellido_paterno: 'González',
        apellido_materno: 'López',
        num_habitacion: '999',
        numero_personas: 1,
        fecha_llegada: '2025-07-01',
        fecha_salida: '2025-07-10',
        correo: 'maria@email.com'
      }, null, 2));
      
      console.log('\n3. ❌ Caso con campos faltantes:');
      console.log('   POST /api/huespedes/validar');
      console.log('   Body:', JSON.stringify({
        nombre: huesped_prueba.nombre,
        apellido_paterno: huesped_prueba.apellido_paterno,
        // Falta apellido_materno y otros campos
      }, null, 2));
    }
    
    connection.release();
    console.log('\n💡 Para probar el endpoint, puedes usar curl o Postman:');
    console.log('curl -X POST http://localhost:4000/api/huespedes/validar \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"nombre":"Juan","apellido_paterno":"Pérez",...}\'');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.end();
  }
}

testHuespedValidation();
