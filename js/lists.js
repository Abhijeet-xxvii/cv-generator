// lists.js — render dynamic entry lists in the editor panel

// ── Update just the header label in-place (no full re-render) ──
// Walks up from the input to the nearest .eblk, finds the .eblk-lbl span,
// and updates its text — so focus is never lost while typing.
function updateLabel(input, cls, fallback) {
  const blk = input.closest('.eblk');
  if (!blk) return;
  const lbl = blk.querySelector('.' + cls);
  if (lbl) lbl.textContent = input.value.trim() || fallback;
}

// ── Render all lists (call after any state mutation) ──────
function renderLists() {
  renderExpList();
  renderEduList();
  renderSkillList();
  renderLangList();
  renderCertList();
  renderProjList();
}

// ── Add entry ─────────────────────────────────────────────
function addEntry(type) {
  const id = uid();
  switch (type) {
    case 'exp':   State.exp.push({ id, role: '', company: '', start: '', end: '', desc: '' }); break;
    case 'edu':   State.edu.push({ id, degree: '', school: '', field: '', year: '' }); break;
    case 'skill': State.skills.push({ id, name: '', lv: 80 }); break;
    case 'lang':  State.langs.push({ id, lang: '', prof: 'Professional' }); break;
    case 'cert':  State.certs.push({ id, name: '', org: '' }); break;
    case 'proj':  State.projs.push({ id, name: '', desc: '', url: '' }); break;
  }
  renderLists();
  render();
}

// ── Remove entry ──────────────────────────────────────────
function removeEntry(type, id) {
  const filter = arr => arr.filter(e => e.id !== id);
  switch (type) {
    case 'exp':   State.exp    = filter(State.exp);    break;
    case 'edu':   State.edu    = filter(State.edu);    break;
    case 'skill': State.skills = filter(State.skills); break;
    case 'lang':  State.langs  = filter(State.langs);  break;
    case 'cert':  State.certs  = filter(State.certs);  break;
    case 'proj':  State.projs  = filter(State.projs);  break;
  }
  renderLists();
  render();
}

// ── List renderers ────────────────────────────────────────
// FIX: Header-label fields (role, degree, skill name, cert name, proj name,
// lang name) no longer call renderXxxList() on every keystroke.
// Instead they call updateLabel() which patches only the <span> in-place,
// preserving focus and cursor position across the whole typing session.

function renderExpList() {
  document.getElementById('exp-list').innerHTML = State.exp.map(e => `
    <div class="eblk">
      <div class="eblk-hd">
        <span class="eblk-lbl">${esc(e.role) || 'New position'}</span>
        <button class="bico" onclick="removeEntry('exp', ${e.id})" aria-label="Remove"><i class="ti ti-trash"></i></button>
      </div>
      <div class="r2">
        <div class="fl"><label>Role</label>
          <input value="${esc(e.role)}" placeholder="Designer"
            oninput="State.exp.find(x=>x.id===${e.id}).role=this.value; updateLabel(this,'eblk-lbl','New position'); render()">
        </div>
        <div class="fl"><label>Company</label>
          <input value="${esc(e.company)}" placeholder="Acme Inc."
            oninput="State.exp.find(x=>x.id===${e.id}).company=this.value; render()">
        </div>
      </div>
      <div class="r2">
        <div class="fl"><label>Start</label>
          <input value="${esc(e.start)}" placeholder="Jan 2021"
            oninput="State.exp.find(x=>x.id===${e.id}).start=this.value; render()">
        </div>
        <div class="fl"><label>End</label>
          <input value="${esc(e.end)}" placeholder="Present"
            oninput="State.exp.find(x=>x.id===${e.id}).end=this.value; render()">
        </div>
      </div>
      <div class="fl"><label>Description</label>
        <textarea oninput="State.exp.find(x=>x.id===${e.id}).desc=this.value; render()">${esc(e.desc)}</textarea>
      </div>
    </div>
  `).join('');
}

function renderEduList() {
  document.getElementById('edu-list').innerHTML = State.edu.map(e => `
    <div class="eblk">
      <div class="eblk-hd">
        <span class="eblk-lbl">${esc(e.degree) || 'New degree'}</span>
        <button class="bico" onclick="removeEntry('edu', ${e.id})" aria-label="Remove"><i class="ti ti-trash"></i></button>
      </div>
      <div class="r2">
        <div class="fl"><label>Degree</label>
          <input value="${esc(e.degree)}" placeholder="B.Sc Computer Science"
            oninput="State.edu.find(x=>x.id===${e.id}).degree=this.value; updateLabel(this,'eblk-lbl','New degree'); render()">
        </div>
        <div class="fl"><label>School</label>
          <input value="${esc(e.school)}" placeholder="MIT"
            oninput="State.edu.find(x=>x.id===${e.id}).school=this.value; render()">
        </div>
      </div>
      <div class="r2">
        <div class="fl"><label>Field</label>
          <input value="${esc(e.field)}" placeholder="Design"
            oninput="State.edu.find(x=>x.id===${e.id}).field=this.value; render()">
        </div>
        <div class="fl"><label>Year</label>
          <input value="${esc(e.year)}" placeholder="2018–2022"
            oninput="State.edu.find(x=>x.id===${e.id}).year=this.value; render()">
        </div>
      </div>
    </div>
  `).join('');
}

