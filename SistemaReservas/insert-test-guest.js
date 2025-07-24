// Script para insertar huésped de prueba: Fernando May Bustos

const data = {
  nombre: 'Fernando',
  apellido_paterno: 'May', 
  apellido_materno: 'Bustos',
  num_habitacion: 456,
  numero_personas: 2,
  fecha_llegada: '2025-07-23',
  fecha_salida: '2025-07-27',
  correo: 'fernando.may@test.com'
};

console.log('Insertando huésped de prueba:', data);

fetch('http://localhost:4000/api/huespedes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(result => {
  console.log('✅ Huésped creado exitosamente:', result);
  console.log('📝 Datos del huésped:');
  console.log(`   Nombre: ${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`);
  console.log(`   Habitación: ${data.num_habitacion}`);
  console.log(`   Personas: ${data.numero_personas}`);
  console.log(`   Estancia: ${data.fecha_llegada} al ${data.fecha_salida}`);
  console.log(`   Email: ${data.correo}`);
})
.catch(err => {
  console.error('❌ Error al crear huésped:', err.message);
  console.error('🔍 Asegúrate de que el backend esté corriendo en http://localhost:4000');
});
