import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getPrivateFlights,
  ExternalFlight,
  deletePrivateFlight,
} from "@/services/flightService";
import FlightModal from "./flightsModal";

interface MyPrivateFlight extends ExternalFlight {
  destination?: string;
}

interface MyFlightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

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
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Eliminarás este vuelo simulado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;
    
    try {
      await deletePrivateFlight(flightId);
      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'El vuelo ha sido eliminado.',
        timer: 1500,
        showConfirmButton: false
      });
      fetchFlights();
    } catch (err: any) {
      Swal.fire("Error", err.message || "Error al eliminar el vuelo", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/30 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-xl z-[1010] w-full max-w-6xl max-h-[90vh] flex flex-col pointer-events-auto text-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mis Vuelos Privados</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Callsign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Origen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Destino
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flights.map((flight) => (
                  <tr key={flight.icao24}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {flight.callsign}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate">
                      {flight.originCountry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate">
                      {flight.destination || "N/A"}
                    </td>
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
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Eliminar vuelo"
                      >
                        <TrashIcon />
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
