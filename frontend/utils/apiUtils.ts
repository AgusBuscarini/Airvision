/**
 * Procesa la respuesta de error del backend y lanza una excepción con un mensaje legible.
 * Soporta respuestas JSON (con campo 'message' o 'errors') y texto plano.
 */
export async function handleResponseError(response: Response, defaultMessage: string): Promise<never> {
  let errorText = "";
  try {
    errorText = await response.text();
  } catch (e) {
    throw new Error(defaultMessage);
  }

  if (!errorText) {
    throw new Error(defaultMessage);
  }

  try {
    const errorJson = JSON.parse(errorText);
    
    let finalMessage = errorJson.message || defaultMessage;

    if (errorJson.errors) {
      const details = Object.values(errorJson.errors).join(", ");
      finalMessage += `: ${details}`;
    }

    throw new Error(finalMessage);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(errorText || defaultMessage);
    }
    throw e;
  }
}