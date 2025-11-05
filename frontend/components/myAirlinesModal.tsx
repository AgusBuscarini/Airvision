import React, { useState, useEffect } from "react";
import {
  getMyPrivateAirlines,
  deleteMyPrivateAirline,
  AirlineResponse,
} from "@/services/airlineService";
import AirlineModal from "./airlineModal";

interface MyAirlinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyAirlinesModal: React.FC<MyAirlinesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [airlines, setAirlines] = useState<AirlineResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchAirlines = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getMyPrivateAirlines(); //
      setAirlines(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar las aerolíneas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAirlines();
    }
  }, [isOpen]);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    fetchAirlines();
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar esta aerolínea? Todos los vuelos simulados asociados también serán eliminados."
      )
    ) {
      return;
    }

    try {
      await deleteMyPrivateAirline(id); 
      fetchAirlines();
    } catch (err: any) {
      setError(err.message || "Error al eliminar la aerolínea");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 pointer-events-none">
        <div className="bg-white p-6 rounded-lg shadow-xl z-[1010] w-full max-w-3xl max-h-[90vh] flex flex-col pointer-events-auto text-gray-800">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mis Aerolíneas Privadas</h2>
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
            Añadir Aerolínea
          </button>

          {isLoading && <p>Cargando aerolíneas...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">País</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IATA/ICAO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {airlines.map((airline) => (
                  <tr key={airline.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{airline.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{airline.country?.name || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{airline.iata || "N/A"} / {airline.icao || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleDelete(airline.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {airlines.length === 0 && !isLoading && (
              <p className="text-center text-gray-500 py-8">
                No has creado ninguna aerolínea privada.
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
      <AirlineModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess} //
      />
    </>
  );
};

export default MyAirlinesModal;