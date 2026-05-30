// state.js — single source of truth + localStorage auto-save/restore

const STORAGE_KEY = 'cvbuilder_v1';

const State = {
  // Sections
  exp:    [],
  edu:    [],
  skills: [],
  langs:  [],
  certs:  [],
  projs:  [],

  // Style
  accent:   '#e94560',
  dark:     '#1a1a2e',
  template: 'classic',

  // Photo (base64 string or '')
  photo: '',
};

// Auto-incrementing ID — restored from storage to avoid collisions
let _nextId = 1;
function uid() { return _nextId++; }

// ── Serialise / restore ───────────────────────────────────

function saveToStorage() {
  try {
    const payload = {
      exp:      State.exp,
      edu:      State.edu,
      skills:   State.skills,
      langs:    State.langs,
      certs:    State.certs,
      projs:    State.projs,
      accent:   State.accent,
      dark:     State.dark,
      template: State.template,
      photo:    State.photo,
      _nextId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch(e) {
    // Storage full (photo too large) — save without photo
    try {
      const payload = {
        exp: State.exp, edu: State.edu, skills: State.skills,
        langs: State.langs, certs: State.certs, projs: State.projs,
        accent: State.accent, dark: State.dark, template: State.template,
        photo: '', _nextId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch(e2) { /* quota exceeded entirely */ }
    return false;
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const p = JSON.parse(raw);
    State.exp      = p.exp      || [];
    State.edu      = p.edu      || [];
    State.skills   = p.skills   || [];
    State.langs    = p.langs    || [];
    State.certs    = p.certs    || [];
    State.projs    = p.projs    || [];
    State.accent   = p.accent   || '#e94560';
    State.dark     = p.dark     || '#1a1a2e';
    State.template = p.template || 'classic';
    State.photo    = p.photo    || '';
    _nextId        = p._nextId  || 1;
    return true;
  } catch(e) {
    return false;
  }
}

// ── Basic-fields save (called from app.js input listener) ─
// Stores plain-field values alongside State so they survive reload.
// We piggyback on the same key — fields are saved in the DOM object.
function saveBasicFields() {
  const fields = ['f-name','f-title','f-summary','f-email','f-phone',
                  'f-location','f-website','f-li','f-gh'];
  const vals = {};
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) vals[id] = el.value;
  });
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    existing._fields = vals;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch(e) {}
}

function restoreBasicFields() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const p = JSON.parse(raw);
    if (!p._fields) return;
    Object.entries(p._fields).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });
  } catch(e) {}
}