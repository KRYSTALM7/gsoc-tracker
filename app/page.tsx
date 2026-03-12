'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const USERNAME = 'CR1TIC4L'
const PASSWORD_HASH = '5319750aa1cdb70c9fd7e23dd809399ad6a4d28ed69c1013d857a4b1ca6dd419'

async function hashPassword(pw: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const hash = await hashPassword(pass)
    if (user !== USERNAME || hash !== PASSWORD_HASH) {
      setError('Incorrect username or password.')
      setLoading(false)
      return
    }
    sessionStorage.setItem('gsoc_authed', '1')
    router.push('/dashboard')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle, rgba(100,255,218,0.06) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 16, padding: '44px 48px', width: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚀</div>
          <span style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)' }}>GSoC 2026 Tracker</span>
        </div>

        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 600, color: 'var(--text)', marginBottom: 6, lineHeight: 1.2 }}>
          Welcome back,<br />CR1TIC4L
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 32 }}>Enter your credentials to access the sprint dashboard.</div>

        {/* Username */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6 }}>Username</label>
          <input
            value={user} onChange={e => setUser(e.target.value)}
            placeholder="username"
            style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'var(--text)', fontFamily: 'DM Mono, monospace', outline: 'none' }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6 }}>Password</label>
          <input
            type="password" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="password"
            style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'var(--text)', fontFamily: 'DM Mono, monospace', outline: 'none' }}
          />
        </div>

        <button
          onClick={handleLogin} disabled={loading}
          style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 8, padding: 12, fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Checking…' : 'Access Dashboard'}
        </button>

        {error && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 10, textAlign: 'center' }}>{error}</div>}
      </div>
    </div>
  )
}