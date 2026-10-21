/**
 * OWNER: Cursor หัวหน้าชุด — C1 และ C6
 * ซอง S ห้ามแก้ไฟล์นี้
 * สูตรหน่วยรายคนจากตารางประกาศที่ยังไม่มีไฟล์ = SOURCE_MISSING
 * สูตรร้อยละของเล่ม 2570 ใช้ได้เฉพาะชั้นส่วนงาน ห้ามส่งผลเข้าฐานหน่วยอาจารย์
 */

export const SOURCE_MISSING = "SOURCE_MISSING";

export function sumWeights(values) {
  return values.reduce((sum, value) => sum + (Number(value) || 0), 0);
}

export function weightsComplete(values) {
  return Math.abs(sumWeights(values) - 100) < 0.001;
}

export function scaleLabel(score, scale5) {
  if (score === null || score === undefined || score === "") return null;
  const value = Number(score);
  const row = scale5.find((item) => value >= item.min && value <= item.max);
  return row ? row.label : null;
}

export function levelLabel(score, levels) {
  if (score === null || score === undefined || score === SOURCE_MISSING) return SOURCE_MISSING;
  const value = Number(score);
  const row = levels.find((item) => value >= item.min && value <= item.max);
  return row ? row.label : SOURCE_MISSING;
}

/** C = B / (A × 10) × 100 */
export function competencyItemPercent(behaviorCount, scoreSum) {
  const A = Number(behaviorCount);
  const B = Number(scoreSum);
  if (!A) return SOURCE_MISSING;
  return (B / (A * 10)) * 100;
}

/** D = A × C / B */
export function competencyProportional(behaviorCount, itemPercent, scoreSum) {
  const A = Number(behaviorCount);
  const C = Number(itemPercent);
  const B = Number(scoreSum);
  if (!B) return SOURCE_MISSING;
  return (A * C) / B;
}

export function scoreCc(scores) {
  const A = scores.length;
  const B = scores.reduce((sum, score) => sum + Number(score), 0);
  const C = competencyItemPercent(A, B);
  const D = competencyProportional(A, C, B);
  return { A, B, C, D };
}

/**
 * (paScore * weights.pa / 100) + (ccScore * weights.cc / 100)
 * ถ้ายังไม่มี paScore ช่วง 0–100 จากต้นฉบับ ให้คืน SOURCE_MISSING
 * ห้ามคูณคะแนนตนเอง 0–10 ด้วย 10
 */
export function weightedTotal(paScore, ccScore, weights) {
  if (paScore === null || paScore === undefined || paScore === SOURCE_MISSING) {
    return SOURCE_MISSING;
  }
  if (ccScore === null || ccScore === undefined || ccScore === SOURCE_MISSING) {
    return SOURCE_MISSING;
  }
  return (Number(paScore) * weights.pa) / 100 + (Number(ccScore) * weights.cc) / 100;
}

export function groupById(config, groupId) {
  return config.faculty.groups.find((group) => group.id === groupId) || null;
}

/** เพดานกลุ่มจาก config เท่านั้น ไม่ใช่คะแนนบทความ */
export function groupCap(config, groupId) {
  const group = groupById(config, groupId);
  return group ? group.cap : SOURCE_MISSING;
}

/**
 * ตัวคูณบทบาทที่ประกาศระบุไว้ว่ามี 100% หรือ 50%
 * ไฟล์ประกาศไม่อยู่ในเครื่อง จึงไม่ตัดสินว่าแถวใดใช้ตัวใด
 */
export function roleFactor(percent) {
  if (percent === 100 || percent === 50) return percent / 100;
  return SOURCE_MISSING;
}

export function facultyUnitsFromAnnouncement() {
  return SOURCE_MISSING;
}

function refuseFacultyMerge(caller) {
  if (caller !== "unit-layer") {
    throw new Error("REFUSED_FACULTY_UNIT_MERGE");
  }
}

export function ratioPercent(numerator, denominator, caller) {
  refuseFacultyMerge(caller);
  if (denominator === SOURCE_MISSING || denominator === null || denominator === undefined) {
    return SOURCE_MISSING;
  }
  const base = Number(denominator);
  if (!base) return SOURCE_MISSING;
  return (Number(numerator) / base) * 100;
}

export function budgetEfficiency(usedAndCommitted, originalPlusMid, caller) {
  refuseFacultyMerge(caller);
  const base = Number(originalPlusMid);
  if (!base) return SOURCE_MISSING;
  return (Number(usedAndCommitted) / base) * 100;
}

export function netProfitMargin(netIncome, totalRevenue, caller) {
  refuseFacultyMerge(caller);
  const revenue = Number(totalRevenue);
  if (!revenue) return SOURCE_MISSING;
  return (Number(netIncome) * 100) / revenue;
}

export function roaPercent(netIncome, totalAssets, caller) {
  refuseFacultyMerge(caller);
  const assets = Number(totalAssets);
  if (!assets) return SOURCE_MISSING;
  return (Number(netIncome) / assets) * 100;
}

/**
 * วิธีตัดชื่อผลงานตามเล่ม 2570
 * มกราคม 2570 ไม่ลบ baseline
 * ไตรมาส 2–4 รวมกับไตรมาส 1 แล้วตัดชื่อซ้ำ
 */
export function publicationTitles({ quarter, month, pulledTitles, baselineTitles, quarter1Titles }, caller) {
  refuseFacultyMerge(caller);
  const pulled = pulledTitles || [];
  if (month === "2570-01") return [...pulled];
  if (quarter === 1) {
    const baseline = new Set(baselineTitles || []);
    return pulled.filter((title) => !baseline.has(title));
  }
  const seen = new Set();
  const merged = [...(quarter1Titles || []), ...pulled];
  return merged.filter((title) => {
    if (seen.has(title)) return false;
    seen.add(title);
    return true;
  });
}

export function indicatorFormula(row) {
  if (!row) return SOURCE_MISSING;
  if (row.formulaDenominator === SOURCE_MISSING || row.formula === SOURCE_MISSING) return SOURCE_MISSING;
  return row.formula || null;
}
