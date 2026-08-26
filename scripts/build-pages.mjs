import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const server = resolve(root, 'dist/server');
const client = resolve(root, 'dist/client');
const output = resolve(root, 'pages-dist');

if (!existsSync(resolve(server, 'index.js')) || !existsSync(client)) {
  throw new Error('Run the Vinext production build before packaging for Pages.');
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(server, output, { recursive: true });
cpSync(client, output, { recursive: true });
cpSync(resolve(server, 'index.js'), resolve(output, '_worker.js'));

console.log('Cloudflare Pages bundle created in pages-dist/.');
