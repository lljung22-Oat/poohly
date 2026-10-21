import test from "node:test";
import assert from "node:assert/strict";
import { createPool } from "../src/db.js";
import { resetDatabase, seedIfEmpty } from "../src/store.js";
import { createApp } from "../src/app.js";

process.env.DB_NAME = process.env.DB_NAME || "pa2570_test";

let base;
let server;
let pool;

async function login(portal, username, password = "Pa-seed-2570") {
  const response = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ portal, username, password, year: "2570" }),
  });
  const body = await response.json();
  return { status: response.status, body };
}

async function call(token, method, path, payload) {
  const response = await fetch(`${base}${path}${path.includes("?") ? "&" : "?"}year=2570`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(payload ? { "Content-Type": "application/json" } : {}),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const body = await response.json();
  return { status: response.status, body };
}

function draftBody() {
  const weight = { strat: 25, main: 55, assign: 15, community: 5 };
  return {
    workloads: ["strat", "main", "assign", "community"].map((groupId) => ({
      groupId,
      weight: weight[groupId],
      agreements: [
        {
          title: `ข้อตกลง ${groupId}`,
          indicators: [{ title: "ตัวชี้วัด", kind: "ปริมาณ", weight: 100, target: "ครบ", indicatorRef: groupId === "strat" ? "1.1" : null }],
        },
      ],
    })),
  };
}

test.before(async () => {
  pool = await createPool();
  await resetDatabase(pool);
  await seedIfEmpty(pool);
  const app = createApp(pool);
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
});

test("วงจร PA CC แยกสาย และไม่คิดหน่วยจากเล่มตัวชี้วัด", async () => {
  const faculty = await login("ratee", "porntipa.c");
  assert.equal(faculty.status, 200);
  assert.equal(faculty.body.roleLabel, "ผู้รับการประเมิน");
  const token = faculty.body.token;
  const menus = (await call(token, "GET", "/api/me")).body.menus.map((item) => item.label);
  assert.equal(menus.some((label) => label.includes("แบบ 05")), false);
  assert.equal(menus.some((label) => label.includes("โครงการวิจัย")), true);

  const saved = await call(token, "PUT", "/api/pa/me", draftBody());
  assert.equal(saved.status, 200);
  assert.equal(saved.body.announcementUnits, "SOURCE_MISSING");
  assert.equal(saved.body.totalUnits, 1820);
  assert.deepEqual(saved.body.workloads.map((workload) => workload.groupId), ["strat", "main", "assign", "community"]);
  assert.equal(saved.body.facultyCriteria[0].id, "pub_top1");
  assert.equal(saved.body.facultyCriteria.find((item) => item.id === "pub_q1").label.startsWith("1.3"), true);
  const submitted = await call(token, "POST", "/api/pa/me/submit");
  assert.equal(submitted.status, 200);
  assert.equal(submitted.body.status, "wait");

  const support = await login("ratee", "support.ratee");
  const blockedResearch = await call(support.body.token, "GET", "/api/research/me/iNT");
  assert.equal(blockedResearch.status, 403);
  const blockedIndicator = await call(support.body.token, "GET", "/api/indicators");
  assert.equal(blockedIndicator.status, 403);
  const form = await call(support.body.token, "GET", "/api/staff-form/me/form05");
  assert.equal(form.body.source, "SOURCE_MISSING");
  const facultyForm = await call(token, "GET", "/api/staff-form/me/form05");
  assert.equal(facultyForm.status, 403);

  const people = await call((await login("evaluator", "unit.head")).body.token, "GET", "/api/people");
  const ratee = people.body.people.find((person) => person.username === "porntipa.c");
  const headToken = (await login("evaluator", "unit.head")).body.token;
  const approved = await call(headToken, "POST", `/api/pa/${ratee.id}/decide`, { all: true, decision: "approve" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.status, "approved");

  const indicators = saved.body.workloads.flatMap((workload) => workload.agreements.flatMap((agreement) => agreement.indicators));
  const ids = (await call(token, "GET", "/api/pa/me")).body.workloads.flatMap((workload) =>
    workload.agreements.flatMap((agreement) => agreement.indicators.map((indicator) => indicator.id)),
  );
  const scored = await call(token, "PUT", "/api/pa/me/self-score", {
    scores: ids.map((id) => ({ indicatorId: id, selfScore: 8 })),
  });
  assert.equal(scored.status, 200);
  const sent = await call(token, "POST", "/api/pa/me/self-score/submit");
  assert.equal(sent.status, 200);
  const locked = await call(token, "PUT", "/api/pa/me/self-score", {
    scores: [{ indicatorId: ids[0], selfScore: 1 }],
  });
  assert.equal(locked.status, 409);
  assert.equal(indicators.length, 4);

  const cc = await call(token, "PUT", "/api/cc/me", {
    scores: ["mastery", "altruism", "harmony", "integrity", "determination", "originality", "leadership"].map((code) => ({
      code,
      score: 8,
    })),
  });
  assert.equal(cc.status, 200);
  assert.equal((await call(token, "POST", "/api/cc/me/submit")).status, 200);

  const first = await login("evaluator", "first.head");
  await call(first.body.token, "PUT", `/api/cc/${ratee.id}`, {
    scores: ["mastery", "altruism", "harmony", "integrity", "determination", "originality", "leadership"].map((code) => ({
      code,
      score: 7,
    })),
  });
  assert.equal((await call(first.body.token, "POST", `/api/cc/${ratee.id}/submit`)).status, 200);
  const fillIn = await call(first.body.token, "PUT", `/api/pa/${ratee.id}/head-score`, {
    scores: ids.map((id) => ({ indicatorId: id, headScore: 9 })),
  });
  assert.equal(fillIn.status, 403);

  await call(headToken, "PUT", `/api/cc/${ratee.id}`, {
    scores: ["mastery", "altruism", "harmony", "integrity", "determination", "originality", "leadership"].map((code) => ({
      code,
      score: 9,
    })),
  });
  await call(headToken, "PUT", `/api/pa/${ratee.id}/head-score`, {
    scores: ids.map((id) => ({ indicatorId: id, headScore: 9 })),
  });
  const checked = await call(headToken, "POST", `/api/review/${ratee.id}/check`, { strengths: "", improvements: "", suggestions: "" });
  assert.equal(checked.status, 200);
  assert.equal((await call(headToken, "POST", `/api/review/${ratee.id}/sign`)).status, 200);
  const ack = await call(token, "POST", `/api/review/me/ack`);
  assert.equal(ack.body.paStatus, "ack");
  assert.equal(ack.body.ccStatus, "ack");

  const report = await call(token, "GET", "/api/report/me");
  assert.equal(report.body.weightedTotal, "SOURCE_MISSING");
  assert.equal(report.body.longNarrative, false);

  const created = await call(token, "POST", "/api/research/me/iNT", { ชื่อโครงการ: "โครงการของฉัน", สถานะ: "" });
  assert.equal(created.status, 200);
  assert.equal(created.body.rows.some((row) => String(row.สังกัด || "").includes("ศึกษาศาสตร์")), false);
  const extra = await call(token, "POST", "/api/research/me/iNT", { ชื่อโครงการ: "x", เบิกจ่ายจริง: "1" });
  assert.equal(extra.status, 400);
  const notice = await call(token, "POST", "/api/research/me/" + encodeURIComponent("แจ้งทำวิจัย"), { ชื่อโครงการ: "แจ้งเอง", หมายเหตุ: "ทุนส่วนตัว" });
  assert.equal(notice.status, 200);

  const lookup = await call(token, "GET", "/api/indicators");
  const intl = lookup.body.catalog.find((row) => row.id === "intl-pub");
  const lab = lookup.body.catalog.find((row) => row.id === "4.12");
  assert.equal(intl.inUnitPa, false);
  assert.equal(lab.formulaDenominator, "SOURCE_MISSING");
  assert.equal(lookup.body.facultyUnitLink, "SOURCE_MISSING");
});

test("รหัสผิดสามครั้งในช่องผู้รับการประเมินระงับตาม UM-03", async () => {
  const admin = await login("admin", "uni.admin");
  assert.equal((await call(admin.body.token, "POST", "/api/admin/users", {
    username: "lock.user",
    password: "Pa-seed-2570",
    role: "support",
    fullName: "บัญชีทดสอบระงับ",
  })).status, 200);
  assert.equal((await login("evaluator", "lock.user")).status, 401);
  assert.equal((await login("ratee", "lock.user", "wrong")).status, 401);
  assert.equal((await login("ratee", "lock.user", "wrong")).status, 401);
  assert.equal((await login("ratee", "lock.user", "wrong")).status, 401);
  const locked = await login("ratee", "lock.user", "Pa-seed-2570");
  assert.equal(locked.status, 423);
});
