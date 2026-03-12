export function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function fmtDate(d: string) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getDeadlineCountdown() {
    const diff = new Date('2026-03-31T23:59:59').getTime() - Date.now()
    if (diff <= 0) return 'DEADLINE!'
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    return `${d}d ${h}h left`
}