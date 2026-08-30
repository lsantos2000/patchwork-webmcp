import { expect, test } from '@playwright/test';
import { openPatchwork } from '../fixtures/modelContext';

test.beforeEach(async ({ page }) => openPatchwork(page));

test('loads the styled production experience without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.reload();
  await expect(page).toHaveTitle(/Patchwork/);
  await expect(page.locator('footer.footer')).toContainText('by Leonardo Santos-Macias');
  await expect(page.getByRole('heading', { name: /Small actions/i })).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(246, 242, 232)');
  expect(errors).toEqual([]);
});

test('search adds the first matching project to the shared plan', async ({ page }) => {
  await page.getByRole('button', { name: 'Clear plan' }).click();
  await page.getByLabel('Search projects').fill('garden');
  await page.getByRole('button', { name: /Explore/ }).click();
  await expect(page.getByText('1 local match')).toBeVisible();
  await expect(page.getByText('1 good ways to help')).toBeVisible();
});

test('category controls filter project cards', async ({ page }) => {
  await page.getByRole('button', { name: 'Food', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Restock the little pantry' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sunday repair table' })).toBeHidden();
});

test('empty results offer a recovery path', async ({ page }) => {
  await page.getByLabel('Search projects').fill('astronaut training');
  await expect(page.getByRole('heading', { name: 'No exact match—yet.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show every project' }).click();
  await expect(page.getByRole('heading', { name: 'Find your patch.' })).toBeVisible();
});

test('people can add, remove, clear, and review without pledging', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Restock the little pantry' }).click();
  await expect(page.getByText('4h total')).toBeVisible();
  await page.getByRole('button', { name: 'Remove Revive the schoolyard orchard' }).click();
  await page.getByRole('button', { name: /Review my plan/ }).click();
  await expect(page.getByText(/No pledge sent/)).toBeVisible();
  await page.getByRole('button', { name: 'Clear plan' }).click();
  await expect(page.getByText('0h total')).toBeVisible();
});
