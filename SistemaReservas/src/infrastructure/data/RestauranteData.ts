import type { Restaurante } from "../../domain/entities/Restaurante";

export const RESTAURANTES: Restaurante[] = [
  {
    id: 1,
    nombre: "FRIDA",
    descripcion: "Mexican Fine Dining",
    tipoCocina: "Mexicana",
    imagenUrl: "https://ejemplo.com/frida.jpg",
  },
  {
    id: 2,
    nombre: "TORO",
    descripcion: "Spanish Tapas",
    tipoCocina: "Española",
    imagenUrl: "https://ejemplo.com/toro.jpg",
  },
  {
    id: 3,
    nombre: "Isla Sur Restaurant",
    descripcion: "Mediterranean",
    tipoCocina: "Mediterránea",
    imagenUrl: "https://ejemplo.com/isla.jpg",
  },
  {
    id: 4,
    nombre: "CIAO",
    descripcion: "Italian Bistro",
    tipoCocina: "Italiana",
    imagenUrl: "https://ejemplo.com/ciao.jpg",
  },
];
