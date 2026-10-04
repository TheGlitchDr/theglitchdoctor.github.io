/* Creates a local development brief. It does not create or send a server-side ticket. */
globalThis.GlitchIntake = (() => {
  const clean = value => String(value || '').trim();
  function format(data, reference) {
    const value = key => clean(data[key]) || 'Not provided';
    const questions = [];
    if (!clean(data.steps)) questions.push('Walk through the affected process or reproduce the issue together.');
    if (!clean(data.context)) questions.push('Confirm the relevant system, screens, configuration, and any recent changes.');
    if (data.area === 'Salesforce') questions.push('Confirm the affected objects, automation, permissions, and a suitable test environment.');
    if (data.area === 'Documents & templates') questions.push('Review a sample template, its source data, and the required output format.');
    if (data.area === 'Microsoft 365 & email') questions.push('Confirm the affected service, users, timing, and any error messages.');
    if (data.area === 'Infrastructure & other systems') questions.push('Confirm the systems involved, dependencies, and the available troubleshooting access.');
    if (data.area === 'Not sure yet') questions.push('Identify the systems involved before proposing a solution.');
    questions.push('Agree on scope, effort, testing, and delivery timing before work begins.');
    const timing = data.timing === 'There is a specific deadline' ? `${value('timing')}: ${value('deadline')}` : value('timing');
    return [
      'THE GLITCH DOCTOR | DEVELOPMENT INTAKE',
      `Draft reference: ${reference}`,
      'Prepared by the requester. Submission and receipt are not confirmed by the website.',
      '', 'REQUEST', `Title: ${value('title')}`, `Type: ${value('kind')}`, `Area: ${value('area')}`,
      '', 'REQUESTER', `Name: ${value('name')}`, `Email: ${value('email')}`, `Company / team: ${value('company')}`,
      '', 'GOAL / PROBLEM', value('goal'),
      '', 'CURRENT BEHAVIOR / PROCESS', value('current'),
      '', 'EXPECTED RESULT / PROPOSED SUCCESS CRITERIA', value('expected'),
      '', 'REPRODUCTION / PROCESS STEPS', value('steps'),
      '', 'TECHNICAL CONTEXT / ERRORS / RECENT CHANGES', value('context'),
      '', 'BUSINESS IMPACT', `Affected: ${value('affected')}`, `Impact: ${value('impact')}`, `Timing requested: ${timing}`, `Workaround / impact details: ${value('workaround')}`,
      '', 'QUESTIONS TO RESOLVE DURING SCOPING', ...questions.map((question, i) => `${i + 1}. ${question}`),
      '', 'ATTACHMENTS', 'Add relevant screenshots or examples to the email if available.'
    ].join('\n');
  }
  return { format };
})();
