/* ============================================================
   dock.js — macOS-style dock with magnification + flyouts
   ============================================================ */

const DOCK_CONFIG = {
  items: [
    {
      id: 'projects',
      label: 'Projects',
      icon: '🚀',
      color: 'icon-projects',
      action: 'navigate',
      target: (function() {
        return window.location.pathname.includes('/pages/') ? 'projects.html' : 'pages/projects.html';
      })()
    },
    {
      id: 'education',
      label: 'Education',
      icon: '🎓',
      color: 'icon-education',
      action: 'flyout',
      tiles: [
        { icon: '🏫', label: 'B.Tech\n2nd Year', action: null },
        { icon: '📘', label: 'To be\nupdated', action: null }
      ]
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: '✉️',
      color: 'icon-contact',
      action: 'flyout',
      tiles: [
        { icon: '🐦', label: 'Twitter / X', action: 'https://x.com/DemoAccounqjci' },
        { icon: '💼', label: 'LinkedIn', action: null, tag: 'soon' },
        { icon: '🐙', label: 'GitHub',   action: null, tag: 'soon' },
        { icon: '📧', label: 'Email',    action: null, tag: 'soon' },
        { icon: '📱', label: 'Phone',    action: null, tag: 'soon' }
      ]
    }
  ]
};

let activeFlyout = null;

/* -------- Build Dock -------- */
function buildDock() {
  // Main dock el
  const dockEl = document.createElement('div');
  dockEl.className = 'dock-wrapper';
  dockEl.innerHTML = `<div class="dock" id="main-dock"></div>`;
  document.body.appendChild(dockEl);

  const dock = document.getElementById('main-dock');

  DOCK_CONFIG.items.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'dock-item';
    itemEl.dataset.index = index;
    itemEl.innerHTML = `
      <span class="dock-label">${item.label}</span>
      <div class="dock-icon ${item.color}">${item.icon}</div>
      <div class="dock-dot"></div>
    `;

    // Hover magnification
    itemEl.addEventListener('mouseenter', () => applyMagnification(index));
    itemEl.addEventListener('mouseleave', () => clearMagnification());

    // Click
    itemEl.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDockClick(item, itemEl);
    });

    dock.appendChild(itemEl);
  });

  // Flyout backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'flyout-backdrop';
  backdrop.id = 'flyout-backdrop';
  backdrop.addEventListener('click', closeAllFlyouts);
  document.body.appendChild(backdrop);

  // Scroll listener — expand dock
  initScrollExpand();
}

/* -------- Magnification -------- */
function applyMagnification(hoveredIndex) {
  const items = document.querySelectorAll('.dock-item');
  items.forEach((item, i) => {
    item.classList.remove('hovered', 'neighbor-near', 'neighbor-far');
    const dist = Math.abs(i - hoveredIndex);
    if (dist === 0) item.classList.add('hovered');
    else if (dist === 1) item.classList.add('neighbor-near');
    else if (dist === 2) item.classList.add('neighbor-far');
  });
}

function clearMagnification() {
  document.querySelectorAll('.dock-item').forEach(item => {
    item.classList.remove('hovered', 'neighbor-near', 'neighbor-far');
  });
}

/* -------- Click handler -------- */
function handleDockClick(item, itemEl) {
  if (item.action === 'navigate') {
    // Don't navigate if already on this page
    if (window.__currentPage === item.id) return;
    window.location.href = item.target;
    return;
  }

  if (item.action === 'flyout') {
    if (activeFlyout === item.id) {
      closeAllFlyouts();
      return;
    }
    closeAllFlyouts();
    openFlyout(item, itemEl);
  }
}

/* -------- Open Flyout -------- */
function openFlyout(item, anchorEl) {
  activeFlyout = item.id;

  // Remove old flyout
  document.querySelectorAll('.flyout').forEach(f => f.remove());

  const flyout = document.createElement('div');
  flyout.className = 'flyout';
  flyout.id = 'active-flyout';

  item.tiles.forEach((tile, i) => {
    const tileEl = document.createElement('div');
    tileEl.className = 'flyout-tile';
    tileEl.style.animationDelay = `${i * 0.05}s`;

    const labelText = tile.tag
      ? `${tile.label.replace(/\n/g, '<br>')}<br><span style="font-size:8px;color:var(--text-muted)">(${tile.tag})</span>`
      : tile.label.replace(/\n/g, '<br>');

    tileEl.innerHTML = `
      <div class="flyout-tile-icon">${tile.icon}</div>
      <div class="flyout-tile-label">${labelText}</div>
    `;

    if (tile.action) {
      tileEl.style.cursor = 'pointer';
      tileEl.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(tile.action, '_blank');
      });
    } else {
      tileEl.style.opacity = '0.6';
      tileEl.title = 'Coming soon';
    }

    flyout.appendChild(tileEl);
  });

  document.body.appendChild(flyout);

  // Show backdrop
  const backdrop = document.getElementById('flyout-backdrop');
  if (backdrop) backdrop.classList.add('visible');

  // Animate in
  requestAnimationFrame(() => flyout.classList.add('visible'));
}

/* -------- Close Flyouts -------- */
function closeAllFlyouts() {
  activeFlyout = null;
  const flyout = document.getElementById('active-flyout');
  if (flyout) {
    flyout.classList.remove('visible');
    setTimeout(() => flyout.remove(), 300);
  }
  const backdrop = document.getElementById('flyout-backdrop');
  if (backdrop) backdrop.classList.remove('visible');
}

/* -------- Scroll expand -------- */
function initScrollExpand() {
  const dock = document.getElementById('main-dock');
  if (!dock) return;

  let scrolled = false;
  window.addEventListener('scroll', () => {
    const shouldExpand = window.scrollY > 80;
    if (shouldExpand !== scrolled) {
      scrolled = shouldExpand;
      dock.classList.toggle('expanded', shouldExpand);
    }
  }, { passive: true });
}

/* -------- Init -------- */
document.addEventListener('DOMContentLoaded', buildDock);
