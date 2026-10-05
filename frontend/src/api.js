const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// POST /api/auth/login  { employee_id, password }  ->  { token, user }
export async function login(employeeId, password) {
  let res
  try {
    res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ employee_id: employeeId, password }),
    })
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Employee ID or password is incorrect.')
  }
  return data
}
