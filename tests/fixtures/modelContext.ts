import type { Page } from '@playwright/test';

export type RegisteredTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
};

declare global {
  interface Window {
    __patchworkTools: Record<string, RegisteredTool>;
  }
}

type StorageSeed = Record<string, unknown | { __raw: string }>;

export async function openPatchwork(page: Page, storage: StorageSeed = {}) {
  await page.addInitScript((savedValues) => {
    for (const [key, value] of Object.entries(savedValues)) {
      const serialized = value && typeof value === 'object' && '__raw' in value
        ? String(value.__raw)
        : JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    }
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
  }, storage);
  await page.goto('/');
  await page.waitForFunction(() => Object.keys(window.__patchworkTools).length === 4);
}

export async function executeTool(page: Page, name: string, input: Record<string, unknown>) {
  // Reload returns before React effects necessarily re-register WebMCP tools.
  await page.waitForFunction((toolName) => typeof window.__patchworkTools?.[toolName]?.execute === 'function', name);
  return page.evaluate(
    async ({ toolName, toolInput }) => window.__patchworkTools[toolName].execute(toolInput),
    { toolName: name, toolInput: input },
  );
}
