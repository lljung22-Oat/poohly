import test from "node:test";
import assert from "node:assert/strict";
import { FACULTY_CRITERIA, FACULTY_GROUPS } from "../src/facultyCriteria.js";
import { config } from "../src/config.js";

test("ลำดับสี่ภาระงานและเกณฑ์ประกาศคณะไม่ใช้เลขเล่มส่วนงาน", () => {
  assert.deepEqual(FACULTY_GROUPS.map((group) => group.id), ["strat", "main", "assign", "community"]);
  assert.deepEqual(FACULTY_GROUPS.map((group) => group.no), [1, 2, 3, 4]);

  const strat = FACULTY_CRITERIA.filter((item) => item.groupId === "strat").map((item) => item.id);
  assert.deepEqual(strat.slice(0, 9), [
    "pub_top1", "pub_top10", "pub_q1", "pub_q2", "pub_q3", "pub_q4", "grant_th", "grant_en", "grant_mu",
  ]);
  assert.equal(FACULTY_CRITERIA.find((item) => item.id === "pub_top1").label.startsWith("1.1"), true);
  assert.equal(FACULTY_CRITERIA.find((item) => item.id === "pub_q1").label.startsWith("1.3"), true);

  const unitQ1 = config.unitPaFy2570.catalog.find((item) => item.id === "1.1");
  assert.match(unitQ1.title, /Q1/);
  assert.equal(strat.includes("1.1"), false);

  const main = FACULTY_CRITERIA.filter((item) => item.groupId === "main").map((item) => item.id);
  assert.deepEqual(main.slice(0, 6), ["teach_grad_main", "teach_ug_lec", "teach_ug_lab", "thesis_ug", "course_proj", "res_proc_1"]);
  assert.deepEqual(main.slice(-1), ["res_proc_5"]);
});
