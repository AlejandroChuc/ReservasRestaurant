import React, { useEffect } from 'react';
import ValidacionHuesped from '@/components/ValidacionHuesped';
import { useHuespedValidado } from '@/hooks/useHuespedValidado';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const EjemploValidacionCompleta: React.FC = () => {
  const { 
    huespedData, 
    validarHuesped, 
    limpiarHuesped, 
    isValidado 
  } = useHuespedValidado();

  useEffect(() => {
    if (isValidado) {
      console.log('Huésped validado automáticamente desde localStorage:', huespedData);
    }
  }, [isValidado, huespedData]);

  const manejarValidacionExitosa = (idHuesped: number, datosHuesped: any) => {
    console.log('Huésped validado con éxito:', datosHuesped);
    validarHuesped(idHuesped, datosHuesped);
    
    // Aquí puedes redirigir a la siguiente página
    // navigate('/seleccionar-restaurante');
  };

  const manejarError = (mensaje: string) => {
    console.error('Error en validación:', mensaje);
    alert(mensaje); // En producción usar un toast o modal más elegante
  };

  const continuarAReserva = () => {
    console.log('Continuando con la reserva para:', huespedData);
    // Aquí navegarías a la página de selección de restaurante
    // navigate('/restaurantes');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sistema de Reservas de Restaurante
      </h1>

      {isValidado ? (
        // Huésped ya validado - mostrar resumen y opciones
        <Card className="p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              ✅ Huésped Validado
            </h2>
            <div className="bg-green-50 p-4 rounded-lg">
              <p><strong>Nombre:</strong> {huespedData?.nombre_completo}</p>
              <p><strong>Habitación:</strong> {huespedData?.num_habitacion}</p>
              <p><strong>Estancia:</strong> {huespedData?.fecha_llegada} - {huespedData?.fecha_salida}</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={continuarAReserva}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continuar con Reserva
            </Button>
            <Button 
              onClick={limpiarHuesped}
              variant="outline"
            >
              Validar Otro Huésped
            </Button>
          </div>
        </Card>
      ) : (
        // Mostrar formulario de validación
        <div>
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Para realizar una reserva, primero debes validar tus datos de huésped del hotel.
            </p>
          </div>
          
          <ValidacionHuesped 
            onHuespedValidado={manejarValidacionExitosa}
            onError={manejarError}
          />
        </div>
      )}
    </div>
  );
};

export default EjemploValidacionCompleta;
