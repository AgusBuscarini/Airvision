"use client";

import { useRouter } from "next/navigation";

export default function PaymentPendingPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">
          Pago Pendiente
        </h1>
        <p className="text-gray-700 mb-6">
          Tu pago está pendiente de confirmación. 
          Recibirás una notificación cuando se apruebe.
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