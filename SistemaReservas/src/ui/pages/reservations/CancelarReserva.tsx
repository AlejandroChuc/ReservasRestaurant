import { useEffect, useState } from "react";

export default function CancelarReservaPage() {
  const [status, setStatus] = useState<"pending"|"success"|"error">("pending");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const numero = params.get("numero");
    if (numero) {
      fetch("/api/cancel-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservation_number: numero }),
      })
        .then(res => res.ok ? setStatus("success") : setStatus("error"))
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, []);

  if (status === "pending") return <p className="text-center mt-20">Cancelando reserva...</p>;
  if (status === "success") return <p className="text-center mt-20 text-green-600 font-bold">¡Reserva cancelada exitosamente!</p>;
  return <p className="text-center mt-20 text-red-600 font-bold">Error al cancelar la reserva.</p>;
}
