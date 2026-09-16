export interface Item {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

const jsonHeaders = { 'Content-Type': 'application/json' };

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchItems(): Promise<Item[]> {
  const data = await parse<{ items: Item[] }>(await fetch('/api/items'));
  return data.items;
}

export async function createItem(title: string): Promise<Item> {
  const data = await parse<{ item: Item }>(
    await fetch('/api/items', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ title }),
    }),
  );
  return data.item;
}

export async function setItemDone(id: number, done: boolean): Promise<Item> {
  const data = await parse<{ item: Item }>(
    await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: jsonHeaders,
      body: JSON.stringify({ done }),
    }),
  );
  return data.item;
}

export async function deleteItem(id: number): Promise<void> {
  await parse<{ item: Item }>(await fetch(`/api/items/${id}`, { method: 'DELETE' }));
}
