'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Topbar from '@/components/Topbar'
import AuthGuard from '@/components/AuthGuard'
import PRModal from '@/components/modals/PRModal'
import Toast from '@/components/Toast'
import { ORG_META, ORG_LINKS } from '@/lib/constants'
import { fmtDate } from '@/lib/utils'
import type { PR } from '@/lib/types'

export default function OrgPage() {
  const { slug } = useParams() as { slug: string }
  const meta = ORG_META[slug]
  const [prs, setPrs]           = useState<PR[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]   = useState<PR | null>(null)
  const [toast, setToast]       = useState('')

  async function load() {
    const data = await fetch('/api/prs').then(r => r.json())
    setPrs((Array.isArray(data) ? data : []).filter((p: PR) => p.org === slug))
  }

  useEffect(() => { load() }, [slug])

  async function del(id: string) {
    if (!confirm('Delete this PR?')) return
    await fetch('/api/prs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load(); setToast('PR deleted.')
  }

  if (!meta) return <div style={{ padding: 32, color: 'var(--text3)' }}>Unknown org</div>

  const merged = prs.filter(p => p.status === 'merged').length
  const STATUS_COLOR: Record<string, string> = { planned: 'var(--text3)', open: 'var(--blue)', review: 'var(--amber)', merged: 'var(--green)', closed: 'var(--red)' }
  const TYPE_COLOR:   Record<string, string> = { docs: 'var(--blue)', bug: 'var(--amber)', feature: 'var(--accent)', test: 'var(--green)', refactor: 'var(--text3)' }

  return (
    <AuthGuard>
      <Topbar />
      <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 600, color: meta.color, marginBottom: 6 }}>{meta.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>Target: {meta.target} merged PR{meta.target > 1 ? 's' : ''}</div>
          </div>
          <button onClick={() => setShowModal(true)} style={{ padding: '6px 14px', background: 'var(--accent-dim)', border: `1px solid ${meta.color}44`, borderRadius: 6, color: meta.color, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>
            + Add PR
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Merged PRs', val: `${merged} / ${meta.target}` },
            { label: 'Total PRs',  val: prs.length },
            { label: 'In Review',  val: prs.filter(p=>p.status==='review').length },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderBottom: `2px solid ${meta.color}`, borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>{s.label}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 600, color: 'var(--text)' }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* PR Table */}
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>🔀 Pull Requests</div>
            {prs.length === 0
              ? <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 32, textAlign: 'center', color: 'var(--text3)', fontSize: 12, fontStyle: 'italic' }}>No PRs yet.</div>
              : (
                <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                        {['Date','Repo','Type','Description','Status',''].map((h, i) => (
                          <th key={i} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text3)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {prs.map(pr => (
                        <tr key={pr.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 12px', fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--text3)' }}>{fmtDate(pr.date)}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--text)', fontWeight: 500 }}>{pr.repo}</td>
                          <td style={{ padding: '10px 12px' }}><span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${TYPE_COLOR[pr.type]}22`, color: TYPE_COLOR[pr.type] }}>{pr.type}</span></td>
                          <td style={{ padding: '10px 12px', color: 'var(--text2)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.description}</td>
                          <td style={{ padding: '10px 12px' }}><span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${STATUS_COLOR[pr.status]}22`, color: STATUS_COLOR[pr.status] }}>{pr.status}</span></td>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button onClick={() => setEditing(pr)} style={{ width: 24, height: 24, borderRadius: 4, border: 'none', background: 'var(--surface3)', color: 'var(--text3)', cursor: 'pointer', fontSize: 10 }}>✏️</button>
                              <button onClick={() => del(pr.id)}     style={{ width: 24, height: 24, borderRadius: 4, border: 'none', background: 'var(--surface3)', color: 'var(--text3)', cursor: 'pointer', fontSize: 10 }}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>

          {/* Links */}
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>🔗 Key Links</div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              {ORG_LINKS[slug]?.map((l, i, arr) => (
                <div key={i} style={{ padding: '11px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{l.label}</span>
                  <a href={l.url} target="_blank" style={{ color: 'var(--accent)', fontFamily: 'DM Mono, monospace', fontSize: 11, textDecoration: 'none' }}>Open ↗</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && <PRModal defaultOrg={slug} onClose={() => setShowModal(false)} onSave={() => { load(); setShowModal(false); setToast('PR added!') }} />}
      {editing   && <PRModal pr={editing}      onClose={() => setEditing(null)}    onSave={() => { load(); setEditing(null);   setToast('PR updated!') }} />}
      {toast     && <Toast msg={toast} onDone={() => setToast('')} />}
    </AuthGuard>
  )
}