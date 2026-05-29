// utils.js — shared helpers used across templates and lists

/** Escape HTML special characters to prevent XSS */
function esc(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Get the value of a form input by ID */
function g(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/** Collect all basic form field values into a plain object */
function getFormData() {
  return {
    name:     g('f-name'),
    title:    g('f-title'),
    summary:  g('f-summary'),
    email:    g('f-email'),
    phone:    g('f-phone'),
    location: g('f-location'),
    website:  g('f-website'),
    linkedin: g('f-li'),
    github:   g('f-gh'),
  };
}

/** Build a single contact chip (icon + text) */
function contactChip(icon, value, color = '#888') {
  if (!value) return '';
  return `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11.5px;color:${color};margin-right:14px;margin-bottom:4px">
    <i class="ti ti-${icon}" style="font-size:13px;color:${State.accent}" aria-hidden="true"></i>${esc(value)}
  </span>`;
}

/** Skill bar row (name + percentage bar) */
function skillBar(skill, barBg = '#eee') {
  const accent = State.accent;
  return `<div style="margin-bottom:8px">
    <div style="display:flex;justify-content:space-between;margin-bottom:3px">
      <span style="font-size:12px;color:#333">${esc(skill.name || 'Skill')}</span>
      <span style="font-size:10px;color:#999">${skill.lv}%</span>
    </div>
    <div style="height:3px;background:${barBg};border-radius:2px">
      <div style="width:${skill.lv}%;height:100%;background:${accent};border-radius:2px"></div>
    </div>
  </div>`;
}

/** Skill pill / tag chip */
function skillPill(skill, accent) {
  return `<span style="font-size:11.5px;padding:4px 10px;background:${accent}18;color:${accent};border-radius:20px;border:0.5px solid ${accent}44;display:inline-block;margin:0 4px 5px 0">${esc(skill.name || 'Skill')}</span>`;
}

/** Experience block shared across templates */
function expBlock(entry, opts = {}) {
  const {
    roleStyle  = 'font-size:14px;font-weight:600;color:#1a1a2e',
    compStyle  = 'font-size:12.5px;color:#555',
    dateStyle  = 'font-size:11px;color:#999;font-family:monospace',
    descStyle  = 'font-size:13px;color:#444;margin-top:5px;line-height:1.6',
    wrapStyle  = 'margin-bottom:14px;padding-bottom:14px;border-bottom:0.5px solid #eee',
  } = opts;

  const dates = [entry.start, entry.end].filter(Boolean).join(' – ');

  return `<div style="${wrapStyle}">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <div style="${roleStyle}">${esc(entry.role || 'Role')}</div>
        <div style="${compStyle}">${esc(entry.company || '')}</div>
      </div>
      <div style="${dateStyle}">${esc(dates)}</div>
    </div>
    ${entry.desc ? `<div style="${descStyle}">${esc(entry.desc)}</div>` : ''}
  </div>`;
}

// ── Section heading styles ─────────────────────────────────

/** Classic: colored text + bottom border */
function shClassic(label, accent) {
  return `<div style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${accent};border-bottom:1.5px solid ${accent};padding-bottom:5px;margin-bottom:12px">${label}</div>`;
}

/** Sidebar: text + horizontal rule */
function shLine(label, accent) {
  return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
    <span style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${accent};white-space:nowrap">${label}</span>
    <div style="flex:1;height:1px;background:${accent};opacity:.3"></div>
  </div>`;
}

/** Minimal: left border accent */
function shLeft(label, accent) {
  return `<div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${accent};padding-left:10px;border-left:3px solid ${accent};margin-bottom:12px">${label}</div>`;
}

/** Bold: small label, no decoration */
function shBold(label, accent) {
  return `<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${accent};margin-bottom:10px">${label}</div>`;
}

/** Placeholder shown when CV is empty */
function placeholder() {
  return `<p class="cv-placeholder">Start filling in your details to see your CV take shape.</p>`;
}