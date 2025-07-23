import React, { useState, useEffect } from 'react';
import ValidacionHuesped from '@/components/ValidacionHuesped';
import { useHuespedValidado } from '@/hooks/useHuespedValidado';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FlujoReservaConValidacion: React.FC = () => {
  const { 
    huespedData, 
    isValidado, 
    validarHuesped, 
    limpiarHuesped, 
    cargarHuespedGuardado 
  } = useHuespedValidado();
  
  const [error, setError] = useState<string>('');
  const [etapaActual, setEtapaActual] = useState<'validacion' | 'seleccion-restaurante' | 'reserva'>('validacion');

  useEffect(() => {
    // Cargar datos guardados al montar el componente
    cargarHuespedGuardado();
  }, []);

  useEffect(() => {
    // Si hay un huésped validado, pasar a la siguiente etapa
    if (isValidado && etapaActual === 'validacion') {
      setEtapaActual('seleccion-restaurante');
    }
  }, [isValidado, etapaActual]);

  const handleHuespedValidado = (idHuesped: number, datosHuesped: any) => {
    validarHuesped(idHuesped, datosHuesped);
    setError('');
    console.log('Huésped validado con ID:', idHuesped);
  };

  const handleError = (mensaje: string) => {
    setError(mensaje);
  };

  const handleReiniciarProceso = () => {
    limpiarHuesped();
    setError('');
    setEtapaActual('validacion');
  };

  const renderEtapaValidacion = () => (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">❌ Error</p>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <ValidacionHuesped 
        onHuespedValidado={handleHuespedValidado}
        onError={handleError}
      />
    </div>
  );

  const renderResumenHuesped = () => (
    <Card className="p-4 bg-green-50 border-green-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-green-800 mb-2">✅ Huésped Validado</h3>
          <p><strong>Nombre:</strong> {huespedData?.nombre_completo}</p>
          <p><strong>Habitación:</strong> {huespedData?.num_habitacion}</p>
          <p><strong>Estancia:</strong> {huespedData?.fecha_llegada} - {huespedData?.fecha_salida}</p>
          <p className="text-sm text-green-700 mt-2">ID Huésped: {huespedData?.id_huesped}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReiniciarProceso}
        >
          Cambiar Datos
        </Button>
      </div>
    </Card>
  );

  const renderSeleccionRestaurante = () => (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Seleccionar Restaurante</h2>
      <p className="text-gray-600 mb-4">
        Ahora puedes continuar con la selección del restaurante y horario.
      </p>
      
      {/* Aquí iría el componente de selección de restaurante */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800">
          🍽️ Aquí se mostraría la lista de restaurantes disponibles...
        </p>
        <p className="text-sm text-blue-600 mt-2">
          El ID del huésped ({huespedData?.id_huesped}) se usará para crear la reserva final.
        </p>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={() => setEtapaActual('validacion')}>
          ← Volver
        </Button>
        <Button onClick={() => setEtapaActual('reserva')}>
          Continuar con Reserva →
        </Button>
      </div>
    </Card>
  );

  const renderReserva = () => (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Finalizar Reserva</h2>
      <p className="text-gray-600 mb-4">
        Última etapa del proceso de reserva.
      </p>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-4">
        <p className="text-yellow-800">
          📝 Aquí se finalizaría la reserva usando el id_huesped: {huespedData?.id_huesped}
        </p>
      </div>
      
      <Button onClick={() => setEtapaActual('seleccion-restaurante')}>
        ← Volver a Selección
      </Button>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Sistema de Reservas de Restaurante
        </h1>
        <p className="text-gray-600">
          Etapa actual: <span className="font-semibold capitalize">{etapaActual.replace('-', ' ')}</span>
        </p>
      </div>

      {/* Mostrar resumen del huésped si está validado */}
      {isValidado && renderResumenHuesped()}

      {/* Renderizar la etapa actual */}
      {etapaActual === 'validacion' && renderEtapaValidacion()}
      {etapaActual === 'seleccion-restaurante' && renderSeleccionRestaurante()}
      {etapaActual === 'reserva' && renderReserva()}
    </div>
  );
};

export default FlujoReservaConValidacion;
