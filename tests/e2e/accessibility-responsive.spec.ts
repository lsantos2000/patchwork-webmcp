import { expect, test } from '@playwright/test';
import { openPatchwork } from '../fixtures/modelContext';

test('provides a logical heading hierarchy and named controls', async ({ page }) => {
  await openPatchwork(page);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h2')).toHaveCount(2);
  await expect(page.getByLabel('Search projects')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Restock the little pantry' })).toBeVisible();
  await expect(page.getByText('You approve every commitment')).toBeVisible();
});

test('primary discovery flow is keyboard operable', async ({ page }) => {
  await openPatchwork(page);
  await page.getByLabel('Search projects').focus();
  await page.keyboard.type('food');
  await page.keyboard.press('Enter');
  await expect(page.getByText('1 local match')).toBeVisible();
  await expect(page.getByText('Restock the little pantry').last()).toBeVisible();
});

test('interactive elements show visible keyboard focus', async ({ page }) => {
  await openPatchwork(page);
  const search = page.getByLabel('Search projects');
  await search.focus();
  await expect(search).toBeFocused();
  const outline = await search.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe('none');
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`${viewport.name} layout avoids horizontal overflow and keeps core actions visible`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openPatchwork(page);
    await expect(page.getByLabel('Search projects')).toBeVisible();
    await expect(page.getByRole('button', { name: /Explore/ })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
