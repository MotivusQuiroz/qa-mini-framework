/**
 * Stage 7 – Step 3
 * File: src/mock-ui/app.js
 * Objective: Fetch data and render a minimal, testable UI with data-testid hooks.
 */

(function init() {
  const root = document.getElementById('app');

  // ---- helpers -------------------------------------------------------------

  function clearRoot() {
    root.innerHTML = '';
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'dataset' && v && typeof v === 'object') {
        Object.entries(v).forEach(([dk, dv]) => (node.dataset[dk] = String(dv)));
      } else if (k === 'text') {
        node.textContent = String(v);
      } else {
        node.setAttribute(k, String(v));
      }
    });
    children.forEach((c) => node.appendChild(c));
    return node;
  }

  // ---- renderers -----------------------------------------------------------

  function renderLoading() {
    clearRoot();
    root.appendChild(
      el('div', { class: 'status', 'data-testid': 'loading', text: 'Loading…' })
    );
  }

  function renderError(message) {
    clearRoot();
    root.appendChild(
      el('div', {
        class: 'status',
        'data-testid': 'error',
        text: `Error: ${message}`,
      })
    );
  }

  function renderPosts(posts) {
    clearRoot();

    const heading = el('h2', { 'data-testid': 'posts-heading', text: 'Posts' });

    const table = el('table', { 'data-testid': 'posts-table' }, [
      (function buildThead() {
        const tr = el('tr');
        ['userId', 'id', 'title'].forEach((h) => {
          tr.appendChild(el('th', { 'data-testid': `col-${h}`, text: h }));
        });
        return el('thead', {}, [tr]);
      })(),
      (function buildTbody() {
        const tbody = el('tbody', { 'data-testid': 'posts-tbody' });
        posts.slice(0, 10).forEach((p, idx) => {
          const tr = el('tr', {
            'data-testid': 'post-row',
            dataset: { rowIndex: idx },
          });

          const cells = [
            ['userId', p.userId],
            ['id', p.id],
            ['title', p.title],
          ];

          cells.forEach(([name, val]) => {
            tr.appendChild(
              el('td', { 'data-testid': `cell-${name}` , text: val ?? '' })
            );
          });

          tbody.appendChild(tr);
        });
        return tbody;
      })(),
    ]);

    const wrapper = el('div', { class: 'table-wrapper', 'data-testid': 'table-wrapper' }, [table]);

    root.appendChild(heading);
    root.appendChild(wrapper);
  }

  // ---- flow ----------------------------------------------------------------

  (async function run() {
    try {
      renderLoading();

      // Load endpoints configuration from project root (served by dev server in Step 4)
      const cfgRes = await fetch('/config/endpoints.json', { cache: 'no-store' });
      if (!cfgRes.ok) throw new Error(`Failed to load endpoints.json (${cfgRes.status})`);
      const cfg = await cfgRes.json();

      const baseUrl = cfg.baseUrl;
      const listPath = cfg.endpoints?.posts?.list?.path;
      if (!baseUrl || !listPath) throw new Error('Invalid endpoints configuration');

      const res = await fetch(`${baseUrl}${listPath}`);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        renderPosts(data);
      } else {
        throw new Error('Unexpected response shape (expected an array)');
      }
    } catch (err) {
      renderError(err instanceof Error ? err.message : String(err));
    }
  })();
})();
