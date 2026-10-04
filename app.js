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
    { title: 'Automation playground', description: 'Run a sample workflow and explore alternate paths.', href: 'index.html#playground', keywords: 'interactive simulation demo flow' },
    { title: 'Build a project brief', description: 'Choose your challenges and prepare a conversation starter.', href: 'index.html#solution-builder', keywords: 'consulting plan project quote help' },
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

(() => {
  'use strict';
  const model = globalThis.GlitchLabModel;
  if (!model) return;
  const byId = id => document.getElementById(id);
  document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => {
    byId(button.dataset.scroll)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  if (byId('run-flow')) {
    let scenario = 'onboarding';
    let current = -1;
    let timer = null;
    const nodes = [...document.querySelectorAll('[data-step]')];
    const run = byId('run-flow');
    const condition = byId('scenario-condition');
    function stop() { clearInterval(timer); timer = null; }
    function render() {
      const steps = model.workflow(scenario, condition.checked);
      const running = timer !== null;
      nodes.forEach((node, i) => {
        node.classList.toggle('complete', i < current || current === 3);
        node.classList.toggle('active', i === current);
        node.setAttribute('aria-pressed', String(i === current));
        node.setAttribute('aria-label', `Step ${i + 1}: ${steps[i][0]}`);
      });
      document.querySelectorAll('.flow-connector').forEach((line, i) => line.classList.toggle('complete', i < current));
      byId('branch-title').textContent = current >= 2 ? steps[2][0] : 'Choose a path';
      byId('branch-description').textContent = current >= 2 ? (condition.checked ? 'Condition met' : 'Alternate path') : 'The right next step';
      byId('flow-counter').textContent = `${current + 1} / 4 steps`;
      byId('inspector-label').textContent = current < 0 ? 'READY WHEN YOU ARE' : `STEP ${current + 1} / ${current === 3 ? 'OUTCOME' : 'INSPECT THE FLOW'}`;
      byId('inspector-title').textContent = current < 0 ? 'One event. A useful chain reaction.' : steps[current][0];
      byId('inspector-description').textContent = current < 0 ? 'Run the workflow, or select a step to inspect it.' : steps[current][1];
      byId('sample-record-status').textContent = current < 0 ? 'Ready to evaluate' : (current === 3 ? (condition.checked ? 'Processed · sample only' : 'Alternate path · sample only') : 'Evaluating sample');
      byId('flow-status').textContent = running ? 'Running sample…' : current === 3 ? 'Sample complete' : current >= 0 ? 'Paused / inspect any step' : 'Ready';
      run.textContent = running ? 'Pause workflow Ⅱ' : current === 3 ? 'Run again ↻' : current < 0 ? 'Run workflow ▶' : 'Continue workflow ▶';
    }
    function reset() { stop(); current = -1; render(); }
    function selectScenario(key) {
      reset(); scenario = key;
      const s = model.scenarios[key];
      byId('scenario-title').textContent = s.title;
      byId('scenario-description').textContent = s.description;
      byId('condition-label').textContent = s.condition;
      byId('sample-record-name').textContent = s.record;
      byId('flow-takeaway').textContent = s.takeaway;
      document.querySelectorAll('[data-scenario]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === key)));
      render();
    }
    document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => selectScenario(button.dataset.scenario)));
    nodes.forEach(node => node.addEventListener('click', () => { stop(); current = Number(node.dataset.step); render(); }));
    condition.addEventListener('change', reset);
    byId('reset-flow').addEventListener('click', reset);
    run.addEventListener('click', () => {
      if (timer !== null) { stop(); render(); return; }
      if (current === 3) current = -1;
      current += 1;
      if (current < 3) timer = setInterval(() => {
        current += 1;
        if (current >= 3) stop();
        render();
      }, 1450);
      render();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && timer !== null) { stop(); render(); } });
    render();
  }
  if (byId('project-brief')) {
    const selected = new Set(['automation']);
    let timing = 'ready';
    const email = byId('email-brief');
    function renderBrief() {
      const list = byId('brief-recommendations');
      list.replaceChildren();
      [...selected].forEach(key => {
        const item = document.createElement('div');
        item.className = 'brief-recommendation';
        const title = document.createElement('strong'); title.textContent = model.challenges[key].title;
        const detail = document.createElement('p'); detail.textContent = model.challenges[key].detail;
        item.append(title, detail); list.append(item);
      });
      if (!selected.size) {
        const message = document.createElement('p'); message.textContent = 'Pick at least one challenge to build your brief.'; list.append(message);
      }
      const text = model.brief([...selected], timing);
      byId('project-brief').value = text;
      byId('download-brief').disabled = !selected.size;
      email.setAttribute('aria-disabled', String(!selected.size));
      if (selected.size) email.href = 'mailto:doc@theglitchdoctor.com?subject=' + encodeURIComponent('Let’s improve our Salesforce and systems') + '&body=' + encodeURIComponent(text);
      else email.removeAttribute('href');
      document.querySelectorAll('[data-challenge]').forEach(button => {
        const on = selected.has(button.dataset.challenge);
        button.setAttribute('aria-pressed', String(on));
        button.querySelector('.choice-check').textContent = on ? '✓' : '+';
      });
      document.querySelectorAll('[data-timing]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.timing === timing)));
    }
    document.querySelectorAll('[data-challenge]').forEach(button => button.addEventListener('click', () => {
      const key = button.dataset.challenge;
      selected.has(key) ? selected.delete(key) : selected.add(key);
      renderBrief();
    }));
    document.querySelectorAll('[data-timing]').forEach(button => button.addEventListener('click', () => { timing = button.dataset.timing; renderBrief(); }));
    byId('download-brief').addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([byId('project-brief').value], { type: 'text/plain;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = 'My_Glitch_Doctor_Project_Brief.txt';
      document.body.append(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    renderBrief();
  }
  if (byId('studio-brand')) {
    const paper = document.querySelector('.paper');
    const brand = byId('studio-brand');
    const advisor = byId('studio-advisor');
    const note = byId('studio-note');
    const expand = byId('expand-studio');
    function updateDocument() {
      byId('paper-firm').textContent = brand.value.trim().toUpperCase() || 'YOUR FIRM';
      byId('paper-advisor').textContent = advisor.value.trim() || 'Your advisor';
      byId('paper-note-text').textContent = note.value;
      byId('document-status').textContent = 'Preview updated · sample only';
    }
    [brand, advisor, note].forEach(input => input.addEventListener('input', updateDocument));
    const accents = [...document.querySelectorAll('[data-accent]')];
    function setAccent(color) {
      paper.style.setProperty('--document-accent', color);
      accents.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.accent === color)));
    }
    accents.forEach(button => button.addEventListener('click', () => { setAccent(button.dataset.accent); byId('document-status').textContent = 'Accent updated · sample only'; }));
    function setExpanded(on) {
      document.body.classList.toggle('studio-is-expanded', on);
      byId('document-studio').classList.toggle('expanded', on);
      expand.setAttribute('aria-expanded', String(on));
      expand.textContent = on ? 'Exit workspace ×' : 'Expand workspace ⛶';
      if (on) {
        byId('document-studio').setAttribute('role', 'dialog');
        byId('document-studio').setAttribute('aria-modal', 'true');
        byId('document-studio').setAttribute('aria-label', 'Expanded document workspace');
        [...document.body.children].forEach(element => {
          if (element.tagName !== 'MAIN' && !['SCRIPT','STYLE'].includes(element.tagName)) element.inert = true;
        });
        [...byId('main').children].forEach(element => { if (element.id !== 'preview') element.inert = true; });
        document.querySelector('#preview > .section-heading').inert = true;
      } else {
        byId('document-studio').removeAttribute('role');
        byId('document-studio').removeAttribute('aria-modal');
        byId('document-studio').removeAttribute('aria-label');
        document.querySelectorAll('[inert]').forEach(element => { element.inert = false; });
      }
      expand.focus();
    }
    expand.addEventListener('click', () => setExpanded(expand.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', event => {
      if (expand.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') { event.preventDefault(); setExpanded(false); }
      if (event.key === 'Tab') {
        const focusable = [...byId('document-studio').querySelectorAll('button,input,select,textarea,a[href]')].filter(el => !el.disabled && !el.hidden);
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    byId('reset-document').addEventListener('click', () => {
      brand.value = 'Evergreen'; advisor.value = 'Jamie Parker'; note.value = 'Let’s make sure your information is up to date before our next conversation.';
      byId('template-select').value = 'summary';
      byId('template-select').dispatchEvent(new Event('change'));
      byId('include-note').checked = true;
      byId('include-note').dispatchEvent(new Event('change'));
      setAccent('#176866'); updateDocument();
      byId('document-status').textContent = 'Sample reset';
    });
  }
})();
