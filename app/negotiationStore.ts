import { PROJECTS } from './projectData';

export interface PlanProposal {
  id: number;
  base_revision: number;
  project_ids: string[];
  reason: string;
  source: 'WebMCP tool' | 'Example preview';
}
export interface PlanEvent {
  id: number;
  source: 'WebMCP tool' | 'UI action' | 'Example preview';
  action: string;
  details: string;
  revision: number;
}
export interface NegotiationState {
  revision: number;
  selected: string[];
  pinned: string[];
  budget: number;
  proposal: PlanProposal | null;
  undo: string[] | null;
  events: PlanEvent[];
  message: string;
}

export const totalHours = (ids: readonly string[]) => PROJECTS.filter(p => ids.includes(p.id)).reduce((sum, p) => sum + p.time, 0);
const title = (id: string) => PROJECTS.find(p => p.id === id)?.title ?? id;

// One synchronous state transition per operation prevents stale React closures
// from overwriting a UI edit made between an agent's read and proposal.
export function createNegotiationStore() {
  let state: NegotiationState = { revision: 0, selected: ['orchard', 'pantry'], pinned: [], budget: 3, proposal: null, undo: null, events: [], message: '' };
  let sequence = 0;
  const listeners = new Set<() => void>();
  function publish(next: NegotiationState) { state = next; listeners.forEach(listener => listener()); }
  function record(source: PlanEvent['source'], action: string, details: string, update: Partial<NegotiationState> = {}) {
    const next = { ...state, ...update };
    publish({ ...next, events: [...state.events, { id: ++sequence, source, action, details, revision: next.revision }].slice(-50) });
  }
  function constraints(ids: string[]) {
    const missing = state.pinned.filter(id => !ids.includes(id));
    if (missing.length) return `Pinned projects must stay: ${missing.map(title).join(', ')}. Unpin them yourself before requesting removal.`;
    const hours = totalHours(ids);
    if (hours > state.budget) return `This plan needs ${hours} hours but your budget is ${state.budget}. Change the budget or choose fewer unpinned projects.`;
    return null;
  }
  const api = {
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot: () => state,
    getWorkspace() {
      record('WebMCP tool', 'get_workspace', `Read revision ${state.revision}; ${state.budget}h budget; pins: ${state.pinned.join(', ') || 'none'}.`);
      return { workspace: 'negotiation', revision: state.revision, project_ids: [...state.selected], pinned_project_ids: [...state.pinned], total_hours: totalHours(state.selected), budget_hours: state.budget, catalog: PROJECTS.map(p => ({ id: p.id, title: p.title, category: p.type, hours: p.time })), pending_proposal: state.proposal, constraint_issue: constraints(state.selected), storage: 'session_only', approval: 'separate_ui_action', recent_actions: state.events.slice(-10) };
    },
    propose(input: Record<string, unknown>, source: PlanProposal['source'] = 'WebMCP tool') {
      const base = input.base_revision;
      const ids = input.project_ids;
      const reason = input.reason;
      function reject(status: string, message: string) {
        record(source, 'propose_plan_revision rejected', message, { message });
        return { status, message, current_revision: state.revision, applied: false };
      }
      if (!Number.isInteger(base) || !Array.isArray(ids) || ids.length > PROJECTS.length || !ids.every(id => typeof id === 'string' && PROJECTS.some(p => p.id === id)) || typeof reason !== 'string' || !reason.trim() || reason.length > 500) return reject('invalid_input', 'Provide a revision, known project IDs, and a reason of 1–500 characters.');
      if (base !== state.revision) return reject('stale_revision', 'The person changed this workspace. Read get_workspace again before proposing.');
      const selected = [...new Set(ids)] as string[];
      const issue = constraints(selected);
      if (issue) return reject('constraint_conflict', issue);
      if (state.proposal?.base_revision === base && JSON.stringify(state.proposal.project_ids) === JSON.stringify(selected) && state.proposal.reason === reason.trim() && state.proposal.source === source) return { status: 'approval_required', proposal: state.proposal, applied: false };
      const proposal: PlanProposal = { id: ++sequence, base_revision: base as number, project_ids: selected, reason: reason.trim(), source };
      record(source, 'propose_plan_revision', `Projects: ${selected.join(', ') || 'none'}; ${totalHours(selected)}h. Reason supplied: ${reason.trim()}`, { proposal, message: 'Proposal ready. Your current plan has not changed.' });
      return { status: 'approval_required', proposal, total_hours: totalHours(selected), applied: false };
    },
    setBudget(budget: number) {
      if (!Number.isFinite(budget) || budget < 0.5 || budget > 16 || budget === state.budget) return;
      record('UI action', 'Budget changed', `${budget} hours total.`, { budget, revision: state.revision + 1, undo: null, message: 'Budget updated. Any earlier proposal must be regenerated.' });
    },
    togglePin(id: string) {
      if (!state.selected.includes(id)) return;
      const pinned = state.pinned.includes(id) ? state.pinned.filter(x => x !== id) : [...state.pinned, id];
      record('UI action', pinned.includes(id) ? 'Project pinned' : 'Project unpinned', title(id), { pinned, revision: state.revision + 1, undo: null, message: 'Your choice is now part of the workspace constraints.' });
    },
    toggleProject(id: string) {
      if (!PROJECTS.some(p => p.id === id) || state.pinned.includes(id)) return;
      const selected = state.selected.includes(id) ? state.selected.filter(x => x !== id) : [...state.selected, id];
      record('UI action', 'Plan edited', title(id), { selected, revision: state.revision + 1, undo: null, message: 'Plan edited. Earlier proposals cannot overwrite this change.' });
    },
    accept(id: number) {
      const proposal = state.proposal;
      if (!proposal || proposal.id !== id) return false;
      const issue = proposal.base_revision !== state.revision ? 'This proposal is outdated. Request a new proposal for your current choices.' : constraints(proposal.project_ids);
      if (issue) { record('UI action', 'Approval blocked', issue, { message: issue }); return false; }
      record('UI action', 'Revision accepted', `Proposal ${id}: ${totalHours(proposal.project_ids)} hours. No pledge sent.`, { selected: [...proposal.project_ids], undo: [...state.selected], proposal: null, revision: state.revision + 1, message: 'Revision applied locally. You can undo it; no pledge was sent.' });
      return true;
    },
    reject() {
      if (!state.proposal) return;
      record('UI action', 'Proposal rejected', `Proposal ${state.proposal.id}; current plan unchanged.`, { proposal: null, message: 'Proposal dismissed. Your plan is unchanged.' });
    },
    undo() {
      if (!state.undo) return;
      record('UI action', 'Revision undone', 'Restored the plan from before acceptance. Budget and pins unchanged.', { selected: [...state.undo], undo: null, proposal: null, revision: state.revision + 1, message: 'Previous plan restored. Its total may exceed your current budget.' });
    },
    example(): unknown {
      // Deterministic demonstration only; never presented as a real agent call.
      const ids = [...state.pinned];
      for (const id of state.selected) if (!ids.includes(id) && totalHours([...ids, id]) <= state.budget) ids.push(id);
      return api.propose({ base_revision: state.revision, project_ids: ids, reason: 'Example: preserve pins and keep currently selected projects that fit the total budget.' }, 'Example preview');
    },
    issue: () => constraints(state.selected),
  };
  return api;
}
