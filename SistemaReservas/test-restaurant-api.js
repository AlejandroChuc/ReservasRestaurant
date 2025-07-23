import fetch from 'node-fetch';

async function testRestaurantAPI() {
  try {
    console.log('🧪 Probando API de restaurantes...\n');
    
    const response = await fetch('http://localhost:4000/api/restaurantes');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API funcionando correctamente');
      console.log(`📊 Se encontraron ${data.length} restaurantes:`);
      
      data.forEach((restaurante, index) => {
        console.log(`\n🍽️ Restaurante ${index + 1}:`);
        console.log(`   ID: ${restaurante.id_restaurante}`);
        console.log(`   Nombre: ${restaurante.nombre}`);
        console.log(`   Tipo: ${restaurante.tipoCocina || 'No especificado'}`);
        console.log(`   Capacidad: ${restaurante.capacidad_max} personas`);
        console.log(`   Logo: ${restaurante.logo || 'Sin logo'}`);
      });
    } else {
      console.error('❌ Error en la API:', data);
    }
    
  } catch (error) {
    console.error('❌ Error al conectar con el API:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo en http://localhost:4000');
  }
}

testRestaurantAPI();
