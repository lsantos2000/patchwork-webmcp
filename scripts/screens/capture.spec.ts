import { test, expect } from '@playwright/test';
import { executeTool, openPatchwork } from '../../tests/fixtures/modelContext';

// Captures the judging narrative as PNGs in resources/screens/.
// Every agent-driven frame is produced by actually invoking the registered
// WebMCP tool through the model-context shim, not by clicking the UI.
const OUT = 'resources/screens';
const shot = (name: string) => ({ path: `${OUT}/${name}.png`, fullPage: true });

const planTogether = (page: import('@playwright/test').Page) =>
  page.getByRole('tab', { name: 'Plan together', exact: true }).click();

test('discover workflow', async ({ page }) => {
  await openPatchwork(page);
  await page.screenshot(shot('01-discover-human-first'));

  await executeTool(page, 'search_neighborhood_projects', { query: 'food access and outdoor work', max_hours: 3 });
  await expect(page.getByText(/Agent found \d+ project/)).toBeVisible();
  await page.screenshot(shot('02-agent-search-shared-ui'));

  await executeTool(page, 'build_action_plan', { project_ids: ['pantry', 'repair'] });
  await expect(page.getByText(/Agent prepared a \d+-hour plan/)).toBeVisible();
  await page.screenshot(shot('03-agent-built-plan'));
});

test('human confirmation boundaries', async ({ page }) => {
  await openPatchwork(page);

  await executeTool(page, 'propose_neighborhood_project', {
    title: 'Audit accessible cooling spaces', area: 'West Commons', type: 'Community', hours: 2,
    description: 'Verify shaded benches, water fountains, and accessible indoor cooling spaces.',
  });
  await expect(page.getByRole('heading', { name: 'A new local need is ready for review.' })).toBeVisible();
  await page.screenshot(shot('04-agent-draft-awaiting-human-approval'));

  await page.getByRole('button', { name: 'Reject draft' }).click();
  await executeTool(page, 'pledge_support', { project_id: 'orchard', contribution: 'I can bring pruning tools and help for two hours on Saturday morning.' });
  await expect(page.getByRole('heading', { name: 'Review your contribution draft.' })).toBeVisible();
  await page.screenshot(shot('05-pledge-draft-never-submitted'));
});

test('negotiated planning', async ({ page }) => {
  await openPatchwork(page);
  await planTogether(page);
  await expect.poll(() => page.evaluate(() => Object.keys(window.__patchworkTools).sort()))
    .toEqual(['get_workspace', 'propose_plan_revision']);
  await page.screenshot(shot('06-plan-together-scoped-to-two-tools'));

  // Agent proposes around a human pin and a tightened budget.
  await page.getByRole('button', { name: 'Pin Restock the little pantry', exact: true }).click();
  await page.getByLabel('Total time budget (hours)').fill('2');
  const ws = await executeTool(page, 'get_workspace', {}) as { revision: number };
  const proposal = await executeTool(page, 'propose_plan_revision', {
    base_revision: ws.revision, project_ids: ['pantry', 'repair'],
    reason: 'Keep the pinned pantry and replace the orchard with a one-hour repair activity.',
  });
  expect(proposal).toMatchObject({ status: 'approval_required', applied: false });
  await page.screenshot(shot('07-agent-proposal-before-after'));

  await page.getByRole('button', { name: 'Accept revision', exact: true }).click();
  await expect(page.getByText('2h selected / 2h available')).toBeVisible();
  await page.screenshot(shot('08-human-accepted-revision'));
});

test('refusals the site enforces', async ({ page }) => {
  await openPatchwork(page);
  await planTogether(page);

  // stale_revision: the person edits between the agent's read and its proposal.
  const stale = await executeTool(page, 'get_workspace', {}) as { revision: number };
  await page.getByLabel('Total time budget (hours)').fill('2');
  const refused = await executeTool(page, 'propose_plan_revision', {
    base_revision: stale.revision, project_ids: ['pantry'], reason: 'Trim the weekend to a single hour.',
  });
  expect(refused).toMatchObject({ status: 'stale_revision', applied: false });
  await page.screenshot(shot('09-stale-revision-refused'));

  // constraint_conflict: a pinned project cannot fit the budget.
  await page.getByRole('button', { name: 'Pin Revive the schoolyard orchard', exact: true }).click();
  await page.getByLabel('Total time budget (hours)').fill('1');
  const state = await executeTool(page, 'get_workspace', {}) as { revision: number };
  const conflict = await executeTool(page, 'propose_plan_revision', {
    base_revision: state.revision, project_ids: ['orchard'], reason: 'Keep the orchard within one hour.',
  });
  expect(conflict).toMatchObject({ status: 'constraint_conflict', applied: false });
  await expect(page.getByRole('button', { name: 'Pin Revive the schoolyard orchard' })).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot(shot('10-constraint-conflict-explained'));
});

test('honest action history', async ({ page }) => {
  await openPatchwork(page);
  await planTogether(page);
  const ws = await executeTool(page, 'get_workspace', {}) as { revision: number };
  await executeTool(page, 'propose_plan_revision', {
    base_revision: ws.revision, project_ids: ['pantry', 'repair'], reason: 'Fit the weekend into two hours.',
  });
  await page.getByRole('button', { name: 'Preview an example revision' }).click();
  await page.getByRole('tab', { name: 'Action history' }).click();
  await expect(page.getByText(/WebMCP tool · revision/).first()).toBeVisible();
  await expect(page.getByText(/Example preview · revision/).first()).toBeVisible();
  await page.screenshot(shot('11-action-history-entry-paths'));
});

test('responsive at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPatchwork(page);
  await page.screenshot(shot('12-mobile-discover'));
  await planTogether(page);
  await expect(page.getByLabel('Total time budget (hours)')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot(shot('13-mobile-plan-together-no-overflow'));
});
