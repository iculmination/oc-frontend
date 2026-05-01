import { env } from "@/lib/config/env";

type ApiRequestOptions = RequestInit & {
  skipAuthRetry?: boolean;
};

function buildUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${env.NEXT_PUBLIC_API_URL}${normalized}`;
}

async function parseError(response: Response): Promise<Error> {
  let detail = `Request failed: ${response.status}`;
  try {
    const body = (await response.json()) as { detail?: string };
    if (body.detail) detail = body.detail;
  } catch {
    // ignore body parsing errors
  }
  return new Error(detail);
}

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { skipAuthRetry = false, headers, ...init } = options;

  const response = await fetch(buildUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
  });

  if (
    response.status === 401 &&
    !skipAuthRetry &&
    path !== "/auth/refresh" &&
    path !== "auth/refresh"
  ) {
    const refreshResponse = await fetch(buildUrl("/auth/refresh"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (refreshResponse.ok) {
      return apiFetch<T>(path, { ...options, skipAuthRetry: true });
    }
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
