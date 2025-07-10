export interface HorarioRestaurante {
  id: number;
  idRestaurante: number;
  bloque: "Desayuno" | "Comida" | "Cena";
  horaInicio: string; // formato "HH:mm"
  horaFin: string;
  capacidadMaxima: number;
}
