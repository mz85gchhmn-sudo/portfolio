/* ============================================================
   projects.js — Project data, cards, modal
   ============================================================ */

const PROJECTS = [
  {
  id: 1,
  title: 'JSDojo',
  type: 'main',
  badge: 'Featured',
  badgeClass: 'badge-main',
  emoji: '⚡',
  description: 'An interactive JavaScript learning platform with live code playground, lesson-based curriculum, badge rewards, and progress tracking. Built from scratch.',
  fullDescription: `JSDojo is a full JavaScript learning platform I built from scratch — no frameworks, just vanilla JS, CSS custom properties, and localStorage.

It has 9 lessons covering memory, variables, types, immutability, type conversion, operators, functions, type checking, and output — each with a brief, deep-dive sections, a live code editor you can run in-browser, and a quiz that unlocks a badge.

Key features:
  → Live code playground (intercepts console.log, catches errors)
  → Badge + progress system via localStorage
  → Light / dark theme toggle
  → "Coming soon" lessons already wired up (Scope, Arrays, Objects, Async)
  → Roadmap page with animated progress bar
  → Cheatsheet page for quick reference

Tech: Vanilla JS · CSS custom properties · localStorage · IntersectionObserver API`,
  tags: ['Vanilla JS', 'CSS', 'localStorage', 'No frameworks'],
  image: null,
  link: 'https://mz85gchhmn-sudo.github.io/portfolio/jsdojo/'
},
  {
    id: 2,
    title: 'Demo Project One',
    type: 'demo',
    badge: 'Demo',
    badgeClass: 'badge-demo',
    emoji: '🔧',
    description: 'A demo project placeholder. Replace with your actual project — what you built, why it matters, and the tech behind it.',
    fullDescription: `Full details about Demo Project One. Describe the motivation, implementation, and outcome. Update this in projects.js with your real content.\n\nTech stack, links, screenshots — add them all here.`,
    tags: ['To be updated'],
    image: null,
    link: '#'
  },
  {
    id: 3,
    title: 'Demo Project Two',
    type: 'demo',
    badge: 'Demo',
    badgeClass: 'badge-demo',
    emoji: '💡',
    description: 'Another demo project slot. Fill this in with your second project — a side project, hackathon entry, or anything you are proud of.',
    fullDescription: `Full details about Demo Project Two. This is where you tell the story of what you built and why it matters.\n\nUpdate this in projects.js when you are ready to showcase a real project.`,
    tags: ['To be updated'],
    image: null,
    link: '#'
  }
];

/* -------- Render Cards -------- */
function renderProjects() {
  const scroll = document.getElementById('projects-scroll');
  if (!scroll) return;

  PROJECTS.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="card-image">
        ${project.image
          ? `<img src="${project.image}" alt="${project.title}">`
          : `<div class="card-image-placeholder"><span>${project.emoji}</span><small>Add image in projects.js</small></div>`
        }
        <span class="card-badge ${project.badgeClass}">${project.badge}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${project.title}</div>
        <div class="card-desc">${project.description}</div>
        <div class="card-tags">
          ${project.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;

    card.addEventListener('click', () => openModal(project));
    scroll.appendChild(card);
  });
}

/* -------- Modal -------- */
function openModal(project) {
  const backdrop = document.getElementById('modal-backdrop');
  const modal    = document.getElementById('modal');

  modal.innerHTML = `
    <div class="modal-image">
      ${project.image
        ? `<img src="${project.image}" alt="${project.title}">`
        : project.emoji
      }
    </div>
    <div class="modal-body">
      <div class="modal-top">
        <div class="modal-title">${project.title}</div>
        <button class="modal-close" id="modal-close-btn" aria-label="Close">✕</button>
      </div>
      <p class="modal-desc">${project.fullDescription.replace(/\n/g, '<br><br>')}</p>
      <div class="modal-tags">
        ${project.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
      </div>
      ${project.link !== '#'
        ? `<a class="modal-link" href="${project.link}" target="_blank" rel="noopener">
             View Project ↗
           </a>`
        : `<span class="modal-link" style="opacity:0.5;cursor:default">Link coming soon</span>`
      }
    </div>
  `;

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
}

function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

/* -------- Init -------- */
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();

  // Close modal on backdrop click
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  // Keyboard close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.addEventListener('click', () => history.back());
});
