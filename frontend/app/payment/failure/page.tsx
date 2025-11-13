"use client";

import { useRouter } from "next/navigation";

export default function PaymentFailurePage() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Pago Rechazado
        </h1>
        <p className="text-gray-700 mb-6">
          Hubo un problema al procesar tu pago y fue rechazado. 
          Por favor, intenta con otro medio de pago.
        </p>
        <button
          onClick={() => router.push("/map")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
        >
          Volver al Mapa
        </button>
      </div>
    </div>
  );
}