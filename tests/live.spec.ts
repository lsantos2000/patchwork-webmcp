import { expect, test } from '@playwright/test';

type RegisteredTool = {
  name: string;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
};

declare global {
  interface Window {
    __patchworkTools: Record<string, RegisteredTool>;
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__patchworkTools = {};
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: {
        registerTool(tool: RegisteredTool) {
          window.__patchworkTools[tool.name] = tool;
        },
        unregisterTool(name: string) {
          delete window.__patchworkTools[name];
        },
      },
    });
  });
  await page.goto('/');
});

test('loads the styled production experience', async ({ page }) => {
  await expect(page).toHaveTitle(/Patchwork/);
  await expect(page.getByRole('heading', { name: /Small actions/i })).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(246, 242, 232)');
  await expect(page.getByText('Agent-ready via WebMCP')).toBeVisible();
});

test('registers WebMCP tools and shares an agent-created plan with the UI', async ({ page }) => {
  await expect.poll(() => page.evaluate(() => Object.keys(window.__patchworkTools).sort())).toEqual([
    'build_action_plan',
    'pledge_support',
    'search_neighborhood_projects',
  ]);

  const searchResult = await page.evaluate(() =>
    window.__patchworkTools.search_neighborhood_projects.execute({ query: 'food', max_hours: 3 }),
  );
  expect(searchResult).toMatchObject({ shared_ui_updated: true });
  await expect(page.getByLabel('Search projects')).toHaveValue('food');

  const planResult = await page.evaluate(() =>
    window.__patchworkTools.build_action_plan.execute({ project_ids: ['orchard', 'pantry'] }),
  );
  expect(planResult).toMatchObject({
    total_hours: 3,
    shared_ui_updated: true,
    persisted_on_device: true,
  });
  await expect(page.getByText('2 good ways to help')).toBeVisible();
  await expect(page.getByText('3h total')).toBeVisible();
  await expect(page.getByText('Restock the little pantry').last()).toBeVisible();

  await page.reload();
  await expect(page.getByText('Saved on this device')).toBeVisible();
  await expect(page.getByText('2 good ways to help')).toBeVisible();
  await expect(page.getByText('3h total')).toBeVisible();
});

test('keeps pledges confirmation-gated', async ({ page }) => {
  const result = await page.evaluate(() =>
    window.__patchworkTools.pledge_support.execute({
      project_id: 'orchard',
      contribution: 'Two hours on Saturday',
    }),
  );
  expect(result).toMatchObject({ status: 'confirmation_required', shared_ui_updated: true });
  await expect(page.getByText(/Human confirmation is required; nothing was submitted/)).toBeVisible();
});

test('supports human search, clearing, and plan review', async ({ page }) => {
  await page.getByRole('button', { name: 'Clear plan' }).click();
  await expect(page.getByText('0 good ways to help')).toBeVisible();
  await page.getByLabel('Search projects').fill('help in a garden');
  await page.getByRole('button', { name: /Explore/ }).click();
  await expect(page.getByText('1 good ways to help')).toBeVisible();
  await page.getByRole('button', { name: /Review my plan/ }).click();
  await expect(page.getByText(/No pledge sent/)).toBeVisible();
  await expect(page.getByText('Nothing is submitted without your confirmation.')).toBeVisible();
});
