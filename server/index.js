import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import { createApp } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;

const seedItems = [
  { id: 1, title: 'Welcome to poohly', done: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Add your first task', done: false, createdAt: new Date().toISOString() },
];

const app = createApp({ initialItems: seedItems });

// In production, serve the built frontend from dist/ so a single process
// hosts both the API and the static assets.
const distDir = path.resolve(__dirname, '..', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[poohly] API listening on http://localhost:${PORT}`);
});
