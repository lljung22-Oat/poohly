/**
 * OWNER: Cursor หัวหน้าชุด — C3
 * เครื่องสถานะข้อตกลง คู่กับสมรรถนะ การไม่เห็นด้วย และการล็อกหลังส่ง
 */

export function canEditAgreement(status) {
  return status === "draft" || status === "back";
}

export function agreementAfterSave(status) {
  if (!canEditAgreement(status)) {
    return { ok: false, error: "ล็อกแล้ว แก้ได้เฉพาะฉบับร่างหรือฉบับที่ส่งกลับ" };
  }
  return { ok: true, status };
}

export function agreementAfterSubmit(status) {
  if (!canEditAgreement(status)) {
    return { ok: false, error: "ส่งซ้ำไม่ได้หลังจากส่งขออนุมัติแล้ว" };
  }
  return { ok: true, status: "wait" };
}

export function agreementAfterDecision(status, decision, reason) {
  if (status !== "wait") {
    return { ok: false, error: "อนุมัติได้เฉพาะรายการที่รออนุมัติ" };
  }
  if (decision === "approve") return { ok: true, status: "approved" };
  if (decision === "reject") {
    if (!reason || !String(reason).trim()) {
      return { ok: false, error: "ไม่อนุมัติต้องมีเหตุผล" };
    }
    return { ok: true, status: "back" };
  }
  return { ok: false, error: "คำสั่งไม่รู้จัก" };
}

export function agreementAfterAmend(status, confirm, resultStatus) {
  if (!confirm) return { ok: false, error: "ต้องยืนยันก่อนแก้ไขหลังเห็นชอบ" };
  if (status !== "approved") return { ok: false, error: "แก้ไขหลังเห็นชอบได้เฉพาะรายการที่เห็นชอบแล้ว" };
  if (["reported", "firstHead", "head", "ack", "disagree"].includes(resultStatus)) {
    return { ok: false, error: "ส่งผลการดำเนินงานแล้ว แก้ข้อตกลงไม่ได้" };
  }
  return { ok: true, status: "draft" };
}

export function rollupAgreementStatus(statuses) {
  if (statuses.length === 0) return "draft";
  if (statuses.every((status) => status === "approved")) return "approved";
  if (statuses.some((status) => status === "back")) return "back";
  if (statuses.some((status) => status === "wait")) return "wait";
  return "draft";
}

export function selfScoreSubmit(paStatus, locked) {
  if (locked) return { ok: false, error: "ส่งแล้วแก้ไม่ได้" };
  if (paStatus !== "approved" && paStatus !== "reported") {
    return { ok: false, error: "กรอกผลการดำเนินงานได้หลังข้อตกลงเห็นชอบ" };
  }
  if (paStatus === "reported") return { ok: false, error: "ส่งแล้วแก้ไม่ได้" };
  return { ok: true, status: "reported", locked: true };
}

export function ccSelfSubmit(alreadyLocked) {
  if (alreadyLocked) return { ok: false, error: "ยกเลิกประเมินตนเองไม่ได้" };
  return { ok: true, status: "reported", locked: true };
}

export function ccFirstSubmit(ccStatus, selfLocked) {
  if (!selfLocked || !["reported", "firstHead"].includes(ccStatus)) {
    return { ok: false, error: "ให้คะแนนได้หลังผู้รับการประเมินส่งสมรรถนะแล้ว" };
  }
  if (ccStatus === "firstHead") return { ok: false, error: "ส่งแล้วแก้ไม่ได้" };
  return { ok: true, status: "firstHead", locked: true };
}

export function ccHeadSave(ccStatus) {
  if (!["firstHead", "head", "disagree"].includes(ccStatus)) {
    return { ok: false, error: "หัวหน้างานให้คะแนนได้หลังหัวหน้างานขั้นต้นส่งต่อ" };
  }
  return { ok: true };
}

export function reviewCheck({ paStatus, ccStatus, paSelfLocked, ccHeadReady, facultySigned }) {
  if (!paSelfLocked || !["reported", "head", "disagree"].includes(paStatus)) {
    return { ok: false, error: "ตรวจคะแนนได้เมื่อผลการดำเนินงานส่งแล้ว" };
  }
  if (!ccHeadReady || !["firstHead", "head", "disagree"].includes(ccStatus)) {
    return { ok: false, error: "ตรวจคะแนนได้เมื่อ PA และ CC ครบทั้งคู่" };
  }
  return { ok: true, paStatus: "head", ccStatus: "head", facultySigned: facultySigned && paStatus === "head" ? facultySigned : false };
}

export function facultySign(status) {
  if (status !== "head") return { ok: false, error: "ลงนามได้หลังหัวหน้างานตรวจคะแนน" };
  return { ok: true, facultySigned: true };
}

export function acknowledge({ paStatus, ccStatus, paSigned, ccSigned }) {
  if (paStatus !== "head" || ccStatus !== "head" || !paSigned || !ccSigned) {
    return { ok: false, error: "รับทราบได้หลังคณะติดลงนาม" };
  }
  return { ok: true, paStatus: "ack", ccStatus: "ack" };
}

export function disagree({ paStatus, ccStatus, paSigned, ccSigned, reason }) {
  if (!reason || !String(reason).trim()) return { ok: false, error: "ไม่เห็นด้วยต้องมีเหตุผล" };
  if (paStatus !== "head" || ccStatus !== "head" || !paSigned || !ccSigned) {
    return { ok: false, error: "ไม่เห็นด้วยได้หลังแจ้งผล" };
  }
  return {
    ok: true,
    paStatus: "disagree",
    ccStatus: "disagree",
    facultySigned: false,
    unlockHead: true,
  };
}

export function idpSubmit(status) {
  if (status !== "draft" && status !== "back") return { ok: false, error: "ส่งแผนซ้ำไม่ได้" };
  return { ok: true, status: "idpWait" };
}

export function idpDecide(status, decision, reason) {
  if (status !== "idpWait") return { ok: false, error: "อนุมัติได้เฉพาะแผนที่รออนุมัติ" };
  if (decision === "approve") return { ok: true, status: "idpApproved" };
  if (!reason || !String(reason).trim()) return { ok: false, error: "ไม่อนุมัติต้องมีเหตุผล" };
  return { ok: true, status: "back" };
}

export function idpReport(status, locked) {
  if (locked) return { ok: false, error: "รายงานการพัฒนาแล้วแก้ไม่ได้" };
  if (status !== "idpApproved") return { ok: false, error: "รายงานได้หลังแผนเห็นชอบ" };
  return { ok: true, status: "idpReported", locked: true };
}

export function idpEvaluate(status, result, allowed) {
  if (status !== "idpReported" && status !== "disagree") {
    return { ok: false, error: "ประเมินผลแผนได้หลังมีรายงาน" };
  }
  if (!allowed.includes(result)) return { ok: false, error: "ผลต้องเป็นข้อความตามคู่มือ" };
  return { ok: true, status: "idpEval" };
}

export function idpAck(status) {
  if (status !== "idpEval") return { ok: false, error: "รับทราบผลแผนได้หลังประเมินผล" };
  return { ok: true, status: "idpAck" };
}

export function idpDisagree(status, reason) {
  if (status !== "idpEval") return { ok: false, error: "ไม่เห็นด้วยได้หลังประเมินผลแผน" };
  if (!reason || !String(reason).trim()) return { ok: false, error: "ไม่เห็นด้วยต้องมีเหตุผล" };
  return { ok: true, status: "disagree" };
}
