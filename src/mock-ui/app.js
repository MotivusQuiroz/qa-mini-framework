/**
 * Stage 7 – Step 2
 * File: src/mock-ui/app.js
 * Objective: Fetch data from the configured API and render it inside #app.
 * Notes:
 *  - Reads /config/endpoints.json from project root (served by the dev server).
 *  - Renders a minimal table with a small subset of fields.
 */

(async function init() {
  const root = document.getElementById('app');

  // Basic helpers (minimal UX for this step)
  function renderLoading() {
    root.textContent = 'Loading…';
  }

  function renderError(message) {
    root.innerHTML = '';
    const div = document.createElement('div');
    div.textContent = `Error: ${message}`;
    root.appendChild(div);
  }

  function renderPosts(posts) {
    root.innerHTML = '';

    const heading = document.createElement('h2');
    heading.textContent = 'Posts';
    root.appendChild(heading);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    ['userId', 'id', 'title'].forEach((h) => {
      const th = document.createElement('th');
      th.textContent = h;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    // Limit rows for a minimal view
    posts.slice(0, 10).forEach((p) => {
      const tr = document.createElement('tr');
      const tdUserId = document.createElement('td');
      const tdId = document.createElement('td');
      const tdTitle = document.createElement('td');

      tdUserId.textContent = String(p.userId ?? '');
      tdId.textContent = String(p.id ?? '');
      tdTitle.textContent = String(p.title ?? '');

      tr.appendChild(tdUserId);
      tr.appendChild(tdId);
      tr.appendChild(tdTitle);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    root.appendChild(table);
  }

  try {
    renderLoading();

    // Load endpoints configuration served from project root
    const cfgRes = await fetch('/config/endpoints.json', { cache: 'no-store' });
    if (!cfgRes.ok) throw new Error(`Failed to load endpoints.json (${cfgRes.status})`);
    const cfg = await cfgRes.json();

    const baseUrl = cfg.baseUrl;
    const listPath = cfg.endpoints?.posts?.list?.path;
    if (!baseUrl || !listPath) throw new Error('Invalid endpoints configuration');

    // Fetch posts
    const res = await fetch(`${baseUrl}${listPath}`);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();

    // Render
    if (Array.isArray(data)) {
      renderPosts(data);
    } else {
      throw new Error('Unexpected response shape (expected an array)');
    }
  } catch (err) {
    renderError(err instanceof Error ? err.message : String(err));
  }
})();
