import { db } from './backend/db/db.js';

async function updateRestauranteTable() {
  try {
    console.log('🔧 Actualizando estructura de la tabla Restaurante...\n');
    
    const connection = await db.getConnection();
    
    // Agregar los campos faltantes
    console.log('➕ Agregando campo capacidad_max...');
    await connection.execute('ALTER TABLE Restaurante ADD COLUMN capacidad_max INT NOT NULL DEFAULT 50');
    
    console.log('➕ Agregando campo logo...');
    await connection.execute('ALTER TABLE Restaurante ADD COLUMN logo VARCHAR(255) NULL');
    
    console.log('➕ Agregando campo tipoCocina...');
    await connection.execute('ALTER TABLE Restaurante ADD COLUMN tipoCocina VARCHAR(100) NULL');
    
    console.log('➕ Agregando campo imagenUrl...');
    await connection.execute('ALTER TABLE Restaurante ADD COLUMN imagenUrl VARCHAR(255) NULL');
    
    // Mostrar nueva estructura
    console.log('\n✅ Campos agregados exitosamente!');
    console.log('\n📋 Nueva estructura de la tabla Restaurante:');
    const [structure] = await connection.execute('DESCRIBE Restaurante');
    console.table(structure);
    
    // Actualizar datos existentes con valores por defecto
    console.log('\n🔄 Actualizando datos existentes...');
    
    // Actualizar cada restaurante con información específica
    const updates = [
      { id: 2, tipoCocina: 'Asiática', imagenUrl: '/src/assets/ZEN.jpg', capacidad_max: 80 },
      { id: 3, tipoCocina: 'Italiana', imagenUrl: '/src/assets/Ciao.jpeg', capacidad_max: 60 },
      { id: 4, tipoCocina: 'Parrilla', imagenUrl: '/src/assets/Toro.jpeg', capacidad_max: 70 },
      { id: 5, tipoCocina: 'Mariscos', imagenUrl: '/src/assets/Isla_Sur_Restaurant.jpg', capacidad_max: 50 },
      { id: 6, tipoCocina: 'Mexicana', imagenUrl: '/src/assets/Frida.jpeg', capacidad_max: 90 }
    ];
    
    for (const update of updates) {
      await connection.execute(
        'UPDATE Restaurante SET tipoCocina = ?, imagenUrl = ?, capacidad_max = ? WHERE id_restaurante = ?',
        [update.tipoCocina, update.imagenUrl, update.capacidad_max, update.id]
      );
      console.log(`✅ Actualizado restaurante ID ${update.id}`);
    }
    
    // Mostrar datos actualizados
    console.log('\n📊 Datos actualizados:');
    const [data] = await connection.execute('SELECT * FROM Restaurante');
    console.table(data);
    
    connection.release();
    console.log('\n🎉 ¡Tabla Restaurante actualizada exitosamente!');
    
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('⚠️ Los campos ya existen en la tabla.');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await db.end();
  }
}

updateRestauranteTable();
