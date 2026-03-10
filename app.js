// ─── UTILITIES ───────────────────────────────────────────────────────────────

async function hashPassword(pw) {
const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function ls(k)       { try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; } }
function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function uid()       { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

function toast(msg, type = 'success') {
const t = document.getElementById('toast');
document.getElementById('toastMsg').textContent = msg;
t.querySelector('i').className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
t.style.borderColor = type === 'success' ? 'var(--accent)' : 'var(--blue)';
t.classList.add('show');
setTimeout(() => t.classList.remove('show'), 2500);
}

function fmtDate(d) {
if (!d) return '—';
return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

// Credentials stored as SHA-256 hash — real password never appears in source
const _U = 'CR1TIC4L';
const _H = '5319750aa1cdb70c9fd7e23dd809399ad6a4d28ed69c1013d857a4b1ca6dd419';

async function doLogin() {
const u   = document.getElementById('loginUser').value.trim();
const p   = document.getElementById('loginPass').value;
const err = document.getElementById('loginError');
  const hash = await hashPassword(p);
  if (u !== _U || hash !== _H) { err.textContent = 'Incorrect username or password.'; return; }
  lsSet('gsoc_session', { user: u, ts: Date.now() });
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display        = 'flex';
  document.getElementById('app').style.flexDirection  = 'column';
  initApp();
}

function doLogout() {
  localStorage.removeItem('gsoc_session');
  document.getElementById('app').style.display        = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginUser').value = '';
}

// ─── PAGE NAV ────────────────────────────────────────────────────────────────

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
  if (id === 'dashboard') renderDashboard();
  if (id === 'ml4sci')    renderOrgPage('ml4sci');
  if (id === 'kubeflow')  renderOrgPage('kubeflow');
  if (id === 'airflow')   renderOrgPage('airflow');
  if (id === 'sprint')    renderSprint();
  if (id === 'mentors')   renderMentors();
}

// ─── DATA ────────────────────────────────────────────────────────────────────

function getData()      { return ls('gsoc_data') || getDefaultData(); }
function saveData(data) { lsSet('gsoc_data', data); }

function getDefaultData() {
  return { prs: [], mentors: [], sprint: getDefaultSprint() };
}

function getDefaultSprint() {
  return {
    '1-2':  { tasks: [
      { id: uid(), text: 'Update GitHub profile README with ML experience, tech stack, GSoC badge', done: false },
      { id: uid(), text: 'Pin best ML and research repositories on GitHub', done: false },
      { id: uid(), text: 'Add clear READMEs with architecture diagrams to pinned repos', done: false },
      { id: uid(), text: 'Study ML4SCI project list on GSoC page', done: false },
      { id: uid(), text: 'Study Kubeflow GSoC projects and select target', done: false },
      { id: uid(), text: 'Study Apache Airflow GSoC projects and select target', done: false },
      { id: uid(), text: 'Run ML4SCI/ML4DQM repository locally', done: false },
    ]},
    '3-4':  { tasks: [
      { id: uid(), text: 'Join ML4SCI Slack channel and post intro message', done: false },
      { id: uid(), text: 'Join Kubeflow Slack / GitHub discussions', done: false },
      { id: uid(), text: 'Join Apache Airflow dev mailing list or Slack', done: false },
      { id: uid(), text: 'Find good-first-issue labels in all 3 orgs', done: false },
      { id: uid(), text: 'Submit PR #1 to ML4SCI (docs / README fix)', done: false },
    ]},
    '5-6':  { tasks: [
      { id: uid(), text: 'Submit PR #2 to ML4SCI (bug fix with tests)', done: false },
      { id: uid(), text: 'Submit PR #1 to Kubeflow (docs or small fix)', done: false },
      { id: uid(), text: 'Read ML4DQM research paper and take notes', done: false },
      { id: uid(), text: 'Deep study dataset pipeline and model architecture', done: false },
    ]},
    '7':    { tasks: [
      { id: uid(), text: 'Submit PR #3 to ML4SCI (feature: metric module or data loader)', done: false },
      { id: uid(), text: 'Submit PR #1 to Apache Airflow (good first issue)', done: false },
      { id: uid(), text: 'Update sprint progress tracker', done: false },
    ]},
    '8':    { tasks: [
      { id: uid(), text: 'Send intro message to ML4SCI mentor via Slack', done: false },
      { id: uid(), text: 'Send intro message to Kubeflow mentor', done: false },
      { id: uid(), text: 'Log all mentor interactions in the Mentors tab', done: false },
      { id: uid(), text: 'Submit PR #2 to Kubeflow (bug fix)', done: false },
    ]},
    '9-10': { tasks: [
      { id: uid(), text: 'Write proposal title, abstract, and problem statement', done: false },
      { id: uid(), text: 'Draw architecture diagram on Excalidraw (excalidraw.com)', done: false },
      { id: uid(), text: 'Complete 12-week timeline table', done: false },
      { id: uid(), text: 'Write deliverables and About Me sections', done: false },
    ]},
    '11':   { tasks: [
      { id: uid(), text: 'Submit PR #4 (performance opt or refactor — any org)', done: false },
      { id: uid(), text: 'Grammar and clarity pass on proposal draft', done: false },
      { id: uid(), text: 'Verify architecture diagram is clear and complete', done: false },
    ]},
    '12':   { tasks: [
      { id: uid(), text: 'Grammar, clarity, and technical depth review', done: false },
      { id: uid(), text: 'Validate timeline is realistic', done: false },
      { id: uid(), text: 'Confirm all links and diagrams work', done: false },
    ]},
    '13-14':{ tasks: [
      { id: uid(), text: 'Send proposal draft to ML4SCI mentor for feedback', done: false },
      { id: uid(), text: 'Incorporate mentor feedback into proposal', done: false },
      { id: uid(), text: 'Submit PR #5 (final contribution)', done: false },
      { id: uid(), text: 'Submit final proposal on summerofcode.withgoogle.com', done: false },
      { id: uid(), text: 'Confirm submission confirmation email received', done: false },
    ]},
  };
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const ORG_META = {
  ml4sci:   { name: 'ML4SCI',   color: 'ml4sci',   target: 3, gh: 'https://github.com/ML4SCI',          icon: 'flask' },
  kubeflow: { name: 'Kubeflow', color: 'kubeflow', target: 2, gh: 'https://github.com/kubeflow',         icon: 'cloud' },
  airflow:  { name: 'Airflow',  color: 'airflow',  target: 1, gh: 'https://github.com/apache/airflow',   icon: 'wind'  },
};

const TYPE_BADGE = {
  docs:     '<span class="badge badge-blue">Docs</span>',
  bug:      '<span class="badge badge-amber">Bug Fix</span>',
  feature:  '<span class="badge badge-cyan">Feature</span>',
  test:     '<span class="badge badge-green">Tests</span>',
  refactor: '<span class="badge badge-gray">Refactor</span>',
};

const STATUS_BADGE = {
  planned: '<span class="badge badge-gray">Planned</span>',
  open:    '<span class="badge badge-blue">Open</span>',
  review:  '<span class="badge badge-amber">In Review</span>',
  merged:  '<span class="badge badge-green"><i class="fas fa-check"></i> Merged</span>',
  closed:  '<span class="badge badge-red">Closed</span>',
};

const MENTOR_STATUS = {
  sent:     '<span class="badge badge-amber">Awaiting Reply</span>',
  replied:  '<span class="badge badge-green">Replied</span>',
  followup: '<span class="badge badge-red">Follow Up</span>',
};

const PLATFORM_BADGE = {
  slack:   '<span class="badge badge-pink">Slack</span>',
  github:  '<span class="badge badge-gray"><i class="fab fa-github"></i> GitHub</span>',
  email:   '<span class="badge badge-blue">Email</span>',
  discord: '<span class="badge badge-blue">Discord</span>',
};

const DAY_LABELS = {
  '1-2':   { title: '📌 Day 1–2',   sub: 'Setup & GitHub'        },
  '3-4':   { title: '🤝 Day 3–4',   sub: 'Community Joining'     },
  '5-6':   { title: '🔧 Day 5–6',   sub: 'First Contributions'   },
  '7':     { title: '⚙️ Day 7',     sub: 'Feature PRs'           },
  '8':     { title: '💬 Day 8',     sub: 'Mentor Contact'         },
  '9-10':  { title: '📝 Day 9–10',  sub: 'Proposal Writing'       },
  '11':    { title: '🚀 Day 11',    sub: 'Additional PRs'         },
  '12':    { title: '✍️ Day 12',    sub: 'Proposal Polish'        },
  '13-14': { title: '✅ Day 13–14', sub: 'Final Submission'       },
};

const ORG_LINKS = {
  ml4sci: [
    { label: 'ML4DQM Repo',      url: 'https://github.com/ML4SCI/ML4DQM' },
    { label: 'ML4SCI Org',       url: 'https://github.com/ML4SCI' },
    { label: 'GSoC Page',        url: 'https://summerofcode.withgoogle.com/programs/2026/organizations/machine-learning-for-science-ml4sci' },
    { label: 'Good First Issues',url: 'https://github.com/search?q=org%3AML4SCI+label%3A%22good+first+issue%22&type=issues' },
    { label: 'DeepLense Repo',   url: 'https://github.com/ML4SCI/DeepLense' },
    { label: 'CERN Open Data',   url: 'https://opendata.cern.ch' },
  ],
  kubeflow: [
    { label: 'Kubeflow Pipelines', url: 'https://github.com/kubeflow/pipelines' },
    { label: 'Kubeflow Org',       url: 'https://github.com/kubeflow' },
    { label: 'Good First Issues',  url: 'https://github.com/search?q=org%3Akubeflow+label%3A%22good+first+issue%22&type=issues' },
    { label: 'Kubeflow Website',   url: 'https://www.kubeflow.org' },
    { label: 'Kubeflow Slack',     url: 'https://kubeflow.slack.com' },
  ],
  airflow: [
    { label: 'Airflow GitHub',      url: 'https://github.com/apache/airflow' },
    { label: 'Good First Issues',   url: 'https://github.com/apache/airflow/issues?q=label%3A%22good+first+issue%22' },
    { label: 'Airflow Docs',        url: 'https://airflow.apache.org/docs/' },
    { label: 'Dev Mailing List',    url: 'https://lists.apache.org/list.html?dev@airflow.apache.org' },
    { label: 'Contributing Guide',  url: 'https://github.com/apache/airflow/blob/main/CONTRIBUTING.rst' },
  ],
};

// ─── DEADLINE ────────────────────────────────────────────────────────────────

function updateDeadline() {
  const diff = new Date('2026-03-31T23:59:59') - new Date();
  if (diff <= 0) { document.getElementById('deadlineCountdown').textContent = 'DEADLINE!'; return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  document.getElementById('deadlineCountdown').textContent = `${d}d ${h}h left`;
}

// ─── INIT ────────────────────────────────────────────────────────────────────

function initApp() {
  if (!ls('gsoc_data')) saveData(getDefaultData());
  updateDeadline();
  setInterval(updateDeadline, 60000);
  renderDashboard();
  document.getElementById('prDate').value     = new Date().toISOString().split('T')[0];
  document.getElementById('mentorDate').value = new Date().toISOString().split('T')[0];
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

function renderDashboard() {
  const data    = getData();
  const prs     = data.prs || [];
  const merged  = prs.filter(p => p.status === 'merged').length;
  const mentors = (data.mentors || []).length;
  const allTasks  = Object.values(data.sprint || {}).flatMap(s => s.tasks);
  const doneTasks = allTasks.filter(t => t.done).length;
  const sprintPct = allTasks.length ? Math.round(doneTasks / allTasks.length * 100) : 0;

  document.getElementById('dashStats').innerHTML = `
    <div class="stat-card stat-accent-green">
      <div class="stat-label">Merged PRs</div>
      <div class="stat-value">${merged} <span class="unit">/ 5</span></div>
      <div class="stat-sub">${5 - merged} more needed</div>
    </div>
    <div class="stat-card stat-accent-blue">
      <div class="stat-label">Mentor Interactions</div>
      <div class="stat-value">${mentors} <span class="unit">logged</span></div>
      <div class="stat-sub">Target: 3+</div>
    </div>
    <div class="stat-card stat-accent-pink">
      <div class="stat-label">Sprint Progress</div>
      <div class="stat-value">${sprintPct}<span class="unit">%</span></div>
      <div class="stat-sub">${doneTasks} / ${allTasks.length} tasks done</div>
    </div>
    <div class="stat-card stat-accent-amber">
      <div class="stat-label">Total PRs</div>
      <div class="stat-value">${prs.length} <span class="unit">/ 5</span></div>
      <div class="stat-sub">${prs.filter(p => p.status === 'review').length} in review</div>
    </div>
  `;

  document.getElementById('orgCards').innerHTML = Object.entries(ORG_META).map(([key, org]) => {
    const orgPRs   = prs.filter(p => p.org === key);
    const orgMerged = orgPRs.filter(p => p.status === 'merged').length;
    return `
      <div class="org-card org-${key}" onclick="showPage('${key}')">
        <div class="org-card-name"><i class="fas fa-${org.icon}"></i> &nbsp;${org.name}</div>
        <div class="org-card-project">Target: ${org.target} PR${org.target > 1 ? 's' : ''}</div>
        <div class="org-card-stats">
          <div class="org-stat-item"><strong>${orgMerged}</strong> Merged</div>
          <div class="org-stat-item"><strong>${orgPRs.length}</strong> Total</div>
          <div class="org-stat-item"><strong>${org.target}</strong> Goal</div>
        </div>
      </div>
    `;
  }).join('');

  const mlPRs = prs.filter(p => p.org === 'ml4sci');
  const kfPRs = prs.filter(p => p.org === 'kubeflow');
  const afPRs = prs.filter(p => p.org === 'airflow');

  document.getElementById('overallProgress').innerHTML = [
    progRow('ML4SCI PRs',    mlPRs.filter(p=>p.status==='merged').length, 3, 'var(--ml4sci)'),
    progRow('Kubeflow PRs',  kfPRs.filter(p=>p.status==='merged').length, 2, 'var(--kubeflow)'),
    progRow('Airflow PRs',   afPRs.filter(p=>p.status==='merged').length, 1, 'var(--airflow)'),
    progRow('Sprint Tasks',  doneTasks, allTasks.length, 'var(--accent)'),
    progRow('Mentor Contact',mentors, 3, 'var(--accent2)'),
  ].join('');

  document.getElementById('timeline').innerHTML = [
    { date:'Mar 11', title:'Sprint Day 1 begins',         color:'var(--green)'  },
    { date:'Mar 16', title:'Proposal window opens',        color:'var(--accent)' },
    { date:'Mar 24', title:'Sprint ends · Submit draft',   color:'var(--accent2)'},
    { date:'Mar 31', title:'⚠️ Proposal Deadline',         color:'var(--red)'    },
    { date:'Apr 30', title:'Results announced',            color:'var(--amber)'  },
    { date:'May 25', title:'Coding starts',                color:'var(--blue)'   },
  ].map(tl => `
    <div class="tl-item">
      <div class="tl-dot" style="background:${tl.color}"></div>
      <div class="tl-date">${tl.date}</div>
      <div class="tl-title">${tl.title}</div>
    </div>
  `).join('');

  renderPRTable('allPRsBody', prs, true);
}

function progRow(label, val, max, color) {
  const pct = max > 0 ? Math.min(100, Math.round(val / max * 100)) : 0;
  return `
    <div class="prog-row">
      <div class="prog-label">${label}</div>
      <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${color}"></div></div>
      <div class="prog-pct">${val}/${max}</div>
    </div>
  `;
}

// ─── ORG PAGES ───────────────────────────────────────────────────────────────

function renderOrgPage(org) {
  const data   = getData();
  const prs    = (data.prs || []).filter(p => p.org === org);
  const meta   = ORG_META[org];
  const color  = `var(--${org})`;
  const merged = prs.filter(p => p.status === 'merged').length;

  document.getElementById(org + 'Content').innerHTML = `
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);">
      <div class="stat-card" style="border-bottom:2px solid ${color}">
        <div class="stat-label">Merged PRs</div>
        <div class="stat-value">${merged} <span class="unit">/ ${meta.target}</span></div>
      </div>
      <div class="stat-card" style="border-bottom:2px solid ${color}">
        <div class="stat-label">Total PRs</div>
        <div class="stat-value">${prs.length}</div>
      </div>
      <div class="stat-card" style="border-bottom:2px solid ${color}">
        <div class="stat-label">In Review</div>
        <div class="stat-value">${prs.filter(p=>p.status==='review').length}</div>
      </div>
    </div>
    <div class="two-col" style="margin-top:24px">
      <div>
        <div class="section-head">
          <div class="section-title"><i class="fas fa-code-branch"></i> Pull Requests</div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Repo</th><th>Type</th><th>Description</th><th>Links</th><th>Status</th><th></th></tr></thead>
            <tbody id="${org}PRsBody"></tbody>
          </table>
        </div>
      </div>
      <div>
        <div class="section-head">
          <div class="section-title"><i class="fas fa-link"></i> Key Links</div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;">
          ${ORG_LINKS[org].map(l => `
            <div style="padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
              <span style="font-size:13px;color:var(--text2)">${l.label}</span>
              <a href="${l.url}" target="_blank" class="link-cell"><i class="fas fa-external-link-alt"></i> Open</a>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  renderPRTable(org + 'PRsBody', prs, false);
}

// ─── PR TABLE ────────────────────────────────────────────────────────────────

function renderPRTable(tbodyId, prs, showOrg) {
  const tbody = document.getElementById(tbodyId);
  if (!prs.length) {
    tbody.innerHTML = `<tr><td colspan="${showOrg ? 8 : 7}" style="padding:32px;text-align:center;color:var(--text3);font-size:12px;font-style:italic;">No PRs yet — add your first one above.</td></tr>`;
    return;
  }
  tbody.innerHTML = prs.map(pr => `
    <tr>
      <td style="font-family:'Space Mono',monospace;font-size:10.5px;color:var(--text3)">${fmtDate(pr.date)}</td>
      ${showOrg ? `<td><span class="badge badge-${pr.org}">${ORG_META[pr.org]?.name || pr.org}</span></td>` : ''}
      <td class="td-main">${pr.repo || '—'}</td>
      <td>${TYPE_BADGE[pr.type] || pr.type}</td>
      <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${pr.desc || '—'}</td>
      <td>
        ${pr.link  ? `<a class="link-cell" href="${pr.link}"  target="_blank"><i class="fas fa-code-branch"></i> PR</a>` : '<span class="link-none">—</span>'}
        ${pr.issue ? `&nbsp;<a class="link-cell" href="${pr.issue}" target="_blank" style="color:var(--blue)"><i class="fas fa-bug"></i> Issue</a>` : ''}
      </td>
      <td>${STATUS_BADGE[pr.status] || pr.status}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn edit" onclick="openPRModal('${pr.id}',null)" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="icon-btn del"  onclick="deletePR('${pr.id}')"         title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ─── PR MODAL ────────────────────────────────────────────────────────────────

function openPRModal(editId, forOrg) {
  const data = getData();
  if (editId) {
    const pr = data.prs.find(p => p.id === editId);
    if (!pr) return;
    document.getElementById('prEditId').value  = editId;
    document.getElementById('prModalTitle').textContent = 'Edit Pull Request';
    document.getElementById('prOrg').value     = pr.org;
    document.getElementById('prRepo').value    = pr.repo   || '';
    document.getElementById('prDesc').value    = pr.desc   || '';
    document.getElementById('prLink').value    = pr.link   || '';
    document.getElementById('prIssue').value   = pr.issue  || '';
    document.getElementById('prType').value    = pr.type   || 'docs';
    document.getElementById('prStatus').value  = pr.status || 'open';
    document.getElementById('prDate').value    = pr.date   || '';
  } else {
    document.getElementById('prEditId').value  = '';
    document.getElementById('prModalTitle').textContent = 'Add Pull Request';
    document.getElementById('prRepo').value    = '';
    document.getElementById('prDesc').value    = '';
    document.getElementById('prLink').value    = '';
    document.getElementById('prIssue').value   = '';
    document.getElementById('prType').value    = 'docs';
    document.getElementById('prStatus').value  = 'open';
    document.getElementById('prDate').value    = new Date().toISOString().split('T')[0];
    if (forOrg && forOrg !== 'all') document.getElementById('prOrg').value = forOrg;
  }
  document.getElementById('prModal').classList.add('open');
}

function savePR() {
  const data   = getData();
  const editId = document.getElementById('prEditId').value;
  const pr = {
    id:     editId || uid(),
    org:    document.getElementById('prOrg').value,
    repo:   document.getElementById('prRepo').value.trim(),
    desc:   document.getElementById('prDesc').value.trim(),
    link:   document.getElementById('prLink').value.trim(),
    issue:  document.getElementById('prIssue').value.trim(),
    type:   document.getElementById('prType').value,
    status: document.getElementById('prStatus').value,
    date:   document.getElementById('prDate').value,
  };
  if (!pr.repo || !pr.desc) { toast('Repository and description required.', 'info'); return; }
  if (editId) {
    const idx = data.prs.findIndex(p => p.id === editId);
    if (idx >= 0) data.prs[idx] = pr;
  } else {
    data.prs.push(pr);
  }
  saveData(data);
  closeModal('prModal');
  toast(editId ? 'PR updated!' : 'PR added!');
  refreshActive();
}

function deletePR(id) {
  if (!confirm('Delete this PR entry?')) return;
  const data = getData();
  data.prs = data.prs.filter(p => p.id !== id);
  saveData(data);
  toast('PR deleted.');
  refreshActive();
}

// ─── SPRINT ──────────────────────────────────────────────────────────────────

function renderSprint() {
  const data   = getData();
  const sprint = data.sprint || {};

  document.getElementById('sprintGrid').innerHTML = Object.entries(DAY_LABELS).map(([key, info]) => {
    const s     = sprint[key] || { tasks: [] };
    const done  = s.tasks.filter(t => t.done).length;
    const total = s.tasks.length;
    const pct   = total ? Math.round(done / total * 100) : 0;
    const badge = pct === 100 ? 'badge-green' : pct > 0 ? 'badge-amber' : 'badge-gray';

    return `
      <div class="sprint-card">
        <div class="sprint-head">
          <div class="sprint-head-title">
            ${info.title}
            <span style="font-size:11px;color:var(--text3);font-weight:400;">${info.sub}</span>
          </div>
          <span class="badge ${badge}">${pct === 100 ? '✓ Done' : `${done}/${total}`}</span>
        </div>
        <div class="sprint-body">
          ${s.tasks.map(t => taskHTML(t, key)).join('')}
          ${total === 0 ? '<div style="color:var(--text3);font-size:12px;font-style:italic;">No tasks yet.</div>' : ''}
        </div>
      </div>
    `;
  }).join('');
}

function taskHTML(t, day) {
  return `
    <div class="check-row ${t.done ? 'done' : ''}" onclick="toggleTask('${t.id}','${day}')">
      <div class="checkbox"></div>
      <div class="check-text" style="flex:1">${t.text}</div>
      <button class="icon-btn del" style="opacity:0.4;flex-shrink:0;" onclick="event.stopPropagation();deleteTask('${t.id}','${day}')" title="Delete"><i class="fas fa-times"></i></button>
    </div>
  `;
}

function toggleTask(taskId, day) {
  const data = getData();
  const t = (data.sprint[day]?.tasks || []).find(t => t.id === taskId);
  if (t) { t.done = !t.done; saveData(data); renderSprint(); }
}

function deleteTask(taskId, day) {
  const data = getData();
  if (data.sprint[day]) {
    data.sprint[day].tasks = data.sprint[day].tasks.filter(t => t.id !== taskId);
    saveData(data); renderSprint(); toast('Task removed.');
  }
}

function openAddTaskModal() {
  document.getElementById('taskText').value = '';
  document.getElementById('taskModal').classList.add('open');
}

function saveTask() {
  const day  = document.getElementById('taskDay').value;
  const text = document.getElementById('taskText').value.trim();
  if (!text) { toast('Please enter a task.', 'info'); return; }
  const data = getData();
  if (!data.sprint[day]) data.sprint[day] = { tasks: [] };
  data.sprint[day].tasks.push({ id: uid(), text, done: false });
  saveData(data); closeModal('taskModal'); toast('Task added!'); renderSprint();
}

// ─── MENTORS ─────────────────────────────────────────────────────────────────

function renderMentors() {
  const data    = getData();
  const list    = document.getElementById('mentorsList');
  const mentors = data.mentors || [];

  if (!mentors.length) {
    list.innerHTML = `<div class="empty-state"><i class="fas fa-user-tie"></i><p>No mentor interactions logged yet.<br>Click "Log Interaction" to add your first one.</p></div>`;
    return;
  }

  list.innerHTML = mentors.map(m => {
    const avatarBg   = m.org === 'ml4sci' ? 'rgba(100,255,218,0.12)' : m.org === 'kubeflow' ? 'rgba(126,179,255,0.12)' : 'rgba(255,159,67,0.12)';
    const avatarColor = m.org === 'ml4sci' ? 'var(--ml4sci)' : m.org === 'kubeflow' ? 'var(--kubeflow)' : 'var(--airflow)';
    return `
      <div class="mentor-card">
        <div class="mentor-avatar" style="background:${avatarBg};color:${avatarColor}">${(m.name||'?')[0].toUpperCase()}</div>
        <div class="mentor-body">
          <div class="mentor-name">${m.name || 'Unknown'}</div>
          <div class="mentor-msg">${m.notes || m.topic || '—'}</div>
          <div class="mentor-meta">
            <span class="badge badge-${m.org}">${ORG_META[m.org]?.name || m.org}</span>
            ${PLATFORM_BADGE[m.platform] || ''}
            ${MENTOR_STATUS[m.status]    || ''}
            <span style="font-family:'Space Mono',monospace;font-size:10px;color:var(--text3)">${fmtDate(m.date)}</span>
            <div class="mentor-actions">
              <button class="icon-btn edit" onclick="openMentorModal('${m.id}')" title="Edit"><i class="fas fa-pen"></i></button>
              <button class="icon-btn del"  onclick="deleteMentor('${m.id}')"    title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openMentorModal(editId) {
  const data = getData();
  if (editId) {
    const m = (data.mentors || []).find(m => m.id === editId);
    if (!m) return;
    document.getElementById('mentorEditId').value        = editId;
    document.getElementById('mentorModalTitle').textContent = 'Edit Interaction';
    document.getElementById('mentorName').value          = m.name     || '';
    document.getElementById('mentorOrg').value           = m.org      || 'ml4sci';
    document.getElementById('mentorPlatform').value      = m.platform || 'slack';
    document.getElementById('mentorTopic').value         = m.topic    || '';
    document.getElementById('mentorNotes').value         = m.notes    || '';
    document.getElementById('mentorStatus').value        = m.status   || 'sent';
    document.getElementById('mentorDate').value          = m.date     || '';
  } else {
    document.getElementById('mentorEditId').value        = '';
    document.getElementById('mentorModalTitle').textContent = 'Log Interaction';
    document.getElementById('mentorName').value          = '';
    document.getElementById('mentorOrg').value           = 'ml4sci';
    document.getElementById('mentorPlatform').value      = 'slack';
    document.getElementById('mentorTopic').value         = '';
    document.getElementById('mentorNotes').value         = '';
    document.getElementById('mentorStatus').value        = 'sent';
    document.getElementById('mentorDate').value          = new Date().toISOString().split('T')[0];
  }
  document.getElementById('mentorModal').classList.add('open');
}

function saveMentor() {
  const data   = getData();
  const editId = document.getElementById('mentorEditId').value;
  const m = {
    id:       editId || uid(),
    name:     document.getElementById('mentorName').value.trim(),
    org:      document.getElementById('mentorOrg').value,
    platform: document.getElementById('mentorPlatform').value,
    topic:    document.getElementById('mentorTopic').value.trim(),
    notes:    document.getElementById('mentorNotes').value.trim(),
    status:   document.getElementById('mentorStatus').value,
    date:     document.getElementById('mentorDate').value,
  };
  if (!m.name) { toast('Mentor name required.', 'info'); return; }
  if (!data.mentors) data.mentors = [];
  if (editId) {
    const idx = data.mentors.findIndex(x => x.id === editId);
    if (idx >= 0) data.mentors[idx] = m;
  } else {
    data.mentors.push(m);
  }
  saveData(data); closeModal('mentorModal'); toast(editId ? 'Updated!' : 'Interaction logged!'); renderMentors();
}

function deleteMentor(id) {
  if (!confirm('Remove this mentor log entry?')) return;
  const data = getData();
  data.mentors = (data.mentors || []).filter(m => m.id !== id);
  saveData(data); toast('Entry removed.'); renderMentors();
}

// ─── TEMPLATES ───────────────────────────────────────────────────────────────

function copyTemplate(type) {
  const templates = {
    intro:    `Hello, I'm interested in contributing to the [Project] project.\nI have experience with ML pipelines, LSTM, and gradient boosting.\n\nI'd like to start by improving data preprocessing / evaluation pipelines.\nCould you point me to open issues that would be a good starting point?`,
    proposal: `I've prepared a draft proposal for [Project].\nI've also made a few contributions to the repository.\n\nWould you be open to reviewing it and suggesting improvements?\nI'd really value your feedback on the technical design.`,
  };
  navigator.clipboard.writeText(templates[type]).then(() => toast('Copied to clipboard!'));
}

// ─── MODAL UTILS ─────────────────────────────────────────────────────────────

function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ─── EXPORT / IMPORT ─────────────────────────────────────────────────────────

function exportData() {
  const blob = new Blob([JSON.stringify(getData(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `gsoc-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  toast('Data exported!');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try { saveData(JSON.parse(ev.target.result)); toast('Data imported!'); renderDashboard(); }
    catch { toast('Invalid JSON file.', 'info'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function resetAllData() {
  if (!confirm('This will delete ALL your PRs, sprint progress, and mentor logs. Are you sure?')) return;
  saveData(getDefaultData()); toast('Data reset to defaults.'); renderDashboard();
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function refreshActive() {
  const id = document.querySelector('.page.active')?.id?.replace('page-', '');
  if (!id) return;
  if (id === 'dashboard') renderDashboard();
  else if (id === 'ml4sci' || id === 'kubeflow' || id === 'airflow') renderOrgPage(id);
}

// ─── BOOT ────────────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });

  // Enter key on login
  document.getElementById('loginPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });

  // Auto-login if session exists
  const session = ls('gsoc_session');
  if (session && session.user === _U) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display        = 'flex';
    document.getElementById('app').style.flexDirection  = 'column';
    initApp();
  }
});