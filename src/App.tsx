import { useEffect, useMemo, useState } from 'react';
import { createItem, deleteItem, fetchItems, setItemDone, type Item } from './api';
import './App.css';

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const remaining = useMemo(() => items.filter((item) => !item.done).length, [items]);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setError(null);
    try {
      const created = await createItem(trimmed);
      setItems((prev) => [...prev, created]);
      setTitle('');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleToggle(item: Item) {
    try {
      const updated = await setItemDone(item.id, !item.done);
      setItems((prev) => prev.map((candidate) => (candidate.id === item.id ? updated : candidate)));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDelete(item: Item) {
    try {
      await deleteItem(item.id);
      setItems((prev) => prev.filter((candidate) => candidate.id !== item.id));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo" aria-hidden="true">
            ✓
          </span>
          <h1>poohly</h1>
        </div>
        <p className="app__subtitle">A tiny task board proving the dev environment works end to end.</p>
      </header>

      <form className="composer" onSubmit={handleAdd}>
        <input
          className="composer__input"
          aria-label="New task title"
          placeholder="What needs doing?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button className="composer__button" type="submit" disabled={!title.trim()}>
          Add task
        </button>
      </form>

      {error && <p className="app__error" role="alert">{error}</p>}

      {loading ? (
        <p className="app__status">Loading tasks…</p>
      ) : items.length === 0 ? (
        <p className="app__status">No tasks yet. Add your first one above.</p>
      ) : (
        <>
          <p className="app__count">{remaining} remaining</p>
          <ul className="list">
            {items.map((item) => (
              <li key={item.id} className={`list__item ${item.done ? 'list__item--done' : ''}`}>
                <label className="list__label">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleToggle(item)}
                    aria-label={`Mark "${item.title}" as ${item.done ? 'not done' : 'done'}`}
                  />
                  <span className="list__title">{item.title}</span>
                </label>
                <button
                  className="list__delete"
                  type="button"
                  onClick={() => handleDelete(item)}
                  aria-label={`Delete "${item.title}"`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