function renderSkillList() {
  document.getElementById('skill-list').innerHTML = State.skills.map(e => `
    <div class="eblk">
      <div class="eblk-hd">
        <span class="eblk-lbl">${esc(e.name) || 'Skill'}</span>
        <button class="bico" onclick="removeEntry('skill', ${e.id})" aria-label="Remove"><i class="ti ti-trash"></i></button>
      </div>
      <div class="r2">
        <div class="fl"><label>Skill</label>
          <input value="${esc(e.name)}" placeholder="Figma"
            oninput="State.skills.find(x=>x.id===${e.id}).name=this.value; updateLabel(this,'eblk-lbl','Skill'); render()">
        </div>
        <div class="fl"><label class="skill-lv-lbl" id="lv-lbl-${e.id}">Level (${e.lv}%)</label>
          <input type="range" min="10" max="100" step="10" value="${e.lv}"
            oninput="State.skills.find(x=>x.id===${e.id}).lv=+this.value; document.getElementById('lv-lbl-${e.id}').textContent='Level ('+this.value+'%)'; render()">
        </div>
      </div>
    </div>
  `).join('');
}

function renderLangList() {
  const levels = ['Native', 'Fluent', 'Professional', 'Intermediate', 'Beginner'];
  document.getElementById('lang-list').innerHTML = State.langs.map(e => `
    <div class="eblk">
      <div class="eblk-hd">
        <span class="eblk-lbl">${esc(e.lang) || 'Language'}</span>
        <button class="bico" onclick="removeEntry('lang', ${e.id})" aria-label="Remove"><i class="ti ti-trash"></i></button>
      </div>
      <div class="r2">
        <div class="fl"><label>Language</label>
          <input value="${esc(e.lang)}" placeholder="French"
            oninput="State.langs.find(x=>x.id===${e.id}).lang=this.value; updateLabel(this,'eblk-lbl','Language'); render()">
        </div>
        <div class="fl"><label>Level</label>
          <select onchange="State.langs.find(x=>x.id===${e.id}).prof=this.value; render()">
            ${levels.map(l => `<option ${e.prof === l ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCertList() {
  document.getElementById('cert-list').innerHTML = State.certs.map(e => `
    <div class="eblk">
      <div class="eblk-hd">
        <span class="eblk-lbl">${esc(e.name) || 'Certification'}</span>
        <button class="bico" onclick="removeEntry('cert', ${e.id})" aria-label="Remove"><i class="ti ti-trash"></i></button>
      </div>
      <div class="r2">
        <div class="fl"><label>Name</label>
          <input value="${esc(e.name)}" placeholder="AWS Solutions Architect"
            oninput="State.certs.find(x=>x.id===${e.id}).name=this.value; updateLabel(this,'eblk-lbl','Certification'); render()">
        </div>
        <div class="fl"><label>Issuer &amp; Year</label>
          <input value="${esc(e.org)}" placeholder="Amazon, 2023"
            oninput="State.certs.find(x=>x.id===${e.id}).org=this.value; render()">
        </div>
      </div>
    </div>
  `).join('');
}

function renderProjList() {
  document.getElementById('proj-list').innerHTML = State.projs.map(e => `
    <div class="eblk">
      <div class="eblk-hd">
        <span class="eblk-lbl">${esc(e.name) || 'Project'}</span>
        <button class="bico" onclick="removeEntry('proj', ${e.id})" aria-label="Remove"><i class="ti ti-trash"></i></button>
      </div>
      <div class="r2">
        <div class="fl"><label>Name</label>
          <input value="${esc(e.name)}" placeholder="Portfolio site"
            oninput="State.projs.find(x=>x.id===${e.id}).name=this.value; updateLabel(this,'eblk-lbl','Project'); render()">
        </div>
        <div class="fl"><label>URL</label>
          <input value="${esc(e.url)}" placeholder="github.com/..."
            oninput="State.projs.find(x=>x.id===${e.id}).url=this.value; render()">
        </div>
      </div>
      <div class="fl"><label>Description</label>
        <textarea oninput="State.projs.find(x=>x.id===${e.id}).desc=this.value; render()">${esc(e.desc)}</textarea>
      </div>
    </div>
  `).join('');
}