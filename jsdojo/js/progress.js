// =============================================
// PROGRESS.JS — tracks completed lessons + badges
// Uses localStorage so progress persists
// =============================================

const Progress = (() => {
  const KEY = "jsdojo_progress";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { completed: [], badges: [] };
    } catch { return { completed: [], badges: [] }; }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function isCompleted(lessonId) {
    return load().completed.includes(lessonId);
  }

  function markComplete(lessonId) {
    const data = load();
    if (!data.completed.includes(lessonId)) {
      data.completed.push(lessonId);
      save(data);
    }
    return data;
  }

  function earnBadge(lessonId) {
    const data = load();
    if (!data.badges.includes(lessonId)) {
      data.badges.push(lessonId);
      save(data);
      return true; // newly earned
    }
    return false;
  }

  function getCount() {
    return load().completed.length;
  }

  function getTotal() {
    return typeof LESSONS !== "undefined" ? LESSONS.length : 8;
  }

  function reset() {
    save({ completed: [], badges: [] });
  }

  function getAll() {
    return load();
  }

  return { isCompleted, markComplete, earnBadge, getCount, getTotal, reset, getAll };
})();

// ---- BADGE POPUP ---- //
function showBadgePopup(badge) {
  // Remove any existing popup
  const existing = document.querySelector(".badge-popup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.className = "badge-popup";
  popup.innerHTML = `
    <div class="badge-icon">${badge.emoji}</div>
    <div class="badge-text">
      <h4>🎖 Congrats, Soldier!</h4>
      <p>Badge earned: <strong>${badge.label}</strong></p>
    </div>
  `;
  document.body.appendChild(popup);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => popup.classList.add("show"));
  });

  // Animate out after 4s
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 600);
  }, 4000);
}

// ---- THEME TOGGLE ---- //
function initTheme() {
  const saved = localStorage.getItem("jsdojo_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);

  const sw = document.getElementById("theme-switch");
  if (!sw) return;

  sw.checked = saved === "light";

  sw.addEventListener("change", () => {
    const next = sw.checked ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("jsdojo_theme", next);
  });
}

// ---- SCROLL REVEAL ---- //
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal, .lesson-section");
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); }
    }),
    { threshold: 0.12 }
  );
  els.forEach(el => observer.observe(el));
}

// ---- SIDE FLOAT ---- //
function initSideFloat() {
  const el = document.querySelector(".side-float");
  if (!el) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) el.classList.add("visible");
    else el.classList.remove("visible");
  });
}

// ---- NAV PROGRESS ---- //
function updateNavProgress() {
  const el = document.getElementById("nav-progress");
  if (!el) return;
  el.textContent = `${Progress.getCount()} / ${Progress.getTotal()} done`;
}

// Run on load
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initScrollReveal();
  initSideFloat();
  updateNavProgress();
});
