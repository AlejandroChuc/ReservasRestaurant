// Servicio para manejar la validación de huéspedes

export interface HuespedValidacionRequest {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  num_habitacion: string;
  numero_personas: number;
  fecha_llegada: string;
  fecha_salida: string;
  correo: string;
}

export interface HuespedValidacionResponse {
  success: boolean;
  id_huesped?: number;
  nombre_completo?: string;
  num_habitacion?: string;
  fecha_llegada?: string;
  fecha_salida?: string;
  error?: string;
}

const API_BASE_URL = 'http://localhost:4000/api';

export const huespedService = {
  /**
   * Valida los datos de un huésped
   */
  async validarHuesped(datos: HuespedValidacionRequest): Promise<HuespedValidacionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/huespedes/validar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al validar huésped:', error);
      return {
        success: false,
        error: 'Error de conexión al servidor'
      };
    }
  },

  /**
   * Obtiene todos los huéspedes (para administración)
   */
  async obtenerHuespedes(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/huespedes`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener huéspedes:', error);
      return [];
    }
  },

  /**
   * Obtiene un huésped por ID
   */
  async obtenerHuespedPorId(id: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/huespedes/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener huésped:', error);
      return null;
    }
  }
};
