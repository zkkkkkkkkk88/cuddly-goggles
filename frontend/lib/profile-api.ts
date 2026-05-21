import { getToken } from "@/services/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export async function fetchProfile(): Promise<Record<string, any>> {
  const token = getToken();
  if (!token) return {};
  const res = await fetch(`${API}/api/profile`, {
    headers: { Authorization: token },
  });
  if (!res.ok) return {};
  const body = await res.json();
  return body.data || {};
}

export async function saveProfile(data: Record<string, any>): Promise<void> {
  const token = getToken();
  if (!token) return;
  await fetch(`${API}/api/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ data }),
  });
}
