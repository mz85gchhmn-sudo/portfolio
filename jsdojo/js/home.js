// =============================================
// HOME.JS — landing page interactions
// =============================================

document.addEventListener("DOMContentLoaded", () => {
  renderLessonCards();
  initTerminalTyper();
  initSideFloat();
  updateNavProgress();
  addRevealClasses();
});

// ---- LESSON CARDS on home ---- //
function renderLessonCards() {
  const grid = document.getElementById("lessons-grid");
  if (!grid || typeof LESSONS === "undefined") return;

  LESSONS.forEach(lesson => {
    const done = Progress.isCompleted(lesson.id);
    const soon = lesson.comingSoon === true;
    const card = document.createElement("a");

    card.href = soon ? "#" : `pages/lessons.html?id=${lesson.id}`;
    card.className = [
      "lesson-card",
      "reveal",
      done ? "completed" : "",
      soon ? "locked" : ""
    ].filter(Boolean).join(" ");

    card.innerHTML = `
      <div class="lesson-num">// lesson ${String(lesson.id).padStart(2, "0")}</div>
      <h3>${lesson.emoji} ${lesson.title}</h3>
      <p>${lesson.subtitle}</p>
      ${soon
        ? `<span class="lesson-tag" style="color:var(--neon-pink);border-color:var(--neon-pink)">🔒 coming soon</span>`
        : `<span class="lesson-tag">${lesson.tags[0]}</span>`
      }
    `;

    if (soon) {
      card.style.opacity = "0.5";
      card.style.cursor  = "default";
      card.style.pointerEvents = "none";
    }

    grid.appendChild(card);
  });
}

// ---- TERMINAL TYPER ---- //
function initTerminalTyper() {
  const el = document.getElementById("terminal-type");
  if (!el) return;

  const lines = [
    '> const lang = "JavaScript";',
    '> typeof lang',
    '"string"',
    '> true && "hello"',
    '"hello"',
    '> typeof null',
    '"object"  // 😅 famous bug',
    '> [1,2,3].map(x => x * 2)',
    '[2, 4, 6]',
    '> "5" - 3',
    '2',
    '> "5" + 3',
    '"53"  // coercion!',
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let content   = "";

  function type() {
    if (lineIndex >= lines.length) {
      setTimeout(() => {
        lineIndex = 0; charIndex = 0; content = "";
        el.textContent = "";
        type();
      }, 3000);
      return;
    }

    const currentLine = lines[lineIndex];

    if (charIndex < currentLine.length) {
      content += currentLine[charIndex];
      el.textContent = content + "█";
      charIndex++;
      setTimeout(type, currentLine.startsWith(">") ? 45 : 25);
    } else {
      content += "\n";
      el.textContent = content + "█";
      lineIndex++;
      charIndex = 0;
      setTimeout(type, currentLine.startsWith(">") ? 300 : 700);
    }
  }

  type();
}

// ---- SCROLL REVEAL CLASSES ---- //
function addRevealClasses() {
  document.querySelectorAll(".howto-card, .fact-card").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${i * 0.07}s`;
  });
  initScrollReveal();
}
