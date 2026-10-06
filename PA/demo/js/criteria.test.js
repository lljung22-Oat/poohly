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

const asg = S.calcTarget({ criteriaId: "asg_chair", qty: 2 }, "assign");
assert.strictEqual(asg.units, 40);

const com = S.calcTarget({ criteriaId: "com_attend", qty: 3 }, "community");
assert.strictEqual(com.units, 15);

const mupsf = S.calcTarget({ criteriaId: "mupsf2" }, "strat");
assert.strictEqual(mupsf.units, 319);
assert.strictEqual(mupsf.score, 7);

assert.strictEqual(S.GROUPS.reduce((s, g) => s + g.pct, 0), 100);
assert.strictEqual(S.GROUPS.reduce((s, g) => s + g.cap, 0), 1820);
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
assert.strictEqual(S.GRANT_SOURCES.grant_th.label.includes("ภายในประเทศ"), true);
assert.strictEqual(S.GRANT_SOURCES.grant_en.label.includes("ต่างประเทศ"), true);
assert.strictEqual(S.GRANT_SOURCES.grant_mu.label.includes("มหาวิทยาลัย"), true);
assert.strictEqual(S.GRANT_SOURCES.grant_th.tiers[0].amount, 3000000);

console.log("criteria tests ok");
