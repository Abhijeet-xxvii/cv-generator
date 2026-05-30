// ats.js — ATS Resume Optimization scorer

function runATS() {
  const D      = getFormData();
  const tips   = [];
  let   score  = 0;
  const MAX    = 100;

  // ── 1. Contact completeness (20 pts) ─────────────────────
  const contactFields = [D.email, D.phone, D.location];
  const contactScore  = Math.round((contactFields.filter(Boolean).length / 3) * 20);
  score += contactScore;
  if (!D.email)    tips.push({ type:'error',   text: 'Add an email address — required by all ATS systems.' });
  if (!D.phone)    tips.push({ type:'warn',    text: 'Add a phone number for recruiter contact.' });
  if (!D.location) tips.push({ type:'warn',    text: 'Add a location (city / country) — many ATS filter by region.' });

  // ── 2. Name & title (10 pts) ─────────────────────────────
  if (D.name)  score += 5; else tips.push({ type:'error', text: 'Full name is missing.' });
  if (D.title) score += 5; else tips.push({ type:'warn',  text: 'Add a job title — ATS matches it against the role.' });

  // ── 3. Summary / profile (10 pts) ────────────────────────
  if (D.summary && D.summary.length >= 80) {
    score += 10;
  } else if (D.summary) {
    score += 5;
    tips.push({ type:'warn', text: 'Profile summary is short. Aim for 80+ characters with relevant keywords.' });
  } else {
    tips.push({ type:'warn', text: 'Add a Profile summary — it gives ATS critical keyword context.' });
  }

  // ── 4. Experience (20 pts) ───────────────────────────────
  if (State.exp.length >= 2) {
    score += 20;
  } else if (State.exp.length === 1) {
    score += 10;
    tips.push({ type:'info', text: 'One experience entry found. ATS ranks CVs with 2+ entries higher.' });
  } else {
    tips.push({ type:'error', text: 'No work experience. ATS filters will deprioritize this CV.' });
  }

  // Check for action verbs & measurable results in descriptions
  const actionVerbs = ['led','managed','built','designed','developed','increased',
    'reduced','created','launched','delivered','improved','achieved','coordinated',
    'implemented','analysed','analyzed','spearheaded','drove','optimized'];
  const allDescText = State.exp.map(e => (e.desc || '').toLowerCase()).join(' ');
  const verbCount   = actionVerbs.filter(v => allDescText.includes(v)).length;
  if (verbCount >= 3) {
    score += 5;
  } else if (State.exp.length > 0) {
    tips.push({ type:'info', text: `Use strong action verbs (Led, Built, Increased…) in job descriptions — only ${verbCount} found.` });
  }

  const hasNumbers = /\d+%|\d+x|\$[\d,]+|\d+ (people|users|projects|clients|team)/i.test(allDescText);
  if (hasNumbers) {
    score += 5;
  } else if (State.exp.length > 0) {
    tips.push({ type:'info', text: 'Add measurable results to experience (e.g. "increased revenue by 30%") — ATS and recruiters prioritise these.' });
  }

  // ── 5. Education (10 pts) ────────────────────────────────
  if (State.edu.length >= 1) {
    score += 10;
  } else {
    tips.push({ type:'warn', text: 'No education entries. Many ATS systems filter by degree.' });
  }

  // ── 6. Skills (10 pts) ───────────────────────────────────
  if (State.skills.length >= 5) {
    score += 10;
  } else if (State.skills.length >= 2) {
    score += 5;
    tips.push({ type:'info', text: `${State.skills.length} skills found. Add more (5+) to match job description keywords.` });
  } else {
    tips.push({ type:'warn', text: 'Add skills — ATS scores CVs heavily on keyword matches.' });
  }

  // ── 7. Keyword density check (10 pts) ────────────────────
  const allText = [
    D.summary, D.title,
    ...State.exp.map(e => `${e.role} ${e.company} ${e.desc}`),
    ...State.skills.map(s => s.name),
    ...State.edu.map(e => `${e.degree} ${e.field}`),
  ].join(' ').toLowerCase();

  const techKeywords = ['communication','leadership','management','analysis','design',
    'development','strategy','project','team','agile','data','software','marketing',
    'customer','sales','research','python','javascript','sql','excel','aws',
    'product','ux','ui','engineering','finance','operations'];
  const kwHits = techKeywords.filter(k => allText.includes(k)).length;
  if (kwHits >= 6)      score += 10;
  else if (kwHits >= 3) score += 5;
  else tips.push({ type:'info', text: `Only ${kwHits} common industry keywords detected. Match the language from the job posting.` });

  // ── 8. Format anti-patterns (bonus / deductions) ─────────
  // Check for special characters in names that confuse parsers
  if (D.name && /[^\w\s\-'.]/.test(D.name)) {
    score = Math.max(0, score - 5);
    tips.push({ type:'warn', text: 'Special characters in your name may confuse ATS parsers.' });
  }

  // Very long descriptions (over 600 chars) — hard to parse
  const longDesc = State.exp.filter(e => (e.desc || '').length > 600);
  if (longDesc.length > 0) {
    tips.push({ type:'info', text: 'Some job descriptions are very long. Keep each under 3–4 bullet points for best ATS parsing.' });
  }

  // Certs & projects as bonus signals
  if (State.certs.length >= 1) score = Math.min(MAX, score + 3);
  if (State.projs.length >= 1) score = Math.min(MAX, score + 2);

  score = Math.min(MAX, Math.max(0, score));

  // ── Positive tips if doing well ──────────────────────────
  if (score >= 85) tips.unshift({ type:'good', text: 'Excellent! Your CV is well-optimized for ATS systems.' });
  else if (score >= 60) tips.unshift({ type:'good', text: 'Good foundation. Address the warnings below to improve your score.' });
  else tips.unshift({ type:'error', text: 'Your CV needs attention before submitting to ATS-screened roles.' });

  // ── Render ───────────────────────────────────────────────
  const circumference = 213.6;
  const offset = circumference - (score / 100) * circumference;
  const arc = document.getElementById('ats-arc');
  const num = document.getElementById('ats-score-num');
  const sub = document.getElementById('ats-score-sub');
  const title = document.getElementById('ats-score-title');

  if (arc) {
    arc.style.strokeDashoffset = offset;
    arc.style.stroke = score >= 75 ? '#059669' : score >= 50 ? '#ea580c' : '#e94560';
  }
  if (num) num.textContent = score;
  if (title) title.textContent = `ATS Score: ${score}/100`;
  if (sub) sub.textContent = score >= 75 ? 'ATS-ready' : score >= 50 ? 'Needs improvement' : 'At risk of being filtered';

  const tipsEl = document.getElementById('ats-tips');
  if (!tipsEl) return;

  const icons = { good:'ti-circle-check', info:'ti-info-circle', warn:'ti-alert-triangle', error:'ti-alert-circle' };
  const colors= { good:'#059669',         info:'#0891b2',        warn:'#ea580c',           error:'#e94560' };

  tipsEl.innerHTML = tips.map(t => `
    <div class="ats-tip ats-tip-${t.type}">
      <i class="ti ${icons[t.type]}" style="color:${colors[t.type]};font-size:15px;flex-shrink:0;margin-top:1px"></i>
      <span>${t.text}</span>
    </div>
  `).join('');
}