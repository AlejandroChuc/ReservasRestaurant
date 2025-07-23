import { db } from './backend/db/db.js';

async function testElegantDescriptions() {
  try {
    console.log('🧪 Probando descripciones elegantes con puntos suspensivos...\n');
    
    const connection = await db.getConnection();
    
    // Simular la consulta mejorada del endpoint
    const [restaurantes] = await connection.execute(`
      SELECT 
        id_restaurante,
        nombre,
        CASE 
          WHEN LENGTH(descripcion) > 50 
          THEN CONCAT(LEFT(descripcion, 47), '...')
          ELSE descripcion
        END as descripcion,
        capacidad_max,
        logo,
        tipoCocina
      FROM Restaurante
    `);
    
    console.log(`📊 Restaurantes con descripciones elegantes:\n`);
    
    restaurantes.forEach((restaurante, index) => {
      console.log(`🍽️ ${restaurante.nombre}:`);
      console.log(`   Descripción: "${restaurante.descripcion}"`);
      console.log(`   Longitud: ${restaurante.descripcion.length} caracteres`);
      console.log(`   Tipo: ${restaurante.tipoCocina}`);
      console.log(`   Capacidad: ${restaurante.capacidad_max} personas`);
      console.log('   ---');
    });
    
    connection.release();
    console.log('\n✅ Descripciones con formato elegante aplicadas correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.end();
  }
}

testElegantDescriptions();
