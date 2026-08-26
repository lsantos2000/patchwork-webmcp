'use client';

import { useEffect } from 'react';

export interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (input: Record<string, unknown>) => Promise<unknown>;
}

type ModelContext = {
  registerTool: (tool: WebMCPTool) => void;
  unregisterTool?: (name: string) => void;
};

declare global {
  interface Document { modelContext?: ModelContext }
  interface Navigator { modelContext?: ModelContext }
}

export function useWebMCP(tools: WebMCPTool[]) {
  useEffect(() => {
    const context = document.modelContext || navigator.modelContext;
    if (!context || typeof context.registerTool !== 'function') return;

    const registered: string[] = [];
    for (const tool of tools) {
      try {
        context.registerTool(tool);
        registered.push(tool.name);
      } catch (error) {
        console.error(`[WebMCP] Failed to register ${tool.name}`, error);
      }
    }

    return () => {
      if (typeof context.unregisterTool !== 'function') return;
      for (const name of registered) context.unregisterTool(name);
    };
  }, [tools]);
}
