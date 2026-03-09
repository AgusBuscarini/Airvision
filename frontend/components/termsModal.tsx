"use client";

import React from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
            Términos y Condiciones
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-light"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto pr-2 text-gray-700 space-y-3 text-sm">
          <p>
            Bienvenido a <strong>AirVision</strong>. 
            Nos complace ofrecerle acceso al Servicio, sujeto a estos
            términos y condiciones y a la Política
            de Privacidad correspondiente de AirVision.
          </p>
          <p>
            Al acceder y utilizar el Servicio, usted expresa su consentimiento,
            acuerdo y entendimiento de los Términos de Servicio y la Política de
            Privacidad. Si no está de acuerdo con los Términos de Servicio o la
            Política de Privacidad, no utilice el Servicio.
          </p>

          <h2 className="text-lg font-semibold pt-2 text-gray-800">
            Descripción del Servicio
          </h2>
          <p>
            AirVision es un servicio de visualización de vuelos en tiempo real.
            Las operaciones habilitadas son aquellas que estarán disponibles
            para los clientes, quienes deberán cumplir los requisitos que se
            encuentren vigentes en su momento para operar el Servicio.
          </p>
          <p>
            Para operar el Servicio se requerirá siempre que se trate de
            clientes de AirVision, quienes podrán acceder mediante cualquier
            dispositivo con conexión a la Red Internet. El cliente deberá
            proporcionar una dirección de correo electrónico y la clave personal
            durante el registro.
          </p>
          <p>
            La clave personal tiene el carácter de secreto e intransferible, y
            por lo tanto usted asume las consecuencias de su divulgación a
            terceros, liberando a AirVision de toda responsabilidad que de ello
            se derive.
          </p>

          <h2 className="text-lg font-semibold pt-2 text-gray-800">
            Costo del Servicio
          </h2>
          <p>
            AirVision ofrece diferentes niveles de servicio, incluyendo
            "USER_FREE" y "USER_PREMIUM". La Compañía podrá cobrar comisiones
            por el uso de ciertos servicios (como las funciones Premium). En
            caso de cualquier modificación a la presente previsión, lo
            comunicará con al menos 60 días de antelación.
          </p>

          <h2 className="text-lg font-semibold pt-2 text-gray-800">Vigencia</h2>
          <p>
            El Usuario podrá dejar sin efecto la relación que surja de la
            presente, en forma inmediata, sin otra responsabilidad que la
            derivada de los gastos originados hasta ese momento.
          </p>

          <h2 className="text-lg font-semibold pt-2 text-gray-800">
            Propiedad intelectual
          </h2>
          <p>
            El software de AirVision está protegido por las leyes de propiedad
            intelectual y derechos de autor.
            El software en Argentina está protegido por la ley 11.723, 
            que regula la propiedad intelectual y los derechos de autor 
            de todos aquellos creadores de obras artísticas, literarias y científicas.
          </p>

          <h2 className="text-lg font-semibold pt-2 text-gray-800">
            Privacidad de la información
          </h2>
          <p>
            Para utilizar los Servicios ofrecidos por AirVision, los Usuarios
            deberán facilitar determinados datos de carácter personal. Su
            información personal se procesa y almacena en servidores que
            mantienen altos estándares de seguridad y protección.
          </p>
        </div>

        <div className="text-right pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;