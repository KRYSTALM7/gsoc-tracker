import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#08090c',
        bg2:      '#0f1117',
        surface:  '#13151c',
        surface2: '#1a1d27',
        surface3: '#20253a',
        border1:  '#1f2335',
        border2:  '#2a3050',
        t1:       '#e2e8f5',
        t2:       '#8892b0',
        t3:       '#4a5280',
        accent:   '#64ffda',
        accent2:  '#ff6b9d',
        blue:     '#7eb3ff',
        amber:    '#ffd27f',
        green:    '#69ff94',
        red:      '#ff6b6b',
        ml4sci:   '#64ffda',
        kubeflow: '#7eb3ff',
        airflow:  '#ff9f43',
      },
      fontFamily: {
        sans:     ['DM Sans', 'sans-serif'],
        mono:     ['DM Mono', 'monospace'],
        fraunces: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config