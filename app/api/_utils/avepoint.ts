const TOKEN_ENDPOINT = 'https://identity.avepointonlineservices.com/connect/token';

let cachedToken: { token: string; expiresAt: number } | null = null;

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function requestToken() {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: requiredEnv('AOS_CLIENT_ID'),
    client_secret: requiredEnv('AOS_CLIENT_SECRET'),
    scope: requiredEnv('ELEMENTS_SCOPE'),
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Token request failed (${response.status}): ${message}`);
  }

  const payload = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!payload.access_token || !payload.expires_in) {
    throw new Error('Token response missing access_token or expires_in');
  }

  const expiresAt = Date.now() + (payload.expires_in - 60) * 1000;
  cachedToken = { token: payload.access_token, expiresAt };
  return payload.access_token;
}

export async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  return requestToken();
}

export async function callElementsApi<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = requiredEnv('ELEMENTS_GRAPH_BASE_URL').replace(/\/$/, '');
  const token = await getAccessToken();

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Elements API ${path} failed (${response.status}): ${message}`);
  }

  return response.json() as Promise<T>;
}

export function normalizeItems<T>(payload: unknown) {
  const candidate = payload as { items?: T[]; data?: T[] } | T[];
  if (Array.isArray(candidate)) {
    return candidate;
  }
  if (Array.isArray(candidate.items)) {
    return candidate.items;
  }
  if (Array.isArray(candidate.data)) {
    return candidate.data;
  }
  return [] as T[];
}
