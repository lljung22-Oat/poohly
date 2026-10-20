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

const paPre = sliceFn("viewPA");
assert.match(paPre, /PA ล่วงหน้า \(ก่อนเริ่มปฏิบัติงาน\)/);
assert.match(paPre, /หน่วยภาระงานที่คาดว่าจะได้รับ/);
assert.doesNotMatch(paPre, /Upload ไฟล์หลักฐาน/);
assert.doesNotMatch(paPre, /หลักฐาน \/ เหตุผล/);
assert.match(src, /ยุทธศาสตร์ตีพิมพ์/);
assert.match(src, /ยุทธศาสตร์ทุนวิจัย/);
assert.match(src, /ยุทธศาสตร์อื่นๆ/);

const paReport = sliceFn("viewPaReport");
assert.match(paReport, /ประเมินผลงานจริง/);
assert.match(paReport, /ผลการดำเนินงาน/);
assert.match(paReport, /ประเมินตนเอง \(0–10\)/);
assert.match(paReport, /DOI/);
assert.match(paReport, /ไม่เกิน 3 ไฟล์ต่อเรื่อง/);
assert.match(src, /data-files/);
assert.match(src, /function loginLocal\(/);
assert.match(src, /data-proj-q/);
assert.match(src, /ตัวอย่างไฟล์เก็บข้อมูลโครงการวิจัยที่ใช้ประกอบการพิจารณา/);
assert.match(src, /data-syl-q/);
assert.match(src, /textarea data-pa="t:\$\{t\.id\}:report"/);
assert.doesNotMatch(paReport, /รายงานผล \/ หลักฐาน/);

const competency = sliceFn("viewCompetency");
assert.match(competency, /ประเมินผลงาน และประเมินสมรรถนะ/);
assert.match(competency, /firstHeadLabel\(\)/);
assert.match(competency, /headLabel\(\)/);
assert.doesNotMatch(competency, /รายงานผล/);
assert.doesNotMatch(competency, /กรรมการ/);
assert.doesNotMatch(competency, /ประธาน/);
assert.doesNotMatch(competency, /data-cc="\$\{it\.id\}:report"/);

assert.doesNotMatch(src, /โหมดประธาน/);
assert.doesNotMatch(src, /โหมดกรรมการ/);
assert.doesNotMatch(src, /พิมพ์คำอธิบายรายงานผล/);

console.log("labels.test.js ok");
