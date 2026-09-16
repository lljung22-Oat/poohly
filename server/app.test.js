import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

describe('poohly API', () => {
  it('reports health', async () => {
    const res = await request(createApp()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', service: 'poohly' });
  });

  it('starts with the provided items', async () => {
    const app = createApp({ initialItems: [{ id: 1, title: 'seed', done: false, createdAt: 'x' }] });
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].title).toBe('seed');
  });

  it('creates, updates, and deletes an item end to end', async () => {
    const app = createApp();

    const created = await request(app).post('/api/items').send({ title: '  Write tests  ' });
    expect(created.status).toBe(201);
    expect(created.body.item).toMatchObject({ title: 'Write tests', done: false });
    const id = created.body.item.id;

    const toggled = await request(app).patch(`/api/items/${id}`).send({ done: true });
    expect(toggled.status).toBe(200);
    expect(toggled.body.item.done).toBe(true);

    const removed = await request(app).delete(`/api/items/${id}`);
    expect(removed.status).toBe(200);

    const list = await request(app).get('/api/items');
    expect(list.body.items).toHaveLength(0);
  });

  it('rejects an empty title', async () => {
    const res = await request(createApp()).post('/api/items').send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('title is required');
  });

  it('returns 404 for a missing item', async () => {
    const res = await request(createApp()).patch('/api/items/999').send({ done: true });
    expect(res.status).toBe(404);
  });
});
