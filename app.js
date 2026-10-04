(() => {
  'use strict';
  const body = document.body;
  const themeButton = document.getElementById('theme-toggle');
  const applyTheme = dark => {
    body.classList.toggle('dark', dark);
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  try { applyTheme(localStorage.getItem('glitch-theme') === 'dark' || (!localStorage.getItem('glitch-theme') && localStorage.getItem('darkMode') === 'enabled')); } catch (_) { applyTheme(false); }
  themeButton.addEventListener('click', () => {
    const dark = !body.classList.contains('dark');
    applyTheme(dark);
    try { localStorage.setItem('glitch-theme', dark ? 'dark' : 'light'); } catch (_) { /* The theme still works when storage is unavailable. */ }
  });
  let opener = null;
  const openDialog = (id, trigger) => {
    const dialog = document.getElementById(id);
    if (!dialog || dialog.open) return;
    opener = trigger;
    dialog.showModal();
    if (id === 'search-dialog') document.getElementById('site-search').focus();
  };
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openDialog(button.dataset.open, button)));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { if (opener && opener.isConnected) opener.focus(); });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));
  });
  const directory = [
    { title: 'Salesforce administration', description: 'Users, permissions, data cleanup, and Financial Services Cloud.', href: 'index.html#services', keywords: 'admin support security configuration' },
    { title: 'Automation & custom development', description: 'Flow, Apex, and Lightning Web Components.', href: 'index.html#services', keywords: 'automate code process repetitive workflow' },
    { title: 'Infrastructure & email', description: 'Microsoft 365, Windows Server, and email delivery.', href: 'index.html#services', keywords: 'technical systems infrastructure troubleshooting' },
    { title: 'Solutions from real-world work', description: 'Campaign views, beneficiary summaries, and action plans.', href: 'index.html#work', keywords: 'reporting household marketing dashboards' },
    { title: 'Top Secret Project', description: 'A Salesforce document project. Name under wraps.', href: 'top-secret.html', keywords: 'documents templates designer print product secret merge' },
    { title: 'About John', description: 'The person behind The Glitch Doctor.', href: 'index.html#about', keywords: 'experience background contact' }
  ];
  const search = document.getElementById('site-search');
  const results = document.getElementById('search-results');
  function renderSearch() {
    const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matches = directory.filter(item => words.every(word => `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(word)));
    results.replaceChildren();
    for (const item of matches) {
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.title;
      const detail = document.createElement('small');
      detail.textContent = item.description;
      link.append(detail);
      link.addEventListener('click', () => document.getElementById('search-dialog').close());
      results.append(link);
    }
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No matches. Try “automation”, “documents”, or “email”.';
      results.append(empty);
    }
  }
  search.addEventListener('input', renderSearch);
  renderSearch();
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !document.querySelector('dialog[open]') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
      event.preventDefault();
      openDialog('search-dialog', document.querySelector('.search-trigger'));
    }
  });
  const template = document.getElementById('template-select');
  if (template) {
    template.addEventListener('change', () => {
      const meeting = template.value === 'meeting';
      document.getElementById('document-title').textContent = meeting ? 'Meeting Confirmation' : 'Household Summary';
      document.getElementById('document-intro').textContent = meeting ? 'A little preparation for a productive conversation.' : 'A clear view of the details that matter.';
      document.getElementById('summary-content').hidden = meeting;
      document.getElementById('meeting-content').hidden = !meeting;
    });
    document.getElementById('include-note').addEventListener('change', event => {
      document.getElementById('advisor-note').hidden = !event.target.checked;
    });
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();
