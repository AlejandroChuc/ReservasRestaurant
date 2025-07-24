// Test para probar los endpoints de horarios

console.log('🧪 Probando endpoint de horarios disponibles...');

const testData = {
  restaurante: 1, // ID del primer restaurante
  fecha: '2025-07-25', // Mañana
  personas: 2,
  huesped: 2 // ID del huésped Fernando que creamos
};

const url = `http://localhost:4000/api/horarios/disponibles?${new URLSearchParams(testData)}`;

console.log('📡 URL:', url);

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log('✅ Respuesta del servidor:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`\n📊 Encontrados ${data.totalHorarios} horarios disponibles:`);
      data.horarios.forEach((horario, index) => {
        console.log(`${index + 1}. ${horario.bloque_comida}: ${horario.hora_inicio.substring(0,5)} - ${horario.hora_fin.substring(0,5)} (${horario.capacidad_disponible}/${horario.capacidad_maxima} disponible)`);
      });
    }
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    console.error('🔍 Asegúrate de que el backend esté corriendo en http://localhost:4000');
  });
