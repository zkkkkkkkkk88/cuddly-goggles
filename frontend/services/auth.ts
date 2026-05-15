const TOKEN_KEY = "resume_ai_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export interface AuthResult {
  id: number;
  email: string;
  token: string;
}

export async function register(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "注册失败");
  }
  const data = await res.json();
  setToken(data.token);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "登录失败");
  }
  const data = await res.json();
  setToken(data.token);
  return data;
}

export function logout(): void {
  clearToken();
}
