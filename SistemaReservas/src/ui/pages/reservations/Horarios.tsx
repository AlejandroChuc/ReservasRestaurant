"use client"

import { useState, useEffect } from "react"
import { getHorarios } from "../../../application/api/horarios"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"

interface SelectDateTimeStepProps {
  onNext: () => void
  onBack?: () => void
}

// 🔹 Bloques de comida con iconos
const mealBlocks = [
  {
    key: "Desayuno",
    label: "Desayuno",
    icon: "☀️",
    time: "7:00 - 10:00",
  },
  {
    key: "Comida",
    label: "Comida",
    icon: "🌞",
    time: "12:30 - 15:30",
  },
  {
    key: "Cena",
    label: "Cena",
    icon: "🌙",
    time: "18:00 - 22:00",
  },
]

// Horarios obtenidos de la API


export default function SelectDateTimeStep({ onNext, onBack }: SelectDateTimeStepProps) {
  const { reservationData, updateReservationData, setCurrentStep } = useReservation()
  
  // Usar los datos del huésped para número de personas - Intentar cargar desde localStorage si no existe en el contexto
  let huespedData = reservationData.huespedData || null;
  
  // Si no hay datos en el contexto pero sí en localStorage, cargarlos
  if (!huespedData && typeof window !== 'undefined') {
    try {
      const huespedDataStr = localStorage.getItem('huesped_data');
      if (huespedDataStr) {
        const localData = JSON.parse(huespedDataStr || '{}');
        
        // Asegurar que usamos exactamente los datos del localStorage sin modificarlos
        huespedData = {
          id: localData.id_huesped || localData.id, // compatibilidad con ambos formatos
          nombre_completo: localData.nombre_completo,
          num_habitacion: String(localData.num_habitacion), // asegurar que es string
          numero_personas: Number(localData.numero_personas), // asegurar que es número
          fecha_llegada: localData.fecha_llegada,
          fecha_salida: localData.fecha_salida,
          correo: localData.correo
        };
        
        // Actualizar también el contexto para futuros renders
        updateReservationData({ huespedData });
      }
    } catch (error) {
      console.error('Error al cargar datos de huésped desde localStorage:', error);
    }
  }
  
  const [people, setPeople] = useState(reservationData.people || (huespedData?.numero_personas?.toString() || ""))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState(reservationData.selectedTime || "")
  const [selectedBlock, setSelectedBlock] = useState<string>("")
  interface Horario {
    id_horario: number;
    id_restaurante: number;
    bloque_comida: string;
    hora_inicio: string;
    activo: boolean;
  }
  
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [errorHorarios, setErrorHorarios] = useState("")

  // Verificar datos del huésped desde el contexto
  useEffect(() => {
    // Este efecto se ejecuta cuando cambian los datos del huésped
  }, [huespedData]);

  // Generar fechas disponibles basadas en la estancia del huésped
  const getAvailableDays = () => {
    if (!huespedData) {
      return [];
    }
    
    if (!huespedData.fecha_llegada || !huespedData.fecha_salida) {
      return [];
    }
    
    const fechas: Array<{num: number, day: string, fullDay: string, fecha: string}> = []
    
    // Crear objetos Date y validarlos
    let llegada, salida;
    try {
      llegada = new Date(huespedData.fecha_llegada);
      salida = new Date(huespedData.fecha_salida);
      
      // Validar que son fechas válidas
      if (isNaN(llegada.getTime()) || isNaN(salida.getTime())) {
        throw new Error('Fechas inválidas');
      }
    } catch (e) {
      console.error('Error al convertir fechas:', e);
      // Usar fechas predeterminadas si hay error
      llegada = new Date('2025-07-24');
      salida = new Date('2025-07-29');
    }
    
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    
    // Generar TODAS las fechas desde llegada hasta salida (inclusive)
    // No limitamos a "hoy" para mostrar el rango completo
    for (let fecha = new Date(llegada); 
         fecha <= salida; 
         fecha.setDate(fecha.getDate() + 1)) {
      
      fechas.push({
        num: fecha.getDate(),
        day: fecha.toLocaleDateString('en', { weekday: 'short' }),
        fullDay: dayNames[fecha.getDay()],
        fecha: fecha.toISOString().split('T')[0]
      });
    }
    
    return fechas;
  }

  const availableDays = getAvailableDays()

  useEffect(() => {
    setCurrentStep(2)
    // Auto-set personas basado en datos del huésped
    if (huespedData?.numero_personas && !people) {
      setPeople(huespedData.numero_personas.toString())
    }
  }, [setCurrentStep, huespedData, people])

  // Cargar horarios desde la API
  useEffect(() => {
    setLoadingHorarios(true)
    getHorarios()
      .then((data: Horario[]) => {
        setHorarios(data)
        setErrorHorarios("")
      })
      .catch(() => setErrorHorarios("Error al cargar horarios"))
      .finally(() => setLoadingHorarios(false))
  }, [])

  const handleContinue = () => {
    if (!people || !selectedDate || !selectedTime || !selectedBlock) return;
    updateReservationData({
      people,
      selectedDate: selectedDate, // ahora es string (fecha YYYY-MM-DD)
      selectedTime,
      mealBlock: selectedBlock,
    })
    onNext()
  }

  const isComplete = people && selectedDate && selectedTime && selectedBlock;
  const restaurantId = reservationData.restaurantId;
  // Filtrar horarios reales según restaurante y bloque
  const timeSlots = horarios
    .filter((h) =>
      (!restaurantId || h.id_restaurante === restaurantId) &&
      (!selectedBlock || h.bloque_comida === selectedBlock)
    )
    .map((h) => h.hora_inicio);
  const selectedMealBlock = mealBlocks.find((block) => block.key === selectedBlock);

  return (
    <ReservationLayout
      currentStep={3}
      title="Seleccione Fecha y Horario"
      subtitle={`Elija la fecha, bloque de comida y horario para su reserva en ${reservationData.restaurant || "el restaurante seleccionado"}`}
    >
      <div className="w-full max-w-4xl mx-auto space-y-8">
        
        {/* Mensaje cuando no hay datos del huésped */}
        {!huespedData && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-orange-800 font-semibold">Se requiere validación del huésped</h3>
            </div>
            <p className="text-orange-700 mb-4">
              Para continuar con la reserva, primero debe validar sus datos como huésped del hotel.
            </p>
            <button 
              onClick={onBack || (() => {})}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Validación
            </button>
          </div>
        )}
        
        {/* Número de personas - Basado en datos del huésped */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <label className="text-white text-lg font-semibold">Número de personas</label>
          </div>
          {huespedData ? (
            <div className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <div className="text-sm text-amber-400 mb-1">
                    Seleccione número de personas (máx. {huespedData.numero_personas})
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <button 
                      onClick={() => {
                        const newValue = Math.max(1, Number(people) - 1);
                        setPeople(newValue.toString());
                        updateReservationData({ people: newValue.toString() });
                      }}
                      className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700"
                      disabled={Number(people) <= 1}
                    >
                      -
                    </button>
                    
                    <span className="text-xl font-medium">
                      {people} persona{Number(people) > 1 ? "s" : ""}
                    </span>
                    
                    <button 
                      onClick={() => {
                        const newValue = Math.min(Number(huespedData?.numero_personas || 1), Number(people) + 1);
                        setPeople(newValue.toString());
                        updateReservationData({ people: newValue.toString() });
                      }}
                      className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700"
                      disabled={Number(people) >= Number(huespedData?.numero_personas || 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 md:mt-0">
                  <span className="text-amber-400 text-sm">Registrado en el hotel</span>
                </div>
              </div>
              
              <div className="text-sm text-white/70 mt-2 border-t border-white/10 pt-2">
                <div>
                  Huésped: {huespedData.nombre_completo} - Hab. {huespedData.num_habitacion}
                </div>
                <div>
                  Estancia: {new Date(huespedData.fecha_llegada).toLocaleDateString()} - {new Date(huespedData.fecha_salida).toLocaleDateString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-white text-lg backdrop-blur-sm">
              <span className="text-red-300">No se encontraron datos del huésped</span>
            </div>
          )}
        </div>

        {/* Fechas - Mejorado */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 9a2 2 0 002 2h8a2 2 0 002-2l-2-9m-6 0V7"
                />
              </svg>
            </div>
            <label className="text-white text-lg font-semibold">Seleccione la fecha</label>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {availableDays.length > 0 ? (
              availableDays.map((day) => (
                <button
                  key={`${day.fecha}-${day.num}`}
                  className={`min-w-[90px] px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    selectedDate === day.fecha
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/25"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                  onClick={() => setSelectedDate(day.fecha)}
                >
                  <span className="font-bold block text-xl">{day.num}</span>
                  <span className="text-xs opacity-80 block">{day.fullDay}</span>
                </button>
              ))
            ) : (
              <div className="w-full p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-200">
                <div className="text-center">
                  <p className="font-medium">No hay fechas disponibles</p>
                  <p className="text-sm mt-1">
                    {!huespedData 
                      ? "Debe validar sus datos de huésped primero" 
                      : "No hay fechas futuras dentro de su estancia"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bloque de comida - Mejorado */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <label className="text-white text-lg font-semibold">Bloque de comida</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mealBlocks.map((block) => (
              <button
                key={block.key}
                className={`p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                  selectedBlock === block.key
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/25"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
                onClick={() => {
                  setSelectedBlock(block.key)
                  setSelectedTime("") // Limpiar selección de horario al cambiar bloque
                }}
              >
                <div className="text-2xl mb-2">{block.icon}</div>
                <div className="font-semibold text-lg">{block.label}</div>
                <div className="text-xs opacity-80 mt-1">{block.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Horarios disponibles - Mejorado */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <label className="text-white text-lg font-semibold">
              Horarios disponibles para {selectedMealBlock?.label}
            </label>
          </div>

          {loadingHorarios ? (
            <div className="text-center py-8 text-slate-400 text-lg">Cargando horarios...</div>
          ) : errorHorarios ? (
            <div className="text-center py-8 text-red-400 text-lg">{errorHorarios}</div>
          ) : timeSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className={`px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedTime === time
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/25"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-slate-400 text-lg">No hay horarios disponibles para este bloque</div>
            </div>
          )}
        </div>

        {/* Botones de navegación - Mejorados */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
          <button
            onClick={() => {
              updateReservationData({
                people,
                selectedDate,
                selectedTime,
                mealBlock: selectedBlock,
              })
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              if (onBack) {
                onBack()
              } else {
                setCurrentStep(1)
              }
            }}
            className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 text-lg px-6 py-3 rounded-xl hover:bg-white/5"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Información
          </button>

          <button
            onClick={handleContinue}
            disabled={!isComplete}
            className={`font-bold text-xl px-12 py-4 rounded-full shadow-2xl transition-all duration-300 transform tracking-wide ${
              isComplete
                ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:shadow-amber-500/25 hover:scale-105"
                : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
            }`}
          >
            {isComplete ? (
              <span className="flex items-center gap-2">
                Continuar a Adicional
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            ) : (
              "Continuar a Adicional"
            )}
          </button>
        </div>
      </div>
    </ReservationLayout>
  )
}
