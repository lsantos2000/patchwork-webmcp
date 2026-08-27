import { expect, test } from '@playwright/test';
import { executeTool, openPatchwork } from '../fixtures/modelContext';

test('restores a valid saved query, filter, and plan', async ({ page }) => {
  await openPatchwork(page, {
    'patchwork.query.v1': 'food',
    'patchwork.filter.v1': 'Food',
    'patchwork.plan.v1': ['pantry'],
  });
  await expect(page.getByLabel('Search projects')).toHaveValue('food');
  await expect(page.getByRole('button', { name: 'Food', exact: true })).toHaveClass(/active/);
  await expect(page.getByText('1h total')).toBeVisible();
  await expect(page.getByText('Saved on this device')).toBeVisible();
});

test('agent-created plan survives a reload', async ({ page }) => {
  await openPatchwork(page);
  await executeTool(page, 'build_action_plan', { project_ids: ['orchard', 'pantry'] });
  await page.reload();
  await expect(page.getByText('2 good ways to help')).toBeVisible();
  await expect(page.getByText('3h total')).toBeVisible();
});

for (const [label, key, badValue] of [
  ['malformed JSON', 'patchwork.plan.v1', { __raw: '{bad json' }],
  ['unknown project IDs', 'patchwork.plan.v1', ['unknown']],
  ['unsupported filters', 'patchwork.filter.v1', 'Everything'],
] as const) {
  test(`recovers safely from ${label}`, async ({ page }) => {
    await openPatchwork(page, { [key]: badValue });
    await expect(page.getByText('Saved on this device')).toBeVisible();
    const saved = await page.evaluate((storageKey) => window.localStorage.getItem(storageKey), key);
    expect(saved).not.toContain('unknown');
    expect(saved).not.toContain('Everything');
    expect(saved).not.toContain('{bad json');
  });
}

test('clear plan persists across reloads', async ({ page }) => {
  await openPatchwork(page);
  await page.getByRole('button', { name: 'Clear plan' }).click();
  await page.reload();
  await expect(page.getByText('0 good ways to help')).toBeVisible();
});
