import { getToken } from "./userService";
import { handleResponseError } from "@/utils/apiUtils";

const BASE_URL = "/api/countries";

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
  if (!response.ok) await handleResponseError(response, "Error al obtener los países");
  return response.json();
}
