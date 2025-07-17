"use client"

import { useState, useEffect } from "react"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"

interface SelectRestaurantStepProps {
  onNext: () => void
}

// 🔹 Datos simulados de restaurantes con descripciones
const restaurants = [
  {
    id: 1,
    name: "Frida",
    logo: "/src/assets/Frida.jpeg",
    cuisine: "Mexican Fine Dining",
    description:
      "Auténtica cocina mexicana con un toque contemporáneo. Especialidades en mole, tacos gourmet y mezcales artesanales.",
  },
  {
    id: 2,
    name: "Toro",
    logo: "/src/assets/Toro.jpeg",
    cuisine: "Spanish Tapas",
    description:
      "Tapas españolas tradicionales y vinos selectos. Jamón ibérico, paellas artesanales y una extensa carta de vinos españoles.",
  },
  {
    id: 3,
    name: "Isla Sur Restaurant",
    logo: "/src/assets/Isla_Sur_Restaurant.jpg",
    cuisine: "Mediterranean",
    description:
      "Cocina mediterránea fresca con ingredientes locales. Pescados frescos, aceite de oliva premium y hierbas aromáticas.",
  },
  {
    id: 4,
    name: "Ciao",
    logo: "/src/assets/Ciao.jpeg",
    cuisine: "Italian Bistro",
    description:
      "Auténtica cocina italiana casera. Pastas frescas hechas a mano, pizzas en horno de leña y postres tradicionales.",
  },
  {
    id: 5,
    name: "ZEN",
    logo: "/src/assets/ZEN.jpg",
    cuisine: "Asian Fusion",
    description:
      "Experiencia de alta cocina asiática con sushi, ramen y platillos de autor en un ambiente moderno y relajante.",
  },
]

export default function SelectRestaurantStep({ onNext }: SelectRestaurantStepProps) {
  const { reservationData, updateReservationData, setCurrentStep } = useReservation()
  // No hay restaurante seleccionado por defecto
  const [selected, setSelected] = useState<null | typeof restaurants[0]>(
    restaurants.find((r) => r.name === reservationData.restaurant) || null
  )
  const [showDescription, setShowDescription] = useState<number | null>(null)

  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  const handleCardClick = (restaurant: (typeof restaurants)[0]) => {
    setSelected(restaurant)
    if (showDescription === restaurant.id) {
      setShowDescription(null)
    } else {
      setShowDescription(restaurant.id)
    }
  }

  const handleContinue = () => {
    if (!selected) return;
    updateReservationData({
      restaurant: selected.name,
      restaurantId: selected.id,
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
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="relative">
            {/* Tarjeta Principal */}
            <button
              onClick={() => handleCardClick(restaurant)}
              className={`w-full rounded-2xl p-0 transition-all duration-300 transform hover:scale-105 overflow-hidden h-56 flex flex-col justify-end relative ${
                selected && selected.id === restaurant.id ? "ring-4 ring-amber-500 shadow-xl" : "bg-white/10 border border-white/20"
              }`}
            >
              {restaurant.logo && (
                <img
                  src={restaurant.logo || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 z-0"
                />
              )}
              <div className="relative z-10 p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent w-full">
                <h3 className="text-xl font-semibold text-white text-center mb-2">{restaurant.name}</h3>
                <p className="text-sm text-slate-300 text-center">{restaurant.cuisine}</p>
              </div>
            </button>

            {/* Descripción expandible */}
            {showDescription === restaurant.id && (
              <div className="absolute top-0 left-0 w-full h-56 bg-black/30 backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-center z-20 animate-in fade-in duration-300">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white text-center mb-4 drop-shadow-lg">{restaurant.name}</h3>
                  <p className="text-sm text-white text-center leading-relaxed drop-shadow-md">
                    {restaurant.description}
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
    </ReservationLayout>
  )
}
