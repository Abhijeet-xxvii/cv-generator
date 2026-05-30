// templates/classic.js — Playfair Display header, two-column layout

function tplClassic(D) {
  const { accent, dark } = State;

  const contacts = [
    contactChip('mail',           D.email,    '#ccc'),
    contactChip('phone',          D.phone,    '#ccc'),
    contactChip('map-pin',        D.location, '#ccc'),
    contactChip('world',          D.website,  '#ccc'),
    contactChip('brand-linkedin', D.linkedin, '#ccc'),
    contactChip('brand-github',   D.github,   '#ccc'),
  ].filter(Boolean).join('');

  // Photo in header (if provided)
  const photo = State.photo
    ? `<img src="${State.photo}" alt="Profile photo"
        style="width:80px;height:80px;object-fit:cover;border-radius:50%;
               border:2.5px solid rgba(255,255,255,.3);flex-shrink:0" />`
    : '';

  let main = '';

  if (D.summary) {
    main += `
      <div style="margin-bottom:22px">
        ${shClassic('Profile', accent)}
        <p style="font-size:13.5px;line-height:1.75;color:#333">${esc(D.summary)}</p>
      </div>`;
  }

  if (State.exp.length) {
    main += `<div style="margin-bottom:22px">${shClassic('Experience', accent)}
      ${State.exp.map(e => expBlock(e)).join('')}
    </div>`;
  }

  if (State.edu.length) {
    main += `<div style="margin-bottom:22px">${shClassic('Education', accent)}
      ${State.edu.map(e => `
        <div style="margin-bottom:12px">
          <div style="font-size:13.5px;font-weight:600;color:#1a1a2e">${esc(e.degree)}</div>
          <div style="font-size:12.5px;color:#555">${esc(e.school)}${e.field ? ' · ' + esc(e.field) : ''}</div>
          <div style="font-size:11px;color:#999;font-family:monospace">${esc(e.year)}</div>
        </div>`).join('')}
    </div>`;
  }

  if (State.projs.length) {
    main += `<div style="margin-bottom:22px">${shClassic('Projects', accent)}
      ${State.projs.map(e => `
        <div style="margin-bottom:10px">
          <div style="font-size:13.5px;font-weight:600;color:#1a1a2e">
            ${esc(e.name)}
            ${e.url ? `<span style="font-size:11px;color:${accent};font-weight:400"> ${esc(e.url)}</span>` : ''}
          </div>
          ${e.desc ? `<div style="font-size:12.5px;color:#555;margin-top:3px">${esc(e.desc)}</div>` : ''}
        </div>`).join('')}
    </div>`;
  }

  let aside = '';

  if (State.skills.length) {
    aside += `<div style="margin-bottom:20px">${shClassic('Skills', accent)}
      ${State.skills.map(s => skillBar(s)).join('')}
    </div>`;
  }

  if (State.langs.length) {
    aside += `<div style="margin-bottom:20px">${shClassic('Languages', accent)}
      ${State.langs.map(l => `
        <div style="display:flex;justify-content:space-between;font-size:12.5px;color:#333;margin-bottom:6px">
          <span>${esc(l.lang || 'Language')}</span>
          <span style="color:#999;font-size:11px">${l.prof}</span>
        </div>`).join('')}
    </div>`;
  }

  if (State.certs.length) {
    aside += `<div style="margin-bottom:20px">${shClassic('Certifications', accent)}
      ${State.certs.map(c => `
        <div style="font-size:12.5px;color:#333;margin-bottom:7px;padding-left:10px;border-left:2px solid ${accent}">
          ${esc(c.name || 'Cert')}
          ${c.org ? `<div style="font-size:11px;color:#999">${esc(c.org)}</div>` : ''}
        </div>`).join('')}
    </div>`;
  }

  return `
    <div style="background:#fff;font-family:'Lato',sans-serif;color:#1a1a1a">
      <!-- Header -->
      <div style="background:${dark};padding:2.5rem 2.5rem 1.75rem">
        <div style="display:flex;align-items:center;gap:20px">
          ${photo}
          <div style="flex:1">
            <div style="font-family:'Playfair Display',serif;font-size:34px;font-weight:700;color:#fff;letter-spacing:-0.5px;line-height:1.1">
              ${esc(D.name) || 'Your Name'}
            </div>
            <div style="font-size:12.5px;color:rgba(255,255,255,.55);margin-top:6px;letter-spacing:1.5px;text-transform:uppercase;font-weight:300">
              ${esc(D.title) || 'Your Title'}
            </div>
          </div>
        </div>
        ${contacts ? `<div style="margin-top:16px;display:flex;flex-wrap:wrap">${contacts}</div>` : ''}
      </div>

      <!-- Body -->
      <div style="display:grid;grid-template-columns:1fr 190px">
        <div style="padding:2rem 2rem 2rem 2.5rem;border-right:0.5px solid #eee">
          ${main || placeholder()}
        </div>
        <div style="padding:2rem 1.75rem 2rem 1.5rem;background:#fafafa">
          ${aside}
        </div>
      </div>
    </div>`;
}