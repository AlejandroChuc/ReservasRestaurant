// API para consumir restaurantes desde el backend
export async function getRestaurantes() {
  const response = await fetch('http://localhost:4000/api/restaurantes');
  if (!response.ok) throw new Error('Error al obtener restaurantes');
  return await response.json();
}
