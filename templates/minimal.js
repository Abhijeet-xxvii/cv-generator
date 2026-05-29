// templates/minimal.js — single-column, generous whitespace, DM Serif Display, left-border sections

function tplMinimal(D) {
  const { accent, dark } = State;

  // ── Header contact line ────────────────────────────────────
  const contactParts = [
    D.email    && `<span style="display:inline-flex;align-items:center;gap:4px"><i class="ti ti-mail"           style="font-size:12px;color:${accent}" aria-hidden="true"></i>${esc(D.email)}</span>`,
    D.phone    && `<span style="display:inline-flex;align-items:center;gap:4px"><i class="ti ti-phone"          style="font-size:12px;color:${accent}" aria-hidden="true"></i>${esc(D.phone)}</span>`,
    D.location && `<span style="display:inline-flex;align-items:center;gap:4px"><i class="ti ti-map-pin"        style="font-size:12px;color:${accent}" aria-hidden="true"></i>${esc(D.location)}</span>`,
    D.website  && `<span style="display:inline-flex;align-items:center;gap:4px"><i class="ti ti-world"          style="font-size:12px;color:${accent}" aria-hidden="true"></i>${esc(D.website)}</span>`,
    D.linkedin && `<span style="display:inline-flex;align-items:center;gap:4px"><i class="ti ti-brand-linkedin" style="font-size:12px;color:${accent}" aria-hidden="true"></i>${esc(D.linkedin)}</span>`,
    D.github   && `<span style="display:inline-flex;align-items:center;gap:4px"><i class="ti ti-brand-github"   style="font-size:12px;color:${accent}" aria-hidden="true"></i>${esc(D.github)}</span>`,
  ].filter(Boolean).join('<span style="color:#ddd;margin:0 6px">·</span>');

  // ── Body sections ──────────────────────────────────────────
  let body = '';

  if (D.summary) {
    body += `
      <div style="margin-bottom:28px">
        ${shLeft('Profile', accent)}
        <p style="font-size:13.5px;line-height:1.8;color:#444">${esc(D.summary)}</p>
      </div>`;
  }

  if (State.exp.length) {
    body += `
      <div style="margin-bottom:28px">
        ${shLeft('Experience', accent)}
        ${State.exp.map(e => expBlock(e, {
          roleStyle : 'font-size:13.5px;font-weight:600;color:#1a1a2e',
          compStyle : 'font-size:12.5px;color:#666;font-style:italic',
          dateStyle : `font-size:11px;color:${accent};font-family:'JetBrains Mono',monospace`,
          descStyle : 'font-size:13px;color:#555;margin-top:6px;line-height:1.7',
          wrapStyle : 'margin-bottom:18px;padding-bottom:18px;border-bottom:0.5px solid #eee',
        })).join('')}
      </div>`;
  }

  if (State.edu.length) {
    body += `
      <div style="margin-bottom:28px">
        ${shLeft('Education', accent)}
        ${State.edu.map(e => `
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;padding-bottom:14px;border-bottom:0.5px solid #eee">
            <div>
              <div style="font-size:13.5px;font-weight:600;color:#1a1a2e">${esc(e.degree)}</div>
              <div style="font-size:12.5px;color:#666;font-style:italic;margin-top:2px">${esc(e.school)}${e.field ? ' · ' + esc(e.field) : ''}</div>
            </div>
            <div style="font-size:11px;color:${accent};font-family:'JetBrains Mono',monospace;white-space:nowrap;padding-left:12px">${esc(e.year)}</div>
          </div>`).join('')}
      </div>`;
  }

  // Skills + Languages in a two-column row
  const hasSkills = State.skills.length > 0;
  const hasLangs  = State.langs.length  > 0;

  if (hasSkills || hasLangs) {
    body += `<div style="display:grid;grid-template-columns:${hasSkills && hasLangs ? '1fr 1fr' : '1fr'};gap:28px;margin-bottom:28px">`;

    if (hasSkills) {
      body += `
        <div>
          ${shLeft('Skills', accent)}
          ${State.skills.map(s => skillBar(s, '#f0f0f0')).join('')}
        </div>`;
    }

    if (hasLangs) {
      body += `
        <div>
          ${shLeft('Languages', accent)}
          ${State.langs.map(l => `
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:#333;margin-bottom:9px;padding-bottom:9px;border-bottom:0.5px solid #f0f0f0">
              <span style="font-weight:500">${esc(l.lang || 'Language')}</span>
              <span style="font-size:11px;color:#999;font-style:italic">${esc(l.prof)}</span>
            </div>`).join('')}
        </div>`;
    }

    body += `</div>`;
  }

  if (State.projs.length) {
    body += `
      <div style="margin-bottom:28px">
        ${shLeft('Projects', accent)}
        ${State.projs.map(e => `
          <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:0.5px solid #eee">
            <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
              <span style="font-size:13.5px;font-weight:600;color:#1a1a2e">${esc(e.name)}</span>
              ${e.url ? `<a style="font-size:11px;color:${accent};font-family:'JetBrains Mono',monospace">${esc(e.url)}</a>` : ''}
            </div>
            ${e.desc ? `<div style="font-size:12.5px;color:#555;margin-top:4px;line-height:1.65">${esc(e.desc)}</div>` : ''}
          </div>`).join('')}
      </div>`;
  }

  if (State.certs.length) {
    body += `
      <div style="margin-bottom:28px">
        ${shLeft('Certifications', accent)}
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${State.certs.map(c => `
            <div style="font-size:12.5px;color:#333;padding:7px 12px;border:1px solid #e8e8e8;border-radius:6px;border-left:3px solid ${accent}">
              <div style="font-weight:500">${esc(c.name || 'Certification')}</div>
              ${c.org ? `<div style="font-size:11px;color:#999;margin-top:1px">${esc(c.org)}</div>` : ''}
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ── Render ─────────────────────────────────────────────────
  return `
    <div style="background:#fff;font-family:'DM Sans',sans-serif;color:#1a1a1a">

      <!-- Header -->
      <div style="padding:2.75rem 3rem 2rem;border-bottom:2px solid ${accent}">
        <div style="font-family:'DM Serif Display',serif;font-size:36px;font-weight:400;color:${dark};letter-spacing:-0.5px;line-height:1.1">
          ${esc(D.name) || 'Your Name'}
        </div>
        ${D.title ? `<div style="font-size:13px;color:#888;margin-top:7px;letter-spacing:1.2px;text-transform:uppercase;font-weight:300">${esc(D.title)}</div>` : ''}
        ${contactParts ? `<div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:6px 0;font-size:12px;color:#666;row-gap:6px">${contactParts}</div>` : ''}
      </div>

      <!-- Body -->
      <div style="padding:2.25rem 3rem 2.5rem">
        ${body || placeholder()}
      </div>

    </div>`;
}