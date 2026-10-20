const assert = require("assert");
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");
const crit = fs.readFileSync(path.join(__dirname, "criteria.js"), "utf8");

function sliceFn(name) {
  const start = src.indexOf(`function ${name}(`);
  assert.ok(start >= 0, "missing " + name);
  const next = src.indexOf("\nfunction ", start + 1);
  return src.slice(start, next === -1 ? undefined : next);
}

assert.match(src, /function firstHeadLabel\(\) \{ return "หัวหน้างานขั้นต้น"; \}/);
assert.match(src, /function headLabel\(\) \{ return "หัวหน้างาน"; \}/);
assert.match(src, /roleLabel: "หัวหน้างานขั้นต้น"/);
assert.match(src, /roleLabel: "หัวหน้างาน"/);
assert.match(src, /role: "committee"/);
assert.match(src, /role: "chair"/);
assert.match(src, /canChair: true/);
assert.doesNotMatch(src, /roleLabel: "กรรมการประเมิน"/);
assert.doesNotMatch(src, /roleLabel: "ประธานกรรมการประเมิน"/);

const pa = sliceFn("viewPA");
assert.match(pa, /แบบรายงานผลการปฏิบัติงาน/);
assert.match(pa, /PA_HEADERS/);
assert.match(pa, /PA_PLAN_HEADERS/);
assert.doesNotMatch(pa, /h2>PA ล่วงหน้า/);
assert.doesNotMatch(pa, /data-pa-layout/);
assert.doesNotMatch(pa, /data-move-row/);
assert.doesNotMatch(pa, /จัดทำข้อตกลง \(กระชับ\)/);
assert.match(src, /function facultyPeriodSwitch\(/);
assert.match(src, /function facultyOrderPanel\(/);
assert.match(src, /PA ล่วงหน้า \(ก่อนทำงาน\)/);
assert.match(src, /หน้าประเมินจริง/);
assert.match(src, /data-pa-layout="plan"/);
assert.match(src, /data-pa-layout="eval"/);
assert.match(sliceFn("viewModules"), /facultyPeriodSwitch\(\)/);
assert.match(src, /data-move-row/);
assert.match(src, /function moveFacultyRow\(/);
assert.match(src, /ยุทธศาสตร์ตีพิมพ์/);
assert.match(src, /meta\.name/);
assert.match(crit, /ภาระงานหลัก/);
assert.match(crit, /ภาระงานที่ได้รับมอบหมาย/);
assert.match(crit, /ภาระงานเพื่อส่วนรวม/);
assert.match(crit, /ภาระงานที่สอดคล้องยุทธศาสตร์/);
assert.match(src, /function facultyItemRow\(/);
assert.match(src, /หลักฐาน \(ไม่เกิน \$\{C\.MAX_EVIDENCE_FILES\} ไฟล์ต่อเรื่อง\)/);

const paReport = sliceFn("viewPaReport");
assert.match(paReport, /ประเมินผลงาน/);
assert.match(paReport, /ประเมินตนเอง \(0–10\)/);
assert.doesNotMatch(paReport, /ประเมินผลงานจริง/);

assert.match(src, /function loginLocal\(/);
assert.match(src, /function isFileMode\(/);

const competency = sliceFn("viewCompetency");
assert.match(competency, /ประเมินผลงาน และประเมินสมรรถนะ/);
assert.match(competency, /firstHeadLabel\(\)/);
assert.match(competency, /headLabel\(\)/);
assert.doesNotMatch(competency, /กรรมการ/);
assert.doesNotMatch(competency, /ประธาน/);
assert.doesNotMatch(competency, /data-cc="\$\{it\.id\}:report"/);

assert.doesNotMatch(src, /โหมดประธาน/);
assert.doesNotMatch(src, /โหมดกรรมการ/);
assert.doesNotMatch(src, /พิมพ์คำอธิบายรายงานผล/);

const facDash = sliceFn("facultyDashCards");
assert.match(facDash, /PA ภาระงานอาจารย์/);
assert.doesNotMatch(facDash, /สายสนับสนุน/);
assert.doesNotMatch(facDash, /ข้อมูลวันลา/);
assert.doesNotMatch(facDash, /paStaff/);
const supDash = sliceFn("supportDashCards");
assert.match(supDash, /paStaff/);
assert.match(supDash, /สายสนับสนุน/);
assert.doesNotMatch(supDash, /PA ภาระงานอาจารย์/);
assert.doesNotMatch(supDash, /kpi2570/);

console.log("labels.test.js ok");
