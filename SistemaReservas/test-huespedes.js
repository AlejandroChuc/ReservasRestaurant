import { db } from './backend/db/db.js';

async function checkHuespedes() {
  try {
    console.log('Verificando huéspedes en la base de datos...');
    
    const [huespedes] = await db.execute(`
      SELECT * 
      FROM Huesped 
      LIMIT 5
    `);
    
    console.log('Huéspedes encontrados:', huespedes);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkHuespedes();
