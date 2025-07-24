// API para consumir horarios desde el backend

// Obtener todos los horarios
export async function getHorarios() {
  const response = await fetch('http://localhost:4000/api/horarios');
  if (!response.ok) throw new Error('Error al obtener horarios');
  return await response.json();
}

// Obtener horarios disponibles para un restaurante específico
export async function getHorariosDisponibles(idRestaurante, fecha, numPersonas, idHuesped) {
  const params = new URLSearchParams({
    restaurante: idRestaurante,
    fecha: fecha,
    personas: numPersonas,
    huesped: idHuesped
  });

  const response = await fetch(`http://localhost:4000/api/horarios/disponibilidad?${params}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener horarios disponibles');
  }
  return await response.json();
}

// Crear una reserva
export async function crearReserva(reservaData) {
  const response = await fetch('http://localhost:4000/api/reservas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reservaData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la reserva');
  }
  return await response.json();
}

// Obtener reservas de un huésped
export async function getReservasHuesped(idHuesped) {
  const response = await fetch(`http://localhost:4000/api/reservas/huesped/${idHuesped}`);
  if (!response.ok) throw new Error('Error al obtener reservas del huésped');
  return await response.json();
}
