"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/authContext";
import { createPreference, PaymentRequest } from "@/services/paymentService";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckIcon = () => (
  <svg
    className="h-5 w-5 text-blue-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!user || !user.id || !user.email) {
      setError("No se pudo obtener la información del usuario. Por favor, inicie sesión de nuevo.");
      return;
    }

    setIsLoading(true);
    setError("");

    const paymentData: PaymentRequest = {
      title: "AirVision - Suscripción Premium",
      unitPrice: 100.00,
      quantity: 1,
      userId: user.id,
      payerEmail: user.email,
    };

    try {
      const response = await createPreference(paymentData);
      if (response.initPoint) {
        window.location.href = response.initPoint;
      } else {
        setError("No se pudo iniciar el proceso de pago.");
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[5000] flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-11/12 max-w-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Conviértete en Premium
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-light"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto pr-2 text-gray-700 space-y-3">
          <p className="text-center text-gray-600 mb-6">
            Desbloquea todo el potencial de AirVision y lleva tu control aéreo
            al siguiente nivel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-gray-300 rounded-lg p-6 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Plan Free
              </h3>
              <ul className="space-y-3 flex-grow">
                <li className="flex items-start">
                  <CheckIcon />
                  <span className="ml-2">
                    Acceso al radar de vuelos globales
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <span className="ml-2">Registro y autenticación</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-blue-500 rounded-lg p-6 flex flex-col bg-blue-50 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                RECOMENDADO
              </span>
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Plan Premium
              </h3>
              <ul className="space-y-3 flex-grow">
                <li className="flex items-start">
                  <CheckIcon />
                  <span className="ml-2">Todo lo incluido en Free</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <span className="ml-2">
                    <strong>CRUD de aerolíneas privadas</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <span className="ml-2">
                    <strong>Creación y simulación de vuelos privados</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <span className="ml-2">
                    Acceso a estadísticas avanzadas
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <span className="ml-2">Filtros avanzados en el mapa</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Procesando..." : "Pagar $2999.00 ARS con MercadoPago"}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        <div className="text-right pt-6 mt-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;