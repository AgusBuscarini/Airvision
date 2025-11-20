"use client";

import React, { useState } from "react";

const AccordionItem: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left text-gray-800"
      >
        <span className="font-semibold">{title}</span>
        <span className="text-xl font-light text-blue-600">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 pr-4 text-gray-700 text-sm">{children}</div>
      )}
    </div>
  );
};

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[5000] flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-11/12 max-w-3xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Preguntas Frecuentes
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-light"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto pr-2">
          <AccordionItem title="¿Cómo creo mi clave?">
            <p>
              Tu clave (contraseña) se crea durante el proceso de registro.
              Simplemente ve a la página de registro, completa tu nombre, correo
              electrónico y la contraseña que desees.
            </p>
          </AccordionItem>

          <AccordionItem title="¿Cómo desbloqueo mi usuario?">
            <p>
              Actualmente, no contamos con un sistema de recuperación de
              contraseña automatizado. Si olvidaste tu contraseña o tu usuario
              está bloqueado, por favor contacta a soporte.
            </p>
          </AccordionItem>

          <AccordionItem title="¿Qué necesito para ver vuelos privados?">
            <p>
              La visualización y creación de vuelos privados y aerolíneas
              privadas es una función exclusiva para usuarios{" "}
              <strong>PREMIUM</strong>.
              Puedes obtener tu membresía Premium al instante haciendo clic en el botón{" "}
              <span className="text-green-600 font-bold">Hacerse Premium</span> en el mapa 
              y completando el pago seguro con Mercado Pago.
            </p>
          </AccordionItem>

          <AccordionItem title="¿Tienes dudas o quieres comunicarte con nosotros?">
            <p>
              Puedes enviarnos un correo a{" "}
              <a
                href="mailto:soporte@airvision.com"
                className="text-blue-600 hover:underline"
              >
                soporte@airvision.com
              </a>
              .
            </p>
          </AccordionItem>
        </div>

        <div className="text-right pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqModal;