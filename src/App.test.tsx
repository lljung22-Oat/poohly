import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import type { Item } from './api';

function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 1,
    title: 'Existing task',
    done: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders items fetched from the API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ items: [makeItem({ title: 'Buy honey' })] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<App />);

    expect(await screen.findByText('Buy honey')).toBeInTheDocument();
    expect(screen.getByText('1 remaining')).toBeInTheDocument();
  });

  it('adds a new task through the composer', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ item: makeItem({ id: 5, title: 'Ship it' }) }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<App />);

    await screen.findByText('No tasks yet. Add your first one above.');

    await user.type(screen.getByLabelText('New task title'), 'Ship it');
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    await waitFor(() => expect(screen.getByText('Ship it')).toBeInTheDocument());
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/items',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
