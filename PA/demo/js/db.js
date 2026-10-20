/* ฐานข้อมูลเดโมในเบราว์เซอร์ — IndexedDB ชื่อ mu-pms-db
   เก็บผู้ใช้ รหัสผ่านแฮช สิทธิ์ รอบประเมิน และบันทึก PA ทั้งหมด */
(function (root) {
  const DB_NAME = "mu-pms-db";
  const DB_VER = 2;
  let dbp = null;

  function sha256Sync(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const maxWord = Math.pow(2, 32);
    const hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    let msg = unescape(encodeURIComponent(String(ascii)));
    const asciiBitLength = msg.length * 8;
    msg += "\x80";
    while (msg.length % 64 - 56) msg += "\x00";
    const words = [];
    for (let i = 0; i < msg.length; i++) {
      words[i >> 2] |= msg.charCodeAt(i) << ((3 - i) % 4) * 8;
    }
    words[words.length] = ((asciiBitLength / maxWord) | 0);
    words[words.length] = asciiBitLength;
    for (let j = 0; j < words.length;) {
      const w = words.slice(j, j += 16);
      const oldHash = hash.slice(0, 8);
      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ ((~e) & hash[6]))
          + k[i]
          + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0);
        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash.unshift((temp1 + temp2) | 0);
        hash[4] = (hash[4] + temp1) | 0;
        hash.pop();
      }
      for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    let result = "";
    for (let i = 0; i < 8; i++) {
      for (let j = 3; j >= 0; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? "0" : "") + b.toString(16);
      }
    }
    return result;
  }

  function open() {
    if (dbp) return dbp;
    if (typeof indexedDB === "undefined") {
      dbp = Promise.reject(new Error("เบราว์เซอร์นี้ไม่เปิด IndexedDB"));
      return dbp;
    }
    dbp = new Promise((resolve, reject) => {
      let done = false;
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        dbp = null;
        reject(new Error("ฐานข้อมูลไม่ตอบ (เปิดไฟล์ตรงจากเครื่อง)"));
      }, 4000);
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
        if (!db.objectStoreNames.contains("projects")) {
          db.createObjectStore("projects", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("sources")) {
          db.createObjectStore("sources", { keyPath: "id" });
        }
      };
      req.onsuccess = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve(req.result);
      };
      req.onerror = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        dbp = null;
        reject(req.error || new Error("เปิดฐานข้อมูลไม่ได้"));
      };
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
    const v = String(text);
    try {
      if (globalThis.crypto && crypto.subtle && typeof crypto.subtle.digest === "function") {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(v));
        return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (err) { /* file:// ไม่ใช่ secure context */ }
    return sha256Sync(v);
  }

  function now() {
    return new Date().toISOString();
  }

  function seedUsers() {
    return [
      {
        id: "faculty", username: "porntipa.c", full: "น.ส.พรทิพา เซี่ยงฉิน",
        position: "อาจารย์", type: "สายวิชาการ", staffId: "10101642",
        dept: "ภาควิชาสังคมศาสตร์", email: "porntipa.c@mahidol.ac.th", phone: "",
        supervisor: "หัวหน้างาน",
        family: "ratee", track: "faculty", role: "faculty",
        roleLabel: "ผู้รับการประเมิน", roleSub: "อาจารย์",
        hint: "กรอกข้อตกลงตามประกาศสายวิชาการของตนเองเท่านั้น",
        tone: "ratee", canEval: false, canChair: false, canHr: false, canAdmin: false, active: true
      },
      {
        id: "support", username: "staff.sh", full: "เจ้าหน้าที่สายสนับสนุน",
        position: "เจ้าหน้าที่บริหารงานทั่วไป", type: "สายสนับสนุน", staffId: "10102001",
        dept: "งานการเจ้าหน้าที่", email: "staff.sh@mahidol.ac.th", phone: "",
        supervisor: "หัวหน้างาน",
        family: "ratee", track: "support", role: "support",
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
    if (!existing.length) {
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
    await seedCatalog();
  }

  async function seedCatalog() {
    const C = typeof PAScore !== "undefined" ? PAScore : null;
    const F = typeof Faculty2570 !== "undefined" ? Faculty2570 : null;
    const projects = (C && C.PROJECT_REGISTRY) || [];
    for (const p of projects) {
      await tx("projects", "readwrite", (s) => s.put({ id: p.code, ...p, seededAt: now() }));
    }
    if (F) {
      await tx("sources", "readwrite", (s) => s.put({
        id: "kpi-pdf",
        title: "คำอธิบายตัวชี้วัด PA 2570 ฉบับจัดทำ PA",
        path: F.SOURCE_PDF,
        kind: "pdf",
        seededAt: now()
      }));
      await tx("sources", "readwrite", (s) => s.put({
        id: "research-xlsx",
        title: "แบบติดตามข้อมูลโครงการวิจัย ปี 2570",
        path: F.SOURCE_XLSX,
        kind: "xlsx",
        rows: (F.RESEARCH_SAMPLE || []).length,
        seededAt: now()
      }));
      await tx("sources", "readwrite", (s) => s.put({
        id: "research-json",
        title: "ตัวอย่างไฟล์เก็บข้อมูลโครงการวิจัยที่ใช้ประกอบการพิจารณา",
        path: F.SOURCE_JSON,
        kind: "json",
        rows: (F.RESEARCH_SAMPLE || []).length,
        seededAt: now()
      }));
    }
  }

  function listProjects() {
    return open().then((db) => new Promise((resolve, reject) => {
      const t = db.transaction("projects", "readonly");
      const q = t.objectStore("projects").getAll();
      q.onsuccess = () => resolve(q.result || []);
      q.onerror = () => reject(q.error);
    }));
  }

  function listSources() {
    return open().then((db) => new Promise((resolve, reject) => {
      const t = db.transaction("sources", "readonly");
      const q = t.objectStore("sources").getAll();
      q.onsuccess = () => resolve(q.result || []);
      q.onerror = () => reject(q.error);
    }));
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

  async function updateProfile(id, patch, actor) {
    const u = await getUser(id);
    if (!u) throw new Error("ไม่พบบัญชี");
    const allow = ["full", "staffId", "position", "type", "dept", "email", "phone", "supervisor"];
    allow.forEach((k) => {
      if (patch[k] !== undefined) u[k] = patch[k];
    });
    u.updatedAt = now();
    await putUser(u);
    await audit(actor || u.username, "update-profile", "แก้ไขข้อมูลส่วนบุคคล " + u.username);
    return u;
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
    await Promise.all(["users", "records", "session", "audit", "projects", "sources"].map((name) => new Promise((resolve, reject) => {
      const t = db.transaction(name, "readwrite");
      t.objectStore(name).clear();
      t.oncomplete = () => resolve();
      t.onerror = () => reject(t.error);
    })));
    dbp = null;
  }

  const api = {
    open, seed, seedCatalog, sha256, sha256Sync,
    listUsers, getUser, getUserByName, putUser, createUser, updateProfile, setPassword, setActive,
    verify, saveRecord, loadRecord, saveSession, loadSession, clearSession,
    audit, listAudit, wipeDemo, listProjects, listSources
  };
  root.PMSDB = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
