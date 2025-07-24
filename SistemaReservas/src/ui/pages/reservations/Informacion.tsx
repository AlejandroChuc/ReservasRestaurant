"use client"

import { useState, useEffect } from "react"
import { useReservation } from "../../../context/ReservationContext"
import ReservationLayout from "../../components/Layout/ReservationLayout"

interface InformacionPageProps {
  onNext: () => void
  onBack: () => void
}

const API_BASE_URL = 'http://localhost:4000/api';

export default function InformacionPage({ onNext, onBack }: InformacionPageProps) {
  const { reservationData, updateReservationData, setCurrentStep } = useReservation()
  const [firstName, setFirstName] = useState(reservationData.firstName || "")
  const [apellidoPaterno, setApellidoPaterno] = useState(reservationData.apellidoPaterno || "")
  const [apellidoMaterno, setApellidoMaterno] = useState(reservationData.apellidoMaterno || "")
  const [email, setEmail] = useState(reservationData.email || "")
  const [roomNumber, setRoomNumber] = useState(reservationData.roomNumber || "")
  const [emailError, setEmailError] = useState("")
  const [roomError, setRoomError] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [huespedData, setHuespedData] = useState<any>(null)

  // Función para llenar con datos de prueba
  const fillWithTestData = () => {
    setFirstName("Fernando")
    setApellidoPaterno("May")
    setApellidoMaterno("Bustos")
    setEmail("fernando.nuevo@gmail.com") // Email diferente al de la BD
    setRoomNumber("456")
    setEmailError("")
    setRoomError("")
  }

  // Función para llenar con datos de prueba 2
  const fillWithTestData2 = () => {
    setFirstName("Fernando")
    setApellidoPaterno("May")
    setApellidoMaterno("Bustos")
    setEmail("fernando.may@test.com") // Email original de la BD
    setRoomNumber("456")
    setEmailError("")
    setRoomError("")
  }

  // Función para llenar con datos de prueba 3
  const fillWithTestData3 = () => {
    setFirstName("Fernando")
    setApellidoPaterno("May")
    setApellidoMaterno("Bustos")
    setEmail("fernando.personalizado@outlook.com") // Otro email diferente
    setRoomNumber("456")
    setEmailError("")
    setRoomError("")
  }

  useEffect(() => {
    setCurrentStep(3)
  }, [setCurrentStep])

  // Función para validar huésped en el backend
  const validateHuesped = async () => {
    if (!firstName || !apellidoPaterno || !apellidoMaterno || !email || !roomNumber || emailError || roomError) {
      setValidationError("Por favor complete todos los campos correctamente")
      return false
    }

    // Validar que el número de habitación sea válido
    const roomNum = parseInt(roomNumber);
    if (isNaN(roomNum) || roomNum <= 0) {
      setValidationError("El número de habitación debe ser un número válido")
      return false
    }

    setIsValidating(true)
    setValidationError("")

    try {
      console.log('🔍 Datos a enviar al backend:');
      console.log('- firstName:', firstName, typeof firstName);
      console.log('- apellidoPaterno:', apellidoPaterno, typeof apellidoPaterno);
      console.log('- apellidoMaterno:', apellidoMaterno, typeof apellidoMaterno);
      console.log('- email:', email, typeof email);
      console.log('- roomNumber:', roomNumber, typeof roomNumber);
      console.log('- roomNumber parseado:', parseInt(roomNumber), typeof parseInt(roomNumber));
      
      const requestBody = {
        nombre: firstName,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        num_habitacion: parseInt(roomNumber),
        correo: email
      };
      
      console.log('📦 Request body completo:', requestBody);
      console.log('📦 Request body JSON:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/huespedes/validar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        
        if (response.status === 404) {
          setValidationError('No se encontró ningún huésped con ese nombre, apellidos y número de habitación. El correo puede ser cualquiera que desee.');
          return false;
        }
        
        if (response.status === 500) {
          setValidationError('Error interno del servidor. Verifique que el servidor backend esté funcionando correctamente.');
          return false;
        }
        
        setValidationError(`Error del servidor: ${response.status} ${response.statusText}`);
        return false;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Respuesta no es JSON:', contentType);
        const text = await response.text();
        console.error('Contenido de respuesta:', text);
        setValidationError('El servidor no devolvió una respuesta JSON válida');
        return false;
      }

      const data = await response.json();
      console.log('Huésped validado exitosamente:', data.nombre_completo);

      if (data.success) {
        // Huésped válido - guardar datos Y el número de personas
        setHuespedData({
          id_huesped: data.id_huesped,
          nombre_completo: data.nombre_completo,
          num_habitacion: data.num_habitacion,
          numero_personas: data.numero_personas, // Obtener del backend
          fecha_llegada: data.fecha_llegada,
          fecha_salida: data.fecha_salida,
          correo: data.correo
        });
        
        // Guardar el número de personas en el contexto para los siguientes pasos
        updateReservationData({
          people: data.numero_personas?.toString() || "1"
        });
        
        console.log('✅ Número de personas obtenido del huésped:', data.numero_personas);
        return true;
      } else {
        setValidationError(data.error || 'Error al validar los datos del huésped');
        return false;
      }
    } catch (error) {
      console.error('Error al validar huésped:', error);
      setValidationError('Error de conexión al servidor. Asegúrese de que el servidor backend esté corriendo en el puerto 4000.');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleContinue = async () => {
    // Primero validar el huésped
    const isValidHuesped = await validateHuesped();
    
    if (!isValidHuesped) {
      return;
    }

    // Si la validación es exitosa, continuar con la reserva
    updateReservationData({
      firstName,
      apellidoPaterno,
      apellidoMaterno,
      lastName: `${apellidoPaterno} ${apellidoMaterno}`, // para compatibilidad
      email,
      roomNumber,
      customerName: `${firstName} ${apellidoPaterno} ${apellidoMaterno}`,
      huespedData: huespedData // Agregar los datos del huésped validado
    })
    
    console.log('[INFO] InformacionPage reservationData:', {
      firstName,
      apellidoPaterno,
      apellidoMaterno,
      email,
      roomNumber,
      huespedData
    });
    
    onNext()
  }

  const handleBack = () => {
    updateReservationData({
      firstName,
      apellidoPaterno,
      apellidoMaterno,
      lastName: `${apellidoPaterno} ${apellidoMaterno}`,
      email,
      roomNumber,
      customerName: `${firstName} ${apellidoPaterno} ${apellidoMaterno}`
    })
    onBack()
  }

  const isComplete = firstName && apellidoPaterno && apellidoMaterno && email && roomNumber && !emailError && !roomError

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

          {/* Botones de prueba */}
          <div className="text-center mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={fillWithTestData}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                🧪 Email Nuevo
              </button>
              <button
                onClick={fillWithTestData2}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                🧪 Email Original
              </button>
              <button
                onClick={fillWithTestData3}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                🧪 Email Personalizado
              </button>
            </div>
            <p className="text-slate-400 text-sm mt-2">Prueba diferentes emails - todos funcionan con los mismos datos de huésped</p>
          </div>

          {/* Nombre y Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-lg font-medium text-white mb-4">
                Nombre *{firstName && <span className="ml-2 text-green-400">✓</span>}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-white mb-4">
                Apellido Paterno *{apellidoPaterno && <span className="ml-2 text-green-400">✓</span>}
              </label>
              <input
                type="text"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
                placeholder="Apellido paterno"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-white mb-4">
                Apellido Materno *{apellidoMaterno && <span className="ml-2 text-green-400">✓</span>}
              </label>
              <input
                type="text"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
                placeholder="Apellido materno"
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
                  <span className="font-medium">Importante:</span> Los datos deben coincidir exactamente con tu reserva de hotel.
                  Solo puedes hacer reservas durante tu estancia en el hotel. 
                  <br />
                  <span className="font-medium">Nota:</span> Al validar tus datos, obtendremos automáticamente el número de personas registradas en tu reserva de hotel.
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje de error de validación */}
          {validationError && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-red-200 text-sm leading-relaxed font-medium">
                    {validationError}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              disabled={!isComplete || isValidating}
              className={`font-bold text-xl px-16 py-5 rounded-full shadow-2xl transition-all duration-300 transform tracking-wide ${
                isComplete && !isValidating
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:shadow-amber-500/25 hover:scale-105 hover:shadow-2xl"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
              }`}
            >
              {isValidating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Validando Huésped...
                </span>
              ) : isComplete ? (
                <span className="flex items-center gap-2">
                  Validar y Continuar
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
