"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/userService";
import { useAuth } from "@/context/authContext";
import TermsModal from "@/components/termsModal";
import FaqModal from "@/components/faqModal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser({ email, password });
      if (response.token && response.role) {
        login(response.token, response.role);
        router.push("/map");
      } else {
        setError(response.message || "Error inesperado: no se recibio token");
      }
    } catch (error: any) {
      setError(error.message || "Error desconocido al iniciar sesion");
    }
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-8 w-96 space-y-5 border border-gray-200"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Iniciar sesión
          </h1>

          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: usuario@correo.com"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors duration-200"
          >
            Ingresar
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿No tenés cuenta?
            <a href="/register" className="text-blue-600 hover:underline ml-1">
              Registrate
            </a>
          </p>

          <div className="text-center text-xs text-gray-500 border-t pt-4 mt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsFaqOpen(true)}
              className="text-blue-600 hover:underline"
            >
              Preguntas Frecuentes
            </button>
            <span className="text-gray-400">|</span>
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="text-blue-600 hover:underline"
            >
              Términos de Servicio
            </button>
          </div>
        </form>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </>
  );
}
