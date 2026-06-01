export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

function buildUrl(path: string) {
  if (!API_BASE_URL) {
    throw new ApiError(
      "No hay URL de backend configurada",
      500,
      "Missing env NEXT_PUBLIC_API_URL or NEXT_PUBLIC_BACKEND_URL"
    );
  }

  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, body, ...rest } = options;
  const resolvedHeaders = new Headers(headers);

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData && body !== undefined) {
    resolvedHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    resolvedHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: resolvedHeaders,
    body: isFormData
      ? (body as FormData)
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
    cache: "no-store",
  });

  const text = await response.text();
  const parsed = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const backendMessage =
      parsed &&
        typeof parsed === "object" &&
        "message" in parsed &&
        typeof (parsed as { message?: unknown }).message === "string" &&
        (parsed as { message: string }).message;
    const message = backendMessage || `Error ${response.status} al llamar ${path}`;
    throw new ApiError(String(message), response.status, parsed ?? text);
  }

  return (parsed as T) ?? ({} as T);
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}
