import type { HorarioRestaurante } from "../../domain/entities/HorarioRestaurante";

export const HORARIOS: HorarioRestaurante[] = [
  {
    id: 1,
    idRestaurante: 1,
    bloque: "Desayuno",
    horaInicio: "07:00",
    horaFin: "10:00",
    capacidadMaxima: 10,
  },
  {
    id: 2,
    idRestaurante: 1,
    bloque: "Comida",
    horaInicio: "13:00",
    horaFin: "15:00",
    capacidadMaxima: 10,
  },
  {
    id: 3,
    idRestaurante: 1,
    bloque: "Cena",
    horaInicio: "18:00",
    horaFin: "21:00",
    capacidadMaxima: 10,
  },
  {
    id: 4,
    idRestaurante: 2,
    bloque: "Desayuno",
    horaInicio: "08:00",
    horaFin: "11:00",
    capacidadMaxima: 8,
  },
  // Y así sucesivamente por restaurante...
];
