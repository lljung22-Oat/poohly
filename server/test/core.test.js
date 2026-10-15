import test from "node:test";
import assert from "node:assert/strict";
import { config } from "../src/config.js";
import {
  competencyItemPercent,
  competencyProportional,
  facultyUnitsFromAnnouncement,
  netProfitMargin,
  publicationTitles,
  ratioPercent,
  roleFactor,
  scaleLabel,
  scoreCc,
  weightedTotal,
  weightsComplete,
  SOURCE_MISSING,
} from "../src/formulas.js";
import {
  acknowledge,
  agreementAfterAmend,
  agreementAfterDecision,
  disagree,
  idpSubmit,
  selfScoreSubmit,
} from "../src/state.js";
import { HIDDEN_FROM_FACULTY, HIDDEN_FROM_SUPPORT, menusFor } from "../src/acl.js";

test("น้ำหนักครบ 100 และฉบับร่างยังไม่ครบได้ในชั้นตรวจ", () => {
  assert.equal(weightsComplete([25, 55, 15, 5]), true);
  assert.equal(weightsComplete([40]), false);
});

test("สูตรสมรรถนะ UM-01", () => {
  const C = competencyItemPercent(7, 70);
  assert.equal(C, 100);
  assert.equal(competencyProportional(7, C, 70), 10);
  const summary = scoreCc([10, 10, 10, 10, 10, 10, 10]);
  assert.equal(summary.C, 100);
  assert.equal(summary.D, 10);
});

test("ไม่แปลงคะแนน 0–10 เป็น paScore เอง", () => {
  assert.equal(weightedTotal(SOURCE_MISSING, 100, config.weights), SOURCE_MISSING);
  assert.equal(weightedTotal(80, 100, config.weights), 84);
});

test("ช่วงคะแนนตามสไลด์", () => {
  assert.equal(scaleLabel(9, config.scale5), "สูงกว่าเป้าหมาย");
  assert.equal(scaleLabel(2, config.scale5), "ต่ำกว่าเป้าหมายมาก");
});

test("ชั้นส่วนงานไม่ยอมให้สูตรร้อยละไปคิดหน่วยอาจารย์", () => {
  assert.equal(facultyUnitsFromAnnouncement(), SOURCE_MISSING);
  assert.equal(roleFactor(100), 1);
  assert.equal(roleFactor(70), SOURCE_MISSING);
  assert.throws(() => ratioPercent(10, 79, "faculty-units"), /REFUSED_FACULTY_UNIT_MERGE/);
  assert.equal(ratioPercent(10, 79, "unit-layer"), (10 / 79) * 100);
  assert.equal(ratioPercent(1, SOURCE_MISSING, "unit-layer"), SOURCE_MISSING);
  assert.equal(netProfitMargin(10, 100, "unit-layer"), 10);
});

test("ตัด baseline ผลงาน และมกราคม 2570 ไม่ลบ", () => {
  assert.deepEqual(
    publicationTitles({ quarter: 1, pulledTitles: ["A", "B"], baselineTitles: ["A"] }, "unit-layer"),
    ["B"],
  );
  assert.deepEqual(
    publicationTitles({ quarter: 1, month: "2570-01", pulledTitles: ["A"], baselineTitles: ["A"] }, "unit-layer"),
    ["A"],
  );
  assert.deepEqual(
    publicationTitles({ quarter: 2, quarter1Titles: ["A"], pulledTitles: ["A", "C"] }, "unit-layer"),
    ["A", "C"],
  );
});

test("ล็อกหลังส่ง และไม่เห็นด้วยต้องมีเหตุผลแล้วคู่ PA กับ CC", () => {
  assert.equal(selfScoreSubmit("approved", false).status, "reported");
  assert.equal(selfScoreSubmit("reported", false).ok, false);
  assert.equal(agreementAfterDecision("wait", "reject", "").ok, false);
  assert.equal(agreementAfterDecision("wait", "approve").status, "approved");
  assert.equal(agreementAfterAmend("approved", false, "approved").ok, false);
  assert.equal(agreementAfterAmend("approved", true, "reported").ok, false);
  const back = disagree({
    paStatus: "head",
    ccStatus: "head",
    paSigned: true,
    ccSigned: true,
    reason: "ไม่ตรงผลงาน",
  });
  assert.equal(back.paStatus, "disagree");
  assert.equal(back.ccStatus, "disagree");
  assert.equal(acknowledge({ paStatus: "head", ccStatus: "head", paSigned: true, ccSigned: false }).ok, false);
});

test("แผนพัฒนาส่งได้จากฉบับร่าง และเกินสองรายการไม่ใช่สูตรคะแนน", () => {
  assert.equal(idpSubmit("draft").status, "idpWait");
  assert.equal(config.idp.hardBlockOverMax, false);
  assert.deepEqual(config.idp.resultLabels, ["เป็นไปตามที่คาดหวัง", "ไม่เป็นไปตามที่คาดหวัง"]);
});

test("เมนูสายวิชาการไม่เห็นแบบสายสนับสนุน และกลับกัน", () => {
  const faculty = menusFor({ role: "faculty" }, config, true).map((item) => item.id);
  const support = menusFor({ role: "support" }, config, true).map((item) => item.id);
  for (const id of HIDDEN_FROM_FACULTY) assert.equal(faculty.includes(id), false);
  for (const id of HIDDEN_FROM_SUPPORT) assert.equal(support.includes(id), false);
  assert.equal(faculty.includes("research2570"), true);
  assert.equal(support.includes("follow"), true);
  assert.equal(support.includes("form11"), false);
  assert.equal(config.form11.enabled, false);
});
