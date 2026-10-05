import { useState } from 'react'
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react'
import { login } from '../api.js'
import './Login.css'

export default function Login({ onSignedIn }) {
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      onSignedIn(await login(employeeId.trim(), password))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <aside className="login__brand">
        <div className="brand">
          <span className="brand__logo"><img src="/logo.png" alt="Archon Nell Incorporated logo" /></span>
          <span>
            <strong className="brand__name">Archon Nell Incorporated</strong>
            <span className="brand__sub">Payroll &amp; Benefits Management</span>
          </span>
        </div>

        <div className="pitch">
          <h1>Manage payroll and benefits, all in one place.</h1>
          <p>
            Compute payroll, track claims and reimbursements, administer HMO benefits,
            and keep employee records — for your whole team, in a single system.
          </p>
        </div>

        <small className="login__copy">© 2026 Archon Nell Incorporated. All rights reserved.</small>
      </aside>

      <main className="login__panel">
        <form className="form" onSubmit={submit} noValidate>
          <h2>Welcome back</h2>
          <p className="form__lead">Sign in to your account to continue</p>

          <label htmlFor="employeeId">Employee ID <span className="req">*</span></label>
          <input
            id="employeeId"
            autoFocus
            autoComplete="username"
            placeholder="Enter your employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />

          <label htmlFor="password">Password <span className="req">*</span></label>
          <div className="field">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="field__eye"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="form__error" role="alert">{error}</p>}

          <button className="submit" disabled={loading || !employeeId || !password}>
            {loading ? <Loader2 size={16} className="spin" /> : <Lock size={16} />}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="form__note">
            No account yet? Ask your administrator to create one via the backend.
          </p>
        </form>
      </main>
    </div>
  )
}
