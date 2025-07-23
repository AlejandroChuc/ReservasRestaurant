// API para consumir horarios desde el backend
export async function getHorarios() {
  const response = await fetch('http://localhost:4000/api/horarios');
  if (!response.ok) throw new Error('Error al obtener horarios');
  return await response.json();
}
