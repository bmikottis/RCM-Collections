/**
 * Copy @embedpdf/snippet /dist (ESM + wasm + chunks) into src/assets so the app
 * can load the viewer with native import(URL) and avoid LWR3009 in prod-compat.
 * Run on postinstall and before prod-compat builds. See contentRecordPage.js.
 */
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules/@embedpdf/snippet/dist');
const dest = join(root, 'src/assets/vendor/embedpdf-snippet');

if (!existsSync(src)) {
    console.warn('copy-embedpdf-assets: skip — node_modules/@embedpdf/snippet/dist not found (run npm install).');
    process.exit(0);
}
mkdirSync(dirname(dest), { recursive: true });
cpSync(src, dest, { recursive: true });
console.log('copy-embedpdf-assets: copied to', dest);
