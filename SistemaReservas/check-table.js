// Verificar estructura de la tabla Restaurante
import mysql from 'mysql2/promise';

async function checkTableStructure() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Bizcocho-8',
      database: 'reservas_restaurante'
    });

    console.log('🔍 Verificando estructura de la tabla Restaurante...');
    
    // Verificar si la tabla existe
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'reservas_restaurante' AND TABLE_NAME = 'Restaurante'
    `);

    if (tables.length === 0) {
      console.log('❌ La tabla Restaurante no existe');
      return;
    }

    console.log('✅ La tabla Restaurante existe');

    // Mostrar estructura de la tabla
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'reservas_restaurante' AND TABLE_NAME = 'Restaurante'
      ORDER BY ORDINAL_POSITION
    `);

    console.log('📋 Columnas de la tabla Restaurante:');
    columns.forEach(col => {
      console.log(`   ${col.COLUMN_NAME} (${col.DATA_TYPE}) - Nullable: ${col.IS_NULLABLE}`);
    });

    // Verificar datos
    const [count] = await connection.execute('SELECT COUNT(*) as total FROM Restaurante');
    console.log(`📊 Total de registros: ${count[0].total}`);

    if (count[0].total > 0) {
      const [sample] = await connection.execute('SELECT * FROM Restaurante LIMIT 1');
      console.log('🔍 Registro de ejemplo:');
      console.log(sample[0]);
    }

    await connection.end();

  } catch (error) {
    console.error('❌ Error al verificar tabla:', error);
  }
}

checkTableStructure();
