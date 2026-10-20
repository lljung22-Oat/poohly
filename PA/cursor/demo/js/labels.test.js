const assert = require("assert");
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");

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
assert.match(pa, /Performance Agreement \(PA\)/);
assert.match(pa, /ชื่อบทความ \/ ชื่อโครงการ/);
assert.match(pa, /บทบาทและเงื่อนไขใช้/);
assert.match(pa, /หน่วยภาระงานที่ได้รับ/);
assert.match(pa, /ผลการประเมินตนเอง/);
assert.match(pa, /หลักฐาน \/ เหตุผล/);
assert.doesNotMatch(pa, /PA ล่วงหน้า/);
assert.match(src, /function facultyItemRow\(/);
assert.match(src, /Upload ไฟล์หลักฐาน/);

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

console.log("labels.test.js ok");
