// Script para verificar si el servidor está funcionando
import fetch from 'node-fetch';

const API_URL = 'http://localhost:4000/api/restaurantes';

async function checkServer() {
  try {
    console.log('Verificando conexión al servidor...');
    
    const response = await fetch(API_URL);
    
    if (response.ok) {
      console.log('✅ Servidor backend está funcionando correctamente');
      const data = await response.json();
      console.log(`📊 Hay ${data.length} restaurantes en la base de datos`);
    } else {
      console.error('❌ Servidor responde pero con error:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('❌ No se puede conectar al servidor backend:');
    console.error('   - Asegúrese de que el servidor esté corriendo en el puerto 4000');
    console.error('   - Ejecute: cd backend && node server.js');
    console.error('   Error:', error.message);
  }
}

checkServer();
