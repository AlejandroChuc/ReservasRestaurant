"use client"

import { useState, useEffect } from "react"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"

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

  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  useEffect(() => {
    // Cargar restaurantes siempre al inicio
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
  }, [reservationData.restaurant])

  const handleCardClick = (restaurant: any) => {
    setSelected(restaurant)
    if (showDescription === restaurant.id_restaurante) {
      setShowDescription(null)
    } else {
      setShowDescription(restaurant.id_restaurante)
    }
  }

  const handleContinue = () => {
    if (!selected) return
    
    updateReservationData({
      restaurant: selected.nombre,
      restaurantId: selected.id_restaurante
    })
    onNext()
  }

  return (
    <ReservationLayout
      currentStep={1}
      title="Seleccione su Restaurante"
      subtitle="Elija el restaurante de su preferencia"
    >
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
          Continuar
        </button>
      </div>
    </ReservationLayout>
  )
}
