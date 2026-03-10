<div align="center">

<img src="https://img.shields.io/badge/GSoC-2026-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="GSoC 2026"/>
<img src="https://img.shields.io/badge/Status-Active%20Sprint-64ffda?style=for-the-badge" alt="Active"/>
<img src="https://img.shields.io/badge/Made%20by-KRYSTALM7-ff6b9d?style=for-the-badge&logo=github" alt="KRYSTALM7"/>
<img src="https://img.shields.io/badge/Deploy-GitHub%20Pages-222?style=for-the-badge&logo=github-pages" alt="GitHub Pages"/>

<br/><br/>

# 🚀 GSoC 2026 Sprint Tracker

**A fully self-contained, password-protected personal dashboard for tracking Google Summer of Code 2026 contributions, proposals, and mentor interactions — built and deployed as a single HTML file.**

[**→ Live Dashboard**](https://KRYSTALM7.github.io/gsoc-tracker) &nbsp;·&nbsp; [**Report a Bug**](https://github.com/KRYSTALM7/gsoc-tracker/issues/new?template=bug_report.md) &nbsp;·&nbsp; [**Changelog**](https://github.com/KRYSTALM7/gsoc-tracker/releases)

<br/>

![Dashboard Preview](https://img.shields.io/badge/Preview-Dashboard%20Screenshot-1a1d27?style=flat-square)

</div>

---

## 📌 What is this?

This is my **personal GSoC 2026 preparation command center** — a single-file web app I built to replace scattered Notion pages and spreadsheets. It tracks everything I need to go from zero contributions to a submitted proposal in 14 days.

**Organizations I'm targeting:**
| Organization | Project | PR Target |
|---|---|---|
| 🔬 [Machine Learning for Science (ML4SCI)](https://github.com/ML4SCI) | ML4DQM — Anomaly Detection | 2–3 PRs |
| ☁️ [Kubeflow](https://github.com/kubeflow) | ML Pipelines | 1–2 PRs |
| 🌀 [Apache Airflow](https://github.com/apache/airflow) | ML Workflow DAGs | 1 PR |

**Sprint:** March 11 → March 24, 2026 &nbsp;·&nbsp; **Proposal Deadline:** March 31, 2026

---

## ✨ Features

### 🔐 Authentication
- Password-protected login — credentials stored as **SHA-256 hash** in the source
- Session persistence across browser refreshes via `localStorage`
- Clean logout — no traces left in memory

### 📊 Common Dashboard
- Live stats: merged PRs, mentor interactions, sprint completion %, total PRs
- Per-organization progress bars (ML4SCI / Kubeflow / Airflow)
- Unified PR table across all organizations
- Key dates timeline (proposal window, sprint end, deadline)

### 🏢 Per-Organization Dashboards
Each org gets its own dedicated page with:
- Individual PR tracker (add, edit, delete entries)
- Status badges: `Planned` → `Open` → `In Review` → `Merged`
- Type tagging: `Docs`, `Bug Fix`, `Feature`, `Tests`, `Refactor`
- Pre-loaded key links (GitHub repo, good first issues, docs, Slack/community)
- Live stats: merged count, total PRs, in-review count

### ✅ 14-Day Sprint Checklists
- Pre-loaded daily task groups (Day 1-2 through Day 13-14)
- Click any checkbox to mark done — saves instantly
- Add or delete tasks per day from the UI
- Visual progress badge per day group

### 👤 Mentor Interaction Log
- Log every interaction with org, platform, topic, notes, response status
- Platform badges: Slack, GitHub, Email, Discord
- Copy-paste message templates (intro + proposal review request)
- Edit and delete any entry

### 🚀 Deploy Guide (built-in)
- Step-by-step GitHub Pages and Netlify instructions inside the app
- Data export (JSON) and import for cross-device sync
- Full data reset option

### 🎨 Design
- Dark theme, `Syne` + `Space Mono` + `Outfit` typography
- Fully responsive (mobile-friendly)
- Smooth animations, toast notifications
- No framework — zero dependencies, single file

---

## 🛠️ Tech Stack

```
HTML5 + CSS3 + Vanilla JavaScript
├── Fonts:  Google Fonts (Syne, Space Mono, Outfit)
├── Icons:  Font Awesome 6.5
├── Auth:   Web Crypto API (SHA-256)
├── Store:  localStorage (no backend needed)
└── Deploy: GitHub Pages / Netlify / Vercel
```

No Node.js. No npm. No build step. Just one file.

---

## 🚀 Deployment

### GitHub Pages (this repo)

```bash
# 1. Fork or clone this repo
git clone https://github.com/KRYSTALM7/gsoc-tracker.git

# 2. The index.html is the entire app — edit credentials if needed
# 3. Push to main branch
git add index.html
git commit -m "deploy: update tracker"
git push origin main

# 4. Enable GitHub Pages:
# Settings → Pages → Source: Deploy from branch → main → / root → Save
# Live at: https://KRYSTALM7.github.io/gsoc-tracker
```

### Vercel (recommended — supports private repos)

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. **Add New → Project** → Import `gsoc-tracker` repo
3. Framework preset: **Other** → leave defaults → **Deploy**
4. Live at: `https://gsoc-tracker.vercel.app`

Auto-deploys on every `git push` to `main`.

### Netlify (drag & drop)

1. Go to [netlify.com](https://netlify.com)
2. Drag `index.html` into the deploy zone
3. Live instantly — no configuration needed

---

## 🔐 Security Model

> **The real password never appears in source code.**

Credentials are verified using the **Web Crypto API (SHA-256)**:

```
User types password → SHA-256 hash computed in browser
                    → compared to hardcoded hash in source
                    → match = session granted
```

What's stored in the file:
```
// Only a hash — cannot be reversed to the original password
const _H = '5319750aa1cdb70c9fd7e23dd809399...';
```

**Changing your password:**
1. Compute SHA-256 of your new password:
   ```bash
   echo -n "YourNewPassword" | sha256sum
   # or use: https://emn178.github.io/online-tools/sha256.html
   ```
2. Replace `_H` value in `index.html`
3. Push to GitHub → auto-redeploys

---

## 📁 Repository Structure

```
gsoc-tracker/
├── index.html                  # Entire app — single file
├── README.md                   # This file
├── CHANGELOG.md                # Version history and release notes
├── LICENSE                     # MIT License
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md       # Bug report template
    │   └── feature_request.md  # Feature request template
    └── PULL_REQUEST_TEMPLATE/
        └── pull_request.md     # PR template (if accepting contributions)
```

---

## 📅 My GSoC Timeline

| Date | Milestone |
|---|---|
| Mar 11 | Sprint Day 1 — GitHub cleanup, org research |
| Mar 16 | GSoC proposal window opens |
| Mar 13–17 | First contributions (PRs #1–#3) |
| Mar 18–22 | Feature PRs + mentor contact |
| Mar 22–24 | Proposal draft + mentor review |
| Mar 24 | Sprint end — first full draft submitted |
| Mar 31 | **Proposal deadline** |
| Apr 30 | Results announced |
| May 25 | Coding begins |

---

## 📊 Current Progress

> _Updated manually as sprint progresses_

| Metric | Current | Target |
|---|---|---|
| Merged PRs (ML4SCI) | 0 | 2–3 |
| Merged PRs (Kubeflow) | 0 | 1–2 |
| Merged PRs (Airflow) | 0 | 1 |
| Mentor interactions | 0 | 3+ |
| Proposal draft | 0% | 100% |

---

## 🔗 Useful Links

| Resource | URL |
|---|---|
| GSoC 2026 Portal | https://summerofcode.withgoogle.com |
| ML4SCI GitHub | https://github.com/ML4SCI |
| ML4DQM Repository | https://github.com/ML4SCI/ML4DQM |
| Kubeflow Pipelines | https://github.com/kubeflow/pipelines |
| Apache Airflow | https://github.com/apache/airflow |
| My GitHub Profile | https://github.com/KRYSTALM7 |
| CERN Open Data | https://opendata.cern.ch |
| Excalidraw (diagrams) | https://excalidraw.com |

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

This project is for personal use during GSoC 2026 preparation. Feel free to fork and adapt for your own GSoC sprint.

---

<div align="center">

**Built with focus during a 14-day GSoC sprint · March 2026**

[![GitHub](https://img.shields.io/badge/GitHub-KRYSTALM7-181717?style=flat-square&logo=github)](https://github.com/KRYSTALM7)

</div>
