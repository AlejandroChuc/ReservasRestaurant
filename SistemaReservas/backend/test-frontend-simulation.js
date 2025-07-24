// Simular exactamente lo que hace el frontend
const testData = {
  nombre: "Fernando",
  apellido_paterno: "May", 
  apellido_materno: "Bustos",
  num_habitacion: "456",
  numero_personas: 2,
  correo: "fernando.may@test.com"
};

console.log("Enviando datos:", JSON.stringify(testData));

try {
  const response = await fetch('http://localhost:4000/api/huespedes/validar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(testData),
  });

  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);
  
  if (response.ok) {
    const data = await response.json();
    console.log('Respuesta exitosa:', data);
  } else {
    const errorText = await response.text();
    console.log('Error response:', errorText);
  }
} catch (error) {
  console.error('Error de conexión:', error.message);
}
