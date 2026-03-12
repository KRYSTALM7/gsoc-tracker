'use client'
import { useEffect, useState } from 'react'
import Topbar from '@/components/Topbar'
import AuthGuard from '@/components/AuthGuard'
import Toast from '@/components/Toast'
import { ORG_META } from '@/lib/constants'
import { fmtDate, uid } from '@/lib/utils'
import type { Mentor } from '@/lib/types'

const BLANK: Partial<Mentor> = { id: '', name: '', org: 'ml4sci', platform: 'slack', topic: '', notes: '', status: 'sent', date: new Date().toISOString().split('T')[0] }

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [form, setForm]       = useState<Partial<Mentor> | null>(null)
  const [toast, setToast]     = useState('')

  async function load() {
    const data = await fetch('/api/mentors').then(r => r.json())
    setMentors(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
  load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  function set(k: keyof Mentor, v: string) { setForm(f => f ? { ...f, [k]: v } : f) }

  async function save() {
    if (!form?.name) { alert('Name required.'); return }
    const m = { ...form, id: form.id || uid() }
    await fetch('/api/mentors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m) })
    load(); setForm(null); setToast(form.id ? 'Updated!' : 'Interaction logged!')
  }

  async function del(id: string) {
    if (!confirm('Remove this entry?')) return
    await fetch('/api/mentors', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load(); setToast('Removed.')
  }

  const STATUS_COLOR: Record<string, string> = { sent: 'var(--amber)', replied: 'var(--green)', followup: 'var(--red)' }
  const STATUS_LABEL: Record<string, string> = { sent: 'Awaiting Reply', replied: 'Replied', followup: 'Follow Up' }
  const PLATFORM_COLOR: Record<string, string> = { slack: 'var(--accent2)', github: 'var(--text3)', email: 'var(--blue)', discord: 'var(--blue)' }
  const ORG_COLOR = (org: string) => ORG_META[org]?.color || 'var(--text3)'

  const F: React.CSSProperties = { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 7, padding: '10px 13px', fontSize: 13, color: 'var(--text)', fontFamily: 'DM Sans', outline: 'none' }

  return (
    <AuthGuard>
      <Topbar />
      <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
              Mentor <span style={{ color: 'var(--accent2)' }}>Log</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>Track every interaction · Templates ready to copy</div>
          </div>
          <button onClick={() => setForm({ ...BLANK, id: '' })} style={{ padding: '6px 14px', background: 'var(--accent2-dim)', border: '1px solid rgba(255,107,157,0.3)', borderRadius: 6, color: 'var(--accent2)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>
            + Log Interaction
          </button>
        </div>

        {/* Mentor Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {mentors.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 13 }}>No mentor interactions logged yet.</div>
            : mentors.map(m => (
              <div key={m.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${ORG_COLOR(m.org)}1a`, color: ORG_COLOR(m.org), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
                  {(m.name || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 8 }}>{m.notes || m.topic || '—'}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: `${ORG_COLOR(m.org)}1a`, color: ORG_COLOR(m.org) }}>{ORG_META[m.org]?.name}</span>
                    <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: `${PLATFORM_COLOR[m.platform]}22`, color: PLATFORM_COLOR[m.platform] }}>{m.platform}</span>
                    <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: `${STATUS_COLOR[m.status]}22`, color: STATUS_COLOR[m.status] }}>{STATUS_LABEL[m.status]}</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--text3)' }}>{fmtDate(m.date)}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                      <button onClick={() => setForm(m)} style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: 'var(--surface3)', color: 'var(--text3)', cursor: 'pointer', fontSize: 11 }}>✏️</button>
                      <button onClick={() => del(m.id)}   style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: 'var(--surface3)', color: 'var(--text3)', cursor: 'pointer', fontSize: 11 }}>🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {/* Templates */}
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>📋 Message Templates</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          {[
            { label: '🗣️ Introduction', text: `Hello, I'm interested in contributing to the [Project] project.\nI have experience with ML pipelines, LSTM, and gradient boosting.\n\nI'd like to start by improving data preprocessing / evaluation pipelines.\nCould you point me to open issues that would be a good starting point?` },
            { label: '📋 Proposal Review', text: `I've prepared a draft proposal for [Project].\nI've also made a few contributions to the repository.\n\nWould you be open to reviewing it and suggesting improvements?\nI'd really value your feedback on the technical design.` },
          ].map((tpl, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 8 }}>{tpl.label}</div>
              <pre style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, lineHeight: 1.9, color: 'var(--text2)', whiteSpace: 'pre-wrap' }}>{tpl.text}</pre>
              <button onClick={() => navigator.clipboard.writeText(tpl.text).then(() => setToast('Copied!'))}
                style={{ marginTop: 10, background: 'var(--accent-dim)', border: 'none', borderRadius: 5, padding: '5px 12px', color: 'var(--accent)', fontSize: 11, cursor: 'pointer' }}>
                📋 Copy
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor Modal */}
      {form && (
        <div onClick={e => e.target === e.currentTarget && setForm(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 14, padding: 32, width: 500, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>👔 {form.id ? 'Edit' : 'Log'} Interaction</div>
            <button onClick={() => setForm(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16 }}>✕</button>

            {[
              { label: 'Mentor Name / Handle', key: 'name',     type: 'input',    placeholder: '@mentor_handle' },
              { label: 'Topic / Summary',      key: 'topic',    type: 'input',    placeholder: 'What did you discuss?' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6, marginTop: 14 }}>{f.label}</label>
                <input value={(form as any)[f.key] || ''} onChange={e => set(f.key as keyof Mentor, e.target.value)} placeholder={f.placeholder} style={F} />
              </div>
            ))}

            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6, marginTop: 14 }}>Notes</label>
            <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Key takeaways…" style={{ ...F, resize: 'vertical', minHeight: 80 }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { label: 'Org',      key: 'org',      opts: ['ml4sci','kubeflow','airflow'] },
                { label: 'Platform', key: 'platform', opts: ['slack','github','email','discord'] },
                { label: 'Status',   key: 'status',   opts: ['sent','replied','followup'] },
              ].map(s => (
                <div key={s.key}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6, marginTop: 14 }}>{s.label}</label>
                  <select value={(form as any)[s.key] || ''} onChange={e => set(s.key as keyof Mentor, e.target.value)} style={F}>
                    {s.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6, marginTop: 14 }}>Date</label>
            <input type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} style={F} />

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button onClick={() => setForm(null)} style={{ background: 'var(--surface3)', color: 'var(--text2)', border: 'none', borderRadius: 7, padding: '9px 22px', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans' }}>Cancel</button>
              <button onClick={save} style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 7, padding: '9px 22px', fontFamily: 'Fraunces, serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </AuthGuard>
  )
}