// API para consumir colaboradores desde el backend
export async function getColaboradores() {
  const response = await fetch('http://localhost:4000/api/colaboradores');
  if (!response.ok) throw new Error('Error al obtener colaboradores');
  return await response.json();
}
