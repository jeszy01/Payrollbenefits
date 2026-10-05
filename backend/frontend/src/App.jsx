import { useState } from 'react'
import Login from './pages/Login.jsx'

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('anl_user')) } catch { return null }
  })

  const handleSignedIn = ({ token, user }) => {
    localStorage.setItem('anl_token', token)
    localStorage.setItem('anl_user', JSON.stringify(user))
    setUser(user)
  }

  const signOut = () => {
    localStorage.removeItem('anl_token')
    localStorage.removeItem('anl_user')
    setUser(null)
  }

  if (!user) return <Login onSignedIn={handleSignedIn} />

  // Placeholder until the dashboard is built (next step)
  return (
    <div style={{ padding: 48 }}>
      <h1>Signed in{user.name ? ` as ${user.name}` : ''}</h1>
      <p>Dashboard coming in the next step.</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}
