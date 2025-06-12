import { useState, useEffect } from "react"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"

interface EncontrarPageProps {
  onNext: () => void;
}

const restaurants = [
  { name: "FRIDA", logo: "/frida-logo.png", cuisine: "Mexican Fine Dining" },
  { name: "TORO", logo: "/toro-logo.png", cuisine: "Spanish Tapas" },
  { name: "Isla Sur Restaurant", cuisine: "Mediterranean" },
  { name: "CIAO", cuisine: "Italian Bistro" },
]

export default function EncontrarPage({ onNext }: EncontrarPageProps) {
  const { reservationData, updateReservationData, setCurrentStep } = useReservation()

  const [selected, setSelected] = useState(reservationData.restaurant || restaurants[0].name)
  const [people, setPeople] = useState(reservationData.people || "2")
  const [selectedDate, setSelectedDate] = useState(reservationData.selectedDate || 17)
  const [selectedTime, setSelectedTime] = useState(reservationData.selectedTime || "")

  // Días de la semana
  const days = [
    { num: 12, day: "J" },
    { num: 13, day: "V" },
    { num: 14, day: "S" },
    { num: 15, day: "D" },
    { num: 16, day: "L" },
    { num: 17, day: "M", selected: true },
    { num: 18, day: "Mi" },
    { num: 19, day: "J" },
    { num: 20, day: "V" },
    { num: 21, day: "S" },
    { num: 22, day: "D" },
    { num: 23, day: "L" },
  ]

  // Horarios disponibles
  const timeSlots = [
    ["17:30", "18:00", "18:30"],
    ["19:00", "19:30", "20:00"],
    ["20:30", "21:00", "21:30"],
  ]

  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  const handleContinue = () => {
    // Guardar datos del paso 1
    updateReservationData({
      restaurant: selected,
      people,
      selectedDate,
      selectedTime,
    })

    // Navegar al siguiente paso
    onNext()
  }

  const isComplete = selected && selectedTime

  return (
    <ReservationLayout
      currentStep={1}
      title="Seleccione su Restaurante"
      subtitle="Elija el restaurante y horario de su preferencia"
    >
      {/* Restaurant Selection */}
      <div className="w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <button
              key={restaurant.name}
              onClick={() => setSelected(restaurant.name)}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
                selected === restaurant.name
                  ? "bg-gradient-to-br from-amber-500 to-amber-600 shadow-2xl shadow-amber-500/25"
                  : "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15"
              }`}
            >
              <div className="relative z-10">
                {restaurant.logo && (
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                    <img
                      src={restaurant.logo || "/placeholder.svg"}
                      alt={restaurant.name}
                      className="h-8 w-auto opacity-90"
                    />
                  </div>
                )}
                <h3
                  className={`text-xl font-semibold mb-2 ${selected === restaurant.name ? "text-white" : "text-white"}`}
                >
                  {restaurant.name}
                </h3>
                <p className={`text-sm ${selected === restaurant.name ? "text-amber-100" : "text-slate-300"}`}>
                  {restaurant.cuisine}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          {/* People Selector */}
          <div className="mb-10">
            <label className="block text-lg font-medium text-white mb-4">Número de Personas</label>
            <div className="relative max-w-xs">
              <select
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full appearance-none bg-white/5 border border-white/20 rounded-xl px-6 py-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
              >
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
                <option value="5">5 personas</option>
                <option value="6">6 personas</option>
                <option value="7">7 personas</option>
                <option value="8">8 personas</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date Selector */}
          <div className="mb-10">
            <label className="block text-lg font-medium text-white mb-4">Seleccione la Fecha</label>
            <div className="flex justify-center space-x-3 w-full overflow-x-auto py-2">
              {days.map((day) => (
                <button
                  key={day.num}
                  type="button"
                  onClick={() => setSelectedDate(day.num)}
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                    selectedDate === day.num
                      ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                      : "bg-white/10 text-amber-200 hover:bg-white/20"
                  }`}
                >
                  <span className="text-lg font-bold">{day.num}</span>
                  <span className="text-xs">{day.day}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Restaurant Status */}
          <div className="text-center mb-6">
            <p className="text-slate-300 text-lg">Restaurante abierto para el servicio de cena</p>
          </div>

          {/* Meal Type */}
          <div className="text-center mb-8">
            <h4 className="text-amber-400 font-semibold text-xl tracking-wider">CENA</h4>
          </div>

          {/* Time Slots */}
          <div className="mb-10">
            <label className="block text-lg font-medium text-white mb-4">
              Seleccione la Hora *{selectedTime && <span className="ml-2 text-green-400">✓</span>}
            </label>
            {timeSlots.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-4 mb-4">
                {row.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-6 rounded-xl text-center transition-all duration-200 min-w-[100px] font-medium ${
                      selectedTime === time
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!isComplete}
              className={`font-bold text-xl px-16 py-5 rounded-full shadow-2xl transition-all duration-300 transform tracking-wide ${
                isComplete
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:shadow-amber-500/25 hover:scale-105"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continuar a Información
            </button>
          </div>
        </div>
      </div>
    </ReservationLayout>
  )
}