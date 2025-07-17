"use client"

import { useState, useEffect } from "react"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"

interface SelectDateTimeStepProps {
  onNext: () => void
  onBack?: () => void
}

// 🔹 Fechas disponibles
const days = [
  { num: 23, day: "Mon", fullDay: "Lunes" },
  { num: 24, day: "Tue", fullDay: "Martes" },
  { num: 25, day: "Wed", fullDay: "Miércoles" },
  { num: 26, day: "Thu", fullDay: "Jueves" },
  { num: 27, day: "Fri", fullDay: "Viernes" },
  { num: 28, day: "Sat", fullDay: "Sábado" },
  { num: 29, day: "Sun", fullDay: "Domingo" },
  { num: 30, day: "Mon", fullDay: "Lunes" },
  { num: 1, day: "Tue", fullDay: "Martes" },
  { num: 2, day: "Wed", fullDay: "Miércoles" },
]

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

// 🔹 Horarios por restaurante y bloque
const scheduleByRestaurantAndBlock: Record<number, Record<string, string[]>> = {
  1: {
    Desayuno: ["07:00", "08:00", "09:00", "10:00"],
    Comida: ["13:00", "14:00", "15:00"],
    Cena: ["18:00", "19:30", "21:00", "22:00"],
  },
  2: {
    Desayuno: ["07:30", "08:30", "09:30"],
    Comida: ["13:30", "14:30", "15:30"],
    Cena: ["17:30", "19:00", "20:30", "21:30"],
  },
  3: {
    Desayuno: ["08:00", "09:00", "10:00"],
    Comida: ["12:30", "13:30", "14:30"],
    Cena: ["19:00", "20:00", "21:00"],
  },
  4: {
    Desayuno: ["07:00", "08:00", "09:00"],
    Comida: ["13:00", "14:00", "15:00"],
    Cena: ["18:30", "20:00", "21:30"],
  },
}

export default function SelectDateTimeStep({ onNext, onBack }: SelectDateTimeStepProps) {
  const { reservationData, updateReservationData, setCurrentStep } = useReservation()
  // Todo inicia vacío, el usuario debe seleccionar
  const [people, setPeople] = useState(reservationData.people || "")
  const [selectedDate, setSelectedDate] = useState<number | null>(reservationData.selectedDate || null)
  const [selectedTime, setSelectedTime] = useState(reservationData.selectedTime || "")
  const [selectedBlock, setSelectedBlock] = useState<string>("")

  useEffect(() => {
    setCurrentStep(2)
  }, [setCurrentStep])

  const handleContinue = () => {
    if (!people || !selectedDate || !selectedTime || !selectedBlock) return;
    updateReservationData({
      people,
      selectedDate,
      selectedTime,
      mealBlock: selectedBlock,
    })
    console.log('[INFO] HorariosPage reservationData:', {
      people,
      selectedDate,
      selectedTime,
      mealBlock: selectedBlock,
    });
    onNext()
  }

  const isComplete = people && selectedDate && selectedTime && selectedBlock;
  const restaurantId = reservationData.restaurantId;
  const timeSlots = restaurantId && selectedBlock ? (scheduleByRestaurantAndBlock[restaurantId]?.[selectedBlock] || []) : [];
  const selectedMealBlock = mealBlocks.find((block) => block.key === selectedBlock);

  return (
    <ReservationLayout
      currentStep={3}
      title="Seleccione Fecha y Horario"
      subtitle={`Elija la fecha, bloque de comida y horario para su reserva en ${reservationData.restaurant || "el restaurante seleccionado"}`}
    >
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Número de personas - Mejorado */}
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
          <select
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white text-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500 hover:bg-white/15 transition-all"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          >
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1} className="bg-slate-800">
                {i + 1} persona{i > 0 ? "s" : ""}
              </option>
            ))}
          </select>
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
            {days.map((day) => (
              <button
                key={day.num}
                className={`min-w-[90px] px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  selectedDate === day.num
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/25"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
                onClick={() => setSelectedDate(day.num)}
              >
                <span className="font-bold block text-xl">{day.num}</span>
                <span className="text-xs opacity-80 block">{day.fullDay}</span>
              </button>
            ))}
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

          {timeSlots.length > 0 ? (
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
