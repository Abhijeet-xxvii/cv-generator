// app.js — bootstrap: wire up all events, restore saved state, kick off render

// Debounce helper — waits ms after last call before firing fn
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Save-status indicator ─────────────────────────────────
let _saveTimer;
function showSaveStatus(msg, color) {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = color || 'var(--accent)';
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    el.textContent = '4 templates · live preview · export ready';
    el.style.color = '';
  }, 2200);
}

// Debounced full save (State + fields)
const debouncedSave = debounce(() => {
  saveBasicFields();
  const ok = saveToStorage();
  showSaveStatus(ok ? '✓ Saved' : '✓ Saved (photo excluded — storage full)', ok ? '' : '#ea580c');
}, 800);

document.addEventListener('DOMContentLoaded', () => {

  // ── Restore saved state ────────────────────────────────
  const hadSave = loadFromStorage();

  // ── Tab navigation ─────────────────────────────────────
  document.querySelectorAll('#tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#tabs .tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      if (tab.dataset.tab === 'ats') runATS();
    });
  });

  // ── "Add entry" buttons ────────────────────────────────
  document.querySelectorAll('.badd[data-type]').forEach(btn => {
    btn.addEventListener('click', () => addEntry(btn.dataset.type));
  });

  // ── Template switcher ──────────────────────────────────
  document.querySelectorAll('.tpl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tpl-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      State.template = btn.dataset.tpl;
      render();
      debouncedSave();
    });
  });

  // ── Color dots ─────────────────────────────────────────
  document.querySelectorAll('.tdot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.tdot').forEach(d => d.classList.remove('sel'));
      dot.classList.add('sel');
      State.accent = dot.dataset.c;
      State.dark   = dot.dataset.d;
      render();
      debouncedSave();
    });
  });

  // ── Basic field inputs ─────────────────────────────────
  document.querySelectorAll('#tab-basics input, #tab-basics textarea').forEach(el => {
    el.addEventListener('input', () => { render(); debouncedSave(); });
  });

  // ── Photo upload ───────────────────────────────────────
  const photoInput  = document.getElementById('photo-input');
  const photoRemove = document.getElementById('photo-remove-btn');
  const photoPreview= document.getElementById('photo-preview');

  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      State.photo = e.target.result;
      updatePhotoUI();
      render();
      debouncedSave();
    };
    reader.readAsDataURL(file);
  });

  photoRemove.addEventListener('click', () => {
    State.photo = '';
    photoInput.value = '';
    updatePhotoUI();
    render();
    debouncedSave();
  });

  function updatePhotoUI() {
    if (State.photo) {
      photoPreview.innerHTML = `<img src="${State.photo}" alt="Profile photo" />`;
      photoRemove.style.display = 'inline-flex';
    } else {
      photoPreview.innerHTML = `<i class="ti ti-user" style="font-size:28px;color:var(--muted)"></i>`;
      photoRemove.style.display = 'none';
    }
  }

  // ── Export dropdown ────────────────────────────────────
  const exportBtn  = document.getElementById('export-btn');
  const exportMenu = document.getElementById('export-menu');
  const exportWrap = document.getElementById('export-wrap');

  exportBtn.addEventListener('click', e => {
    e.stopPropagation();
    exportMenu.classList.toggle('open');
  });
  document.addEventListener('click', () => exportMenu.classList.remove('open'));

  document.querySelectorAll('.export-opt').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      exportMenu.classList.remove('open');
      const fmt = btn.dataset.fmt;
      if (fmt === 'html')  exportHTML();
      if (fmt === 'pdf')   exportPDF();
      if (fmt === 'docx')  exportDOCX();
    });
  });

  // ── ATS refresh button ─────────────────────────────────
  document.getElementById('ats-refresh-btn').addEventListener('click', runATS);

  // ── Mobile UI ──────────────────────────────────────────
  const panel       = document.getElementById('panel');
  const preview     = document.getElementById('preview');
  const mobMenuBtn  = document.getElementById('mob-menu-btn');
  const mobCloseBtn = document.getElementById('mob-close-btn');
  const mobPreviewBtn= document.getElementById('mob-preview-btn');
  const mobBackBtn  = document.getElementById('mob-back-btn');
  const appEl       = document.getElementById('app');

  function setMobileView(view) {
    // view: 'editor' | 'preview'
    appEl.dataset.mview = view;
  }

  mobMenuBtn.addEventListener('click',    () => setMobileView('editor'));
  mobCloseBtn.addEventListener('click',   () => setMobileView('preview'));
  mobPreviewBtn.addEventListener('click', () => setMobileView('preview'));
  mobBackBtn.addEventListener('click',    () => setMobileView('editor'));

  // Default mobile view
  setMobileView('editor');

  // ── Restore saved template button active state ─────────
  if (hadSave) {
    document.querySelectorAll('.tpl-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tpl === State.template);
    });
    document.querySelectorAll('.tdot').forEach(d => {
      d.classList.toggle('sel', d.dataset.c === State.accent);
    });
    renderLists();
    restoreBasicFields();
    updatePhotoUI();
    showSaveStatus('↩ Session restored', '#059669');
  }

  // ── Initial render ─────────────────────────────────────
  render();
});