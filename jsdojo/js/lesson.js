// =============================================
// LESSON.JS — lesson viewer logic
// Reads ?id= from URL and renders the lesson
// =============================================

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id") ?? "0");

  renderSidebar(id);
  renderLesson(id);
  updateNavProgress();
});

// ---- SIDEBAR ---- //
function renderSidebar(activeId) {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar || typeof LESSONS === "undefined") return;

  LESSONS.forEach(lesson => {
    const done = Progress.isCompleted(lesson.id);
    const soon = lesson.comingSoon === true;
    const item = document.createElement("div");
    item.className = [
      "sidebar-item",
      lesson.id === activeId ? "active" : "",
      done ? "done" : "",
      soon ? "coming-soon" : ""
    ].filter(Boolean).join(" ");

    item.innerHTML = `
      <span class="sidebar-dot"></span>
      <span class="sidebar-label">${lesson.emoji} ${lesson.title}</span>
      ${soon
        ? `<span class="sidebar-soon-tag">soon</span>`
        : `<span class="sidebar-check">✓</span>`
      }
    `;

    if (!soon) {
      item.addEventListener("click", () => {
        window.location.search = `?id=${lesson.id}`;
      });
    }
    sidebar.appendChild(item);
  });
}

// ---- LESSON RENDERER ---- //
function renderLesson(id) {
  const lesson = (typeof LESSONS !== "undefined") && LESSONS.find(l => l.id === id);
  if (!lesson) return;

  const main = document.getElementById("lesson-main");
  if (!main) return;

  // ── COMING SOON ──────────────────────────────────
  if (lesson.comingSoon) {
    main.innerHTML = `
      <div class="coming-soon-screen">
        <div class="cs-emoji">${lesson.emoji}</div>
        <p class="lesson-eyebrow">// coming soon</p>
        <h1 class="lesson-title">${lesson.title}</h1>
        <p class="lesson-subtitle">${lesson.subtitle}</p>
        <div class="cs-card">
          <div class="cs-pulse"></div>
          <p>This lesson is being crafted. Check back soon — we ship fast.</p>
          <div class="cs-tags">
            ${lesson.tags.map(t => `<span class="cs-tag">${t}</span>`).join("")}
          </div>
        </div>
        <a class="btn-ghost" style="margin-top:2rem;display:inline-block;" href="?id=${Math.max(0, id - 1)}">
          ← Back to previous lesson
        </a>
      </div>
    `;
    return;
  }

  // ── NORMAL LESSON ─────────────────────────────────
  const done = Progress.isCompleted(id);

  main.innerHTML = `
    <p class="lesson-eyebrow">// lesson ${String(id).padStart(2, "0")} of ${LESSONS.filter(l => !l.comingSoon).length}</p>
    <h1 class="lesson-title">${lesson.emoji} ${lesson.title}</h1>
    <p class="lesson-subtitle">${lesson.subtitle}</p>

    <div class="lesson-brief">${lesson.brief}</div>

    ${lesson.sections.map((s, i) => `
      <div class="lesson-section" style="transition-delay:${i * 0.1}s">
        <h3>${s.heading}</h3>
        <p>${s.body}</p>
        ${s.code ? renderCodeBlock(s.code, "javascript") : ""}
      </div>
    `).join("")}

    ${renderPlayground(lesson.playgroundCode)}
    ${renderQuiz(lesson.quiz)}
    ${renderCompleteBar(lesson, done)}
  `;

  // Init playground
  const runBtn = document.getElementById("run-btn");
  const editor = document.getElementById("playground-editor");
  const output = document.getElementById("playground-output");

  if (runBtn && editor && output) {
    runBtn.addEventListener("click", () => runCode(editor.value, output));
  }

  // Init quiz
  initQuiz(lesson);

  // Scroll reveal for sections
  setTimeout(() => initScrollReveal(), 100);
}

// ---- CODE BLOCK ---- //
function renderCodeBlock(code, lang = "javascript") {
  return `
    <div class="code-block">
      <div class="code-block-bar">
        <span>${lang}</span>
        <button class="code-copy-btn" onclick="copyCode(this)">copy</button>
      </div>
      <pre><code>${escapeHtml(code)}</code></pre>
    </div>
  `;
}

// ---- PLAYGROUND ---- //
function renderPlayground(code) {
  return `
    <div class="playground">
      <div class="playground-header">
        <span class="playground-title">▶ live playground</span>
        <button class="playground-run" id="run-btn">Run ▶</button>
      </div>
      <textarea class="playground-editor" id="playground-editor" spellcheck="false">${escapeHtml(code)}</textarea>
      <div class="playground-output" id="playground-output">
        <span style="color:var(--text3); font-size:0.75rem;">// output appears here</span>
      </div>
    </div>
  `;
}

