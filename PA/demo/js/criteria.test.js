const assert = require("assert");
const S = require("./criteria.js");

function w(over) {
  return Object.assign({
    title: "x", date: "", crit: "", other: "", amount: "",
    role: "pi", inDb: true, withStudent: false, reason: "", file: ""
  }, over);
}

function tgt(over) {
  return Object.assign({
    criteriaId: "pub_top1", role: "pi", inDb: true, withStudent: false,
    amount: "", hours: "", qty: 1, weight: 25, selfScore: null, chairScore: null
  }, over);
}

assert.deepStrictEqual(S.calc(w({ crit: "top1" })), { units: 455, score: 10, autoScore: 10 });
assert.deepStrictEqual(S.calc(w({ crit: "top10" })), { units: 410, score: 9, autoScore: 9 });
assert.deepStrictEqual(S.calc(w({ crit: "q1" })), { units: 364, score: 8, autoScore: 8 });
assert.deepStrictEqual(S.calc(w({ crit: "q2" })), { units: 273, score: 6, autoScore: 6 });
assert.deepStrictEqual(S.calc(w({ crit: "", other: "q3" })), { units: 228, score: 5, autoScore: 5 });
assert.deepStrictEqual(S.calc(w({ crit: "", other: "q4" })), { units: 182, score: 4, autoScore: 4 });
assert.deepStrictEqual(S.calc(w({ crit: "top1", role: "corr" })), { units: 455, score: 10, autoScore: 10 });
assert.deepStrictEqual(S.calc(w({ crit: "top1", role: "co" })), { units: 227.5, score: 5, autoScore: 5 });
assert.strictEqual(S.calc(w({ crit: "top1", role: "" })).units, 0);
assert.strictEqual(S.calc(w({ crit: "top1", inDb: false })).units, 0);
assert.strictEqual(S.calc(w({ crit: "top1", withStudent: true })).units, 0);
assert.strictEqual(S.calc(w({ crit: "top1", withStudent: true })).blocked, "student");

assert.deepStrictEqual(S.grantUnits("grant_th", 3000000), { units: 455, score: 10 });
assert.deepStrictEqual(S.grantUnits("grant_th", 400000), { units: 273, score: 6 });
assert.deepStrictEqual(S.grantUnits("grant_en", 1000000), { units: 455, score: 10 });
assert.deepStrictEqual(S.grantUnits("grant_mu", 500000), { units: 455, score: 10 });

const two = [w({ crit: "top1" }), w({ crit: "top10" })];
assert.strictEqual(S.sumUnits(two), 455);

const g1 = S.calcTarget(tgt({ criteriaId: "pub_q1" }), "strat");
assert.strictEqual(g1.units, 364);
assert.strictEqual(g1.score, 8);

const teach = S.calcTarget({ criteriaId: "teach_grad_main", hours: 15 }, "main");
assert.strictEqual(teach.units, 60);

const teachLab = S.calcTarget({ criteriaId: "teach_ug_lab", hours: 10 }, "main");
assert.strictEqual(teachLab.units, 15);
assert.strictEqual(S.calcTarget({ criteriaId: "teach_ug_lec", teachFormula: "ug_lab", hours: 10 }, "main").units, 30);

const custom = S.calcTarget({ criteriaId: "asg_other", proposedUnits: 22, proposedScore: 7 }, "assign");
assert.strictEqual(custom.units, 22);
assert.strictEqual(custom.score, 7);

assert.strictEqual(S.TEACH_FORMULAS.length, 3);
assert.strictEqual(S.teachCriteriaFromPick("ug", "lec"), "teach_ug_lec");
assert.strictEqual(S.teachCriteriaFromPick("grad", ""), "teach_grad_main");
assert.strictEqual(S.teachPickOf("teach_ug_lab").level, "ug");
assert.strictEqual(S.TEACH_PICK.length, 3);
assert.ok(S.TEACH_PICK.find((x) => x.id === "ug").conds.find((c) => c.id === "lec").label.includes("3 หน่วย"));
assert.strictEqual(S.MAX_EVIDENCE_FILES, 3);
assert.ok(S.searchProjects("เหลื่อมล้ำ").some((p) => p.code === "INT-2570-01"));
assert.strictEqual(S.findProject("INT-2570-01").contractDate, "2569-10-01");
assert.strictEqual(S.findProject("INT-2570-02").contractDate, "");
assert.strictEqual(S.PROJECT_REGISTRY.length, 9);
assert.strictEqual(S.findSyllabus("SHSS501").hours, 45);
assert.strictEqual(S.doiStatus("10.1234/abc").ok, true);
assert.strictEqual(S.doiStatus("https://doi.org/10.1234/abc").ok, true);
assert.strictEqual(S.normalizeDoi("https://doi.org/10.1234/abc"), "10.1234/abc");
assert.strictEqual(S.doiStatus("not-a-doi").ok, false);
assert.strictEqual(S.doiUrl("https://doi.org/10.1234/abc"), "https://doi.org/10.1234/abc");
assert.strictEqual(S.doiUrl(""), "");
assert.ok(S.SCORE_COND.doi.includes("แนบลิงก์ DOI"));
const ev = S.attachEvidence({ files: ["a.pdf", "b.pdf"] }, ["c.pdf", "d.pdf"]);
assert.strictEqual(ev.files.length, 3);
assert.strictEqual(ev.blocked, true);
const prev = S.expectedPreview({ criteriaId: "pub_q1", inDb: false }, "strat");
assert.strictEqual(prev.units, 364);

