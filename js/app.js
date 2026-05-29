// app.js — bootstrap: wire up events and kick off first render

document.addEventListener('DOMContentLoaded', () => {

  // ── Tab navigation ──────────────────────────────────────
  document.querySelectorAll('#tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#tabs .tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // ── "Add entry" buttons ─────────────────────────────────
  document.querySelectorAll('.badd').forEach(btn => {
    btn.addEventListener('click', () => addEntry(btn.dataset.type));
  });

  // ── Template switcher ───────────────────────────────────
  document.querySelectorAll('.tpl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tpl-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      State.template = btn.dataset.tpl;
      render();
    });
  });

  // ── Color dots ──────────────────────────────────────────
  document.querySelectorAll('.tdot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.tdot').forEach(d => d.classList.remove('sel'));
      dot.classList.add('sel');
      State.accent = dot.dataset.c;
      State.dark   = dot.dataset.d;
      render();
    });
  });

  // ── Basic field inputs (delegated to all inputs in .sec) ─
  document.querySelectorAll('.sec input, .sec textarea, .sec select').forEach(el => {
    el.addEventListener('input', () => render());
  });

  // ── Export button ───────────────────────────────────────
  document.getElementById('export-btn').addEventListener('click', exportCV);

  // ── Initial render ──────────────────────────────────────
  render();
});