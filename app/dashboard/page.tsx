'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/Topbar'
import AuthGuard from '@/components/AuthGuard'
import PRModal from '@/components/modals/PRModal'
import Toast from '@/components/Toast'
import { fmtDate } from '@/lib/utils'
import { ORG_META } from '@/lib/constants'
import type { PR, Mentor, SprintTask } from '@/lib/types'

const STATUS_COLOR: Record<string, string> = {
  planned: 'var(--text3)', open: 'var(--blue)',
  review: 'var(--amber)', merged: 'var(--green)', closed: 'var(--red)'
}
const TYPE_COLOR: Record<string, string> = {
  docs: 'var(--blue)', bug: 'var(--amber)',
  feature: 'var(--accent)', test: 'var(--green)', refactor: 'var(--text3)'
}

export default function DashboardPage() {
  const router = useRouter()
  const [prs, setPrs]         = useState<PR[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [tasks, setTasks]     = useState<SprintTask[]>([])
  const [showPRModal, setShowPRModal] = useState(false)
  const [editingPR, setEditingPR]     = useState<PR | null>(null)
  const [toast, setToast] = useState('')

  async function load() {
    const [p, m, t] = await Promise.all([
      fetch('/api/prs').then(r => r.json()),
      fetch('/api/mentors').then(r => r.json()),
      fetch('/api/sprint').then(r => r.json()),
    ])
    setPrs(Array.isArray(p) ? p : [])
    setMentors(Array.isArray(m) ? m : [])
    setTasks(Array.isArray(t) ? t : [])
  }

  useEffect(() => {
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function deletePR(id: string) {
    if (!confirm('Delete this PR?')) return
    await fetch('/api/prs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
    setToast('PR deleted.')
  }

  const merged    = prs.filter(p => p.status === 'merged').length
  const doneTasks = tasks.filter(t => t.done).length
  const sprintPct = tasks.length ? Math.round(doneTasks / tasks.length * 100) : 0

  const TIMELINE = [
    { date: 'Mar 11', title: 'Sprint Day 1 begins',       color: 'var(--green)'   },
    { date: 'Mar 16', title: 'Proposal window opens',      color: 'var(--accent)'  },
    { date: 'Mar 24', title: 'Sprint ends · Submit draft', color: 'var(--accent2)' },
    { date: 'Mar 31', title: '⚠️ Proposal Deadline',       color: 'var(--red)'     },
    { date: 'Apr 30', title: 'Results announced',          color: 'var(--amber)'   },
    { date: 'May 25', title: 'Coding starts',              color: 'var(--blue)'    },
  ]

  return (
    <AuthGuard>
      <Topbar />
      <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
            GSoC 2026 <span style={{ color: 'var(--accent)' }}>Sprint</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>
            March 11 → March 31 · ML4SCI · Kubeflow · Apache Airflow ·{' '}
            <a href="https://github.com/KRYSTALM7" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}>@KRYSTALM7</a>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Merged PRs',          value: merged,         unit: '/ 5',  sub: `${5 - merged} more needed`,                                    color: 'var(--green)'   },
            { label: 'Mentor Interactions', value: mentors.length, unit: 'logged', sub: 'Target: 3+',                                                  color: 'var(--blue)'    },
            { label: 'Sprint Progress',     value: sprintPct,      unit: '%',    sub: `${doneTasks} / ${tasks.length} done`,                           color: 'var(--accent2)' },
            { label: 'Total PRs',           value: prs.length,     unit: '/ 5',  sub: `${prs.filter(p => p.status === 'review').length} in review`,    color: 'var(--amber)'   },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>{s.label}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 600, color: 'var(--text)', lineHeight: 1, marginBottom: 4 }}>
                {s.value} <span style={{ fontSize: 14, color: 'var(--text3)', fontWeight: 400, fontFamily: 'DM Sans' }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Org Cards */}
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>🏢 Organizations</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
          {Object.entries(ORG_META).map(([key, org]) => {
            const orgPRs    = prs.filter(p => p.org === key)
            const orgMerged = orgPRs.filter(p => p.status === 'merged').length
            return (
              <div key={key} onClick={() => router.push(`/org/${key}`)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: org.color }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: org.color, marginBottom: 4 }}>{org.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>Target: {org.target} PR{org.target > 1 ? 's' : ''}</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[{ label: 'Merged', val: orgMerged }, { label: 'Total', val: orgPRs.length }, { label: 'Goal', val: org.target }].map((s, i) => (
                    <div key={i} style={{ fontSize: 11, color: 'var(--text3)' }}>
                      <strong style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', display: 'block', lineHeight: 1.1 }}>{s.val}</strong>
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress + Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>📈 Overall Progress</div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 22px' }}>
              {[
                { label: 'ML4SCI PRs',     val: prs.filter(p => p.org === 'ml4sci'   && p.status === 'merged').length, max: 3, color: 'var(--ml4sci)'  },
                { label: 'Kubeflow PRs',   val: prs.filter(p => p.org === 'kubeflow' && p.status === 'merged').length, max: 2, color: 'var(--kubeflow)' },
                { label: 'Airflow PRs',    val: prs.filter(p => p.org === 'airflow'  && p.status === 'merged').length, max: 1, color: 'var(--airflow)'  },
                { label: 'Sprint Tasks',   val: doneTasks,      max: tasks.length,   color: 'var(--accent)'  },
                { label: 'Mentor Contact', val: mentors.length, max: 3,              color: 'var(--accent2)' },
              ].map((r, i) => {
                const pct = r.max > 0 ? Math.min(100, Math.round(r.val / r.max * 100)) : 0
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < 4 ? 14 : 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--text2)', width: 150, flexShrink: 0 }}>{r.label}</div>
                    <div style={{ flex: 1, height: 5, background: 'var(--border2)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: r.color, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--text3)', width: 36, textAlign: 'right' }}>{r.val}/{r.max}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>🗓 Key Dates</div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 20px 20px 36px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 22, top: 28, bottom: 28, width: 1, background: 'var(--border2)' }} />
              {TIMELINE.map((tl, i) => (
                <div key={i} style={{ position: 'relative', paddingBottom: i < TIMELINE.length - 1 ? 18 : 0 }}>
                  <div style={{ position: 'absolute', left: -20, top: 4, width: 10, height: 10, borderRadius: '50%', background: tl.color, border: '2px solid var(--surface)' }} />
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>{tl.date}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{tl.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All PRs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>🔀 All Pull Requests</div>
          <button onClick={() => setShowPRModal(true)}
            style={{ padding: '6px 14px', background: 'var(--accent-dim)', border: '1px solid rgba(100,255,218,0.3)', borderRadius: 6, color: 'var(--accent)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>
            + Add PR
          </button>
        </div>

        {prs.length === 0
          ? <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 32, textAlign: 'center', color: 'var(--text3)', fontSize: 12, fontStyle: 'italic' }}>No PRs yet — add your first one above.</div>
          : (
            <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    {['Date','Org','Repo','Type','Description','Links','Status',''].map((h, i) => (
                      <th key={i} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prs.map(pr => (
                    <tr key={pr.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '11px 14px', fontFamily: 'DM Mono, monospace', fontSize: 10.5, color: 'var(--text3)' }}>{fmtDate(pr.date)}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: `${ORG_META[pr.org]?.color}1a`, color: ORG_META[pr.org]?.color }}>
                          {ORG_META[pr.org]?.name || pr.org}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', color: 'var(--text)', fontWeight: 500 }}>{pr.repo || '—'}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: `${TYPE_COLOR[pr.type]}22`, color: TYPE_COLOR[pr.type] }}>{pr.type}</span>
                      </td>
                      <td style={{ padding: '11px 14px', color: 'var(--text2)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.description || '—'}</td>
                      <td style={{ padding: '11px 14px' }}>
                        {pr.link  && <a href={pr.link}  target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontFamily: 'DM Mono, monospace', fontSize: 11, textDecoration: 'none' }}>PR ↗</a>}
                        {pr.issue && <a href={pr.issue} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)',   fontFamily: 'DM Mono, monospace', fontSize: 11, textDecoration: 'none', marginLeft: 8 }}>Issue ↗</a>}
                        {!pr.link && !pr.issue && <span style={{ color: 'var(--text3)', fontSize: 11 }}>—</span>}
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: `${STATUS_COLOR[pr.status]}22`, color: STATUS_COLOR[pr.status] }}>{pr.status}</span>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setEditingPR(pr)} style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: 'var(--surface3)', color: 'var(--text3)', cursor: 'pointer', fontSize: 11 }}>✏️</button>
                          <button onClick={() => deletePR(pr.id)}  style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: 'var(--surface3)', color: 'var(--text3)', cursor: 'pointer', fontSize: 11 }}>🗑</button>
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

      {showPRModal && (
        <PRModal
          onClose={() => setShowPRModal(false)}
          onSave={() => { load(); setShowPRModal(false); setToast('PR added!') }}
        />
      )}
      {editingPR && (
        <PRModal
          pr={editingPR}
          onClose={() => setEditingPR(null)}
          onSave={() => { load(); setEditingPR(null); setToast('PR updated!') }}
        />
      )}
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </AuthGuard>
  )
}