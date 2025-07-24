#!/usr/bin/env node

// Script de diagnóstico para verificar el estado del sistema
import mysql from 'mysql2/promise';
import fetch from 'node-fetch';

const CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'Bizcocho-8',
  database: 'reservas_restaurante'
};

async function testDatabaseConnection() {
  console.log('🔍 Verificando conexión a la base de datos...');
  try {
    const connection = await mysql.createConnection(CONFIG);
    await connection.execute('SELECT 1');
    console.log('✅ Conexión a MySQL exitosa');
    
    // Verificar que las tablas existan
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('Restaurante', 'Huesped', 'Reserva')
    `, [CONFIG.database]);
    
    if (tables.length >= 3) {
      console.log('✅ Tablas principales encontradas');
      
      // Verificar datos en Restaurante
      const [restaurants] = await connection.execute('SELECT COUNT(*) as count FROM Restaurante');
      console.log(`📊 Restaurantes en BD: ${restaurants[0].count}`);
      
      const [guests] = await connection.execute('SELECT COUNT(*) as count FROM Huesped');
      console.log(`👥 Huéspedes en BD: ${guests[0].count}`);
    } else {
      console.log('❌ Faltan tablas en la base de datos');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error de conexión a MySQL:', error.message);
    console.log('💡 Soluciones posibles:');
    console.log('   - Verificar que MySQL esté ejecutándose');
    console.log('   - Verificar usuario/contraseña en backend/db/db.js');
    console.log('   - Verificar que la base de datos "reservas_restaurante" exista');
  }
}

async function testServerConnection() {
  console.log('\n🔍 Verificando servidor backend...');
  try {
    const response = await fetch('http://localhost:4000/api/restaurantes');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Servidor backend funcionando');
      console.log(`📊 API responde con ${data.length} restaurantes`);
    } else {
      console.log(`❌ Servidor responde con error: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ No se puede conectar al servidor backend');
    console.log('💡 Ejecute: cd backend && node server.js');
  }
}

async function main() {
  console.log('🏨 DIAGNÓSTICO DEL SISTEMA DE RESERVAS\n');
  console.log('=======================================\n');
  
  await testDatabaseConnection();
  await testServerConnection();
  
  console.log('\n=======================================');
  console.log('Diagnóstico completado.');
}

main().catch(console.error);
