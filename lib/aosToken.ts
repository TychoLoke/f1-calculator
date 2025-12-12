const EXPIRY_BUFFER_MS = 60_000;

let cachedToken: { token: string; expiresAt: number } | null = null;

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type?: string;
  scope?: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function resolveScope() {
  return (
    process.env.AOS_SCOPE ||
    process.env.ELEMENTS_SCOPE ||
    (() => {
      throw new Error('Missing required environment variable: AOS_SCOPE');
    })()
  );
}

async function requestToken(): Promise<TokenResponse> {
  const tokenUrl = requiredEnv('AOS_TOKEN_URL');
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: requiredEnv('AOS_CLIENT_ID'),
    client_secret: requiredEnv('AOS_CLIENT_SECRET'),
    scope: resolveScope(),
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Token request failed (${response.status} ${response.statusText}): ${message}`);
  }

  const payload = (await response.json()) as Partial<TokenResponse>;
  if (!payload.access_token || typeof payload.expires_in !== 'number') {
    throw new Error('Token response missing access_token or expires_in');
  }

  return {
    access_token: payload.access_token,
    expires_in: payload.expires_in,
    token_type: payload.token_type,
    scope: payload.scope,
  };
}

export async function getAosToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt - EXPIRY_BUFFER_MS > now) {
    return cachedToken.token;
  }

  const token = await requestToken();
  const expiresAt = now + Math.max(0, token.expires_in * 1000 - EXPIRY_BUFFER_MS);
  cachedToken = { token: token.access_token, expiresAt };
  return token.access_token;
}
