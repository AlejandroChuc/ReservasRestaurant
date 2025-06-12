"use client"

import type React from "react"

import { useState } from "react"

const restaurants = [
  { name: "FRIDA", logo: "/frida-logo.png", cuisine: "Mexican Fine Dining" },
  { name: "TORO", logo: "/toro-logo.png", cuisine: "Spanish Tapas" },
  { name: "Isla Sur Restaurant", cuisine: "Mediterranean" },
  { name: "CIAO", cuisine: "Italian Bistro" },
]

interface ReservationData {
  restaurant: string
  people: string
  selectedDate: number
  selectedTime: string
  roomNumber: string
  email: string
  customerName: string
  specialRequests?: string
}

interface RestaurantReservationProps {
  onReservationComplete: (data: ReservationData) => void
}

export default function RestaurantReservation({ onReservationComplete }: RestaurantReservationProps) {
  const [selected, setSelected] = useState(restaurants[0].name)
  const [people, setPeople] = useState("2")
  const [selectedDate, setSelectedDate] = useState(17)
  const [selectedTime, setSelectedTime] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [email, setEmail] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que todos los campos requeridos estén llenos
    if (!selectedTime || !roomNumber || !email || !customerName) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    // Crear objeto con todos los datos de la reserva
    const reservationData: ReservationData = {
      restaurant: selected,
      people,
      selectedDate,
      selectedTime,
      roomNumber,
      email,
      customerName,
      specialRequests,
    }

    // Enviar datos a la vista de confirmación
    onReservationComplete(reservationData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.02&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center py-12 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍽️</span>
            </div>
            <h1 className="text-5xl font-light text-white tracking-wider">
              Restaurant
              <span className="block text-2xl text-amber-400 font-normal mt-1">Reservations</span>
            </h1>
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Experience culinary excellence at our finest establishments
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between w-full max-w-2xl mb-16">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
              1
            </div>
            <span className="text-sm text-amber-400 mt-3 font-medium">Encontrar</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-slate-600 flex items-center justify-center text-slate-400 font-semibold text-lg">
              2
            </div>
            <span className="text-sm text-slate-400 mt-3">Información</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-slate-600 flex items-center justify-center text-slate-400 font-semibold text-lg">
              3
            </div>
            <span className="text-sm text-slate-400 mt-3">Adicional</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-slate-600 flex items-center justify-center text-slate-400 font-semibold text-lg">
              4
            </div>
            <span className="text-sm text-slate-400 mt-3">Confirmación</span>
          </div>
        </div>

        {/* Restaurant Selection */}
        <div className="w-full mb-12">
          <h2 className="text-2xl font-light text-white text-center mb-8 tracking-wide">Seleccione su Restaurante</h2>
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

        {/* Main Reservation Panel */}
        <form onSubmit={handleSubmit} className="w-full max-w-4xl">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            {/* Customer Name */}
            <div className="mb-10">
              <label className="block text-lg font-medium text-white mb-4">Nombre del Cliente *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ingrese el nombre completo"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
                required
              />
            </div>

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
              <label className="block text-lg font-medium text-white mb-4">Seleccione la Hora *</label>
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

            {/* Additional Info Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Número de Habitación *</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Ej: 205"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="su.email@ejemplo.com"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Special Requests */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-300 mb-2">Solicitudes Especiales (Opcional)</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm resize-none"
                placeholder="Restricciones dietéticas, ocasiones especiales, preferencias de asientos..."
              />
            </div>

            {/* Group Message */}
            <div className="mb-8">
              <button
                type="button"
                className="w-full border-2 border-amber-500 text-amber-400 py-4 px-6 rounded-xl text-sm hover:bg-amber-500/10 transition-all duration-200 font-medium"
              >
                Para grupos mayores de 8 personas - Solicitud de grupo
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xl px-16 py-5 rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 tracking-wide"
              >
                Continuar a Confirmación
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">Los campos marcados con * son obligatorios</p>
        </div>
      </div>
    </div>
  )
}
