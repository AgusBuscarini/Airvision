import { getToken } from "./userService";

const BASE_URL = "http://localhost:8080/api/countries";

const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function getCountries() {
  const response = await fetch(`${BASE_URL}`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error("Error al obtener los países");
  return response.json();
}
