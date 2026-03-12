'use client'
import { useEffect, useState } from 'react'
import Topbar from '@/components/Topbar'
import AuthGuard from '@/components/AuthGuard'
import Toast from '@/components/Toast'
import { DAY_LABELS } from '@/lib/constants'
import type { SprintTask } from '@/lib/types'
import { uid } from '@/lib/utils'

export default function SprintPage() {
  const [tasks, setTasks] = useState<SprintTask[]>([])
  const [toast, setToast] = useState('')
  const [addDay, setAddDay]   = useState<string | null>(null)
  const [newText, setNewText] = useState('')

  async function load() {
    const data = await fetch('/api/sprint').then(r => r.json())
    setTasks(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
  load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  async function toggle(id: string, done: boolean) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !done } : t))
    await fetch('/api/sprint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'toggle', id, done: !done }) })
  }

  async function del(id: string) {
    setTasks(ts => ts.filter(t => t.id !== id))
    await fetch('/api/sprint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) })
    setToast('Task removed.')
  }

  async function addTask(day: string) {
    if (!newText.trim()) return
    const task: SprintTask = { id: uid(), day, text: newText.trim(), done: false }
    setTasks(ts => [...ts, task])
    await fetch('/api/sprint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add', day, text: newText.trim() }) })
    setNewText(''); setAddDay(null); setToast('Task added!')
  }

  return (
    <AuthGuard>
      <Topbar />
      <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
          14-Day <span style={{ color: 'var(--accent)' }}>Sprint</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>Day 1 = March 11 · Goal: 5 PRs + 1 Proposal + Mentor contact</div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--amber)', borderRadius: '0 10px 10px 0', padding: '14px 16px', fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 24 }}>
          <strong style={{ color: 'var(--text)' }}>Target:</strong> 2–3 PRs in ML4SCI · 1–2 PRs in Kubeflow · 1 PR in Apache Airflow · Submit proposal by March 24 · <strong style={{ color: 'var(--text)' }}>Final deadline: March 31</strong>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {(['1-2','3-4','5-6','7','8','9-10','11','12','13-14'] as const).map((key) => {
  const info = DAY_LABELS[key]
            const dayTasks = tasks.filter(t => t.day === key)
            const done     = dayTasks.filter(t => t.done).length
            const total    = dayTasks.length
            const pct      = total ? Math.round(done / total * 100) : 0
            const badgeColor = pct === 100 ? 'var(--green)' : pct > 0 ? 'var(--amber)' : 'var(--text3)'

            return (
              <div key={key} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
                    {info.title}
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 400 }}>{info.sub}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: `${badgeColor}22`, color: badgeColor }}>
                      {pct === 100 ? '✓ Done' : `${done}/${total}`}
                    </span>
                    <button onClick={() => setAddDay(key)} style={{ width: 22, height: 22, borderRadius: 4, border: 'none', background: 'var(--accent-dim)', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </div>
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {dayTasks.map(t => (
                    <div key={t.id} onClick={() => toggle(t.id, t.done)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: t.done ? 'var(--text3)' : 'var(--text2)', cursor: 'pointer', lineHeight: 1.4, padding: '2px 0' }}>
                      <div style={{ width: 15, height: 15, border: `1.5px solid ${t.done ? 'var(--accent)' : 'var(--border2)'}`, borderRadius: 4, flexShrink: 0, marginTop: 1, background: t.done ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                        {t.done && <span style={{ fontSize: 9, color: 'var(--bg)', fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                      <button onClick={e => { e.stopPropagation(); del(t.id) }} style={{ width: 20, height: 20, borderRadius: 4, border: 'none', background: 'transparent', color: 'var(--text3)', cursor: 'pointer', fontSize: 11, flexShrink: 0, opacity: 0.5 }}>✕</button>
                    </div>
                  ))}
                  {addDay === key && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <input autoFocus value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask(key)} placeholder="New task…"
                        style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 6, padding: '7px 10px', fontSize: 12, color: 'var(--text)', fontFamily: 'DM Sans', outline: 'none' }} />
                      <button onClick={() => addTask(key)} style={{ padding: '7px 12px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'Fraunces, serif', fontWeight: 700 }}>Add</button>
                      <button onClick={() => setAddDay(null)} style={{ padding: '7px 10px', background: 'var(--surface3)', color: 'var(--text3)', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>✕</button>
                    </div>
                  )}
                  {total === 0 && addDay !== key && <div style={{ color: 'var(--text3)', fontSize: 12, fontStyle: 'italic' }}>No tasks yet.</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </AuthGuard>
  )
}