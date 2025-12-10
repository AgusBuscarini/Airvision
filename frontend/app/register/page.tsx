"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { registerUser, loginUser } from "@/services/userService"; // Importamos loginUser también
import { useAuth } from "@/context/authContext";
import TermsModal from "@/components/termsModal";
import FaqModal from "@/components/faqModal";

// ... (Los componentes de Íconos SVG se mantienen igual: UserIcon, MailIcon, LockIcon, etc.) ...
// --- ÍCONOS SVG (Cópialos del anterior si los necesitas, aquí pongo los esenciales) ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);
const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Intentamos registrar al usuario
      // Si falla, el servicio lanzará un error que captura el catch
      await registerUser({ name, email, password });

      // 2. Si el registro fue exitoso, hacemos LOGIN AUTOMÁTICO
      const loginResponse = await loginUser({ email, password });

      if (loginResponse.token && loginResponse.role) {
        login(loginResponse.token, loginResponse.role);
        
        // Alerta de éxito
        Swal.fire({
          icon: "success",
          title: "¡Cuenta creada!",
          text: "Bienvenido a AirVision. Iniciando sesión...",
          timer: 2000,
          showConfirmButton: false,
        });

        router.push("/map");
      } else {
        // Caso raro: registro ok, pero login falló al entregar token
        throw new Error("Registro exitoso, pero no se pudo iniciar sesión automáticamente.");
      }

    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Ups...",
        text: error.message || "Hubo un problema al crear tu cuenta.",
        confirmButtonColor: "#2563EB",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
          
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex flex-col items-center">
            <div className="mb-3 flex justify-center">
               <Image 
                  src="/logoT.png"
                  alt="AirVision Logo" 
                  width={120} 
                  height={120} 
                  className="object-contain opacity-90"
               />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Crear Cuenta</h1>
            <p className="text-sm text-gray-500 mt-1">Únete a la red de control aéreo</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crea una contraseña segura"
                  className="pl-10 pr-10 w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Creando cuenta...
                  </>
                ) : (
                  "Registrarse"
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                ¿Ya tenés cuenta?
                <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold ml-1 hover:underline transition-colors">
                  Inicia sesión
                </a>
              </p>
            </div>

          </form>

          <div className="bg-gray-50 border-t border-gray-100 p-4 text-center">
             <div className="flex justify-center space-x-4 text-xs text-gray-500 font-medium">
                <button
                  type="button"
                  onClick={() => setIsFaqOpen(true)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Preguntas Frecuentes
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(true)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Términos y Privacidad
                </button>
             </div>
          </div>
        </div>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </>
  );
}