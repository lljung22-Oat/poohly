const assert = require("assert");
const crypto = require("crypto");
const DB = require("./db.js");

function nodeSha(s) {
  return crypto.createHash("sha256").update(String(s), "utf8").digest("hex");
}

assert.strictEqual(DB.sha256Sync("123456"), nodeSha("123456"));
assert.strictEqual(DB.sha256Sync("Admin#2570"), nodeSha("Admin#2570"));
DB.sha256("123456").then((h) => {
  assert.strictEqual(h, nodeSha("123456"));
  console.log("db tests ok");
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
