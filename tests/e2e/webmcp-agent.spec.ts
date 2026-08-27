import { expect, test } from '@playwright/test';
import { executeTool, openPatchwork } from '../fixtures/modelContext';

test.beforeEach(async ({ page }) => openPatchwork(page));

test('registers exactly three documented tools with schemas and descriptions', async ({ page }) => {
  await expect.poll(() => page.evaluate(() => Object.keys(window.__patchworkTools).sort())).toEqual([
    'build_action_plan', 'pledge_support', 'search_neighborhood_projects',
  ]);
  const metadata = await page.evaluate(() => Object.values(window.__patchworkTools).map(({ name, description, inputSchema }) => ({ name, description, inputSchema })));
  expect(metadata.every((tool) => tool.description.length > 30)).toBe(true);
  expect(metadata.every((tool) => tool.inputSchema.type === 'object')).toBe(true);
});

test('agent search respects intent and time while updating shared UI', async ({ page }) => {
  const result = await executeTool(page, 'search_neighborhood_projects', { query: 'food', max_hours: 1 });
  expect(result).toMatchObject({ shared_ui_updated: true, projects: [{ id: 'pantry' }] });
  await expect(page.getByLabel('Search projects')).toHaveValue('food');
  await expect(page.getByText('Agent found 1 project and shared the search.')).toBeVisible();
});

test('agent search safely defaults malformed optional inputs', async ({ page }) => {
  const result = await executeTool(page, 'search_neighborhood_projects', { query: 12, max_hours: 'soon' });
  expect(result).toMatchObject({ shared_ui_updated: true });
  expect((result as { projects: unknown[] }).projects).toHaveLength(4);
});

test('agent creates a deduplicated, ordered, visible action plan', async ({ page }) => {
  const result = await executeTool(page, 'build_action_plan', { project_ids: ['pantry', 'missing', 'orchard', 'pantry'] });
  expect(result).toMatchObject({ total_hours: 3, shared_ui_updated: true, persisted_on_device: true });
  expect((result as { plan: { id: string }[] }).plan.map((project) => project.id)).toEqual(['orchard', 'pantry']);
  await expect(page.getByText('2 good ways to help')).toBeVisible();
  await expect(page.getByText('3h total')).toBeVisible();
});

test('empty or malformed plan input produces a safe empty plan', async ({ page }) => {
  const result = await executeTool(page, 'build_action_plan', { project_ids: 'orchard' });
  expect(result).toMatchObject({ plan: [], total_hours: 0, shared_ui_updated: true });
  await expect(page.getByText('0 good ways to help')).toBeVisible();
});

test('pledge tool returns a draft but never a submission', async ({ page }) => {
  const result = await executeTool(page, 'pledge_support', { project_id: 'orchard', contribution: 'Two hours Saturday' });
  expect(result).toEqual({
    status: 'confirmation_required',
    draft: { project_id: 'orchard', contribution: 'Two hours Saturday' },
    shared_ui_updated: true,
  });
  await expect(page.getByText(/Human confirmation is required; nothing was submitted/)).toBeVisible();
});

test('human controls still work after an agent changes the plan', async ({ page }) => {
  await executeTool(page, 'build_action_plan', { project_ids: ['orchard', 'pantry'] });
  await page.getByRole('button', { name: 'Remove Restock the little pantry' }).click();
  await expect(page.getByText('1 good ways to help')).toBeVisible();
  await expect(page.getByText('2h total')).toBeVisible();
});
