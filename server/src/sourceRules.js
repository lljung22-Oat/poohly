/**
 * OWNER: Cursor หัวหน้าชุด (C3 C5 C6 C7)
 * ค่าที่คู่มือเขียนไว้ แต่ไม่มีเป็นคีย์ใน pa-config.example.json
 * ห้ามเติมเกณฑ์ที่ต้นฉบับไม่มี และห้ามให้ซอง S แก้ไฟล์นี้
 */

export const CC_ITEMS = [
  { code: "mastery", name: "Mastery" },
  { code: "altruism", name: "Altruism" },
  { code: "harmony", name: "Harmony" },
  { code: "integrity", name: "Integrity" },
  { code: "determination", name: "Determination" },
  { code: "originality", name: "Originality" },
  { code: "leadership", name: "Leadership" },
];

export const WORKLOADS = [
  {
    no: 1,
    id: "strat",
    title:
      "งานตามภารกิจที่สอดคล้องกับประเด็นยุทธศาสตร์ของมหาวิทยาลัยและแผนกลยุทธ์ของส่วนงาน",
  },
  {
    no: 2,
    id: "main",
    title:
      "งานตามภารกิจหลักของตำแหน่งงาน ตามหน้าที่ความรับผิดชอบ ตามคำบรรยายลักษณะงาน",
  },
  {
    no: 3,
    id: "assign",
    title: "งานตามภารกิจที่ได้รับมอบหมาย",
  },
  {
    no: 4,
    id: "community",
    title: "งานตามภารกิจเพื่อส่วนรวม",
  },
];

export const INDICATOR_KINDS = ["ปริมาณ", "คุณภาพ", "เวลา", "ความคุ้มค่า", "ความพึงพอใจ"];

export const AGREEMENT_STATUSES = ["draft", "wait", "back", "approved"];

export const RESULT_STATUSES = [
  "draft",
  "wait",
  "back",
  "approved",
  "reported",
  "firstHead",
  "head",
  "ack",
  "disagree",
];

export const IDP_STATUSES = [
  "draft",
  "idpWait",
  "back",
  "idpApproved",
  "idpReported",
  "idpEval",
  "idpAck",
  "disagree",
];

export const STATUS_LABEL = {
  draft: "ฉบับร่าง",
  wait: "รออนุมัติ",
  back: "ส่งกลับ",
  approved: "เห็นชอบ",
  reported: "พนักงานประเมินตนเอง",
  firstHead: "หัวหน้างานขั้นต้น",
  head: "หัวหน้างาน",
  ack: "รับทราบ",
  disagree: "ไม่เห็นด้วย",
  idpWait: "รออนุมัติแผน",
  idpApproved: "เห็นชอบแผน",
  idpReported: "รายงานการพัฒนาแล้ว",
  idpEval: "ประเมินผลการพัฒนาแล้ว",
  idpAck: "รับทราบผลการพัฒนา",
};

export const RESULT_STEPS = [
  { code: "reported", label: "พนักงานประเมินตนเอง" },
  { code: "firstHead", label: "หัวหน้างานขั้นต้น" },
  { code: "head", label: "หัวหน้างาน" },
  { code: "facultySign", label: "คณะติดลงนาม" },
  { code: "ack", label: "พนักงานรับทราบประเมินผล" },
  { code: "done", label: "เสร็จสิ้น" },
];

/** แยกตามโมดูลต้นทาง ห้ามรวมเป็นตัวเลขเดียว */
export const LOGIN_LOCK = {
  ratee: { module: "UM-03", maxFails: 3, lockMinutes: 10 },
  evaluator: { module: "UM-01", maxFails: 5, lockMinutes: 60 },
  admin: { module: "UM-01", maxFails: 5, lockMinutes: 60 },
};

export const PMS_MODULES = [
  "จัดทำข้อตกลงการปฏิบัติงาน (PA)",
  "รายงานผลการปฏิบัติงาน (PA)",
  "ประเมินผลงาน และประเมินสมรรถนะ",
  "แจ้งผลและรับทราบผลการประเมินการปฏิบัติงาน",
  "จัดทำแผนพัฒนารายบุคคล (IDP)",
  "รายงานผลการพัฒนารายบุคคล (IDP)",
  "ประเมินผลการพัฒนารายบุคคล (IDP)",
  "แจ้งผลและรับทราบผลการพัฒนารายบุคคล (IDP)",
  "รายงานและติดตามผลการดำเนินการ (REPORT)",
];

export const STAFF_FORM_MENUS = [
  { id: "form05", label: "แบบ 05" },
  { id: "form06", label: "แบบ 06 ติดตาม" },
  { id: "form07", label: "ประเมินผลงาน (แบบ 07)" },
  { id: "form08", label: "แบบ 08" },
  { id: "form09", label: "แบบ 09" },
];
