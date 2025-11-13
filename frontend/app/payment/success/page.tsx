"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getMyProfile } from "@/services/userService";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    const checkPremium = async () => {
      try {
        const profile = await getMyProfile();
        if (profile?.role === "USER_PREMIUM") {
          if (typeof window !== "undefined") {
            localStorage.setItem("userRole", "USER_PREMIUM");
            window.location.href = "/map";
          }
          return;
        }
      } catch (_) {
        // ignore and retry
      }
      tries += 1;
      if (!cancelled && tries < 15) {
        setTimeout(checkPremium, 2000);
      } else if (!cancelled) {
        router.push("/map");
      }
    };

    checkPremium();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Pago Aprobado</h1>
        <p className="text-gray-700 mb-2">
          Gracias por tu compra. Tu pago fue procesado exitosamente.
        </p>
        <p className="text-gray-600 text-sm mb-6">
          Tu rol se actualizará a Premium en unos momentos.
          Esto puede tardar unos segundos.
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
