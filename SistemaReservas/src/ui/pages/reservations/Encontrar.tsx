"use client"

import { useState, useEffect } from "react"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"
import ValidacionHuesped from "../../../components/ValidacionHuesped"
import { useHuespedValidado } from "../../../hooks/useHuespedValidado"

interface SelectRestaurantStepProps {
  onNext: () => void
}

import { getRestaurantes } from "../../../application/api/restaurantes"


export default function SelectRestaurantStep({ onNext }: SelectRestaurantStepProps) {
  const { reservationData, updateReservationData, setCurrentStep } = useReservation()
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selected, setSelected] = useState<any>(null)
  const [showDescription, setShowDescription] = useState<number | null>(null)
  
  // Hook para manejar la validación del huésped
  const { 
    huespedData, 
    validarHuesped, 
    limpiarHuesped, 
    isValidado 
  } = useHuespedValidado();

  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  useEffect(() => {
    // Solo cargar restaurantes si el huésped está validado
    if (isValidado) {
      setLoading(true)
      getRestaurantes()
        .then((data: any) => {
          setRestaurants(data)
          // Seleccionar el restaurante si ya estaba en reservationData
          const found = data.find((r: any) => r.nombre === reservationData.restaurant)
          setSelected(found || null)
          setError("")
        })
        .catch(() => setError("Error al cargar restaurantes"))
        .finally(() => setLoading(false))
    }
  }, [isValidado, reservationData.restaurant])

  // Funciones para manejar la validación del huésped
  const handleHuespedValidado = (idHuesped: number, datosHuesped: any) => {
    console.log('Huésped validado:', { idHuesped, datosHuesped });
    validarHuesped(idHuesped, datosHuesped);
    
    // Guardar datos del huésped en el contexto de reserva
    updateReservationData({
      customerName: datosHuesped.nombre_completo,
      roomNumber: datosHuesped.num_habitacion,
      email: datosHuesped.correo || ''
    });
  };

  const handleValidationError = (mensaje: string) => {
    console.error('Error en validación:', mensaje);
    setError(mensaje);
  };

  const handleCardClick = (restaurant: any) => {
    setSelected(restaurant)
    if (showDescription === restaurant.id_restaurante) {
      setShowDescription(null)
    } else {
      setShowDescription(restaurant.id_restaurante)
    }
  }

  const handleContinue = () => {
    if (!selected) return;
    updateReservationData({
      restaurant: selected.nombre,
      restaurantId: selected.id_restaurante,
    })
    onNext()
  }

  return (
    <ReservationLayout
      currentStep={1}
      title={isValidado ? "Seleccione su Restaurante" : "Validación de Huésped"}
      subtitle={isValidado ? "Elija el restaurante de su preferencia" : "Verifique sus datos de huésped del hotel"}
    >
      {/* Si el huésped no está validado, mostrar formulario de validación */}
      {!isValidado ? (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-700 text-sm">
                ✨ Para realizar una reserva, primero debes validar tus datos como huésped del hotel
              </p>
            </div>
          </div>
          
          <ValidacionHuesped 
            onHuespedValidado={handleHuespedValidado}
            onError={handleValidationError}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Mostrar información del huésped validado */}
          <div className="mb-6 text-center">
            <div className="bg-green-50 p-4 rounded-lg inline-block mb-4">
              <p className="text-green-700 text-sm">
                ✅ <strong>{huespedData?.nombre_completo}</strong> - Habitación {huespedData?.num_habitacion}
              </p>
              <button 
                onClick={limpiarHuesped}
                className="text-xs text-green-600 hover:text-green-800 underline ml-2"
              >
                Cambiar huésped
              </button>
            </div>
          </div>

          {/* Restaurant Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {loading ? (
          <div className="col-span-full text-center text-slate-400 text-lg">Cargando restaurantes...</div>
        ) : error ? (
          <div className="col-span-full text-center text-red-400 text-lg">{error}</div>
        ) : restaurants.length === 0 ? (
          <div className="col-span-full text-center text-slate-400 text-lg">No hay restaurantes disponibles</div>
        ) : restaurants.map((restaurant) => (
          <div key={restaurant.id_restaurante} className="relative">
            {/* Tarjeta Principal */}
            <button
              onClick={() => handleCardClick(restaurant)}
              className={`w-full rounded-2xl p-0 transition-all duration-300 transform hover:scale-105 overflow-hidden h-56 flex flex-col justify-end relative ${
                selected && selected.id_restaurante === restaurant.id_restaurante ? "ring-4 ring-amber-500 shadow-xl" : "bg-white/10 border border-white/20"
              }`}
            >
              {restaurant.logo && (
                <img
                  src={restaurant.logo}
                  alt={restaurant.nombre}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 z-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div className="relative z-10 p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent w-full">
                <h3 className="text-xl font-semibold text-white text-center mb-2">{restaurant.nombre}</h3>
                <p className="text-sm text-slate-300 text-center">Capacidad: {restaurant.capacidad_max}</p>
              </div>
            </button>

            {/* Descripción expandible */}
            {showDescription === restaurant.id_restaurante && (
              <div className="absolute top-0 left-0 w-full h-56 bg-black/30 backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-center z-20 animate-in fade-in duration-300">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white text-center mb-4 drop-shadow-lg">{restaurant.nombre}</h3>
                  <p className="text-sm text-white text-center leading-relaxed drop-shadow-md">
                    {restaurant.descripcion}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

          {/* Continuar */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selected}
              className={`text-xl font-semibold px-12 py-4 rounded-full transition-all duration-300 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:scale-105 ${!selected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continuar a Información
            </button>
          </div>
        </>
      )}
    </ReservationLayout>
  )
}
