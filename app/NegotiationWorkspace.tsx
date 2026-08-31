'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { createNegotiationStore, totalHours } from './negotiationStore';
import { PROJECTS } from './projectData';
import { useWebMCP, type WebMCPTool } from './useWebMCP';

export function NegotiationWorkspace({ active, history }: { active: boolean; history: boolean }) {
  const [store] = useState(createNegotiationStore);
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const tools = useMemo<WebMCPTool[]>(() => [
    { name: 'get_workspace', description: 'Read the negotiation workspace: current revision, selected projects, human-pinned choices, total-hour budget, catalog and recent actions. Read this before proposing any revision. Does not read or change the separate Discover plan.', inputSchema: { type: 'object', properties: {} }, execute: async () => store.getWorkspace() },
    { name: 'propose_plan_revision', description: 'Propose a change to the negotiation plan using the latest workspace revision. Preserve all pinned projects and stay within the combined time budget. Displays a diff for separate UI approval; never applies changes or makes pledges. On conflict, ask the person which constraint may change; on stale_revision, read get_workspace again.', inputSchema: { type: 'object', properties: { base_revision: { type: 'integer', minimum: 0 }, project_ids: { type: 'array', items: { type: 'string', enum: PROJECTS.map(p => p.id) }, maxItems: 4, uniqueItems: true }, reason: { type: 'string', minLength: 1, maxLength: 500 } }, required: ['base_revision', 'project_ids', 'reason'] }, execute: async input => store.propose(input) },
  ], [store]);
  useWebMCP(active ? tools : []);
  if (!active) return null;
  const proposal = state.proposal;
  const stale = proposal !== null && proposal.base_revision !== state.revision;
  const issue = store.issue();
  const names = (ids: string[]) => ids.map(id => PROJECTS.find(p => p.id === id)?.title ?? id).join(', ') || 'None';
  return <main className="negotiation">
    <header className="negotiation-header">
      <p className="kicker">PEOPLE DECIDE. AGENTS ADAPT.</p>
      <h1>{history ? 'Every change, in the open.' : 'Make a plan. Keep your say.'}</h1>
      <p>A separate planning workspace using the four demonstration projects. Your original Discover plan is untouched. This workspace lasts while the page stays open, including tab switches; refreshing resets it.</p>
      <span className="revision-badge">Workspace revision {state.revision}</span>
    </header>
    {history ? <section aria-label="Action history" className="negotiation-panel">
      <h2>Action history</h2>
      <p>Actual events in this workspace, newest first. “UI action” describes the control used, not proof of a human identity. Explanations are supplied text, not hidden model reasoning. Last 50 events; session only.</p>
      {!state.events.length ? <p>No actions yet. Open Plan together to start.</p> : <ol className="action-events">{[...state.events].reverse().map(event => <li key={event.id}><small>{event.source} · revision {event.revision} · event {event.id}</small><h3>{event.action}</h3><p>{event.details}</p></li>)}</ol>}
    </section> : <>
      <div className="negotiation-grid">
        <section className="negotiation-panel" aria-label="Your constraints">
          <h2>Your choices come first.</h2>
          <label className="budget-label">Total time budget (hours)<input type="number" aria-label="Total time budget (hours)" min="0.5" max="16" step="0.5" value={state.budget} onChange={event => store.setBudget(event.currentTarget.valueAsNumber)}/></label>
          <p><strong>{totalHours(state.selected)}h selected / {state.budget}h available</strong></p>
          {issue && <p role="alert" className="constraint-warning">{issue}</p>}
          <div className="negotiation-projects">{PROJECTS.map(project => <article key={project.id}>
            <div><h3>{project.title}</h3><small>{project.type} · {project.time}h</small></div>
            <div className="negotiation-actions"><button aria-label={`${state.selected.includes(project.id) ? 'Remove' : 'Add'} ${project.title} in workspace`} disabled={state.pinned.includes(project.id)} onClick={() => store.toggleProject(project.id)}>{state.selected.includes(project.id) ? 'Remove' : 'Add'}</button>
            {state.selected.includes(project.id) && <button aria-label={`Pin ${project.title}`} aria-pressed={state.pinned.includes(project.id)} onClick={() => store.togglePin(project.id)}>{state.pinned.includes(project.id) ? 'Pinned · unpin' : 'Keep this · pin'}</button>}</div>
          </article>)}</div>
          <button disabled={!state.undo} onClick={() => store.undo()}>Undo accepted revision</button>
          <p className="negotiation-note">Undo restores the previous selection. Changing the budget, pins, or selection afterward clears undo so it cannot overwrite newer choices.</p>
        </section>
        <section className="negotiation-panel" aria-label="Proposed revision">
          <h2>Compare before you accept.</h2>
          <p>Ask your browser agent:</p>
          <blockquote>Read my workspace. Revise the plan to fit my total time budget, preserve everything I pinned, and explain your changes. Propose only—do not apply anything.</blockquote>
          <p><code>get_workspace</code> → <code>propose_plan_revision</code></p>
          <button onClick={() => store.example()}>Preview an example revision</button>
          <p className="negotiation-note">The example uses deterministic logic, not an AI agent. It goes through the same constraint checks and approval flow.</p>
          {!proposal ? <p>No pending revision. Your existing plan stays in place.</p> : <div className="proposal-diff">
            <small>{proposal.source} · proposal {proposal.id} · based on revision {proposal.base_revision}</small>
            <h3>{stale ? 'Outdated proposal — read again' : 'Revision ready for your decision'}</h3>
            <dl><dt>Current plan</dt><dd>{names(state.selected)} · {totalHours(state.selected)}h</dd><dt>Proposed plan</dt><dd>{names(proposal.project_ids)} · {totalHours(proposal.project_ids)}h</dd><dt>Remove</dt><dd>{names(state.selected.filter(id => !proposal.project_ids.includes(id)))}</dd><dt>Add</dt><dd>{names(proposal.project_ids.filter(id => !state.selected.includes(id)))}</dd><dt>Reason supplied</dt><dd>{proposal.reason}</dd></dl>
            {stale && <p role="alert">Your choices changed after this proposal. It cannot be applied; request a fresh revision.</p>}
            <div className="negotiation-actions"><button disabled={stale} onClick={() => store.accept(proposal.id)}>Accept revision</button><button onClick={() => store.reject()}>Reject revision</button></div>
          </div>}
        </section>
      </div>
      <p role="status" className="negotiation-status">{state.message || 'Pin a project, adjust your budget, then ask your agent to revise the plan.'}</p>
    </>}
    <p className="negotiation-note">No pledges, bookings, or organizer messages are sent. by Leonardo Santos-Macias</p>
  </main>;
}
