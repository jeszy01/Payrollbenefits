const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function post(path, body, fallback) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || fallback)
  return data
}

// Step 1: sends the OTP email
export const login = (employeeId, password) =>
  post('/auth/login', { employee_id: employeeId, password }, 'Employee ID or password is incorrect.')

// Step 2: returns { token, user }
export const verifyOtp = (employeeId, code) =>
  post('/auth/verify-otp', { employee_id: employeeId, code }, 'Invalid or expired code.')


async function authed(method, path, body) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
    throw new Error('Session expired. Please sign in again.')
  }
  if (!res.ok) {
    const first = data.errors && Object.values(data.errors)[0]?.[0]
    throw new Error(first || data.message || 'Something went wrong.')
  }
  return data
}

export const getEmployees = () => authed('GET', '/employees')
export const createEmployee = (body) => authed('POST', '/employees', body)