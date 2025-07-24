import { db } from './backend/db/db.js';

async function checkHorarios() {
  try {
    console.log('Verificando horarios en la base de datos...');
    
    const [horarios] = await db.execute(`
      SELECT h.*, r.nombre as restaurante 
      FROM Horario_Restaurante h 
      JOIN Restaurante r ON h.id_restaurante = r.id_restaurante 
      LIMIT 10
    `);
    
    console.log('Horarios encontrados:', horarios.length);
    if (horarios.length > 0) {
      console.log('Primer horario:', horarios[0]);
    }
    
    // Verificar específicamente para id_restaurante = 1
    const [horariosRest1] = await db.execute(`
      SELECT * 
      FROM Horario_Restaurante 
      WHERE id_restaurante = 1
    `);
    
    console.log('\nHorarios para restaurante 1:', horariosRest1.length);
    if (horariosRest1.length > 0) {
      console.log('Horarios del restaurante 1:', horariosRest1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkHorarios();
