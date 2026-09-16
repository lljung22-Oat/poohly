import express from 'express';

/**
 * Creates the poohly Express application.
 *
 * The store is passed in (or defaulted) so tests can start from a known state
 * without sharing mutable module-level data between test cases.
 */
export function createApp({ initialItems } = {}) {
  const app = express();
  app.use(express.json());

  /** @type {{ id: number, title: string, done: boolean, createdAt: string }[]} */
  const items = initialItems ? [...initialItems] : [];
  let nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'poohly', time: new Date().toISOString() });
  });

  app.get('/api/items', (_req, res) => {
    res.json({ items });
  });

  app.post('/api/items', (req, res) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    if (!title) {
      res.status(400).json({ error: 'title is required' });
      return;
    }
    const item = { id: nextId++, title, done: false, createdAt: new Date().toISOString() };
    items.push(item);
    res.status(201).json({ item });
  });

  app.patch('/api/items/:id', (req, res) => {
    const id = Number(req.params.id);
    const item = items.find((candidate) => candidate.id === id);
    if (!item) {
      res.status(404).json({ error: 'item not found' });
      return;
    }
    if (typeof req.body?.done === 'boolean') {
      item.done = req.body.done;
    }
    res.json({ item });
  });

  app.delete('/api/items/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = items.findIndex((candidate) => candidate.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'item not found' });
      return;
    }
    const [removed] = items.splice(index, 1);
    res.json({ item: removed });
  });

  return app;
}
