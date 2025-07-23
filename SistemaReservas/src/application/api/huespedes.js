// API para consumir huespedes desde el backend
export async function getHuespedes() {
  const response = await fetch('http://localhost:4000/api/huespedes');
  if (!response.ok) throw new Error('Error al obtener huespedes');
  return await response.json();
}
