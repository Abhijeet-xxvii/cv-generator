// export.js — builds a standalone HTML file and triggers a download

function exportCV() {
  const data   = getFormData();
  const fn     = TEMPLATES[State.template] || tplClassic;
  const cvHtml = fn(data);
  const name   = data.name || 'cv';
  const slug   = name.replace(/\s+/g, '-').toLowerCase();

  const html = `<!DOCTYPE html>
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
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${slug}-${State.template}-cv.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}