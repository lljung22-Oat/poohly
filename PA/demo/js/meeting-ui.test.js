const assert = require("assert");
const fs = require("fs");
const path = require("path");
const S = require("./criteria.js");

assert.strictEqual(S.STRAT_BUCKETS.map((b) => b.title).join("|"), "ยุทธศาสตร์ตีพิมพ์|ยุทธศาสตร์ทุนวิจัย|ยุทธศาสตร์อื่นๆ");
assert.strictEqual(S.CATALOG.assign.some((c) => c.id === "asg_other"), true);
assert.strictEqual(S.CATALOG.community.some((c) => c.id === "com_other"), true);
assert.ok(!JSON.stringify(S.PROJECT_REGISTRY).includes("ศึกษาศาสตร์"));
assert.ok(!JSON.stringify(S.SYLLABUS_REGISTRY).includes("ศึกษาศาสตร์"));

const src = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");
assert.match(src, /function facultyEvalRow\(/);
assert.match(src, /function projectSearchBox\(/);
assert.match(src, /function syllabusBox\(/);
assert.match(src, /function evidenceBox\(/);
assert.doesNotMatch(src, /facultyItemRow[\s\S]*Upload ไฟล์หลักฐาน/);

console.log("meeting-ui tests ok");
