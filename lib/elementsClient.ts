import { getAosToken } from './aosToken';

type ElementsRequestInit = Omit<RequestInit, 'headers' | 'body'> & {
  headers?: Record<string, string>;
};

type ErrorBody = { error?: string; message?: string } | string | unknown;

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildUrl(path: string) {
  const base = requiredEnv('AOS_ELEMENTS_BASE_URL').replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

async function parseErrorBody(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return `${response.status} ${response.statusText}`;

  try {
    const parsed = JSON.parse(text) as ErrorBody;
    if (typeof parsed === 'string') return parsed;
    if (parsed && typeof parsed === 'object') {
      if ('message' in parsed && typeof parsed.message === 'string') return parsed.message;
      if ('error' in parsed && typeof parsed.error === 'string') return parsed.error;
    }
  } catch (error) {
    return text;
  }

  return text;
}

export async function elementsFetch<TRequest, TResponse>(
  path: string,
  body?: TRequest,
  init?: ElementsRequestInit,
): Promise<TResponse> {
  const token = await getAosToken();
  const url = buildUrl(path);
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(init?.headers ?? {}),
  };

  const response = await fetch(url, {
    method: init?.method ?? 'POST',
    headers,
    body: init?.body ?? (body !== undefined ? JSON.stringify(body) : undefined),
    cache: 'no-store',
    ...init,
  });

  if (!response.ok) {
    const message = await parseErrorBody(response);
    throw new Error(`Elements API request failed (${response.status}): ${message}`);
  }

  if (response.status === 204) {
    return {} as TResponse;
  }

  return (await response.json()) as TResponse;
}
