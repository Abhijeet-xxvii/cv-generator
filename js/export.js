// export.js — HTML, PDF, and DOCX export

// ── Shared: build standalone HTML string ──────────────────
function buildHTMLString() {
  const data   = getFormData();
  const fn     = TEMPLATES[State.template] || tplClassic;
  const cvHtml = fn(data);
  const name   = data.name || 'cv';

  return {
    slug: name.replace(/\s+/g, '-').toLowerCase(),
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(name)} — CV</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@300;400;500;600&family=Lato:ital,wght@0,300;0,400;0,700;1,300&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f0f0f2;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      font-family: 'DM Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .cv-wrap {
      width: 700px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 28px rgba(0,0,0,0.12);
    }
    @media print {
      body { background: #fff; padding: 0; }
      .cv-wrap { box-shadow: none; border-radius: 0; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="cv-wrap">${cvHtml}</div>
</body>
</html>`,
  };
}

// ── 1. HTML export ────────────────────────────────────────
function exportHTML() {
  const { slug, html } = buildHTMLString();
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `${slug}-${State.template}-cv.html`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ── 2. PDF export via html2pdf.js ─────────────────────────
function exportPDF() {
  const el = document.getElementById('cv-wrap');
  if (!el) return;

  const data = getFormData();
  const name = (data.name || 'cv').replace(/\s+/g, '-').toLowerCase();

  // Temporarily remove border-radius & box-shadow for clean PDF
  const orig = { borderRadius: el.style.borderRadius, boxShadow: el.style.boxShadow };
  el.style.borderRadius = '0';
  el.style.boxShadow = 'none';

  const btn = document.getElementById('export-btn');
  btn.innerHTML = '<i class="ti ti-loader ti-spin"></i> Generating…';
  btn.disabled  = true;

  html2pdf()
    .set({
      margin:       0,
      filename:     `${name}-${State.template}-cv.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'px', format: [700, 990], orientation: 'portrait' },
    })
    .from(el)
    .save()
    .finally(() => {
      el.style.borderRadius = orig.borderRadius;
      el.style.boxShadow    = orig.boxShadow;
      btn.innerHTML = '<i class="ti ti-download"></i> Export <i class="ti ti-chevron-down" style="font-size:12px;margin-left:2px"></i>';
      btn.disabled  = false;
    });
}

