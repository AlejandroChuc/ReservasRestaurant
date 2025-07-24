import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { getHorariosDisponibles, crearReserva } from '../application/api/horarios';

interface HorarioDisponible {
  id_horario: number;
  bloque_comida: 'Desayuno' | 'Comida' | 'Cena';
  hora_inicio: string;
  hora_fin: string;
  capacidad_maxima: number;
  capacidad_disponible: number;
  personas_reservadas: number;
}

interface SeleccionHorariosProps {
  restauranteSeleccionado: {
    id: number;
    nombre: string;
    capacidad: number;
  };
  huespedData: {
    id: number;
    fecha_llegada: string;
    fecha_salida: string;
    numero_personas: number;
  };
  onReservaCreada: (reserva: any) => void;
  onVolver: () => void;
}

export const SeleccionHorarios: React.FC<SeleccionHorariosProps> = ({
  restauranteSeleccionado,
  huespedData,
  onReservaCreada,
  onVolver
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [horariosDisponibles, setHorariosDisponibles] = useState<HorarioDisponible[]>([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<number | null>(null);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [creandoReserva, setCreandoReserva] = useState(false);
  const [error, setError] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');

  // Generar fechas disponibles (entre llegada y salida del huésped)
  const fechasDisponibles = () => {
    const fechas: string[] = [];
    const llegada = new Date(huespedData.fecha_llegada);
    const salida = new Date(huespedData.fecha_salida);
    
    for (let fecha = new Date(llegada); fecha < salida; fecha.setDate(fecha.getDate() + 1)) {
      // Solo fechas futuras o de hoy
      if (fecha >= new Date(new Date().setHours(0, 0, 0, 0))) {
        fechas.push(fecha.toISOString().split('T')[0]);
      }
    }
    
    return fechas;
  };

  // Cargar horarios disponibles cuando se selecciona una fecha
  useEffect(() => {
    if (fechaSeleccionada) {
      cargarHorarios();
    }
  }, [fechaSeleccionada]);

  const cargarHorarios = async () => {
    setCargandoHorarios(true);
    setError('');
    setHorariosDisponibles([]);
    setHorarioSeleccionado(null);

    try {
      const response = await getHorariosDisponibles(
        restauranteSeleccionado.id,
        fechaSeleccionada,
        huespedData.numero_personas,
        huespedData.id
      );

      if (response.success) {
        setHorariosDisponibles(response.horarios);
        if (response.horarios.length === 0) {
          setError('No hay horarios disponibles para la fecha seleccionada');
        }
      } else {
        setError(response.message || 'Error al cargar horarios');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar horarios');
    } finally {
      setCargandoHorarios(false);
    }
  };

  const confirmarReserva = async () => {
    if (!horarioSeleccionado) {
      setError('Por favor selecciona un horario');
      return;
    }

    setCreandoReserva(true);
    setError('');

    try {
      const reservaData = {
        id_huesped: huespedData.id,
        id_horario: horarioSeleccionado,
        fecha_reserva: fechaSeleccionada,
        num_personas: huespedData.numero_personas
      };

      const response = await crearReserva(reservaData);

      if (response.success) {
        setMensaje(`¡Reserva confirmada! ${response.message}`);
        onReservaCreada(response);
      } else {
        setError(response.message || 'Error al crear la reserva');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la reserva');
    } finally {
      setCreandoReserva(false);
    }
  };

  const formatearHora = (hora: string) => {
    return hora.substring(0, 5); // HH:MM
  };

  const getBloqueColor = (bloque: string) => {
    switch (bloque) {
      case 'Desayuno': return 'bg-yellow-500';
      case 'Comida': return 'bg-orange-500';
      case 'Cena': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getBloqueIcon = (bloque: string) => {
    switch (bloque) {
      case 'Desayuno': return '🌅';
      case 'Comida': return '🌞';
      case 'Cena': return '🌙';
      default: return '🍽️';
    }
  };

  if (mensaje) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">¡Reserva Confirmada!</h2>
              <p className="text-slate-300 mb-6">{mensaje}</p>
              <button
                onClick={() => onReservaCreada(null)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Seleccionar Horario</h1>
              <p className="text-slate-400">Restaurante: {restauranteSeleccionado.nombre}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{huespedData.numero_personas} personas</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Estancia: {new Date(huespedData.fecha_llegada).toLocaleDateString()} - {new Date(huespedData.fecha_salida).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Selección de fecha */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">1. Selecciona la fecha</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fechasDisponibles().map((fecha) => (
              <button
                key={fecha}
                onClick={() => setFechaSeleccionada(fecha)}
                className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                  fechaSeleccionada === fecha
                    ? 'border-blue-500 bg-blue-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-slate-300 hover:border-blue-400 hover:bg-blue-400/10'
                }`}
              >
                <div className="text-sm font-medium">
                  {new Date(fecha).toLocaleDateString('es-ES', { 
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Horarios disponibles */}
        {fechaSeleccionada && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              2. Selecciona el horario
              {cargandoHorarios && <span className="ml-2 text-sm text-blue-400">Cargando...</span>}
            </h3>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {cargandoHorarios ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : horariosDisponibles.length > 0 ? (
              <div className="space-y-4">
                {['Desayuno', 'Comida', 'Cena'].map((bloque) => {
                  const horariosBloque = horariosDisponibles.filter(h => h.bloque_comida === bloque);
                  if (horariosBloque.length === 0) return null;

                  return (
                    <div key={bloque}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{getBloqueIcon(bloque)}</span>
                        <h4 className="text-lg font-semibold text-white">{bloque}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {horariosBloque.map((horario) => (
                          <button
                            key={horario.id_horario}
                            onClick={() => setHorarioSeleccionado(horario.id_horario)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                              horarioSeleccionado === horario.id_horario
                                ? 'border-blue-500 bg-blue-500/20'
                                : 'border-white/20 bg-white/5 hover:border-blue-400 hover:bg-blue-400/10'
                            }`}
                          >
                            <div className={`inline-block px-2 py-1 rounded text-xs font-medium text-white mb-2 ${getBloqueColor(horario.bloque_comida)}`}>
                              {horario.bloque_comida}
                            </div>
                            <div className="text-white font-medium mb-1">
                              {formatearHora(horario.hora_inicio)} - {formatearHora(horario.hora_fin)}
                            </div>
                            <div className="text-xs text-slate-400">
                              Disponible: {horario.capacidad_disponible}/{horario.capacidad_maxima} personas
                            </div>
                            {horario.personas_reservadas > 0 && (
                              <div className="text-xs text-orange-400 mt-1">
                                {horario.personas_reservadas} ya reservadas
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : fechaSeleccionada && !cargandoHorarios ? (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay horarios disponibles para esta fecha</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={onVolver}
            className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
          >
            Volver
          </button>

          {horarioSeleccionado && (
            <button
              onClick={confirmarReserva}
              disabled={creandoReserva}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              {creandoReserva ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creando reserva...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirmar Reserva
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
