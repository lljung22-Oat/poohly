/* ฐานข้อมูลเดโมในเบราว์เซอร์ — IndexedDB ชื่อ mu-pms-db
   เก็บผู้ใช้ รหัสผ่านแฮช สิทธิ์ รอบประเมิน และบันทึก PA ทั้งหมด */
(function (root) {
  const DB_NAME = "mu-pms-db";
  const DB_VER = 1;
  let dbp = null;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("users")) {
          const s = db.createObjectStore("users", { keyPath: "id" });
          s.createIndex("username", "username", { unique: true });
        }
        if (!db.objectStoreNames.contains("records")) {
          db.createObjectStore("records", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("session")) {
          db.createObjectStore("session", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("audit")) {
          const a = db.createObjectStore("audit", { keyPath: "id", autoIncrement: true });
          a.createIndex("at", "at");
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }

  function tx(store, mode, fn) {
    return open().then((db) => new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const s = t.objectStore(store);
      const out = fn(s);
      t.oncomplete = () => resolve(out && out.result !== undefined ? out.result : out);
      t.onerror = () => reject(t.error);
      if (out && out.onsuccess) out.onsuccess = () => resolve(out.result);
    }));
  }

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(text)));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function now() {
    return new Date().toISOString();
  }

  function seedUsers() {
    return [
      {
        id: "faculty", username: "porntipa.c", full: "น.ส.พรทิพา เซี่ยงฉิน",
        position: "อาจารย์", type: "สายวิชาการ", staffId: "10101642",
        dept: "ภาควิชาสังคมศาสตร์", family: "ratee", track: "faculty", role: "faculty",
        roleLabel: "ผู้รับการประเมิน", roleSub: "อาจารย์",
        hint: "กรอกข้อตกลงตามประกาศสายวิชาการของตนเองเท่านั้น",
        tone: "ratee", canEval: false, canChair: false, canHr: false, canAdmin: false, active: true
      },
      {
        id: "support", username: "staff.sh", full: "เจ้าหน้าที่สายสนับสนุน",
        position: "เจ้าหน้าที่บริหารงานทั่วไป", type: "สายสนับสนุน", staffId: "10102001",
        dept: "งานการเจ้าหน้าที่", family: "ratee", track: "support", role: "support",
        roleLabel: "ผู้รับการประเมิน", roleSub: "บุคลากรสายสนับสนุน",
        hint: "กรอกแบบข้อตกลง PA บุคคลากรของตนเองเท่านั้น",
        tone: "support", canEval: false, canChair: false, canHr: false, canAdmin: false, active: true
      },
      {
        id: "admin", username: "admin.mu", full: "ผู้ดูแลระบบมหาวิทยาลัย",
        position: "Admin มหาวิทยาลัย", type: "ผู้ดูแลระบบ", staffId: "ADM-01",
        dept: "กองทรัพยากรบุคคล", family: "admin", track: null, role: "admin",
        roleLabel: "ผู้ดูแลระบบ", roleSub: "ช่องทางพิเศษ",
        hint: "สร้างบัญชี กำหนดสิทธิ์ผู้ประเมิน ควบคุมความปลอดภัย",
        tone: "admin", canEval: false, canChair: false, canHr: true, canAdmin: true, active: true
      }
    ];
  }

  async function seed() {
    const existing = await listUsers();
    if (existing.length) return;
    const passRatee = await sha256("123456");
    const passAdmin = await sha256("Admin#2570");
    for (const u of seedUsers()) {
      u.passHash = u.id === "admin" ? passAdmin : passRatee;
      u.createdAt = now();
      u.createdBy = "system";
      await putUser(u);
    }
    await audit("system", "seed", "สร้างบัญชีตั้งต้น อาจารย์ / เจ้าหน้าที่ / ผู้ดูแล");
  }

  function putUser(user) {
    return tx("users", "readwrite", (s) => s.put(user));
  }

  function getUser(id) {
    return tx("users", "readonly", (s) => s.get(id));
  }

  function getUserByName(username) {
    return open().then((db) => new Promise((resolve, reject) => {
      const t = db.transaction("users", "readonly");
      const idx = t.objectStore("users").index("username");
      const q = idx.get(String(username || "").trim().toLowerCase());
      q.onsuccess = () => resolve(q.result || null);
      q.onerror = () => reject(q.error);
    }));
  }

  function listUsers() {
    return open().then((db) => new Promise((resolve, reject) => {
      const t = db.transaction("users", "readonly");
      const q = t.objectStore("users").getAll();
      q.onsuccess = () => resolve(q.result || []);
      q.onerror = () => reject(q.error);
    }));
  }

  async function verify(username, password, gate) {
    const u = await getUserByName(String(username || "").toLowerCase());
    if (!u || !u.active) return { ok: false, reason: "ไม่พบบัญชี หรือบัญชีถูกปิด" };
    const hash = await sha256(password);
    if (hash !== u.passHash) return { ok: false, reason: "รหัสผ่านไม่ถูกต้อง" };
    if (gate === "ratee-faculty" && !(u.family === "ratee" && u.track === "faculty")) {
      return { ok: false, reason: "บัญชีนี้ไม่ใช่อาจารย์" };
    }
    if (gate === "ratee-support" && !(u.family === "ratee" && u.track === "support")) {
      return { ok: false, reason: "บัญชีนี้ไม่ใช่เจ้าหน้าที่สายสนับสนุน" };
    }
    if (gate === "eval" && u.family !== "eval") {
      return { ok: false, reason: "บัญชีนี้ยังไม่ได้รับสิทธิ์ผู้ประเมิน" };
    }
    if (gate === "admin" && !u.canAdmin) {
      return { ok: false, reason: "บัญชีนี้เข้าช่องทางผู้ดูแลไม่ได้" };
    }
    return { ok: true, user: u };
  }

  async function createUser(input, actor) {
    const username = String(input.username || "").trim().toLowerCase();
    if (!username) throw new Error("ต้องมีชื่อผู้ใช้");
    if (await getUserByName(username)) throw new Error("ชื่อผู้ใช้นี้มีแล้ว");
    if (!input.password || String(input.password).length < 4) throw new Error("รหัสผ่านอย่างน้อย 4 ตัว");
    const id = "u" + Math.random().toString(36).slice(2, 10);
    const user = {
      id,
      username,
      passHash: await sha256(input.password),
      full: input.full || username,
      position: input.position || "",
      type: input.type || "",
      staffId: input.staffId || id,
      dept: input.dept || "คณะสังคมศาสตร์และมนุษยศาสตร์",
      family: input.family,
      track: input.track || null,
      role: input.role,
      roleLabel: input.roleLabel,
      roleSub: input.roleSub,
      hint: input.hint || "",
      tone: input.tone || "eval",
      canEval: !!input.canEval,
      canChair: !!input.canChair,
      canHr: !!input.canHr,
      canAdmin: !!input.canAdmin,
      active: input.active !== false,
      createdAt: now(),
      createdBy: actor || "admin"
    };
    await putUser(user);
    await audit(actor || "admin", "create-user", "สร้างบัญชี " + username + " สิทธิ์ " + user.roleLabel);
    return user;
  }

  async function setPassword(id, password, actor) {
    const u = await getUser(id);
    if (!u) throw new Error("ไม่พบบัญชี");
    u.passHash = await sha256(password);
    await putUser(u);
    await audit(actor || "admin", "reset-pass", "ตั้งรหัสใหม่ให้ " + u.username);
  }

  async function setActive(id, active, actor) {
    const u = await getUser(id);
    if (!u) throw new Error("ไม่พบบัญชี");
    u.active = !!active;
    await putUser(u);
    await audit(actor || "admin", active ? "enable" : "disable", (active ? "เปิด" : "ปิด") + "บัญชี " + u.username);
  }

  function recordId(userId, year) {
    return String(userId) + ":" + String(year);
  }

  function saveRecord(userId, year, state) {
    const row = { id: recordId(userId, year), userId, year: String(year), state, updatedAt: now() };
    return tx("records", "readwrite", (s) => s.put(row));
  }

  function loadRecord(userId, year) {
    return tx("records", "readonly", (s) => s.get(recordId(userId, year))).then((r) => r ? r.state : null);
  }

  function saveSession(sess) {
    return tx("session", "readwrite", (s) => s.put({ id: "current", ...sess, at: now() }));
  }

  function loadSession() {
    return tx("session", "readonly", (s) => s.get("current"));
  }

  function clearSession() {
    return tx("session", "readwrite", (s) => s.delete("current"));
  }

  function audit(actor, action, detail) {
    return tx("audit", "readwrite", (s) => s.add({ at: now(), actor, action, detail: detail || "" }));
  }

  function listAudit(limit) {
    return open().then((db) => new Promise((resolve, reject) => {
      const t = db.transaction("audit", "readonly");
      const q = t.objectStore("audit").getAll();
      q.onsuccess = () => {
        const rows = (q.result || []).slice().reverse();
        resolve(rows.slice(0, limit || 40));
      };
      q.onerror = () => reject(q.error);
    }));
  }

  async function wipeDemo() {
    const db = await open();
    await Promise.all(["users", "records", "session", "audit"].map((name) => new Promise((resolve, reject) => {
      const t = db.transaction(name, "readwrite");
      t.objectStore(name).clear();
      t.oncomplete = () => resolve();
      t.onerror = () => reject(t.error);
    })));
    dbp = null;
  }

  root.PMSDB = {
    open, seed, sha256,
    listUsers, getUser, getUserByName, putUser, createUser, setPassword, setActive,
    verify, saveRecord, loadRecord, saveSession, loadSession, clearSession,
    audit, listAudit, wipeDemo
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