// ── 3. DOCX export via docx.js ────────────────────────────
function exportDOCX() {
  if (typeof docx === 'undefined') {
    alert('docx library not loaded. Check your internet connection.');
    return;
  }

  const D    = getFormData();
  const name = D.name || 'Candidate';
  const slug = name.replace(/\s+/g, '-').toLowerCase();

  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel,
    AlignmentType, BorderStyle, Table, TableRow, TableCell,
    WidthType, ShadingType,
  } = docx;

  const ACCENT = State.accent.replace('#','');

  // Helper: section heading paragraph
  function sectionHead(text) {
    return new Paragraph({
      children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20,
        color: ACCENT, font: 'Calibri' })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6,
        color: ACCENT, space: 4 } },
      spacing: { before: 240, after: 100 },
    });
  }

  // Helper: plain paragraph
  function para(text, opts = {}) {
    return new Paragraph({
      children: [new TextRun({ text: text || '', size: opts.size || 22,
        bold: opts.bold || false, color: opts.color || '333333',
        italics: opts.italic || false, font: 'Calibri' })],
      spacing: { after: opts.after || 60 },
      alignment: opts.align || AlignmentType.LEFT,
    });
  }

  const children = [];

  // ── Name & title ────────────────────────────────────────
  children.push(new Paragraph({
    children: [new TextRun({ text: name, bold: true, size: 48,
      color: ACCENT, font: 'Calibri' })],
    spacing: { after: 60 },
  }));
  if (D.title) children.push(para(D.title, { size: 24, color: '555555', italic: true, after: 80 }));

  // Contact line
  const contactParts = [
    D.email    && `Email: ${D.email}`,
    D.phone    && `Phone: ${D.phone}`,
    D.location && `Location: ${D.location}`,
    D.website  && `Web: ${D.website}`,
    D.linkedin && `LinkedIn: ${D.linkedin}`,
    D.github   && `GitHub: ${D.github}`,
  ].filter(Boolean);
  if (contactParts.length) {
    children.push(para(contactParts.join('   ·   '), { size: 18, color: '666666', after: 120 }));
  }

  // ── Summary ─────────────────────────────────────────────
  if (D.summary) {
    children.push(sectionHead('Profile'));
    children.push(para(D.summary, { size: 22, after: 80 }));
  }

  // ── Experience ──────────────────────────────────────────
  if (State.exp.length) {
    children.push(sectionHead('Experience'));
    State.exp.forEach(e => {
      const dates = [e.start, e.end].filter(Boolean).join(' – ');
      children.push(new Paragraph({
        children: [
          new TextRun({ text: e.role || 'Role', bold: true, size: 24, font: 'Calibri', color: '1a1a2e' }),
          new TextRun({ text: `  ${e.company || ''}`, size: 22, font: 'Calibri', color: '555555' }),
          new TextRun({ text: `  ${dates}`, size: 20, font: 'Calibri', color: '999999', italics: true }),
        ],
        spacing: { after: 60 },
      }));
      if (e.desc) children.push(para(e.desc, { size: 21, color: '444444', after: 120 }));
    });
  }

  // ── Education ───────────────────────────────────────────
  if (State.edu.length) {
    children.push(sectionHead('Education'));
    State.edu.forEach(e => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: e.degree || '', bold: true, size: 24, font: 'Calibri', color: '1a1a2e' }),
          new TextRun({ text: `  ${e.school || ''}${e.field ? ' · ' + e.field : ''}`, size: 22, font: 'Calibri', color: '555555' }),
          new TextRun({ text: `  ${e.year || ''}`, size: 20, font: 'Calibri', color: '999999', italics: true }),
        ],
        spacing: { after: 100 },
      }));
    });
  }

  // ── Skills ──────────────────────────────────────────────
  if (State.skills.length) {
    children.push(sectionHead('Skills'));
    children.push(para(State.skills.map(s => `${s.name} (${s.lv}%)`).join('   ·   '),
      { size: 21, color: '333333', after: 100 }));
  }

  // ── Languages ───────────────────────────────────────────
  if (State.langs.length) {
    children.push(sectionHead('Languages'));
    children.push(para(State.langs.map(l => `${l.lang}: ${l.prof}`).join('   ·   '),
      { size: 21, after: 100 }));
  }

  // ── Certifications ──────────────────────────────────────
  if (State.certs.length) {
    children.push(sectionHead('Certifications'));
    State.certs.forEach(c => {
      children.push(para(`${c.name || ''}${c.org ? '  –  ' + c.org : ''}`, { size: 21, after: 80 }));
    });
  }

  // ── Projects ────────────────────────────────────────────
  if (State.projs.length) {
    children.push(sectionHead('Projects'));
    State.projs.forEach(e => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: e.name || '', bold: true, size: 24, font: 'Calibri', color: '1a1a2e' }),
          e.url ? new TextRun({ text: `  ${e.url}`, size: 20, font: 'Calibri', color: ACCENT }) : null,
        ].filter(Boolean),
        spacing: { after: 60 },
      }));
      if (e.desc) children.push(para(e.desc, { size: 21, color: '444444', after: 120 }));
    });
  }

  // ── Build & download ────────────────────────────────────
  const doc = new Document({
    sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
      children }],
  });

  Packer.toBlob(doc).then(blob => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href = url; a.download = `${slug}-${State.template}-cv.docx`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  });
}

// Legacy alias (kept for any direct calls)
function exportCV() { exportHTML(); }