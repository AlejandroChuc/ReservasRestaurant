import { useState } from 'react';

interface HuespedValidado {
  id_huesped: number;
  nombre_completo: string;
  num_habitacion: string;
  fecha_llegada: string;
  fecha_salida: string;
}

export const useHuespedValidado = () => {
  const [huespedData, setHuespedData] = useState<HuespedValidado | null>(null);
  const [isValidado, setIsValidado] = useState(false);

  const validarHuesped = (idHuesped: number, datos: Omit<HuespedValidado, 'id_huesped'>) => {
    const datosCompletos: HuespedValidado = {
      id_huesped: idHuesped,
      ...datos
    };
    
    setHuespedData(datosCompletos);
    setIsValidado(true);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('huesped_validado', JSON.stringify(datosCompletos));
  };

  const limpiarHuesped = () => {
    setHuespedData(null);
    setIsValidado(false);
    localStorage.removeItem('huesped_validado');
  };

  // Cargar datos del localStorage al inicializar
  const cargarHuespedGuardado = () => {
    const datosGuardados = localStorage.getItem('huesped_validado');
    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados);
        setHuespedData(datos);
        setIsValidado(true);
      } catch (error) {
        console.error('Error al cargar datos del huésped guardado:', error);
        localStorage.removeItem('huesped_validado');
      }
    }
  };

  return {
    huespedData,
    isValidado,
    validarHuesped,
    limpiarHuesped,
    cargarHuespedGuardado
  };
};
