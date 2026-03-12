import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { uid } from '@/lib/utils'
import { DEFAULT_SPRINT_TASKS } from '@/lib/constants'

export async function GET() {
  const { data, error } = await supabase.from('sprint_tasks').select('*').order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Seed defaults if empty
  if (!data || data.length === 0) {
    const rows = DEFAULT_SPRINT_TASKS.map(t => ({ id: uid(), day: t.day, text: t.text, done: false }))
    await supabase.from('sprint_tasks').insert(rows)
    return NextResponse.json(rows)
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()

  if (body.action === 'toggle') {
    const { error } = await supabase.from('sprint_tasks').update({ done: body.done }).eq('id', body.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'add') {
    const { data, error } = await supabase.from('sprint_tasks').insert({ id: uid(), day: body.day, text: body.text, done: false }).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (body.action === 'delete') {
    const { error } = await supabase.from('sprint_tasks').delete().eq('id', body.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}