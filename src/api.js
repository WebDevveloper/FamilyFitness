import { getAccessToken } from './component/profile/tokenStorage';
import { Navigate } from 'react-router-dom';

function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Предполагаем, что роль пользователя хранится в localStorage как 'userRole'
function isAdmin() {
  return localStorage.getItem('userRole') === 'admin';
}

export default function AdminRoute({ children }) {
  return isAdmin()
    ? children
    : <Navigate to="/" replace />;
}

// GET JSON
export async function getJSON(path) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  return res.json();
}

// POST JSON
export async function postJSON(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Ошибка ${res.status}`);
  }
  return res.json();
}

// PUT JSON
export async function putJSON(path, body) {
  const res = await fetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Ошибка ${res.status}`);
  }
  return res.json();
}

// DELETE
export async function deleteJSON(path) {
  const res = await fetch(path, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Ошибка ${res.status}`);
  }
  return res.json();
}