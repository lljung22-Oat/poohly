const assert = require("assert");
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");
const start = src.indexOf("function facultyItemRow(");
const next = src.indexOf("\nfunction ", start + 1);
const row = src.slice(start, next === -1 ? undefined : next);
assert.match(row, /ชื่อบทความ \/ ชื่อโครงการ/);
assert.match(row, /facultyCriteriaCell/);
assert.match(row, /facultyRoleCell/);
assert.match(row, /fmtUnit/);
assert.match(row, /selfScore/);
assert.match(row, /หลักฐาน/);
assert.match(row, /Upload ไฟล์หลักฐาน/);
assert.doesNotMatch(src, /h2>PA ล่วงหน้า/);
assert.match(src, /h2>Performance Agreement \(PA\)/);

console.log("meeting-ui tests ok");
