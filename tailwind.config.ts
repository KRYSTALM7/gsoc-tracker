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
        bg:       '#111318',
        bg2:      '#181b22',
        surface:  '#1e2128',
        surface2: '#242830',
        surface3: '#2a2f3a',
        border1:  '#2c3040',
        border2:  '#363d50',
        t1:       '#d4d9e8',
        t2:       '#7e8ba8',
        t3:       '#4a5370',
        accent:   '#4ecdc4',
        accent2:  '#e8749a',
        blue:     '#6fa3e0',
        amber:    '#e8b86d',
        green:    '#5abf7e',
        red:      '#e06b6b',
        ml4sci:   '#4ecdc4',
        kubeflow: '#6fa3e0',
        airflow:  '#e8b86d',
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
