import React, { useState, useEffect } from "react";
import {
  getPrivateFlights,
  ExternalFlight,
  deletePrivateFlight
} from "@/services/flightService";
import FlightModal from "./flightsModal";
interface MyPrivateFlight extends ExternalFlight {
  destination?: string;
}

interface MyFlightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyFlightsModal: React.FC<MyFlightsModalProps> = ({ isOpen, onClose }) => {
  const [flights, setFlights] = useState<MyPrivateFlight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchFlights = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getPrivateFlights();
      setFlights(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar vuelos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFlights();
    }
  }, [isOpen]);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    fetchFlights();
  };

  const handleDelete = async (flightId: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este vuelo simulado?")) {
      return;
    }
    
    try {
      await deletePrivateFlight(flightId);
      fetchFlights();
    } catch (err: any) {
      setError(err.message || "Error al eliminar el vuelo");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 pointer-events-none">
        <div className="bg-white p-6 rounded-lg shadow-xl z-[1010] w-full max-w-4xl max-h-[90vh] flex flex-col pointer-events-auto text-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mis Vuelos Privados</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              &times;
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-fit-content self-start"
          >
            Añadir Vuelo
          </button>

          {isLoading && <p>Cargando vuelos...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Callsign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destino</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flights.map((flight) => (
                  <tr key={flight.icao24}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{flight.callsign}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flight.originCountry}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flight.destination || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {flight.onGround ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          En Tierra
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          En Aire
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(flight.icao24)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {flights.length === 0 && !isLoading && (
              <p className="text-center text-gray-500 py-8">
                No has creado ningún vuelo privado.
              </p>
            )}
          </div>
          
          <div className="flex justify-end mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <FlightModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess} //
      />
    </>
  );
};

export default MyFlightsModal;