# poohly

A tiny full-stack task board used to demonstrate the poohly development environment end to end.

- **Frontend:** [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- **Backend:** [Express](https://expressjs.com/) JSON API with an in-memory store
- **Tests:** [Vitest](https://vitest.dev/) + Testing Library (frontend) and Supertest (API)

## Prerequisites

- Node.js >= 20 (repo is developed against Node 22)
- npm >= 10

## Getting started

```bash
npm ci        # install dependencies
npm run dev   # start the API (:3001) and the Vite dev server (:5173)
```

Then open http://localhost:5173. The Vite dev server proxies `/api/*` to the
Express backend on port 3001, so the UI talks to the real API in development.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API and web dev server together (hot reload). |
| `npm run dev:server` | Run only the Express API on port 3001. |
| `npm run dev:web` | Run only the Vite dev server on port 5173. |
| `npm run build` | Type-check and build the production frontend into `dist/`. |
| `npm start` | Serve the built frontend and API from a single Node process. |
| `npm run lint` | Lint the project with ESLint. |
| `npm test` | Run the Vitest suite once. |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health check. |
| `GET` | `/api/items` | List tasks. |
| `POST` | `/api/items` | Create a task (`{ "title": "..." }`). |
| `PATCH` | `/api/items/:id` | Toggle a task's `done` state. |
| `DELETE` | `/api/items/:id` | Delete a task. |

## Cloud Agent environment

The Cloud Agent environment is defined in [`.cursor/environment.json`](.cursor/environment.json):
`npm ci` installs dependencies and the `dev` terminal runs `npm run dev`, exposing
ports 5173 (web) and 3001 (API).
