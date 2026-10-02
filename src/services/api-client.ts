// Always use relative URLs to go through frontend proxy (which forwards cookies)
// Do NOT use NEXT_PUBLIC_API_URL here - that's for server-side API routes only
const API_URL = '';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================
// CSRF Token Management
// ============================================

let csrfToken: string | null = null;
let csrfFetchPromise: Promise<string | null> | null = null;

/**
 * Fetch CSRF token from server
 */
async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/csrf-token`, {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      return data.csrfToken;
    }
  } catch {
    console.warn('Failed to fetch CSRF token');
  }
  return null;
}

/**
 * Get CSRF token, fetching if necessary
 */
async function getCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken;

  // Prevent concurrent fetches
  if (csrfFetchPromise) return csrfFetchPromise;

  csrfFetchPromise = fetchCsrfToken().then((token) => {
    csrfToken = token;
    csrfFetchPromise = null;
    return token;
  });

  return csrfFetchPromise;
}

/**
 * Clear CSRF token (call on logout)
 */
export function clearCsrfToken(): void {
  csrfToken = null;
}

// ============================================
// Token Refresh Management
// ============================================

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token
 */
async function refreshToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ============================================
// API Client
// ============================================

/**
 * API client with automatic token refresh, retry, and CSRF protection
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  _retried = false
): Promise<T> {
  const method = options.method?.toUpperCase() || 'GET';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add CSRF token for mutating requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = await getCsrfToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  // Handle 401 - try to refresh token and retry once
  if (res.status === 401 && !_retried) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return apiClient<T>(endpoint, options, true);
    }
  }

  // Handle 403 with invalid CSRF - refresh token and retry
  if (res.status === 403 && !_retried) {
    const data = await res.clone().json().catch(() => ({}));
    if (data.error?.code === 'INVALID_CSRF') {
      csrfToken = null; // Clear cached token
      return apiClient<T>(endpoint, options, true);
    }
  }

  // For non-JSON responses
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    if (!res.ok) {
      throw new ApiError('NETWORK_ERROR', 'Network error occurred', res.status);
    }
    return {} as T;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.error?.code || 'UNKNOWN_ERROR',
      data.error?.message || 'Something went wrong',
      res.status
    );
  }

  return data;
}