const asg = S.calcTarget({ criteriaId: "asg_chair", qty: 2 }, "assign");
assert.strictEqual(asg.units, 40);

const com = S.calcTarget({ criteriaId: "com_attend", qty: 3 }, "community");
assert.strictEqual(com.units, 15);

const mupsf = S.calcTarget({ criteriaId: "mupsf2" }, "strat");
assert.strictEqual(mupsf.units, 319);
assert.strictEqual(mupsf.score, 7);

assert.strictEqual(S.GROUPS.reduce((s, g) => s + g.pct, 0), 100);
assert.strictEqual(S.GROUPS.reduce((s, g) => s + g.cap, 0), 1820);
assert.strictEqual(S.GROUPS[0].id, "main");
assert.strictEqual(S.GROUPS[0].name, "ภาระงานหลัก");
assert.strictEqual(S.GROUPS[3].id, "strat");
assert.strictEqual(S.STRAT_BUCKETS.length, 3);
assert.strictEqual(S.STRAT_BUCKETS[0].title, "ยุทธศาสตร์ตีพิมพ์");
assert.strictEqual(S.STRAT_BUCKETS[1].title, "ยุทธศาสตร์ทุนวิจัย");
assert.strictEqual(S.STRAT_BUCKETS[2].title, "ยุทธศาสตร์อื่นๆ");
assert.strictEqual(S.PA_HEADERS.length, 7);
assert.strictEqual(S.PA_HEADERS[1], "วิชา");
assert.strictEqual(S.PA_HEADERS[2], "รายละเอียด");
assert.strictEqual(S.GROUP_HEADERS.assign.item, "กิจกรรม");
assert.strictEqual(S.GROUP_HEADERS.community.item, "ชื่อกิจกรรม");
assert.strictEqual(S.GROUP_HEADERS.strat.item, "ชื่อบทความ");
assert.strictEqual(S.GROUP_HEADERS.strat.eval[2], "ภาระงาน");
assert.strictEqual(S.GROUP_HEADERS.strat.eval[3], "หน่วยภาระงานด้าน");
assert.deepStrictEqual(S.paHeaders("assign", "plan"), ["ลำดับ", "กิจกรรม", "รวมหน่วยภาระงาน", "ผลการประเมินตนเอง"]);
assert.deepStrictEqual(S.paHeaders("strat", "plan"), ["ลำดับ", "ชื่อบทความ", "รวมหน่วยภาระงาน", "ผลการประเมินตนเอง"]);
assert.ok(S.PA_HEADERS[6].includes("9 – 10"));
assert.strictEqual(S.PA_PLAN_HEADERS.length, 4);
assert.strictEqual(S.PA_PLAN_HEADERS[1], "วิชา");
assert.strictEqual(S.PA_PLAN_HEADERS[3], "ผลการประเมินตนเอง");
assert.ok(!S.PA_PLAN_HEADERS.includes("รายละเอียดเกณฑ์"));
assert.strictEqual(S.mainSectionOf({ criteriaId: "res_book" }), "book");
assert.strictEqual(S.mainSectionOf({ criteriaId: "course_proj" }), "service");
assert.ok(S.MAIN_SECTIONS.some((x) => x.no === "1.2.2"));
assert.deepStrictEqual(
  S.sectionHeaders(S.MAIN_SECTIONS.find((x) => x.id === "teach"), "plan"),
  ["ลำดับ", "วิชา", "จำนวนชั่วโมง", "รวมหน่วยภาระงาน", "ผลการประเมินตนเอง"]
);
assert.deepStrictEqual(
  S.sectionHeaders(S.MAIN_SECTIONS.find((x) => x.id === "research"), "plan"),
  ["ลำดับ", "ชื่อเรื่องงานวิจัย", "รวมหน่วยภาระงาน", "ผลการประเมินตนเอง"]
);
const emptyHours = S.expectedPreview({ criteriaId: "teach_grad_main", hours: "" }, "main");
assert.strictEqual(emptyHours.units, 0);
assert.ok(emptyHours.label.includes("กรอกชั่วโมง"));
assert.strictEqual(S.calcTarget({ criteriaId: "teach_grad_main", hours: 45 }, "main").units, 180);
assert.strictEqual(S.calcTarget({ criteriaId: "teach_ug_lec", hours: 30 }, "main").units, 90);
assert.strictEqual(S.calcTarget({ criteriaId: "teach_ug_lab", hours: 24 }, "main").units, 36);
assert.strictEqual(S.calcTarget({ criteriaId: "course_proj", hours: 12 }, "main").units, 36);
assert.strictEqual(S.sectionHeaders(S.MAIN_SECTIONS.find((x) => x.id === "research"), "eval")[2], "ภาระความรับผิดชอบ");
assert.strictEqual(S.sectionHeaders(S.MAIN_SECTIONS.find((x) => x.id === "research"), "eval")[3], "หน่วยภาระงานด้านกระบวนการวิจัย");
assert.strictEqual(S.sectionHeaders(S.MAIN_SECTIONS.find((x) => x.id === "book"), "eval")[1], "ชื่อผลงาน");
assert.strictEqual(S.sectionHeaders(S.MAIN_SECTIONS.find((x) => x.id === "book"), "eval")[3], "หน่วยภาระงานด้านกระบวนการดำเนินงาน");
assert.strictEqual(S.CC_ITEMS.length, 7);
assert.strictEqual(S.IDP_MAX, 2);

