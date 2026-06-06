/* ============================================================
   theme.js — Dark/light theme toggle
   ============================================================ */

const THEME_KEY = 'portfolio-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const knob = document.querySelector('.theme-toggle-knob');
  if (knob) knob.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function createThemeToggle() {
  const btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Toggle theme');
  btn.innerHTML = '<div class="theme-toggle-knob">☀️</div>';
  btn.addEventListener('click', toggleTheme);
  document.body.appendChild(btn);
}

document.addEventListener('DOMContentLoaded', () => {
  createThemeToggle();
  initTheme();
});
