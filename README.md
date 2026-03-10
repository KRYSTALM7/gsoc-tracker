# GSoC 2026 Sprint Tracker

A personal dashboard for tracking Google Summer of Code 2026 contributions across ML4SCI, Kubeflow, and Apache Airflow — built as a single-page web app with login, persistent storage, and full CRUD on everything.

---

## Features

**Dashboard**
Live stats for merged PRs, mentor interactions, sprint progress, and total contributions. Org cards give a quick overview of each organization's PR count vs target. Progress bars show exactly where you stand across all orgs. Key dates timeline keeps the March 31 deadline visible at all times.

**Organization Pages (ML4SCI · Kubeflow · Airflow)**
Each org has its own dedicated page with individual PR stats, a filtered PR table, and a panel of pre-loaded key links — GitHub repos, good first issue searches, documentation, and community channels. Add, edit, and delete PRs directly from each org page or from the main dashboard.

**14-Day Sprint**
Day-by-day checklist from March 11 to March 24. Check off tasks as you complete them. Add custom tasks to any day. Delete tasks you don't need. Progress badge on each card updates in real time.

**Mentor Log**
Log every mentor interaction with organization, platform (Slack, GitHub, Email, Discord), topic, notes, and reply status. Edit or delete any entry. Two copy-paste message templates for introductions and proposal review requests.

**Data Management**
Export all your data as a JSON file to back it up or move it to another device. Import a backup to restore everything instantly. Reset to default sprint tasks if needed.

---

## Editing the Code

The project is split into three files:

- `index.html` — page structure and modals only, no logic
- `styles.css` — all visual styles, colors, layout
- `app.js` — all data, auth, and render logic

**To change the deadline**, search `2026-03-31` in `app.js` and update it.

**To change organizations or links**, edit the `ORG_META` and `ORG_LINKS` objects in `app.js`.

**To change sprint tasks**, edit the `getDefaultSprint()` function in `app.js`. Note: this only affects new installs. If data is already saved in the browser, export → edit → import.

**To change colors or fonts**, all CSS variables are at the top of `styles.css` under `:root`.

**To update credentials**, generate a new SHA-256 hash of your password (use `sha256sum` or any online tool) and replace `_H` in `app.js`. Update `_U` for the username.

---

## Data Storage

Everything is saved in your browser's `localStorage`. No server, no database, no accounts — completely private. To use across devices, use Export → copy the JSON file → Import on the other device.
