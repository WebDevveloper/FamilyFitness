import { getAccessToken } from './component/profile/tokenStorage';

const API_BASE = 'http://localhost:5000';

function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getJSON(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  });
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  return res.json();
}

export async function postJSON(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Ошибка ${res.status}`);
  }
  return res.json();
}