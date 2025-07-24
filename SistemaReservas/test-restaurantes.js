import { db } from './backend/db/db.js';

async function checkRestaurantes() {
  try {
    console.log('Verificando restaurantes en la base de datos...');
    
    const [restaurantes] = await db.execute(`
      SELECT * FROM Restaurante ORDER BY id_restaurante
    `);
    
    console.log('Restaurantes encontrados:', restaurantes);
    
    // Ver qué restaurantes tienen horarios
    const [horariosCount] = await db.execute(`
      SELECT id_restaurante, COUNT(*) as total_horarios 
      FROM Horario_Restaurante 
      GROUP BY id_restaurante 
      ORDER BY id_restaurante
    `);
    
    console.log('\nHorarios por restaurante:', horariosCount);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkRestaurantes();
