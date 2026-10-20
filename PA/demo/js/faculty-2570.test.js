const assert = require("assert");
const fs = require("fs");
const path = require("path");
const F = require("./faculty-2570.js");
const C = require("./criteria.js");

assert.ok(F.UNIT_KPI_2570.some((k) => k.id === "1.1" && k.inUnitPa === true));
assert.ok(F.UNIT_KPI_2570.some((k) => k.id === "intl-pub" && k.inUnitPa === false));
assert.strictEqual(F.INT_COLS.length, 13);
assert.strictEqual(F.NOTIFY_COLS.length, 5);
assert.deepStrictEqual(F.STATUS_FOUND, ["รออนุมัติดำเนินโครงการ"]);
assert.deepStrictEqual(F.REMARK_FOUND, ["ทุนส่วนตัว"]);
assert.ok(!JSON.stringify(F.UNIT_KPI_2570).includes("ศึกษาศาสตร์"));
assert.strictEqual(F.RESEARCH_SAMPLE.length, 9);
assert.strictEqual(F.RESEARCH_SAMPLE.filter((r) => r.sheet === "iNT").length, 2);
assert.strictEqual(F.RESEARCH_SAMPLE.filter((r) => r.sheet === "แจ้งทำวิจัย").length, 7);
assert.ok(F.RESEARCH_SAMPLE.some((r) => String(r.dept).includes("ศึกษาศาสตร์")));
assert.strictEqual(C.PROJECT_REGISTRY.length, 9);
assert.ok(C.findProject("INT-2570-01"));
assert.ok(C.searchProjects("เหลื่อมล้ำ").some((p) => p.code === "INT-2570-01"));
const sources = path.join(__dirname, "..", "sources");
assert.ok(fs.existsSync(path.join(sources, "คำอธิบายตัวชี้วัด-PA-2570-ฉบับจัดทำ-PA.pdf")));
assert.ok(fs.existsSync(path.join(sources, "แบบติดตามข้อมูลโครงการวิจัย-ปี-2570.xlsx")));
assert.ok(fs.existsSync(path.join(sources, "โครงการวิจัย-ปี-2570.json")));

const crit = fs.readFileSync(path.join(__dirname, "criteria.js"), "utf8");
assert.doesNotMatch(crit, /ตารางที่/);
const app = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");
assert.doesNotMatch(app, /ตารางที่/);
assert.match(app, /function viewKpi2570/);
assert.match(app, /function viewResearchTrack/);
assert.match(C.CATALOG.main[1].label, /สอนป\.โท/);
assert.ok(!C.CATALOG.main[1].label.includes("ตารางที่"));
assert.ok(C.SCORE_COND.inDb.includes("SciVal"));
assert.ok(C.PUB[2].formLabel.includes("Q1"));
assert.ok(C.PUB[2].hint.includes("Qurtile 1"));
assert.doesNotMatch(C.SCORE_COND.corp, /1820/);

console.log("faculty-2570.test.js ok");
