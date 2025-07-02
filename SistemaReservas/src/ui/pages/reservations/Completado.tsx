import { useReservation } from "../../../context/ReservationContext";
import { useGlobalReservations } from "../../../context/GlobalReservationsContext";
import { useEffect, useState } from "react";
import {
  sendReservationConfirmationEmail,
  isValidEmail,
} from "../../../services/emailService";
import { EmailStatus } from "../../../components/EmailStatus";
import {
  testEmailConfiguration,
  showEmailJSInstructions,
} from "../../../utils/emailDiagnostics";
import {
  testEmailJSDirectly,
  testEmailDelivery,
} from "../../../config/emailConfig";

interface CompletadoPageProps {
  onNewReservation: () => void;
  onComplete: () => void;
}

export default function CompletadoPage({
  onNewReservation,
  onComplete,
}: CompletadoPageProps) {
  const { reservationData } = useReservation();
  const { addReservation } = useGlobalReservations();
  const [reservationNumber, setReservationNumber] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  // Generar la reserva y agregarla al contexto global
  useEffect(() => {
    console.log("Completado useEffect ejecutado", {
      restaurant: reservationData.restaurant,
      customerName: reservationData.customerName,
      reservationNumber: reservationNumber,
    });

    if (
      reservationData.restaurant &&
      reservationData.customerName &&
      !reservationNumber
    ) {
      console.log("Creando nueva reserva...");
      const newReservationNumber = `RES-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;
      setReservationNumber(newReservationNumber);

      // Determinar el bloque de comida basado en la hora
      const getMealBlock = (time: string): "desayuno" | "comida" | "cena" => {
        const hour = parseInt(time.split(":")[0]);
        if (hour >= 6 && hour < 12) return "desayuno";
        if (hour >= 12 && hour < 18) return "comida";
        return "cena";
      };

      // Crear la nueva reserva
      const newReservation = {
        guestName: reservationData.customerName,
        roomNumber: reservationData.roomNumber || "N/A",
        numberOfPeople: parseInt(reservationData.people || "1"),
        restaurant: reservationData.restaurant,
        date: new Date().toISOString().split("T")[0], // Fecha actual
        time: reservationData.selectedTime || "12:00",
        mealBlock: getMealBlock(reservationData.selectedTime || "12:00"),
        status: "confirmada" as const,
        arrivalConfirmed: false,
        mealCompleted: false,
      };

      console.log("Nueva reserva creada:", newReservation);
      addReservation(newReservation);
      console.log("addReservation llamada completada");

      // Enviar email de confirmación
      if (reservationData.email && isValidEmail(reservationData.email)) {
        console.log("📧 Iniciando envío de email...");
        setEmailSending(true);

        const emailData = {
          customerName: reservationData.customerName || "Cliente",
          customerEmail: reservationData.email,
          restaurant: reservationData.restaurant || "Restaurante",
          date: new Date().toLocaleDateString("es-ES"),
          time: reservationData.selectedTime || "12:00",
          numberOfPeople: reservationData.people || "1",
          roomNumber: reservationData.roomNumber || "N/A",
          reservationNumber: newReservationNumber,
          specialRequests: reservationData.specialRequests || "Ninguna",
        };

        console.log("📋 Datos del email:", emailData);

        sendReservationConfirmationEmail(emailData)
          .then((success) => {
            console.log("📤 Resultado del envío:", success);
            setEmailSending(false);
            if (success) {
              console.log("✅ Email de confirmación enviado exitosamente");
              setEmailSent(true);
              setEmailError(false);
            } else {
              console.error("❌ Error enviando email de confirmación");
              setEmailError(true);
            }
          })
          .catch((error) => {
            console.error("💥 Error en envío de email:", error);
            setEmailSending(false);
            setEmailError(true);
          });
      } else {
        console.warn(
          "⚠️ Email no válido o no proporcionado:",
          reservationData.email
        );
        setEmailError(true);
      }
    }
  }, [reservationData, addReservation, reservationNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ¡Reserva Confirmada!
        </h2>
        <p className="text-gray-600 mb-6">
          Su reserva en <strong>{reservationData.restaurant}</strong> ha sido
          confirmada exitosamente.
        </p>

        {/* Mostrar status del email */}
        {reservationData.email && (
          <EmailStatus
            status={
              emailSending
                ? "sending"
                : emailSent
                ? "sent"
                : emailError
                ? "error"
                : "sending"
            }
            email={reservationData.email}
            onRetry={
              emailError
                ? () => {
                    if (
                      reservationData.email &&
                      isValidEmail(reservationData.email)
                    ) {
                      setEmailSending(true);
                      setEmailError(false);

                      const emailData = {
                        customerName: reservationData.customerName || "Usuario",
                        customerEmail: reservationData.email,
                        restaurant: reservationData.restaurant || "Restaurante",
                        date: new Date().toLocaleDateString("es-ES"),
                        time: reservationData.selectedTime || "12:00",
                        numberOfPeople: reservationData.people || "1",
                        roomNumber: reservationData.roomNumber || "N/A",
                        reservationNumber: reservationNumber,
                        specialRequests: reservationData.specialRequests,
                      };

                      sendReservationConfirmationEmail(emailData).then(
                        (success) => {
                          setEmailSending(false);
                          if (success) {
                            setEmailSent(true);
                            setEmailError(false);
                          } else {
                            setEmailError(true);
                          }
                        }
                      );
                    }
                  }
                : undefined
            }
          />
        )}
        <p className="text-sm text-gray-500 mb-8">
          Número de confirmación:{" "}
          <span className="font-mono font-bold">
            {reservationNumber || "Generando..."}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNewReservation}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300"
          >
            Hacer Nueva Reserva
          </button>
          <button
            onClick={onComplete}
            className="bg-slate-700 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300"
          >
            Volver al Inicio
          </button>
        </div>

        {/* Botón de diagnóstico - TEMPORAL PARA DEBUGGING */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => {
                console.log("🔍 Iniciando diagnóstico EmailJS...");
                testEmailConfiguration().then((result) => {
                  if (result.success) {
                    alert(
                      "✅ Configuración EmailJS correcta. Revisa la consola para más detalles."
                    );
                  } else {
                    alert("❌ Error en configuración: " + result.error);
                  }
                });
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
            >
              🔍 Probar EmailJS
            </button>
            <button
              onClick={() => testEmailJSDirectly()}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
            >
              🚀 Prueba Direct
            </button>
            <button
              onClick={() => testEmailDelivery()}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
            >
              📧 Test Entrega
            </button>
            <button
              onClick={showEmailJSInstructions}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
            >
              📖 Ver Instrucciones
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Botones de diagnóstico (remover en producción)
          </p>
        </div>
      </div>
    </div>
  );
}
