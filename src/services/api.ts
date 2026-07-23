const API_PREFIX = "/api/v1";

async function request(
  backendUrl: string,
  endpoint: string,
  token?: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${backendUrl}${API_PREFIX}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function login(
  backendUrl: string,
  email: string,
  password: string
): Promise<{ token?: string; message?: string }> {
  return request(backendUrl, "/auth/login", undefined, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getUsers(
  backendUrl: string,
  token: string,
  offset = 0,
  limit = 50
): Promise<{ users: any[]; total: number }> {
  return request(backendUrl, `/admin/users?offset=${offset}&limit=${limit}`, token);
}

export async function banUser(
  backendUrl: string,
  token: string,
  userId: number,
  reason: string
): Promise<void> {
  return request(backendUrl, "/admin/users/ban", token, {
    method: "POST",
    body: JSON.stringify({ user_id: userId, reason }),
  });
}

export async function unbanUser(
  backendUrl: string,
  token: string,
  userId: number
): Promise<void> {
  return request(backendUrl, "/admin/users/unban", token, {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });
}

export async function deleteUser(
  backendUrl: string,
  token: string,
  userId: number
): Promise<void> {
  return request(backendUrl, "/admin/users/delete", token, {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });
}

export async function promoteUser(
  backendUrl: string,
  token: string,
  userId: number,
  role: string
): Promise<void> {
  return request(backendUrl, "/admin/users/promote", token, {
    method: "POST",
    body: JSON.stringify({ user_id: userId, role }),
  });
}

export async function getStats(
  backendUrl: string,
  token: string
): Promise<{
  total_users: number;
  active_users: number;
  banned_users: number;
  admin_users: number;
}> {
  return request(backendUrl, "/admin/stats", token);
}