// render.js — calls the correct template and updates the preview

const TEMPLATES = {
  classic: tplClassic,
  sidebar: tplSidebar,
  minimal: tplMinimal,
  bold:    tplBold,
};

function render() {
  const data = getFormData();
  const fn   = TEMPLATES[State.template] || tplClassic;
  document.getElementById('cv-wrap').innerHTML = fn(data);
}