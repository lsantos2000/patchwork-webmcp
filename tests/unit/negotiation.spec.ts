import { expect, test } from '@playwright/test';
import { createNegotiationStore } from '../../app/negotiationStore';

test('workspace reads include actual pins, budget, catalog and revision', () => {
  const store = createNegotiationStore();
  store.togglePin('pantry');
  store.setBudget(2);
  expect(store.getWorkspace()).toMatchObject({ revision: 2, pinned_project_ids: ['pantry'], budget_hours: 2, storage: 'session_only' });
  expect(store.getWorkspace().catalog).toHaveLength(4);
});

test('proposal cannot drop a pinned project or exceed the total budget', () => {
  const store = createNegotiationStore();
  store.togglePin('pantry');
  expect(store.propose({ base_revision: 1, project_ids: ['orchard'], reason: 'Remove pantry' })).toMatchObject({ status: 'constraint_conflict', applied: false });
  store.setBudget(1);
  expect(store.propose({ base_revision: 2, project_ids: ['orchard', 'pantry'], reason: 'Over budget' })).toMatchObject({ status: 'constraint_conflict' });
  expect(store.getSnapshot().selected).toEqual(['orchard', 'pantry']);
});

test('impossible pinned constraints explain the conflict without modifying pins', () => {
  const store = createNegotiationStore();
  store.togglePin('orchard');
  store.setBudget(1);
  expect(store.example()).toMatchObject({ status: 'constraint_conflict', applied: false });
  expect(store.getSnapshot().pinned).toEqual(['orchard']);
});

test('stale reads and approvals cannot overwrite later UI changes', () => {
  const store = createNegotiationStore();
  store.propose({ base_revision: 0, project_ids: ['pantry'], reason: 'Shorter plan' });
  const id = store.getSnapshot().proposal!.id;
  store.toggleProject('repair');
  expect(store.accept(id)).toBe(false);
  expect(store.propose({ base_revision: 0, project_ids: ['pantry'], reason: 'Old read' })).toMatchObject({ status: 'stale_revision' });
  expect(store.getSnapshot().selected).toContain('repair');
});

test('acceptance changes the plan once and undo restores it with a new revision', () => {
  const store = createNegotiationStore();
  store.propose({ base_revision: 0, project_ids: ['pantry'], reason: 'One hour' });
  const id = store.getSnapshot().proposal!.id;
  expect(store.getSnapshot().selected).toEqual(['orchard', 'pantry']);
  expect(store.accept(id)).toBe(true);
  expect(store.accept(id)).toBe(false);
  expect(store.getSnapshot().selected).toEqual(['pantry']);
  store.undo();
  expect(store.getSnapshot()).toMatchObject({ selected: ['orchard', 'pantry'], revision: 2, undo: null });
});

test('manual edits invalidate undo and rejection never applies a draft', () => {
  const store = createNegotiationStore();
  store.propose({ base_revision: 0, project_ids: ['pantry'], reason: 'One hour' });
  store.reject();
  expect(store.getSnapshot().selected).toEqual(['orchard', 'pantry']);
  store.example();
  store.accept(store.getSnapshot().proposal!.id);
  store.setBudget(2);
  expect(store.getSnapshot().undo).toBeNull();
});

test('invalid requests and duplicate retries do not corrupt the workspace', () => {
  const store = createNegotiationStore();
  for (const input of [{}, { base_revision: 0, project_ids: ['fake'], reason: 'invalid' }, { base_revision: 0, project_ids: [], reason: 'x'.repeat(501) }]) expect(store.propose(input)).toMatchObject({ status: 'invalid_input' });
  const request = { base_revision: 0, project_ids: ['pantry'], reason: 'Shorter plan' };
  store.propose(request);
  const id = store.getSnapshot().proposal!.id;
  store.propose(request);
  expect(store.getSnapshot().proposal!.id).toBe(id);
});

test('history records source honestly and is bounded', () => {
  const store = createNegotiationStore();
  store.example();
  expect(store.getSnapshot().events[0].source).toBe('Example preview');
  for (let i = 0; i < 60; i++) store.getWorkspace();
  expect(store.getSnapshot().events).toHaveLength(50);
  expect(store.getSnapshot().events.every(event => event.source === 'WebMCP tool')).toBe(true);
});
