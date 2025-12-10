// JWT utility functions

export interface JwtPayload {
  iat: number;  // Issued at
  exp: number;  // Expiration
  sub: string;  // Subject (username)
  iss?: string; // Issuer
  authorities?: string;
}

/**
 * Decode a JWT token without verification (client-side only)
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Get seconds until token expires
 */
export function getSecondsUntilExpiry(token: string): number {
  const payload = decodeJwt(token);
  if (!payload?.exp) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  return getSecondsUntilExpiry(token) <= 0;
}
