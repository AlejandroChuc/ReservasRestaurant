    import { CheckCircle, XCircle, Mail, Clock } from "lucide-react";

interface EmailStatusProps {
  status: "sending" | "sent" | "error";
  email: string;
  onRetry?: () => void;
}

export function EmailStatus({ status, email, onRetry }: EmailStatusProps) {
  if (status === "sending") {
    return (
      <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
        <Clock className="h-5 w-5 text-blue-500 mr-3 animate-pulse" />
        <div className="text-center">
          <p className="text-blue-800 font-medium">
            Enviando email de confirmación
          </p>
          <p className="text-blue-600 text-sm">A: {email}</p>
        </div>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
        <div className="text-center">
          <p className="text-green-800 font-medium">
            ✓ Email enviado exitosamente
          </p>
          <p className="text-green-600 text-sm">
            Revise su bandeja de entrada: {email}
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
        <div className="flex items-center justify-center mb-3">
          <XCircle className="h-5 w-5 text-red-500 mr-3" />
          <div className="text-center">
            <p className="text-red-800 font-medium">Error enviando email</p>
            <p className="text-red-600 text-sm">A: {email}</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-red-700 text-sm mb-3">
            Su reserva está confirmada, pero no se pudo enviar el email de
            confirmación.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md text-sm transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" />
              Reenviar Email
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
