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
    { title: 'Start a service request', description: 'Describe your issue and prepare a development brief for John.', href: 'index.html#ticket-intake', keywords: 'ticket intake support project issue help request' },
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
  const byId = id => document.getElementById(id);
  document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => byId(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })));
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

(() => {
  'use strict';
  const form = document.getElementById('intake-form');
  if (!form || !globalThis.GlitchIntake) return;
  const panels = [...form.querySelectorAll('[data-intake-panel]')];
  const buttons = [...document.querySelectorAll('[data-intake-step]')];
  const next = document.getElementById('intake-next');
  const back = document.getElementById('intake-back');
  const review = document.getElementById('request-preview');
  const email = document.getElementById('email-request');
  const status = document.getElementById('request-action-status');
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
  const bytes = new Uint8Array(4);
  if (globalThis.crypto?.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i=0;i<bytes.length;i++) bytes[i]=Math.floor(Math.random()*256);
  const reference = `GD-${stamp}-${Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('').toUpperCase()}`;
  let current = 0, furthest = 0;
  const tips = [
    ['You explain the problem. I’ll help work out the solution.', 'Focus on what you need to accomplish. You don’t need to know whether it takes a setting, an automation, or custom development.'],
    ['“It should do this, but it does that.”', 'That comparison is useful. An exact error message or a short sequence of steps can also save a lot of back-and-forth.'],
    ['Impact helps define priority.', 'Tell me who is affected and whether work can continue. A small issue for a whole team can be worth solving before a bigger-looking one.'],
    ['A useful brief. A better first conversation.', 'Your answers are organized into a development intake, including proposed success criteria and questions to resolve before the work starts.']
  ];
  function data() { return Object.fromEntries(new FormData(form).entries()); }
  function updateReview() {
    const values = data();
    review.value = globalThis.GlitchIntake.format(values, reference);
    document.getElementById('request-reference').textContent = reference;
    email.href = 'mailto:doc@theglitchdoctor.com?subject=' + encodeURIComponent(`[${reference}] ${values.title || 'New service request'}`) + '&body=' + encodeURIComponent(review.value);
  }
  function show(index, focus = true) {
    current = index; furthest = Math.max(furthest,index);
    panels.forEach((panel,i) => { panel.hidden = i !== index; });
    buttons.forEach((button,i) => {
      button.disabled = i > furthest;
      if (i === index) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current');
      button.classList.toggle('visited',i < index);
    });
    back.hidden = index === 0;
    next.hidden = index === 3;
    next.textContent = index === 2 ? 'Review my request →' : 'Continue →';
    document.getElementById('intake-progress').textContent = `Step ${index+1} of 4`;
    document.getElementById('intake-tip-title').textContent = tips[index][0];
    document.getElementById('intake-tip').textContent = tips[index][1];
    if (index === 3) updateReview();
    if (focus) {
      const legend = panels[index].querySelector('legend');
      legend.tabIndex = -1; legend.focus({preventScroll:true});
      document.querySelector('.intake-console').scrollIntoView({behavior:'auto',block:'start'});
    }
  }
  function validateThrough(last) {
    for (let i=0;i<=last && i<3;i++) {
      for (const control of panels[i].querySelectorAll('input,select,textarea')) {
        if (control.required && !control.value.trim()) control.setCustomValidity('Please fill in this field.');
        else control.setCustomValidity('');
        if (!control.checkValidity()) { show(i); control.reportValidity(); return false; }
      }
    }
    return true;
  }
  form.addEventListener('input',event => {
    if (event.target.setCustomValidity) event.target.setCustomValidity('');
  });
  form.elements.timing.addEventListener('change',() => {
    const required = form.elements.timing.value === 'There is a specific deadline';
    document.getElementById('deadline-field').hidden = !required;
    form.elements.deadline.required = required;
    form.elements.deadline.disabled = !required;
    if (!required) form.elements.deadline.setCustomValidity('');
  });
  form.elements.deadline.disabled = true;
  form.elements.kind.addEventListener('change',() => {
    document.getElementById('details-guidance').textContent = form.elements.kind.value === 'Build something new' ? 'Describe how the work is handled today and the new experience you want to create. If there is no current process, say so.' : 'Describe what happens now and what you need instead. “I’m not sure” is a useful answer, too.';
  });
  form.elements.area.addEventListener('change',() => {
    const labels = { Salesforce:'Salesforce context: screen, object, automation, error, or recent change', 'Documents & templates':'Document context: template, source data, output format, or error', 'Microsoft 365 & email':'Email or service context: affected app, exact error, and when it started' };
    document.getElementById('context-label').textContent = labels[form.elements.area.value] || 'Helpful context';
  });
  form.addEventListener('submit',event => {
    event.preventDefault();
    if (current < 3 && validateThrough(current)) show(current+1);
  });
  back.addEventListener('click',() => show(Math.max(0,current-1)));
  buttons.forEach(button => button.addEventListener('click',() => {
    const target = Number(button.dataset.intakeStep);
    if (target <= current || validateThrough(target-1)) show(target);
  }));
  email.addEventListener('click',event => {
    if (!validateThrough(2)) { event.preventDefault(); return; }
    updateReview();
    status.textContent = 'Opening your email app. The request is not sent until you send the email there.';
  });
  document.getElementById('copy-request').addEventListener('click',async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(review.value);
      status.textContent = 'Brief copied. Paste it into your email to John.';
    } catch (_) {
      review.focus(); review.select();
      status.textContent = 'Brief selected. Use your device’s Copy command, then paste it into your email.';
    }
  });
  document.getElementById('download-request').addEventListener('click',() => {
    const url = URL.createObjectURL(new Blob([review.value],{type:'text/plain;charset=utf-8'}));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `${reference}_Development_Brief.txt`;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent = 'Brief download requested. You can attach it to an email to John.';
  });
  show(0,false);
})();
