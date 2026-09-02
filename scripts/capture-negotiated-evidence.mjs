import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://patchwork-webmcp.pages.dev';
const outputDirectory = resolve('resources/images/negotiated-planning');
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const page = await context.newPage();

await page.addInitScript(() => {
  window.__patchworkTools = {};
  Object.defineProperty(document, 'modelContext', {
    configurable: true,
    value: {
      registerTool(tool) { window.__patchworkTools[tool.name] = tool; },
      unregisterTool(name) { delete window.__patchworkTools[name]; },
    },
  });
});

async function openWorkspace() {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Object.keys(window.__patchworkTools).length === 4);
  await page.getByRole('tab', { name: 'Plan together', exact: true }).click();
  await page.waitForFunction(() => Object.keys(window.__patchworkTools).sort().join(',') === 'get_workspace,propose_plan_revision');
}

async function callTool(name, input) {
  return page.evaluate(async ({ toolName, toolInput }) => window.__patchworkTools[toolName].execute(toolInput), { toolName: name, toolInput: input });
}

async function capture(name) {
  await page.screenshot({ path: resolve(outputDirectory, name), fullPage: true });
}

try {
  await openWorkspace();
  await capture('01-workflow-tabs-and-workspace.png');

  await page.getByRole('button', { name: 'Pin Restock the little pantry', exact: true }).click();
  await page.getByLabel('Total time budget (hours)').fill('2');
  const workspace = await callTool('get_workspace', {});
  await callTool('propose_plan_revision', {
    base_revision: workspace.revision,
    project_ids: ['pantry', 'repair'],
    reason: 'Keep the pinned pantry and replace the orchard with a one-hour repair activity.',
  });
  await page.getByRole('heading', { name: 'Revision ready for your decision', exact: true }).waitFor();
  await capture('02-agent-proposal-before-approval.png');

  await page.getByRole('button', { name: 'Accept revision', exact: true }).click();
  await page.getByRole('tab', { name: 'Action history', exact: true }).click();
  await page.getByRole('heading', { name: 'Revision accepted', exact: true }).waitFor();
  await capture('03-action-history-after-approval.png');

  await openWorkspace();
  await page.getByRole('button', { name: 'Pin Revive the schoolyard orchard', exact: true }).click();
  await page.getByLabel('Total time budget (hours)').fill('1');
  const conflictedWorkspace = await callTool('get_workspace', {});
  await callTool('propose_plan_revision', {
    base_revision: conflictedWorkspace.revision,
    project_ids: ['orchard'],
    reason: 'Keep the pinned orchard within a one-hour budget.',
  });
  await page.getByRole('alert').first().waitFor();
  await capture('04-pinned-choice-budget-conflict.png');
} finally {
  await browser.close();
}

console.log(`Captured negotiated-planning evidence from ${baseURL}`);

