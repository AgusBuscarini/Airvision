export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: string | null;
  token: string | null;
}

export enum Role {
  ADMIN = "ADMIN",
  USER_FREE = "USER_FREE",
  USER_PREMIUM = "USER_PREMIUM",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface UpdateUserRoleRequest {
  role: Role;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

const BASE_URL = "/api/auth";
const BASE_ADMIN_URL = "/api/admin"
const PROFILE_BASE_URL = "/api/profile";

const TOKEN_KEY = "authToken";
const ROLE_KEY = "userRole";

const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

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

export function getRole (): string | null {
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

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_ADMIN_URL}/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      removeToken();
      window.location.href = "/login";
    }
    throw new Error("Error al obtener los usuarios (solo Admin)");
  }
  return response.json();
}

export async function updateUserRole(
  userId: string,
  request: UpdateUserRoleRequest
): Promise<User> {
  const response = await fetch(`${BASE_ADMIN_URL}/users/${userId}/role`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
     if (response.status === 401 || response.status === 403) {
      removeToken();
      window.location.href = "/login";
    }
    const errorText = await response.text();
    throw new Error(errorText || "Error al actualizar el rol del usuario");
  }
  return response.json();
}

export async function getMyProfile(): Promise<User> {
  const response = await fetch(`${PROFILE_BASE_URL}/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      removeToken();
      window.location.href = "/login";
    }
    throw new Error("Error al obtener los datos del usuario");
  }
  return response.json();
}