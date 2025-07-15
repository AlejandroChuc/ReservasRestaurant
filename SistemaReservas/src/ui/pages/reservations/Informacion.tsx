"use client"

import { useState, useEffect } from "react"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"

interface InformacionPageProps {
  onNext: () => void
  onBack: () => void
}

export default function InformacionPage({ onNext, onBack }: InformacionPageProps) {
  const { reservationData, updateReservationData, setCurrentStep } = useReservation()
  const [firstName, setFirstName] = useState(reservationData.firstName || "")
  const [lastName, setLastName] = useState(reservationData.lastName || "")
  const [email, setEmail] = useState(reservationData.email || "")
  const [roomNumber, setRoomNumber] = useState(reservationData.roomNumber || "")
  const [emailError, setEmailError] = useState("")
  const [roomError, setRoomError] = useState("")

  useEffect(() => {
    setCurrentStep(3)
  }, [setCurrentStep])

  const handleContinue = () => {
    if (!firstName || !lastName || !email || !roomNumber || emailError || roomError) {
      alert("Por favor complete todos los campos requeridos correctamente")
      return
    }
    updateReservationData({
      firstName,
      lastName,
      email,
      roomNumber,
      customerName: `${firstName} ${lastName}` // para compatibilidad
    })
    console.log('[INFO] InformacionPage reservationData:', {
      firstName,
      lastName,
      email,
      roomNumber,
    });
    onNext()
  }

  const handleBack = () => {
    updateReservationData({
      firstName,
      lastName,
      email,
      roomNumber,
      customerName: `${firstName} ${lastName}`
    })
    onBack()
  }

  const isComplete = firstName && lastName && email && roomNumber && !emailError && !roomError

  // Validación de email
  const validateEmail = (value: string) => {
    if (!value.includes("@")) {
      setEmailError("Ingrese un correo válido")
    } else {
      setEmailError("")
    }
    setEmail(value)
  }

  // Validación de número de habitación
  const validateRoom = (value: string) => {
    if (!/^\d*$/.test(value)) {
      setRoomError("Solo números")
    } else {
      setRoomError("")
    }
    setRoomNumber(value.replace(/\D/g, ""))
  }

  return (
    <ReservationLayout
      currentStep={2}
      title="Información del Cliente"
      subtitle="Complete sus datos personales para la reserva"
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Resumen de selección anterior - Mejorado y más parecido al dashboard */}
        <div className="mb-8 bg-[#2d3748] rounded-2xl p-6 shadow-xl border border-[#4a5568]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg">Resumen de su selección</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1a202c] rounded-xl p-4 border border-[#4a5568]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-slate-400 text-sm">Restaurante</span>
              </div>
              <p className="text-white font-medium">{reservationData.restaurant}</p>
            </div>
            <div className="bg-[#1a202c] rounded-xl p-4 border border-[#4a5568]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-slate-400 text-sm">Personas</span>
              </div>
              <p className="text-white font-medium">{reservationData.people}</p>
            </div>
            <div className="bg-[#1a202c] rounded-xl p-4 border border-[#4a5568]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 9a2 2 0 002 2h8a2 2 0 002-2l-2-9m-6 0V7" />
                </svg>
                <span className="text-slate-400 text-sm">Fecha</span>
              </div>
              <p className="text-white font-medium">{reservationData.selectedDate} Mayo</p>
            </div>
            <div className="bg-[#1a202c] rounded-xl p-4 border border-[#4a5568]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-slate-400 text-sm">Hora</span>
              </div>
              <p className="text-white font-medium">{reservationData.selectedTime}</p>
            </div>
          </div>
        </div>

        {/* Formulario principal - Mejorado y más parecido al dashboard */}
        <div className="bg-[#2d3748] rounded-3xl p-8 md:p-12 shadow-2xl border border-[#4a5568]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Datos Personales</h2>
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-lg font-medium text-white mb-4">
                Nombre *{firstName && <span className="ml-2 text-green-400">✓</span>}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ingrese su nombre"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-white mb-4">
                Apellido *{lastName && <span className="ml-2 text-green-400">✓</span>}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ingrese su apellido"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
                required
              />
            </div>
          </div>

          {/* Email y Habitación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-white mb-4">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Correo Electrónico
                <span className="text-red-400">*</span>
                {email && <span className="ml-2 text-green-400">✓</span>}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  placeholder="su.email@ejemplo.com"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg hover:bg-white/10"
                  required
                />
                {emailError && (
                  <div className="text-red-400 text-sm mt-2">{emailError}</div>
                )}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  {email && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-white mb-4">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Número de Habitación
                <span className="text-red-400">*</span>
                {roomNumber && <span className="ml-2 text-green-400">✓</span>}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => validateRoom(e.target.value)}
                  placeholder="Ej: 205"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg hover:bg-white/10"
                  required
                />
                {roomError && (
                  <div className="text-red-400 text-sm mt-2">{roomError}</div>
                )}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  {roomNumber && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nota informativa - Mejorada */}
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-amber-200 text-sm leading-relaxed">
                  <span className="font-medium">Información importante:</span> Utilizaremos estos datos para confirmar
                  su reserva y enviarle los detalles por correo electrónico. Sus datos están protegidos y no serán
                  compartidos con terceros.
                </p>
              </div>
            </div>
          </div>

          {/* Botones de navegación - Mejorados */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <button
              onClick={handleBack}
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
              Volver
            </button>

            <button
              onClick={handleContinue}
              disabled={!isComplete}
              className={`font-bold text-xl px-16 py-5 rounded-full shadow-2xl transition-all duration-300 transform tracking-wide ${
                isComplete
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:shadow-amber-500/25 hover:scale-105 hover:shadow-2xl"
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
                "Complete todos los campos"
              )}
            </button>
          </div>
        </div>
      </div>
    </ReservationLayout>
  )
}
