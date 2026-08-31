import { expect, test } from '@playwright/test';
import { executeTool, openPatchwork } from '../fixtures/modelContext';

test.beforeEach(async ({ page }) => { await openPatchwork(page); await page.getByRole('tab', { name: 'Plan together', exact: true }).click(); });

test('new workflow registers scoped tools without altering the original plan', async ({ page }) => {
  await expect.poll(() => page.evaluate(() => Object.keys(window.__patchworkTools).sort())).toEqual(['get_workspace', 'propose_plan_revision']);
  await page.getByLabel('Total time budget (hours)').fill('2');
  await page.getByRole('tab', { name: 'Discover', exact: true }).click();
  await expect(page.getByText('3h total')).toBeVisible();
  await expect.poll(() => page.evaluate(() => Object.keys(window.__patchworkTools).length)).toBe(4);
  await page.getByRole('tab', { name: 'Plan together', exact: true }).click();
  await expect(page.getByLabel('Total time budget (hours)')).toHaveValue('2');
});

test('agent revises around a UI pin, person accepts, then undoes', async ({ page }) => {
  await page.getByRole('button', { name: 'Pin Restock the little pantry', exact: true }).click();
  await page.getByLabel('Total time budget (hours)').fill('2');
  const workspace = await executeTool(page, 'get_workspace', {}) as { revision: number; pinned_project_ids: string[] };
  expect(workspace.pinned_project_ids).toEqual(['pantry']);
  const result = await executeTool(page, 'propose_plan_revision', { base_revision: workspace.revision, project_ids: ['pantry', 'repair'], reason: 'Keep the pinned pantry and replace the orchard with a one-hour repair activity.' });
  expect(result).toMatchObject({ status: 'approval_required', applied: false });
  await expect(page.getByText('3h selected / 2h available')).toBeVisible();
  await page.getByRole('button', { name: 'Accept revision', exact: true }).click();
  await expect(page.getByText('2h selected / 2h available')).toBeVisible();
  await page.getByRole('button', { name: 'Undo accepted revision' }).click();
  await expect(page.getByText('3h selected / 2h available')).toBeVisible();
  await page.getByRole('tab', { name: 'Action history' }).click();
  await expect(page.getByRole('heading', { name: 'Revision undone', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'propose_plan_revision', exact: true })).toBeVisible();
});

test('human edit makes a pending proposal unapprovable', async ({ page }) => {
  await executeTool(page, 'propose_plan_revision', { base_revision: 0, project_ids: ['pantry'], reason: 'One hour' });
  await page.getByLabel('Total time budget (hours)').fill('2');
  await expect(page.getByRole('button', { name: 'Accept revision', exact: true })).toBeDisabled();
  await expect(page.getByText('Outdated proposal — read again')).toBeVisible();
});

test('impossible request preserves pinned project and reports conflict', async ({ page }) => {
  await page.getByRole('button', { name: 'Pin Revive the schoolyard orchard', exact: true }).click();
  await page.getByLabel('Total time budget (hours)').fill('1');
  const state = await executeTool(page, 'get_workspace', {}) as { revision: number };
  expect(await executeTool(page, 'propose_plan_revision', { base_revision: state.revision, project_ids: ['orchard'], reason: 'Keep orchard' })).toMatchObject({ status: 'constraint_conflict', applied: false });
  await expect(page.getByRole('button', { name: 'Pin Revive the schoolyard orchard' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Accept revision', exact: true })).toHaveCount(0);
});

test('example history is not labeled as an agent call and tab navigation works by keyboard', async ({ page }) => {
  await page.getByRole('button', { name: 'Preview an example revision' }).click();
  const tab = page.getByRole('tab', { name: 'Plan together', exact: true });
  await tab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Action history' })).toBeFocused();
  await expect(page.getByText(/Example preview · revision/)).toBeVisible();
  await expect(page.getByText(/WebMCP tool · revision/)).toHaveCount(0);
});

test('mobile negotiation controls do not overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByLabel('Total time budget (hours)')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
