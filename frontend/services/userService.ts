export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: string | null;
  token: string | null;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  role?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

const BASE_URL = "http://localhost:8080/api/auth";
const TOKEN_KEY = "authToken";
const ROLE_KEY = "userRole";

export function saveToken (token: string, role: string): void {
  if(typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  }
}

export function getToken (): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function getRole (): string | null { // <-- AÑADIR ESTA FUNCIÓN
  if (typeof window !== "undefined") {
    return localStorage.getItem(ROLE_KEY);
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);    
    localStorage.removeItem(ROLE_KEY);
  }
}



export function isAuthenticated (): boolean {
  return getToken() !== null;
}

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data: LoginResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Credenciales inválidas");
  }

  if (data.token && data.role) {
    saveToken(data.token, data.role);
  } else {
    console.warn("Login exitoso pero no se recibio token")
  }

  return data;
}

export async function registerUser(
  credentials: RegisterRequest
): Promise<RegisterResponse> {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data: RegisterResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al registrar usuario");
  }

  return data;
}