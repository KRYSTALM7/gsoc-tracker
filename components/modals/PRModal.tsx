'use client'
import { useState } from 'react'
import type { PR } from '@/lib/types'
import { uid } from '@/lib/utils'

const ORGS: { key: string; label: string }[] = [
  { key: 'ml4sci',          label: 'ML4SCI'          },
  { key: 'numfocus_pymc',   label: 'NumFOCUS (PyMC)' },
  { key: 'apache_fineract', label: 'Apache Fineract'  },
]
const TYPES  = ['docs', 'bug', 'feature', 'test', 'refactor']
const STATUSES = ['planned', 'open', 'review', 'merged', 'closed']

export default function PRModal({ pr, onClose, onSave, defaultOrg }: { pr?: PR; onClose: () => void; onSave: () => void; defaultOrg?: string }) {
  const [form, setForm] = useState<Partial<PR>>({
    id:          pr?.id || uid(),
    org:         pr?.org || defaultOrg || 'ml4sci',
    repo:        pr?.repo || '',
    description: pr?.description || '',
    link:        pr?.link || '',
    issue:       pr?.issue || '',
    type:        pr?.type || 'docs',
    status:      pr?.status || 'open',
    date:        pr?.date || new Date().toISOString().split('T')[0],
  })
  const [saving, setSaving] = useState(false)

  function set(k: keyof PR, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    if (!form.repo || !form.description) { alert('Repo and description required.'); return }
    setSaving(true)
    await fetch('/api/prs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    onSave()
  }

  const F = fieldStyle

  return (
    <Overlay onClose={onClose}>
      <div style={modalStyle}>
        <div style={titleStyle}>🔀 {pr ? 'Edit' : 'Add'} Pull Request</div>
        <button onClick={onClose} style={closeStyle}>✕</button>

        <Label>Organization</Label>
        <select value={form.org} onChange={e => set('org', e.target.value)} style={F}>
          {ORGS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>

        <Label>Repository</Label>
        <input value={form.repo} onChange={e => set('repo', e.target.value)} placeholder="e.g. ML4DQM" style={F} />

        <Label>Description</Label>
        <input value={form.description} onChange={e => set('description', e.target.value)} placeholder="What does this PR do?" style={F} />

        <Label>PR Link</Label>
        <input value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://github.com/..." style={F} />

        <Label>Issue Link (optional)</Label>
        <input value={form.issue} onChange={e => set('issue', e.target.value)} placeholder="https://github.com/.../issues/..." style={F} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <Label>Type</Label>
            <select value={form.type} onChange={e => set('type', e.target.value)} style={F}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select value={form.status} onChange={e => set('status', e.target.value)} style={F}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <Label>Date</Label>
        <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={F} />

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={onClose} style={cancelBtn}>Cancel</button>
          <button onClick={save} disabled={saving} style={saveBtn}>{saving ? 'Saving…' : 'Save PR'}</button>
        </div>
      </div>
    </Overlay>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6, marginTop: 14 }}>{children}</label>
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  )
}

const fieldStyle: React.CSSProperties = { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 7, padding: '10px 13px', fontSize: 13, color: 'var(--text)', fontFamily: 'DM Sans', outline: 'none' }
const modalStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 14, padding: 32, width: 500, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }
const titleStyle: React.CSSProperties = { fontFamily: 'DM Sans', fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }
const closeStyle: React.CSSProperties = { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16 }
const saveBtn:   React.CSSProperties = { background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 7, padding: '9px 22px', fontFamily: 'Fraunces, serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }
const cancelBtn: React.CSSProperties = { background: 'var(--surface3)', color: 'var(--text2)', border: 'none', borderRadius: 7, padding: '9px 22px', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans' }