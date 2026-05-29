// templates/sidebar.js — full-height dark sidebar, avatar, horizontal-rule sections

function tplSidebar(D) {
  const { accent, dark } = State;
  const initial = (D.name || '?').charAt(0).toUpperCase();

  // ── Sidebar ─────────────────────────────────────────────
  let sidebar = `
    <div style="text-align:center;margin-bottom:1.5rem">
      <div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#fff;margin:0 auto 12px;border:2px solid rgba(255,255,255,.35)">
        ${initial}
      </div>
      <div style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#fff;line-height:1.2">${esc(D.name) || 'Your Name'}</div>
      <div style="font-size:11px;color:rgba(255,255,255,.55);margin-top:6px;letter-spacing:1px;text-transform:uppercase">${esc(D.title) || 'Title'}</div>
    </div>`;

  // Contact
  const contactItems = [
    D.email    && `<i class="ti ti-mail"           style="font-size:13px;color:${accent}" aria-hidden="true"></i>${esc(D.email)}`,
    D.phone    && `<i class="ti ti-phone"          style="font-size:13px;color:${accent}" aria-hidden="true"></i>${esc(D.phone)}`,
    D.location && `<i class="ti ti-map-pin"        style="font-size:13px;color:${accent}" aria-hidden="true"></i>${esc(D.location)}`,
    D.website  && `<i class="ti ti-world"          style="font-size:13px;color:${accent}" aria-hidden="true"></i>${esc(D.website)}`,
    D.linkedin && `<i class="ti ti-brand-linkedin" style="font-size:13px;color:${accent}" aria-hidden="true"></i>${esc(D.linkedin)}`,
    D.github   && `<i class="ti ti-brand-github"  style="font-size:13px;color:${accent}" aria-hidden="true"></i>${esc(D.github)}`,
  ].filter(Boolean);

  if (contactItems.length) {
    sidebar += `<div style="margin-bottom:1.5rem">
      ${shClassic('Contact', 'rgba(255,255,255,.65)')}
      ${contactItems.map(c => `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,.8);margin-bottom:5px">${c}</div>`).join('')}
    </div>`;
  }

  if (State.skills.length) {
    sidebar += `<div style="margin-bottom:1.5rem">
      ${shClassic('Skills', 'rgba(255,255,255,.65)')}
      ${State.skills.map(s => `
        <div style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:3px">
            <span style="font-size:12px;color:rgba(255,255,255,.85)">${esc(s.name || 'Skill')}</span>
          </div>
          <div style="height:3px;background:rgba(255,255,255,.18);border-radius:2px">
            <div style="width:${s.lv}%;height:100%;background:#fff;border-radius:2px;opacity:.85"></div>
          </div>
        </div>`).join('')}
    </div>`;
  }

  if (State.langs.length) {
    sidebar += `<div style="margin-bottom:1.5rem">
      ${shClassic('Languages', 'rgba(255,255,255,.65)')}
      ${State.langs.map(l => `
        <div style="display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,.8);margin-bottom:5px">
          <span>${esc(l.lang)}</span>
          <span style="color:rgba(255,255,255,.45);font-size:10.5px">${l.prof}</span>
        </div>`).join('')}
    </div>`;
  }

  if (State.certs.length) {
    sidebar += `<div style="margin-bottom:1.5rem">
      ${shClassic('Certifications', 'rgba(255,255,255,.65)')}
      ${State.certs.map(c => `
        <div style="font-size:12px;color:rgba(255,255,255,.8);margin-bottom:7px">
          ${esc(c.name)}
          ${c.org ? `<div style="font-size:10.5px;color:rgba(255,255,255,.45)">${esc(c.org)}</div>` : ''}
        </div>`).join('')}
    </div>`;
  }

  // ── Main column ──────────────────────────────────────────
  let main = '';

  if (D.summary) {
    main += `<div style="margin-bottom:22px">
      ${shLine('Profile', accent)}
      <p style="font-size:13.5px;line-height:1.75;color:#444">${esc(D.summary)}</p>
    </div>`;
  }

  if (State.exp.length) {
    main += `<div style="margin-bottom:22px">
      ${shLine('Experience', accent)}
      ${State.exp.map(e => expBlock(e, {
        roleStyle: 'font-size:13.5px;font-weight:700;color:#1a1a2e',
        compStyle: `font-size:12.5px;color:${accent}`,
        dateStyle: 'font-size:11px;color:#999;font-family:monospace',
      })).join('')}
    </div>`;
  }

  if (State.edu.length) {
    main += `<div style="margin-bottom:22px">
      ${shLine('Education', accent)}
      ${State.edu.map(e => `
        <div style="margin-bottom:12px">
          <div style="font-size:13.5px;font-weight:700;color:#1a1a2e">${esc(e.degree)}</div>
          <div style="font-size:12.5px;color:${accent}">${esc(e.school)}${e.field ? ' · ' + esc(e.field) : ''}</div>
          <div style="font-size:11px;color:#999">${esc(e.year)}</div>
        </div>`).join('')}
    </div>`;
  }

  if (State.projs.length) {
    main += `<div style="margin-bottom:22px">
      ${shLine('Projects', accent)}
      ${State.projs.map(e => `
        <div style="margin-bottom:10px">
          <div style="font-size:13.5px;font-weight:700;color:#1a1a2e">${esc(e.name)}</div>
          ${e.desc ? `<div style="font-size:12.5px;color:#555;margin-top:3px">${esc(e.desc)}</div>` : ''}
        </div>`).join('')}
    </div>`;
  }

  return `
    <div style="background:#fff;font-family:'Space Grotesk',sans-serif;color:#1a1a1a;display:grid;grid-template-columns:215px 1fr">
      <div style="background:${dark};padding:1.75rem 1.5rem;min-height:100%">${sidebar}</div>
      <div style="padding:2rem">${main || placeholder()}</div>
    </div>`;
}