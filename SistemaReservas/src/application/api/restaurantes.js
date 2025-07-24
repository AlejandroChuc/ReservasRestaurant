// API para consumir restaurantes desde el backend
export async function getRestaurantes() {
  try {
    console.log('🔄 Obteniendo restaurantes del servidor...');
    
    const response = await fetch('http://localhost:4000/api/restaurantes');
    
    console.log(`📡 Respuesta del servidor: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Error interno del servidor. Verifique que la base de datos esté funcionando y que el servidor backend esté iniciado correctamente.');
      }
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.length} restaurantes obtenidos exitosamente`);
    
    return data;
  } catch (error) {
    console.error('❌ Error al obtener restaurantes:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se puede conectar al servidor backend. Asegúrese de que esté ejecutándose en el puerto 4000.');
    }
    
    throw error;
  }
}
