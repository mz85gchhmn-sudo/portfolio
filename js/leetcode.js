/* ============================================================
   leetcode.js — Fetch and render LeetCode stats
   ============================================================ */

const LEETCODE_USERNAME = 'Paansh_1';

const LEETCODE_QUERY = `
query getUserStats($username: String!) {
  matchedUser(username: $username) {
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
    profile {
      ranking
    }
  }
  userContestRanking(username: $username) {
    rating
    attendedContestsCount
    globalRanking
  }
}
`;

async function fetchLeetCodeStats() {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username: LEETCODE_USERNAME }
      })
    });

    if (!res.ok) throw new Error('Network error');
    const data = await res.json();

    if (!data.data || !data.data.matchedUser) {
      throw new Error('User not found');
    }

    const stats = data.data.matchedUser.submitStats.acSubmissionNum;
    const profile = data.data.matchedUser.profile;
    const contest = data.data.userContestRanking;

    const allSolved   = stats.find(s => s.difficulty === 'All')?.count    || 0;
    const easySolved  = stats.find(s => s.difficulty === 'Easy')?.count   || 0;
    const medSolved   = stats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardSolved  = stats.find(s => s.difficulty === 'Hard')?.count   || 0;

    return {
      totalSolved: allSolved,
      easySolved,
      medSolved,
      hardSolved,
      ranking: profile?.ranking || '—',
      contestRating: contest ? Math.round(contest.rating) : '—',
      contestsAttended: contest?.attendedContestsCount || 0
    };
  } catch (err) {
    console.warn('LeetCode API error:', err.message);
    return null;
  }
}

function renderLeetCodeCard(container, stats) {
  if (!stats) {
    container.innerHTML = `
      <div class="leetcode-header">
        <div class="leetcode-brand">
          <svg class="leetcode-logo" viewBox="0 0 24 24" fill="none">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" fill="#FFA116"/>
          </svg>
          LeetCode
        </div>
      </div>
      <p class="leetcode-loading">⚠️ Could not load stats — check username or try later.</p>
    `;
    return;
  }

  const total = stats.easySolved + stats.medSolved + stats.hardSolved || 1;
  const easyPct  = (stats.easySolved / total * 100).toFixed(1);
  const medPct   = (stats.medSolved  / total * 100).toFixed(1);
  const hardPct  = (stats.hardSolved / total * 100).toFixed(1);

  container.innerHTML = `
    <div class="leetcode-header">
      <div class="leetcode-brand">
        <svg class="leetcode-logo" viewBox="0 0 24 24" fill="none">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" fill="#FFA116"/>
        </svg>
        LeetCode
      </div>
      <div class="leetcode-rank">
        Rank #${stats.ranking.toLocaleString()}
        ${stats.contestRating !== '—' ? ` · Contest ${stats.contestRating}` : ''}
      </div>
    </div>

    <div class="leetcode-total">
      <div class="number" id="lc-count">0</div>
      <div class="label">Problems Solved</div>
    </div>

    <div class="leetcode-bar">
      <div class="bar-easy"  style="width:${easyPct}%"></div>
      <div class="bar-medium"style="width:${medPct}%"></div>
      <div class="bar-hard"  style="width:${hardPct}%"></div>
    </div>

    <div class="leetcode-breakdown">
      <div class="breakdown-item">
        <div class="breakdown-dot" style="background:var(--easy)"></div>
        <div class="breakdown-count">${stats.easySolved}</div>
        <div class="breakdown-label">Easy</div>
      </div>
      <div class="breakdown-item">
        <div class="breakdown-dot" style="background:var(--medium)"></div>
        <div class="breakdown-count">${stats.medSolved}</div>
        <div class="breakdown-label">Medium</div>
      </div>
      <div class="breakdown-item">
        <div class="breakdown-dot" style="background:var(--hard)"></div>
        <div class="breakdown-count">${stats.hardSolved}</div>
        <div class="breakdown-label">Hard</div>
      </div>
    </div>
  `;

  // Animate counter
  animateCount(document.getElementById('lc-count'), stats.totalSolved);
}

function animateCount(el, target) {
  if (!el) return;
  const duration = 1200;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

async function initLeetCode() {
  const container = document.getElementById('leetcode-card');
  if (!container) return;

  container.innerHTML = `<p class="leetcode-loading">Loading stats…</p>`;

  const stats = await fetchLeetCodeStats();
  renderLeetCodeCard(container, stats);
}

document.addEventListener('DOMContentLoaded', initLeetCode);
