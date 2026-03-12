'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getDeadlineCountdown } from '@/lib/utils'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'ml4sci',    label: 'ML4SCI',    href: '/org/ml4sci' },
  { id: 'kubeflow',  label: 'Kubeflow',  href: '/org/kubeflow' },
  { id: 'airflow',   label: 'Airflow',   href: '/org/airflow' },
  { id: 'sprint',    label: 'Sprint',    href: '/sprint' },
  { id: 'mentors',   label: 'Mentors',   href: '/mentors' },
]

export default function Topbar() {
  const router   = useRouter()
  const pathname = usePathname()
  const [countdown, setCountdown] = useState(getDeadlineCountdown())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setCountdown(getDeadlineCountdown()), 60000)
    return () => clearInterval(t)
  }, [])

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when sidebar open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  function navigate(href: string) {
    router.push(href)
    setSidebarOpen(false)
  }

  function logout() {
    sessionStorage.removeItem('gsoc_authed')
    router.push('/')
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1) }
          50% { opacity:0.4; transform:scale(0.8) }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%) }
          to   { transform: translateX(0) }
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        .nav-btn-desktop:hover {
          color: var(--text) !important;
          background: var(--surface2) !important;
        }
        .sidebar-nav-btn:hover {
          background: var(--surface2) !important;
          color: var(--text) !important;
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,9,12,0.92)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 20px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: Hamburger (mobile) + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Hamburger — mobile only */}
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            style={{
              display: 'none', // overridden by media query
              alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36,
              background: 'var(--surface2)',
              border: '1px solid var(--border2)',
              borderRadius: 8,
              cursor: 'pointer',
              flexDirection: 'column',
              gap: 5,
              padding: 8,
            }}
          >
            <span style={{ width: 18, height: 1.5, background: 'var(--text2)', borderRadius: 2, display: 'block' }} />
            <span style={{ width: 18, height: 1.5, background: 'var(--text2)', borderRadius: 2, display: 'block' }} />
            <span style={{ width: 18, height: 1.5, background: 'var(--text2)', borderRadius: 2, display: 'block' }} />
          </button>

          <div style={{ fontFamily: 'DM Sans', fontSize: 15, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em' }}>
            GSoC 2026
          </div>
        </div>

        {/* Center: Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'flex', gap: 4 }}>
          {NAV.map(n => {
            const active = pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href))
            return (
              <button key={n.id}
                className="nav-btn-desktop"
                onClick={() => navigate(n.href)}
                style={{
                  padding: '6px 14px', borderRadius: 6,
                  fontSize: 12.5, fontWeight: 500,
                  color: active ? 'var(--accent)' : 'var(--text3)',
                  cursor: 'pointer', border: 'none',
                  background: active ? 'var(--accent-dim)' : 'none',
                  fontFamily: 'DM Sans', transition: 'all 0.15s',
                }}
              >
                {n.label}
              </button>
            )
          })}
        </div>

        {/* Right: Countdown + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: 11,
            color: 'var(--red)', background: 'var(--red-dim)',
            padding: '4px 10px', borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', animation: 'pulse 1.8s infinite' }} />
            {countdown}
          </div>
          <button onClick={logout} style={{
            background: 'none', border: '1px solid var(--border2)',
            borderRadius: 6, padding: '5px 12px',
            color: 'var(--text3)', fontSize: 12,
            cursor: 'pointer', fontFamily: 'DM Sans',
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 200,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* ── MOBILE SIDEBAR PANEL ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 280,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border2)',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        overflowY: 'auto',
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 15, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em' }}>
            🚀 GSoC 2026
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              width: 32, height: 32,
              background: 'var(--surface2)',
              border: '1px solid var(--border2)',
              borderRadius: 8,
              cursor: 'pointer',
              color: 'var(--text3)',
              fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Deadline badge */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: 11,
            color: 'var(--red)', background: 'var(--red-dim)',
            padding: '6px 12px', borderRadius: 20,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', animation: 'pulse 1.8s infinite' }} />
            Deadline: {countdown}
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ padding: '12px 12px', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', padding: '4px 8px', marginBottom: 6 }}>
            Navigation
          </div>
          {NAV.map(n => {
            const active = pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href))
            return (
              <button
                key={n.id}
                className="sidebar-nav-btn"
                onClick={() => navigate(n.href)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '11px 14px',
                  borderRadius: 8, border: 'none',
                  background: active ? 'var(--accent-dim)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text2)',
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans',
                  marginBottom: 2,
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'all 0.15s',
                  borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >
                {n.label}
              </button>
            )
          })}
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={logout}
            style={{
              width: '100%', padding: '10px',
              background: 'var(--surface2)',
              border: '1px solid var(--border2)',
              borderRadius: 8,
              color: 'var(--text3)', fontSize: 13,
              cursor: 'pointer', fontFamily: 'DM Sans',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}