export interface PR {
  id: string
  org: string
  repo: string
  description: string
  link: string
  issue: string
  type: string
  status: string
  date: string
}

export interface Mentor {
  id: string
  name: string
  org: string
  platform: string
  topic: string
  notes: string
  status: string
  date: string
}

export interface SprintTask {
  id: string
  day: string
  text: string
  done: boolean
}