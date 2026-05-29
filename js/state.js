// state.js — single source of truth for all CV data

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
};

// Auto-incrementing ID
let _nextId = 1;
function uid() { return _nextId++; }