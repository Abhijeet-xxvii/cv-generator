// templates/bold.js — high-impact accent-stripe header, Space Grotesk, pill skills, shBold sections

function tplBold(D) {
  const { accent, dark } = State;

  // ── Main column ────────────────────────────────────────────
  let main = '';

  if (D.summary) {
    main += `
      <div style="margin-bottom:22px">
        ${shBold('Profile', accent)}
        <p style="font-size:13.5px;line-height:1.75;color:#444;border-left:3px solid ${accent};padding-left:12px">${esc(D.summary)}</p>
      </div>`;
  }

  if (State.exp.length) {
    main += `
      <div style="margin-bottom:22px">
        ${shBold('Experience', accent)}
        ${State.exp.map(e => expBlock(e, {
          roleStyle : `font-size:14px;font-weight:700;color:${dark}`,
          compStyle : `font-size:12.5px;color:${accent};font-weight:500`,
          dateStyle : 'font-size:10.5px;color:#999;font-family:\'JetBrains Mono\',monospace;background:#f5f5f7;padding:2px 7px;border-radius:4px',
          descStyle : 'font-size:13px;color:#555;margin-top:6px;line-height:1.65',
          wrapStyle : `margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #f0f0f2`,
        })).join('')}
      </div>`;
  }

  if (State.edu.length) {
    main += `
      <div style="margin-bottom:22px">
        ${shBold('Education', accent)}
        ${State.edu.map(e => `
          <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #f0f0f2">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div>
                <div style="font-size:13.5px;font-weight:700;color:${dark}">${esc(e.degree)}</div>
                <div style="font-size:12.5px;color:${accent};font-weight:500;margin-top:2px">${esc(e.school)}${e.field ? ' · ' + esc(e.field) : ''}</div>
              </div>
              <div style="font-size:10.5px;color:#999;font-family:'JetBrains Mono',monospace;background:#f5f5f7;padding:2px 7px;border-radius:4px;white-space:nowrap">${esc(e.year)}</div>
            </div>
          </div>`).join('')}
      </div>`;
  }

  if (State.projs.length) {
    main += `
      <div style="margin-bottom:22px">
        ${shBold('Projects', accent)}
        ${State.projs.map(e => `
          <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #f0f0f2">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span style="font-size:13.5px;font-weight:700;color:${dark}">${esc(e.name)}</span>
              ${e.url ? `<span style="font-size:11px;color:${accent};font-family:'JetBrains Mono',monospace;background:${accent}12;padding:2px 7px;border-radius:4px">${esc(e.url)}</span>` : ''}
            </div>
            ${e.desc ? `<div style="font-size:12.5px;color:#555;margin-top:5px;line-height:1.65">${esc(e.desc)}</div>` : ''}
          </div>`).join('')}
      </div>`;
  }

  // ── Aside column ───────────────────────────────────────────
  let aside = '';

  if (State.skills.length) {
    aside += `
      <div style="margin-bottom:20px">
        ${shBold('Skills', accent)}
        <div style="display:flex;flex-wrap:wrap;gap:0">
          ${State.skills.map(s => skillPill(s, accent)).join('')}
        </div>
      </div>`;
  }

  if (State.langs.length) {
    aside += `
      <div style="margin-bottom:20px">
        ${shBold('Languages', accent)}
        ${State.langs.map(l => `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px">
            <span style="font-size:12.5px;font-weight:600;color:${dark}">${esc(l.lang || 'Language')}</span>
            <span style="font-size:10.5px;color:#fff;background:${accent};padding:2px 8px;border-radius:20px">${esc(l.prof)}</span>
          </div>`).join('')}
      </div>`;
  }

  if (State.certs.length) {
    aside += `
      <div style="margin-bottom:20px">
        ${shBold('Certifications', accent)}
        ${State.certs.map(c => `
          <div style="margin-bottom:8px;padding:8px 10px;background:${accent}0d;border-radius:6px;border-left:3px solid ${accent}">
            <div style="font-size:12.5px;font-weight:600;color:${dark}">${esc(c.name || 'Certification')}</div>
            ${c.org ? `<div style="font-size:11px;color:#888;margin-top:1px">${esc(c.org)}</div>` : ''}
          </div>`).join('')}
      </div>`;
  }

  // ── Contact items for aside ────────────────────────────────
  const contactItems = [
    D.email    && { icon: 'mail',           text: D.email    },
    D.phone    && { icon: 'phone',          text: D.phone    },
    D.location && { icon: 'map-pin',        text: D.location },
    D.website  && { icon: 'world',          text: D.website  },
    D.linkedin && { icon: 'brand-linkedin', text: D.linkedin },
    D.github   && { icon: 'brand-github',   text: D.github   },
  ].filter(Boolean);

  let contactAside = '';
  if (contactItems.length) {
    contactAside = `
      <div style="margin-bottom:20px">
        ${shBold('Contact', accent)}
        ${contactItems.map(c => `
          <div style="display:flex;align-items:center;gap:7px;font-size:12px;color:#444;margin-bottom:6px">
            <span style="width:24px;height:24px;border-radius:50%;background:${accent};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i class="ti ti-${c.icon}" style="font-size:12px;color:#fff" aria-hidden="true"></i>
            </span>
            <span style="word-break:break-all">${esc(c.text)}</span>
          </div>`).join('')}
      </div>`;
  }

  // ── Render ─────────────────────────────────────────────────
  return `
    <div style="background:#fff;font-family:'Space Grotesk',sans-serif;color:#1a1a1a">

      <!-- Header: accent stripe left + name block -->
      <div style="display:flex;min-height:110px">
        <div style="width:8px;background:${accent};flex-shrink:0"></div>
        <div style="background:${dark};flex:1;padding:2rem 2rem 2rem 1.75rem;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
          <div>
            <div style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;color:#fff;letter-spacing:-0.5px;line-height:1.1">
              ${esc(D.name) || 'Your Name'}
            </div>
            ${D.title ? `
              <div style="display:inline-block;margin-top:9px;font-size:11.5px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:${dark};background:${accent};padding:4px 12px;border-radius:4px">
                ${esc(D.title)}
              </div>` : ''}
          </div>
          <!-- Monogram badge -->
          <div style="width:68px;height:68px;border-radius:10px;background:${accent};display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:#fff;flex-shrink:0;letter-spacing:-1px">
            ${esc((D.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()) || '?'}
          </div>
        </div>
      </div>

      <!-- Body -->
      <div style="display:grid;grid-template-columns:1fr 200px">

        <!-- Main -->
        <div style="padding:1.75rem 2rem 2rem 1.75rem;border-right:1px solid #f0f0f2">
          ${main || placeholder()}
        </div>

        <!-- Aside -->
        <div style="padding:1.75rem 1.5rem;background:#fafafa">
          ${contactAside}
          ${aside}
        </div>

      </div>
    </div>`;
}