// ---- RUN CODE ---- //
function runCode(code, outputEl) {
  outputEl.innerHTML = "";
  const logs = [];

  const originalLog   = console.log;
  const originalWarn  = console.warn;
  const originalError = console.error;

  console.log   = (...args) => logs.push({ type: "log",  msg: args.map(safeStr).join(" ") });
  console.warn  = (...args) => logs.push({ type: "warn", msg: args.map(safeStr).join(" ") });
  console.error = (...args) => logs.push({ type: "err",  msg: args.map(safeStr).join(" ") });

  try {
    // eslint-disable-next-line no-new-func
    new Function(code)();
  } catch (e) {
    logs.push({ type: "err", msg: e.message });
  }

  console.log   = originalLog;
  console.warn  = originalWarn;
  console.error = originalError;

  if (logs.length === 0) {
    outputEl.innerHTML = `<span style="color:var(--text3)">// no output</span>`;
    return;
  }

  logs.forEach(log => {
    const div = document.createElement("div");
    div.className = log.type === "err" ? "err-line" : "out-line";
    div.textContent = (log.type === "err" ? "❌ " : "→ ") + log.msg;
    outputEl.appendChild(div);
  });
}

function safeStr(v) {
  if (v === null)      return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "object") {
    try { return JSON.stringify(v); }
    catch { return String(v); }
  }
  return String(v);
}

// ---- QUIZ ---- //
function renderQuiz(quiz) {
  return `
    <div class="quiz-section">
      <div class="quiz-header">// quick quiz</div>
      <p class="quiz-question">${quiz.question}</p>
      <div class="quiz-options" id="quiz-options">
        ${quiz.options.map((opt, i) => `
          <div class="quiz-opt" data-index="${i}" data-correct="${opt.correct}">
            <span class="opt-letter">${String.fromCharCode(65 + i)}.</span>
            <span>${opt.text}</span>
          </div>
        `).join("")}
      </div>
      <div class="quiz-result" id="quiz-result"></div>
    </div>
  `;
}

function initQuiz(lesson) {
  const opts       = document.querySelectorAll(".quiz-opt");
  const result     = document.getElementById("quiz-result");
  const completeBtn = document.getElementById("complete-btn");

  opts.forEach(opt => {
    opt.addEventListener("click", () => {
      if (opt.closest(".quiz-options").dataset.answered) return;
      opt.closest(".quiz-options").dataset.answered = "1";

      const isCorrect = opt.dataset.correct === "true";
      opts.forEach(o => {
        if (o.dataset.correct === "true") o.classList.add("correct");
        else if (o === opt)              o.classList.add("wrong");
      });

      result.style.display = "block";
      if (isCorrect) {
        result.textContent = "✅ Correct! You got it, soldier.";
        result.style.color = "var(--accent)";
      } else {
        result.textContent = "❌ Not quite — the correct answer is highlighted in green.";
        result.style.color = "#ff5f57";
      }
      if (completeBtn) completeBtn.disabled = false;
    });
  });
}

// ---- COMPLETE BAR ---- //
function renderCompleteBar(lesson, done) {
  // Find the next non-comingSoon lesson
  const nextLesson = LESSONS.find(l => l.id === lesson.id + 1 && !l.comingSoon);
  // Check if there are any coming-soon lessons after this
  const hasComingSoon = LESSONS.some(l => l.id > lesson.id && l.comingSoon);

  const isLastPlayable = !nextLesson;

  return `
    <div class="complete-bar">
      <button class="btn-complete" id="complete-btn" ${done ? "" : "disabled"}>
        ${done ? "✓ Completed" : "Mark as Complete"}
      </button>
      ${nextLesson
        ? `<button class="btn-next-lesson" id="next-btn">
             Next: ${nextLesson.emoji} ${nextLesson.title} →
           </button>`
        : isLastPlayable && hasComingSoon
          ? `<div class="coming-soon-note">
               <span class="cs-dot-blink"></span>
               Further lessons updating soon — stay sharp 🧠
             </div>`
          : `<span style="color:var(--accent); font-family:'JetBrains Mono',monospace; font-size:0.85rem;">🏆 You've finished all lessons!</span>`
      }
    </div>
  `;
}

// Event delegation for complete / next buttons
document.addEventListener("click", (e) => {
  if (e.target.id === "complete-btn") {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id") ?? "0");
    const lesson = LESSONS.find(l => l.id === id);

    Progress.markComplete(id);
    e.target.textContent = "✓ Completed";
    e.target.style.background = "var(--accent)";
    updateNavProgress();

    const isNew = Progress.earnBadge(id);
    if (isNew && lesson) showBadgePopup(lesson.badge);

    document.querySelectorAll(".sidebar-item").forEach(item => {
      const label = item.querySelector(".sidebar-label");
      if (label && label.textContent.includes(lesson.title)) {
        item.classList.add("done");
      }
    });
  }

  if (e.target.id === "next-btn") {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id") ?? "0");
    window.location.search = `?id=${id + 1}`;
  }
});

// ---- UTILS ---- //
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function copyCode(btn) {
  const code = btn.closest(".code-block").querySelector("code").textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = "copied!";
    setTimeout(() => (btn.textContent = "copy"), 2000);
  });
}