const groups = [
  {
    id: "strat",
    agreements: [{ kpis: [{ targets: [tgt({ weight: 25, criteriaId: "pub_top1" })] }] }]
  },
  {
    id: "main",
    agreements: [{ kpis: [{ targets: [{ criteriaId: "teach_grad_main", hours: 45, weight: 55 }] }] }]
  },
  {
    id: "assign",
    agreements: [{ kpis: [{ targets: [{ criteriaId: "asg_chair", qty: 2, weight: 15, selfScore: 8 }] }] }]
  },
  {
    id: "community",
    agreements: [{ kpis: [{ targets: [{ criteriaId: "com_chair", qty: 1, weight: 5, selfScore: 8 }] }] }]
  }
];
assert.strictEqual(S.sumWeight(groups), 100);
const pa = S.paPoints(groups);
assert.ok(pa > 80 && pa <= 100, "paPoints " + pa);

const ccItems = S.CC_ITEMS.map((x) => ({ id: x.id, self: 8, chair: 8 }));
const tot = S.totalScore(groups, ccItems, true);
assert.strictEqual(tot.cc, 16);
assert.ok(tot.total >= 80, "total " + tot.total);
assert.ok(["ดีเด่น", "ดีมาก", "ดี"].includes(tot.level));

assert.strictEqual(S.levelOf(95), "ดีเด่น");
assert.strictEqual(S.levelOf(85), "ดีมาก");
assert.strictEqual(S.levelOf(75), "ดี");
assert.strictEqual(S.levelOf(65), "พอใช้");
assert.strictEqual(S.levelOf(50), "ควรปรับปรุง");

const supItems = [
  { weight: 20, selfScore: 8, chairScore: 8 },
  { weight: 55, selfScore: 8, chairScore: 8 },
  { weight: 15, selfScore: 8, chairScore: 8 },
  { weight: 10, selfScore: 8, chairScore: 8 }
];
assert.strictEqual(S.sumSupportWeight(supItems), 100);
assert.strictEqual(S.supportPaPoints(supItems, false), 80);
const supTot = S.supportTotalScore(supItems, ccItems, true);
assert.strictEqual(supTot.pa, 64);
assert.strictEqual(supTot.cc, 16);
assert.strictEqual(supTot.total, 80);
assert.strictEqual(S.SUPPORT_FC_ITEMS.length, 2);
assert.strictEqual(S.WORK_TYPES.length, 4);

assert.strictEqual(S.PUB[0].formLabel.includes("Top1"), true);
assert.ok(!S.PUB[0].formLabel.includes("SciVal/Scopus"));
assert.ok(S.PUB[0].hint.includes("SciVal/Scopus"));
assert.ok(S.PUB[2].hint.includes("Qurtile 1"));
assert.strictEqual(S.GRANT_SOURCES.grant_th.label.includes("ภายในประเทศ"), true);
assert.strictEqual(S.GRANT_SOURCES.grant_en.label.includes("ต่างประเทศ"), true);
assert.strictEqual(S.GRANT_SOURCES.grant_mu.label.includes("มหาวิทยาลัย"), true);
assert.strictEqual(S.GRANT_SOURCES.grant_th.tiers[0].amount, 3000000);
assert.ok(S.GRANT_SOURCES.grant_th.note.includes("นับจำนวนเงินที่ระบุในสัญญา"));
assert.ok(S.GRANT_SOURCES.grant_th.note.includes("ไม่นับ Fundamental Fund"));
assert.ok(S.SCORE_COND.inDb.includes("SciVal หรือ Scopus"));
assert.ok(S.SCORE_COND.evidence.includes("3 ไฟล์"));
assert.ok(S.CATALOG.strat.find((x) => x.id === "mupsf3").hint.includes("ข้ามศาสตร์"));
assert.ok(S.CATALOG.strat.find((x) => x.id === "policy_intl").hint.includes("ไม่นับสะสมปีก่อน"));
assert.ok(!S.PUB[2].formLabel.includes("นับเฉพาะที่ปรากฏในฐาน"));
assert.strictEqual(S.grantUnits("grant_th", 3000000).units, 455);

console.log("criteria tests ok");
