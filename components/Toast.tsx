'use client'
import { useEffect } from 'react'

export default function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: 'var(--surface)',
      border: '1px solid var(--accent)',
      borderRadius: 8, padding: '12px 18px',
      fontSize: 13, color: 'var(--text)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      ✅ {msg}
    </div>
  )
}