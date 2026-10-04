/* Fictional examples: no Salesforce connection or real record changes. */
globalThis.GlitchLabModel = (() => {
  const scenarios = {
    onboarding: {
      title: 'A new client is ready.', description: 'A fictional household needs a clear path from handoff to first meeting.', condition: 'Required details are complete', record: 'Evergreen Household',
      event: ['New client handoff', 'The household is ready for onboarding. This is the event that starts the sample workflow.'],
      check: ['Check the essentials', 'Look for the information the team needs before starting the next stage.'],
      yes: ['Create the onboarding plan', 'The details are complete. Create the right tasks and assign the next steps to the team.'],
      no: ['Request the missing details', 'Hold the next stage and create a follow-up for the missing information. No premature handoff.'],
      finishYes: ['The team has a clear next step.', 'A visible plan replaces a handoff that could get lost in someone’s inbox.'],
      finishNo: ['The exception is visible.', 'The household stays in review until the missing information is resolved.'],
      takeaway: 'Good automation moves the right work forward and makes exceptions visible.'
    },
    campaign: {
      title: 'A campaign member responds.', description: 'A fictional campaign tracks meaningful engagement without treating every status change as a response.', condition: 'Status is an eligible response', record: 'Alex Evergreen / Sample campaign',
      event: ['Campaign status updated', 'A campaign member’s status changes. That creates an opportunity to evaluate the response.'],
      check: ['Check the response rules', 'Compare the new status with the response types that count for this sample campaign.'],
      yes: ['Record meaningful engagement', 'The status qualifies. Record the eligible engagement once and make it available for reporting.'],
      no: ['Skip the engagement award', 'The status does not qualify. Leave engagement unchanged so the reports are not inflated.'],
      finishYes: ['Reporting reflects a real response.', 'The result is visible to the team, without counting an unrelated status change.'],
      finishNo: ['The data stays honest.', 'An ineligible status change does not become a false signal of engagement.'],
      takeaway: 'Sometimes the most useful thing an automation does is correctly decide to do nothing.'
    },
    tasks: {
      title: 'The last task might be done.', description: 'A fictional action plan checks whether work is actually finished before closing the plan.', condition: 'No open tasks remain', record: 'Evergreen Household / Review plan',
      event: ['A task changes', 'A task is completed or removed. Recheck the related action plan instead of asking the team to clean it up manually.'],
      check: ['Look for unfinished work', 'Check the remaining tasks, including pending work, before deciding whether to complete the plan.'],
      yes: ['Complete the action plan', 'No open or pending tasks remain. The sample plan can be marked complete.'],
      no: ['Keep the action plan open', 'There is still work to do. Keep the plan open so unfinished tasks remain visible.'],
      finishYes: ['The plan matches the work.', 'Completed tasks no longer leave an outdated open plan behind.'],
      finishNo: ['Nothing closes too early.', 'The remaining work stays on the team’s radar.'],
      takeaway: 'The system should reflect what actually happened, without another manual cleanup step.'
    }
  };
  const challenges = {
    automation: { title: 'Automation review', detail: 'Map the handoffs, identify repeatable steps, and start with one useful workflow.', brief: 'Reduce repetitive work and manual handoffs' },
    data: { title: 'Data & visibility', detail: 'Clarify the questions your team needs answered, then work backward to the data and views.', brief: 'Improve data quality, reporting, and visibility' },
    admin: { title: 'Salesforce support', detail: 'Prioritize the backlog and tackle configuration, access, and everyday improvements.', brief: 'Work through our Salesforce administration backlog' },
    documents: { title: 'Document workflow review', detail: 'Look at the templates, source records, and review steps that make documents harder than they should be.', brief: 'Simplify our document workflows' },
    systems: { title: 'Systems troubleshooting', detail: 'Trace the issue across email, Microsoft 365, and infrastructure to find a practical next step.', brief: 'Troubleshoot email or infrastructure issues' }
  };
  function workflow(key, condition) {
    const s = scenarios[key];
    if (!s) throw new Error('Unknown sample workflow');
    return [s.event, s.check, condition ? s.yes : s.no, condition ? s.finishYes : s.finishNo];
  }
  function brief(keys, timing) {
    const items = keys.filter(key => Object.hasOwn(challenges, key));
    if (!items.length) return '';
    return 'Hi John,\n\nI’d like to talk about improving a few things:\n\n' + items.map(key => '• ' + challenges[key].brief).join('\n') + '\n\n' + (timing === 'exploring' ? 'I’m exploring possibilities and would appreciate your perspective on where to start.' : 'I’m ready to discuss the next steps and what a project could look like.') + '\n\nHere’s a little more about our situation:\n';
  }
  return { scenarios, challenges, workflow, brief };
})();
