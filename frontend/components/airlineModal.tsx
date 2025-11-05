import React, { useState, useEffect } from "react";
import { getCountries } from "@/services/countryService";
import { createPrivateAirline, Country } from "@/services/airlineService";

interface AirlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface AirlineFormData {
  name: string;
  iata: string;
  icao: string;
  countryCode: string;
}

const AirlineModal: React.FC<AirlineModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<AirlineFormData>({
    name: "",
    iata: "",
    icao: "",
    countryCode: "",
  });

  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    if (isOpen) {
      getCountries()
        .then((data) => setCountries(data))
        .catch((err) => console.error("Error al cargar países:", err));
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

    try {
      const selectedCountry = countries.find(
        (c) => c.code === formData.countryCode
      );

      if (!selectedCountry) {
        alert("Por favor, seleccione un país válido.");
        return;
      }

      await createPrivateAirline({
        name: formData.name,
        iata: formData.iata,
        icao: formData.icao,
        country: selectedCountry,
      });

      alert("✅ Aerolínea creada exitosamente");
      onClose();
    } catch (error: any) {
      console.error("Error al crear la aerolínea:", error);
      alert(error.message || "Error al crear la aerolínea");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 pointer-events-none">
      <div className="bg-white p-6 rounded-lg shadow-xl z-[1010] w-full max-w-md mx-4 pointer-events-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Agregar Aerolínea Privada
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Mi Aerolínea Privada"
              required
            />
          </div>
          <div>
            <label
              htmlFor="iata"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Código IATA (Opcional)
            </label>
            <input
              type="text"
              id="iata"
              name="iata"
              value={formData.iata}
              onChange={handleChange}
              maxLength={3}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: PRV"
            />
          </div>
          <div>
            <label
              htmlFor="icao"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Código ICAO (Opcional)
            </label>
            <input
              type="text"
              id="icao"
              name="icao"
              value={formData.icao}
              onChange={handleChange}
              maxLength={4}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: PRVT"
            />
          </div>

          <div>
            <label
              htmlFor="countryCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              País
            </label>
            <select
              id="countryCode"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un país</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Guardar Aerolínea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AirlineModal;
