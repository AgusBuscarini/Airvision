import { getToken } from "./userService";
import { handleResponseError } from "@/utils/apiUtils";

export interface PaymentRequest {
  title: string;
  unitPrice: number;
  quantity: number;
  userId: string;
  payerEmail: string;
}

export interface PaymentResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

const BASE_URL = "/api/payments";

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

export async function createPreference(
  request: PaymentRequest
): Promise<PaymentResponse> {
  const response = await fetch(`${BASE_URL}/create-preference`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    await handleResponseError(response, "Error al crear la preferencia de pago");
  }

  return response.json();
}