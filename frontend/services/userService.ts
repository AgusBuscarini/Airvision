export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
}

const BASE_URL = "http://localhost:8080/auth";

export async function loginUser(credentials: LoginRequest): Promise<User> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }

  return response.json();
}
