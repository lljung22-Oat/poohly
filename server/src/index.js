import { createApp } from "./app.js";
import { createPool } from "./db.js";
import { seedIfEmpty } from "./store.js";

const pool = await createPool();
await seedIfEmpty(pool);
const port = Number(process.env.PORT || 8080);
createApp(pool).listen(port, "0.0.0.0", () => {
  console.log(`pa listening on ${port}`);
});
