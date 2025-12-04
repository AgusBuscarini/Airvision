import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  createPrivateFlight,
  CreatePrivateFlightRequest,
} from "@/services/flightService";
import { getMyPrivateAirlines } from "@/services/airlineService";
import { Airport, getAirports } from "@/services/airportService";

interface Airline {
  id: string;
  name: string;
}

interface FlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface FlightFormData {
  callsign: string;
  airlineId: string;
  originAirportId: string;
  destinationAirportId: string;
  icao24?: string;
}

const FlightModal: React.FC<FlightModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FlightFormData>({
    callsign: "",
    airlineId: "",
    originAirportId: "",
    destinationAirportId: "",
  });

  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(false);
  const [privateAirlines, setPrivateAirlines] = useState<Airline[]>([]);
  const [isLoadingAirlines, setIsLoadingAirlines] = useState(false);
  const [errorAirports, setErrorAirports] = useState("");
  const [errorAirlines, setErrorAirlines] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        callsign: "",
        airlineId: "",
        originAirportId: "",
        destinationAirportId: "",
      });
      setSubmitError("");

      const fetchAirlines = async () => {
        setIsLoadingAirlines(true);
        setErrorAirlines("");
        try {
          const airlines = await getMyPrivateAirlines();
          setPrivateAirlines(airlines);
        } catch (error) {
          console.error("Error fetching private airlines:", error);
          setErrorAirlines("No se pudieron cargar las aerolíneas.");
        } finally {
          setIsLoadingAirlines(false);
        }
      };

      const fetchAirports = async () => {
        setIsLoadingAirports(true);
        setErrorAirports("");
        try {
          const airportData = await getAirports();
          setAirports(airportData);
        } catch (error) {
          console.error("Error fetching airports:", error);
          setErrorAirports("No se pudieron cargar los aeropuertos.");
        } finally {
          setIsLoadingAirports(false);
        }
      };

      fetchAirlines();
      fetchAirports();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.airlineId ||
      !formData.originAirportId ||
      !formData.destinationAirportId
    ) {
      setSubmitError("Por favor, completa todos los campos obligatorios.");
      return;
    }
    if (formData.originAirportId === formData.destinationAirportId) {
      setSubmitError("El origen y el destino no pueden ser iguales.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const requestData: CreatePrivateFlightRequest = {
        callsign: formData.callsign,
        airlineId: formData.airlineId,
        originAirportId: formData.originAirportId,
        destinationAirportId: formData.destinationAirportId,
        icao24: formData.icao24,
      };

      const createdFlight = await createPrivateFlight(requestData);

      console.log("Vuelo creado exitosamente:", createdFlight);
      if (onSuccess) onSuccess();
      onClose();
      Swal.fire({
        icon: 'success',
        title: '¡Vuelo Creado!',
        text: `El vuelo ${createdFlight.callsign} se ha creado y está en tierra.`,
        timer: 3000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error al crear vuelo:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Error desconocido al crear el vuelo"
      );
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al crear el vuelo.',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isLoading = isLoadingAirlines || isLoadingAirports;

  return (
    <div className="fixed inset-0 z-[2000] flex justify-center items-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl z-[1010] w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Crear Vuelo Privado
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 text-2xl disabled:opacity-50"
          >
            &times;
          </button>
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="airlineId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Aerolínea*
            </label>
            {isLoadingAirlines && (
              <p className="text-sm text-gray-500">Cargando aerolíneas...</p>
            )}
            {errorAirlines && (
              <p className="text-sm text-red-500">{errorAirlines}</p>
            )}
            <select
              id="airlineId"
              name="airlineId"
              value={formData.airlineId}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !formData.airlineId ? "border-red-500" : "border-gray-300"
              }`}
              required
              disabled={
                isLoadingAirlines ||
                !!errorAirlines ||
                privateAirlines.length === 0 ||
                isSubmitting
              }
            >
              <option value="" disabled>
                -- Selecciona tu aerolínea --
              </option>
              {privateAirlines.map((airline) => (
                <option key={airline.id} value={airline.id}>
                  {airline.name}
                </option>
              ))}
            </select>
            {privateAirlines.length === 0 &&
              !isLoadingAirlines &&
              !errorAirlines && (
                <p className="text-xs text-gray-500 mt-1">
                  No tienes aerolíneas privadas.
                </p>
              )}
          </div>

          <div>
            <label
              htmlFor="callsign"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Identificador (Callsign)*
            </label>
            <input
              type="text"
              id="callsign"
              name="callsign"
              value={formData.callsign}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Ej: PRV001"
            />
          </div>

          <div>
            <label
              htmlFor="icao24"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ICAO24 (Opcional)
            </label>
            <input
              type="text"
              id="icao24"
              name="icao24"
              value={formData.icao24 || ""}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Ej: a1b2c3 (Hex)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="originAirportId" className="block text-sm font-medium text-gray-700 mb-1">
                Aeropuerto Origen*
              </label>
              {errorAirports && <p className="text-sm text-red-500">{errorAirports}</p>}
              <select
                id="originAirportId"
                name="originAirportId"
                value={formData.originAirportId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading || !!errorAirports || isSubmitting}
              >
                <option value="" disabled>-- Selecciona Origen --</option>
                {airports.map(airport => (
                  <option key={airport.id} value={airport.id}>{airport.iata} - {airport.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="destinationAirportId" className="block text-sm font-medium text-gray-700 mb-1">
                Aeropuerto Destino*
              </label>
              <select
                id="destinationAirportId"
                name="destinationAirportId"
                value={formData.destinationAirportId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading || !!errorAirports || isSubmitting}
              >
                <option value="" disabled>-- Selecciona Destino --</option>
                {airports.map(airport => (
                  <option key={airport.id} value={airport.id}>{airport.iata} - {airport.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creando...
                </>
              ) : (
                "Crear Vuelo"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightModal;
