const KEY = "mu-pms-demo-v7";
const C = PAScore;
const DB = window.PMSDB;

const FACULTY = "คณะสังคมศาสตร์และมนุษยศาสตร์";

const ACCOUNTS = {
  faculty: {
    id: "faculty",
    username: "porntipa.c",
    aliases: ["porntipa.c", "porntipa", "พรทิพา.เซี่ยงฉิน"],
    full: "น.ส.พรทิพา เซี่ยงฉิน",
    position: "อาจารย์",
    type: "สายวิชาการ",
    staffId: "10101642",
    dept: "ภาควิชาสังคมศาสตร์",
    email: "porntipa.c@mahidol.ac.th",
    phone: "",
    supervisor: "หัวหน้างาน",
    family: "ratee",
    track: "faculty",
    roleLabel: "ผู้รับการประเมิน",
    roleSub: "อาจารย์",
    hint: "กรอกข้อตกลงตามประกาศสายวิชาการ ประเมินตนเอง และรับทราบผลของตนเอง",
    tone: "ratee"
  },
  support: {
    id: "support",
    username: "staff.sh",
    aliases: ["staff.sh", "staff"],
    full: "เจ้าหน้าที่สายสนับสนุน",
    position: "เจ้าหน้าที่บริหารงานทั่วไป",
    type: "สายสนับสนุน",
    staffId: "10102001",
    dept: "งานการเจ้าหน้าที่",
    email: "staff.sh@mahidol.ac.th",
    phone: "",
    supervisor: "หัวหน้างาน",
    family: "ratee",
    track: "support",
    roleLabel: "ผู้รับการประเมิน",
    roleSub: "บุคลากรสายสนับสนุน",
    hint: "กรอกแบบข้อตกลง PA บุคคลากร (แบบ 05–09) ประเมินตนเอง และรับทราบผลของตนเอง — ไม่ใช้ตารางหน่วยอาจารย์",
    tone: "support"
  },
  committee: {
    id: "committee",
    username: "committee.sh",
    aliases: ["committee.sh", "committee"],
    full: "หัวหน้างานขั้นต้น",
    position: "หัวหน้างานขั้นต้น",
    type: "ผู้ประเมิน",
    staffId: "COM-01",
    dept: "ส่วนงาน",
    family: "eval",
    track: null,
    role: "committee",
    canEval: true,
    canChair: false,
    roleLabel: "หัวหน้างานขั้นต้น",
    roleSub: "ผู้ประเมิน",
    hint: "ให้คะแนนตามคู่มือ UM-01 แล้วส่งหัวหน้างาน — ไม่กรอกข้อตกลงเอง",
    tone: "eval"
  },
  chair: {
    id: "chair",
    username: "chair.sh",
    aliases: ["chair.sh", "chair"],
    full: "หัวหน้างาน",
    position: "หัวหน้างาน",
    type: "ผู้ประเมิน",
    staffId: "CHR-01",
    dept: "ส่วนงาน",
    family: "eval",
    track: null,
    role: "chair",
    canEval: true,
    canChair: true,
    roleLabel: "หัวหน้างาน",
    roleSub: "ผู้ประเมิน",
    hint: "อนุมัติข้อตกลง ให้คะแนน PA 80 + CC 20 และประเมิน IDP ตามคู่มือ UM-01 / UM-03",
    tone: "chair"
  },
  hr: {
    id: "hr",
    username: "hr.sh",
    aliases: ["hr.sh", "hr"],
    full: "เจ้าหน้าที่งานการเจ้าหน้าที่",
    position: "เจ้าหน้าที่งานการเจ้าหน้าที่",
    type: "ฝ่ายบุคคลากรส่วนงาน",
    staffId: "HR-01",
    dept: "งานการเจ้าหน้าที่",
    family: "admin",
    track: null,
    role: "hr",
    canHr: true,
    roleLabel: "ฝ่ายบุคคลากร",
    roleSub: "Admin ส่วนงาน",
    hint: "สร้างรอบ ปฏิทิน ตรวจชุดประเมิน นำเข้าผู้ประเมิน — ไม่ให้คะแนน",
    tone: "hr"
  },
  admin: {
    id: "admin",
    username: "admin.mu",
    aliases: ["admin.mu", "admin"],
    full: "ผู้ดูแลระบบมหาวิทยาลัย",
    position: "Admin มหาวิทยาลัย",
    type: "ผู้ดูแลระบบ",
    staffId: "ADM-01",
    dept: "กองทรัพยากรบุคคล",
    family: "admin",
    track: null,
    role: "admin",
    canAdmin: true,
    canHr: true,
    roleLabel: "Admin มหาวิทยาลัย",
    roleSub: "ผู้ดูแลระบบ",
    hint: "นำเข้าโครงสร้างส่วนงาน บุคลากร ผู้บังคับบัญชา — ไม่ใช่ผู้ประเมิน",
    tone: "admin"
  }
};

const RATEES = [
  { id: "faculty", name: ACCOUNTS.faculty.full, position: ACCOUNTS.faculty.position, type: ACCOUNTS.faculty.type },
  { id: "support", name: ACCOUNTS.support.full, position: ACCOUNTS.support.position, type: ACCOUNTS.support.type }
];

const STEPS = [
  "พนักงานประเมินตนเอง",
  "หัวหน้างานขั้นต้น",
  "หัวหน้างาน",
  "คณะติดลงนาม",
  "พนักงานรับทราบประเมินผล",
  "เสร็จสิ้น"
];

function firstHeadLabel() { return "หัวหน้างานขั้นต้น"; }
function headLabel() { return "หัวหน้างาน"; }

const MODULES = [
  { id: "pa", title: "PA ล่วงหน้า (ก่อนทำงาน)", need: null },
  { id: "paReport", title: "หน้าประเมิน PA", need: null },
  { id: "competency", title: "ประเมินผลงาน และประเมินสมรรถนะ", need: "reported" },
  { id: "ack", title: "แจ้งผลและรับทราบผลการประเมินการปฏิบัติงาน", need: "chair" },
  { id: "idp", title: "จัดทำแผนพัฒนารายบุคคล (IDP)", need: null },
  { id: "idpReport", title: "รายงานผลการพัฒนารายบุคคล (IDP)", need: "idpApproved" },
  { id: "idpEval", title: "ประเมินผลการพัฒนารายบุคคล (IDP)", need: "idpReported", sub: "เป็นไปตามที่คาดหวัง / ไม่เป็นไปตามที่คาดหวัง" },
  { id: "idpAck", title: "แจ้งผลและรับทราบผลการพัฒนารายบุคคล (IDP)", need: "idpEval" },
  { id: "report", title: "รายงานและติดตามผลการดำเนินการ (REPORT)", need: null }
];

/* วงจร PA บุคคลากร — จากชุดเอกสารสายสนับสนุน ไม่ปนประกาศหน่วยอาจารย์ */
const STAFF_MODULES = [
  { id: "pa", title: "แบบข้อตกลงและประเมินผลการปฏิบัติงาน (แบบ 05)", need: null },
  { id: "follow", title: "แบบติดตามผลการปฏิบัติงาน (แบบ 06)", need: "approved" },
  { id: "paReport", title: "ประเมินผลงาน (แบบ 07)", need: "approved" },
  { id: "competency", title: "ประเมินผลงาน และประเมินสมรรถนะ", need: "reported" },
  { id: "scoreSum", title: "แบบสรุปคะแนนผลการประเมิน (แบบ 09)", need: "chair" },
  { id: "ack", title: "แบบสรุปและแจ้งผลการประเมิน (แบบ 08)", need: "chair" },
  { id: "idp", title: "IDP ผู้ปฏิบัติ", need: null },
  { id: "idpEval", title: "IDP ผู้อนุมัติ", need: "idpReported", sub: "เป็นไปตามที่คาดหวัง / ไม่เป็นไปตามที่คาดหวัง" },
  { id: "report", title: "รายงานและติดตามผลการดำเนินการ", need: null }
];

function uid() {
  return "id" + Math.random().toString(36).slice(2, 9);
}

function emptyTarget(code, weight) {
  return {
    id: uid(), code, title: "", date: "", kpiType: "quantity", weight: weight || 0,
    criteriaId: "", role: "", inDb: false, withStudent: false,
    amount: "", hours: "", qty: 1, report: "", file: "", files: [],
    doi: "", projectCode: "", contractDate: "", contractDateNote: "",
    teachFormula: "", syllabusId: "",
    customTitle: "", proposedUnits: "", proposedScore: "",
    shpaDuty: "", shpaGrant: "", shpaDone: false, shpaProgress: false,
    shpaLevel: "", shpaAuthor: "", shpaMedia: [], shpaUse: "",
    fileError: "",
    selfScore: "", committeeComment: "", committeeScore: "",
    chairComment: "", chairScore: "", approved: "wait", approveReason: ""
  };
}

function defaultGroups() {
  return [
    {
      id: "strat", no: 4,
      agreements: [
        {
          id: uid(), code: "1.1", title: "ยุทธศาสตร์การวิจัย",
          kpis: [{
            id: uid(), code: "1.1.1", title: "ผลงานตีพิมพ์ / ทุนวิจัย ตามเกณฑ์ประกาศคณะ",
            targets: [{
              ...emptyTarget("1.1.1.1", 10),
              title: "บทความตีพิมพ์ในวารสารที่อยู่ในฐานข้อมูล",
              date: "2026-03-15",
              criteriaId: "pub_q1", role: "pi", inDb: true, kpiType: "quantity"
            }]
          }]
        },
        {
          id: uid(), code: "1.2", title: "ยุทธศาสตร์การวิจัย",
          kpis: [{
            id: uid(), code: "1.2.1", title: "ผลงานตีพิมพ์ / ทุนวิจัย ตามเกณฑ์ประกาศคณะ",
            targets: [{
              ...emptyTarget("1.2.1.1", 10),
              title: "",
              date: "",
              kpiType: "quantity"
            }]
          }]
        }
      ]
    },
    {
      id: "main", no: 1,
      agreements: [
        {
          id: uid(), code: "2.1", title: "ภาระงานสอน",
          kpis: [{
            id: uid(), code: "2.1.1", title: "ชั่วโมงสอน",
            targets: [{
              ...emptyTarget("2.1.1.1", 30),
              title: "สอนภาคบรรยาย ปริญญาโท/เอก",
              criteriaId: "teach_grad_main", teachFormula: "grad_main",
              syllabusId: "", hours: "45", kpiType: "quantity"
            }]
          }]
        },
        {
          id: uid(), code: "2.2", title: "ภาระงานวิจัย",
          kpis: [{
            id: uid(), code: "2.2.1", title: "ความก้าวหน้ากระบวนการวิจัย",
            targets: [{
              ...emptyTarget("2.2.1.1", 15),
              title: "โครงการวิจัยที่อยู่ในระหว่างดำเนินการ",
              criteriaId: "res_proc_3", projectCode: "",
              contractDate: "", kpiType: "quantity"
            }]
          }]
        },
        {
          id: uid(), code: "2.3", title: "ภาระงานบริการวิชาการ",
          kpis: [{
            id: uid(), code: "2.3.1", title: "โครงการหลักสูตร / รายวิชา",
            targets: [{
              ...emptyTarget("2.3.1.1", 10),
              title: "ปฏิบัติงานในโครงการของหลักสูตร",
              criteriaId: "course_proj", hours: "12", kpiType: "quantity"
            }]
          }]
        },
        {
          id: uid(), code: "2.4", title: "ผลงานทางวิชาการที่เทียบเท่างานวิจัย",
          kpis: [{
            id: uid(), code: "2.4.1", title: "การผลิตหนังสือ / ผลงานเทียบเท่างานวิจัย",
            targets: [{
              ...emptyTarget("2.4.1.1", 10),
              title: "ผลงานที่ 1",
              criteriaId: "res_book",
              shpaDuty: "solo", shpaGrant: "mid",
              shpaDone: false, shpaProgress: true, shpaLevel: "3",
              shpaAuthor: "first", shpaMedia: ["print"], shpaUse: "teach",
              kpiType: "quantity"
            }]
          }]
        }
      ]
    },
    {
      id: "assign", no: 2,
      agreements: [
        {
          id: uid(), code: "3.1", title: "งานที่ได้รับมอบหมายตามแผนปฏิบัติการ",
          kpis: [{
            id: uid(), code: "3.1.1", title: "กิจกรรม/โครงการที่ได้รับมอบหมาย",
            targets: [{
              ...emptyTarget("3.1.1.1", 15),
              title: "ประธานกรรมการ/เลขานุการโครงการ",
              criteriaId: "asg_chair", qty: 2, kpiType: "quantity"
            }]
          }]
        }
      ]
    },
    {
      id: "community", no: 3,
      agreements: [
        {
          id: uid(), code: "4.1", title: "งานเพื่อส่วนรวม",
          kpis: [{
            id: uid(), code: "4.1.1", title: "กิจกรรมนักศึกษา / ศิษย์เก่า",
            targets: [{
              ...emptyTarget("4.1.1.1", 5),
              title: "เข้าร่วมกิจกรรมนักศึกษา",
              criteriaId: "com_attend", qty: 3, kpiType: "quantity"
            }]
          }]
        }
      ]
    }
  ];
}

function emptySupportItem(n) {
  return {
    id: uid(), no: n, workType: "main", title: "", weight: 0,
    kpiType: "quantity", kpiWeight: 100, criteria: "",
    report: "", file: "", selfScore: "",
    committeeComment: "", chairScore: "", approved: "wait", approveReason: ""
  };
}

function defaultSupportItems() {
  return [
    { ...emptySupportItem(1), workType: "strat", title: "สนับสนุนการดำเนินงานตามแผนกลยุทธ์ของคณะ", weight: 20, kpiType: "quality", criteria: "ส่งงานตามแผนครบและตรงเวลา" },
    { ...emptySupportItem(2), workType: "main", title: "ปฏิบัติงานตามหน้าที่ความรับผิดชอบประจำตำแหน่ง", weight: 55, kpiType: "quantity", criteria: "ปริมาณงานประจำเสร็จตามที่ได้รับมอบหมาย" },
    { ...emptySupportItem(3), workType: "assign", title: "งานที่ได้รับมอบหมายเพิ่มเติมจากผู้บังคับบัญชา", weight: 15, kpiType: "time", criteria: "ส่งงานภายในกำหนด" },
    { ...emptySupportItem(4), workType: "community", title: "ร่วมกิจกรรมเพื่อส่วนรวมของส่วนงาน", weight: 10, kpiType: "quantity", criteria: "เข้าร่วมกิจกรรมตามที่คณะจัด" }
  ];
}

function blankCc() {
  return C.CC_ITEMS.map((x) => ({ id: x.id, name: x.name, full: x.full, report: "", file: "", self: "", committee: "", chair: "" }));
}
function blankFc(track) {
  const src = track === "support" ? C.SUPPORT_FC_ITEMS : C.FC_ITEMS;
  return src.map((x) => ({ id: x.id, name: x.name, report: "", self: "", committee: "", chair: "", ack: false }));
}
function blankIdp(track) {
  return [{
    id: uid(),
    competency: track === "support" ? "การประสานงานกับส่วนงาน" : "SFC02 ทักษะการวิจัย",
    behavior: track === "support" ? "ประสานงานได้ครบวงจรภายในกำหนด" : "จัดทำข้อเสนอโครงการวิจัยและตีพิมพ์ผลงาน",
    method: "70",
    detail: track === "support" ? "เรียนรู้จากการปฏิบัติงานจริงในงานการเจ้าหน้าที่" : "เป็นนักวิจัยร่วมในโครงการของภาควิชา",
    start: "2026-10-01", end: "2027-09-30",
    budget: "0", approved: "wait", report: "", file: "", result: ""
  }];
}

function defaultState() {
  return {
    loggedIn: false,
    account: "",
    focus: "faculty",
    year: "2570",
    round: "รอบประเมินปีงบประมาณ 2570",
    view: "login",
    paLayout: "eval",
    paStatus: "draft",
    paReject: "",
    paDisagree: "",
    groups: defaultGroups(),
    ccStatus: "draft",
    cc: blankCc(),
    fc: blankFc("faculty"),
    fcAck: false,
    strength: "",
    develop: "",
    suggest: "",
    chairSent: false,
    idpStatus: "draft",
    idpReject: "",
    idpDisagree: "",
    idp: blankIdp("faculty"),
    idpEvalNote: "",
    supportStatus: "draft",
    supportReject: "",
    supportDisagree: "",
    supportItems: defaultSupportItems(),
    supportCc: blankCc(),
    supportFc: blankFc("support"),
    supportFcAck: false,
    supportStrength: "",
    supportDevelop: "",
    supportSuggest: "",
    supportChairSent: false,
    supportIdpStatus: "draft",
    supportIdpReject: "",
    supportIdpDisagree: "",
    supportIdp: blankIdp("support"),
    supportFollow: [],
    supportPledge: {
      text: "ข้าพเจ้าจะปฏิบัติงานตามข้อตกลงที่ได้รับอนุมัติ และพัฒนาสมรรถนะตามแผน IDP ในปีงบประมาณนี้",
      rateeSigned: false,
      chairSigned: false
    },
    modal: null,
    user: null,
    users: [],
    loginGate: "public",
    loginType: "",
    leaveRows: defaultLeaveRows(),
    timeRows: defaultTimeRows(),
    researchInt: [emptyResearchInt()],
    researchNotify: [emptyResearchNotify()]
  };
}

function emptyResearchInt() {
  return {
    id: uid(), status: "", no: "", name: "", lead: "", dept: "", funder: "",
    start: "", end: "", amount: "", objective: "", benefit: "", output: "", contract: ""
  };
}

function emptyResearchNotify() {
  return { id: uid(), no: "", name: "", lead: "", dept: "", remark: "" };
}

function defaultLeaveRows() {
  return [
    { id: uid(), kind: "ลาพักผ่อน", start: "", end: "", days: "", reason: "", status: "ร่าง" }
  ];
}

function defaultTimeRows() {
  return [
    { id: uid(), date: "", timeIn: "", timeOut: "", note: "" }
  ];
}

function hydrate(raw) {
  const s = { ...defaultState(), ...(raw || {}) };
  if (!s.groups || !s.groups.length) s.groups = defaultGroups();
  s.groups = orderFacultyGroups(s.groups);
  if (s.paLayout !== "plan" && s.paLayout !== "eval") s.paLayout = "plan";
  if (!s.supportItems || !s.supportItems.length) s.supportItems = defaultSupportItems();
  if (!s.year || !["2569", "2570"].includes(String(s.year))) s.year = "2570";
  if (!s.supportFollow) s.supportFollow = [];
  if (!s.supportPledge) s.supportPledge = defaultState().supportPledge;
  if (!s.leaveRows || !s.leaveRows.length) s.leaveRows = defaultLeaveRows();
  if (!s.timeRows || !s.timeRows.length) s.timeRows = defaultTimeRows();
  if (!s.researchInt || !s.researchInt.length) s.researchInt = [emptyResearchInt()];
  if (!s.researchNotify || !s.researchNotify.length) s.researchNotify = [emptyResearchNotify()];
  (s.groups || []).forEach((g) => {
    (g.agreements || []).forEach((a) => {
      (a.kpis || []).forEach((k) => {
        (k.targets || []).forEach((t) => {
          if (!Array.isArray(t.files)) t.files = t.file ? [t.file] : [];
          if (t.doi == null) t.doi = "";
          if (t.projectCode == null) t.projectCode = "";
          if (t.contractDate == null) t.contractDate = "";
          if (t.contractDateNote == null) t.contractDateNote = "";
          if (t.teachFormula == null) t.teachFormula = "";
          if (t.syllabusId == null) t.syllabusId = "";
          if (t.customTitle == null) t.customTitle = "";
          if (t.proposedUnits == null) t.proposedUnits = "";
          if (t.proposedScore == null) t.proposedScore = "";
          if (t.shpaDuty == null) t.shpaDuty = "";
          if (t.shpaGrant == null) t.shpaGrant = "";
          if (t.shpaDone == null) t.shpaDone = false;
          if (t.shpaProgress == null) t.shpaProgress = false;
          if (t.shpaLevel == null) t.shpaLevel = "";
          if (t.shpaAuthor == null) t.shpaAuthor = "";
          if (!Array.isArray(t.shpaMedia)) t.shpaMedia = [];
          if (t.shpaUse == null) t.shpaUse = "";
        });
      });
    });
  });
  const main = (s.groups || []).find((g) => g.id === "main");
  if (main) {
    let hasBook = false;
    (main.agreements || []).forEach((a) => (a.kpis || []).forEach((k) => (k.targets || []).forEach((t) => {
      if (t.criteriaId === "res_book") hasBook = true;
    })));
    if (!hasBook) {
      main.agreements.push({
        id: uid(), code: "2.4", title: "ผลงานทางวิชาการที่เทียบเท่างานวิจัย",
        kpis: [{
          id: uid(), code: "2.4.1", title: "การผลิตหนังสือ / ผลงานเทียบเท่างานวิจัย",
          targets: [{
            ...emptyTarget("2.4.1.1", 10),
            title: "ผลงานที่ 1",
            criteriaId: "res_book",
            shpaDuty: "solo", shpaGrant: "mid",
            shpaDone: false, shpaProgress: true, shpaLevel: "3",
            shpaAuthor: "first", shpaMedia: ["print"], shpaUse: "teach"
          }]
        }]
      });
    }
  }
  s.modal = null;
  return s;
}

function isFileMode() {
  return typeof location !== "undefined" && location.protocol === "file:";
}

function persist() {
  const copy = { ...S, modal: null, users: undefined };
  try { localStorage.setItem(KEY, JSON.stringify(copy)); } catch { /* ignore */ }
  if (isFileMode()) return;
  if (DB && S.user && S.loggedIn) {
    Promise.resolve()
      .then(() => DB.saveRecord(S.user.id, S.year, copy))
      .then(() => DB.saveSession({ userId: S.user.id, year: S.year, view: S.view }))
      .then(() => DB.audit(S.user.username, "save", S.view || "state"))
      .catch(() => {});
  }
}

let S = hydrate();

function account() {
  return S.user || ACCOUNTS[S.account] || null;
}

function isRatee() { return account() && account().family === "ratee"; }
function isFaculty() { return account() && account().family === "ratee" && account().track === "faculty"; }
function isSupport() { return account() && account().family === "ratee" && account().track === "support"; }
function isCommittee() { return account() && account().family === "eval" && !account().canChair; }
function isChair() { return account() && (account().role === "chair" || account().canChair); }
function isHr() { return account() && account().role === "hr"; }
function isAdmin() { return account() && (account().role === "admin" || account().canAdmin); }
function isEval() { return account() && account().family === "eval"; }

function track() {
  if (isRatee() && account().track) return account().track;
  if (S.focus === "support" || S.focus === "faculty") return S.focus;
  return "faculty";
}

function rateeUsers() {
  return (S.users || []).filter((u) => u.family === "ratee" && u.active);
}

function rateeAccount() {
  const id = track();
  return (S.users || []).find((u) => u.id === id || (u.track === id && u.family === "ratee"))
    || ACCOUNTS[id] || ACCOUNTS.faculty;
}

function paStatus() { return track() === "support" ? S.supportStatus : S.paStatus; }
function setPaStatus(v) {
  if (track() === "support") S.supportStatus = v;
  else S.paStatus = v;
}
function idpStatus() { return track() === "support" ? S.supportIdpStatus : S.idpStatus; }
function setIdpStatus(v) {
  if (track() === "support") S.supportIdpStatus = v;
  else S.idpStatus = v;
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3200);
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function go(view) {
  if (isRatee()) S.focus = account().track;
  if (isFaculty() && ["paStaff", "follow", "scoreSum", "leave", "time"].includes(view)) {
    toast("เมนูบุคลากรสายสนับสนุนไม่ใช้กับสายวิชาการ");
    return;
  }
  if (isSupport() && ["kpi2570", "researchTrack"].includes(view)) {
    toast("คำอธิบายตัวชี้วัดและแบบติดตามโครงการวิจัยปี 2570 เป็นของสายวิชาการ");
    return;
  }
  if (isSupport() && view === "period") {
    S.view = "modules";
    S.modal = null;
    persist();
    if (!isFileMode()) location.hash = "modules";
    render();
    window.scrollTo(0, 0);
    return;
  }
  if (track() !== "support" && view === "pa") S.paLayout = "plan";
  if (track() !== "support" && view === "paReport") S.paLayout = "eval";
  S.view = view;
  S.modal = null;
  persist();
  if (!isFileMode()) location.hash = view;
  render();
  window.scrollTo(0, 0);
}

function logout() {
  S.loggedIn = false;
  S.account = "";
  S.user = null;
  S.view = "login";
  S.loginGate = "public";
  S.loginType = "";
  if (DB) DB.clearSession();
  persist();
  render();
}

async function resetDemo() {
  if (!confirm("ล้างข้อมูลในฐานข้อมูลแล้วเริ่มใหม่?")) return;
  const user = S.user;
  const year = S.year;
  if (DB) {
    await DB.wipeDemo();
    await DB.open();
    await DB.seed();
    S.users = await DB.listUsers();
  }
  S = hydrate();
  S.year = year;
  S.round = "รอบประเมินปีงบประมาณ " + year;
  if (user) {
    S.user = (S.users || []).find((u) => u.id === user.id) || user;
    S.account = S.user.id;
    S.loggedIn = true;
    S.view = "home";
  } else {
    S.view = "login";
  }
  persist();
  render();
  toast("ล้างฐานข้อมูลแล้ว");
}

function demoPasswordOk(user, password) {
  if (!user) return false;
  if (user.id === "admin") return password === "Admin#2570";
  if (user.family === "ratee") return password === "123456";
  return false;
}

function loginLocal(username, password, gate) {
  const name = String(username || "").trim().toLowerCase();
  const u = Object.values(ACCOUNTS).find((a) => a.username === name || (a.aliases || []).includes(name));
  if (!u || !demoPasswordOk(u, password)) return { ok: false, reason: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  if (gate === "ratee-faculty" && !(u.family === "ratee" && u.track === "faculty")) {
    return { ok: false, reason: "บัญชีนี้ไม่ใช่อาจารย์" };
  }
  if (gate === "ratee-support" && !(u.family === "ratee" && u.track === "support")) {
    return { ok: false, reason: "บัญชีนี้ไม่ใช่เจ้าหน้าที่สายสนับสนุน" };
  }
  if (gate === "eval" && u.family !== "eval") {
    return { ok: false, reason: "บัญชีนี้ยังไม่ได้รับสิทธิ์ผู้ประเมิน" };
  }
  if (gate === "admin" && !u.canAdmin) {
    return { ok: false, reason: "บัญชีนี้เข้าช่องทางผู้ดูแลไม่ได้" };
  }
  return { ok: true, user: u };
}

async function enterUser(user) {
  S.loggedIn = true;
  S.user = user;
  S.account = user.id;
  S.focus = user.track || S.focus || "faculty";
  let rec = null;
  if (DB && !isFileMode()) {
    try { rec = await DB.loadRecord(user.id, S.year); } catch { rec = null; }
  }
  if (rec) {
    const keep = { user: S.user, users: S.users, loggedIn: true, account: user.id, year: S.year, focus: user.track || S.focus || "faculty" };
    S = hydrate(rec);
    Object.assign(S, keep);
  }
  S.view = "home";
  S.round = "รอบประเมินปีงบประมาณ " + S.year;
  persist();
  if (!isFileMode()) location.hash = "home";
  render();
  window.scrollTo(0, 0);
}

function yearOptions() {
  return ["2570", "2569"].map((y) =>
    `<option value="${y}" ${String(S.year) === y ? "selected" : ""}>${y}</option>`
  ).join("");
}

function setYear(y) {
  S.year = String(y);
  S.round = "รอบประเมินปีงบประมาณ " + S.year;
}

function enterAccount(id) {
  const fromDb = (S.users || []).find((u) => u.id === id);
  const acc = fromDb || ACCOUNTS[id];
  if (!acc) { toast("ไม่พบบัญชีนี้"); return; }
  enterUser(acc);
}

function ico(name) {
  const common = 'xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="#2b4c7e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  if (name === "person") return `<svg ${common}><circle cx="24" cy="16" r="7"/><path d="M10 38c2-8 8-12 14-12s12 4 14 12"/></svg>`;
  if (name === "leave") return `<svg ${common}><rect x="10" y="12" width="28" height="24" rx="3"/><path d="M10 20h28M18 8v8M30 8v8"/><circle cx="24" cy="28" r="2.2" fill="#2b4c7e" stroke="none"/></svg>`;
  if (name === "clock") return `<svg ${common}><circle cx="24" cy="24" r="14"/><path d="M24 16v9l6 4"/></svg>`;
  if (name === "clip") return `<svg ${common}><rect x="14" y="12" width="20" height="26" rx="3"/><path d="M18 12V9h12v3M18 22h12M18 28h8"/></svg>`;
  if (name === "grad") return `<svg ${common}><path d="M8 20l16-8 16 8-16 8-16-8z"/><path d="M16 24v8c4 3 12 3 16 0v-8"/><path d="M40 20v10"/></svg>`;
  if (name === "target") return `<svg ${common}><circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="7"/><circle cx="24" cy="24" r="2" fill="#c2410c" stroke="#c2410c"/><path d="M24 10v4M38 24h-4M24 38v-4M10 24h4" stroke="#c2410c"/></svg>`;
  if (name === "people") return `<svg ${common}><circle cx="16" cy="16" r="6"/><circle cx="32" cy="16" r="6"/><path d="M6 38c1-8 6-12 10-12s9 4 10 12M26 38c1-8 6-12 10-12s8 4 10 12"/></svg>`;
  if (name === "cal") return `<svg ${common}><rect x="10" y="12" width="28" height="24" rx="3"/><path d="M10 20h28M18 8v8M30 8v8"/></svg>`;
  if (name === "shield") return `<svg ${common}><path d="M24 8l14 6v10c0 9-6 16-14 18C16 40 10 33 10 24V14z"/></svg>`;
  return `<svg ${common}><path d="M10 32l8-10 6 6 8-12 8 16H10z"/><path d="M10 36h28"/></svg>`;
}

function canEditAgreement() {
  return isRatee() && ["draft", "back"].includes(paStatus());
}
function canApproveAgreement() {
  return isChair() && paStatus() === "wait";
}
function canReportPa() {
  return isRatee() && paStatus() === "approved";
}
function canComment() {
  return isCommittee() && ["reported", "committee"].includes(paStatus());
}
function canChairScore() {
  return isChair() && ["reported", "committee", "disagree"].includes(paStatus());
}
function canAck() {
  return isRatee() && ["chair", "disagree"].includes(paStatus());
}
function canEditIdp() {
  return isRatee() && ["draft", "back"].includes(idpStatus());
}
function canApproveIdp() {
  return isChair() && idpStatus() === "wait";
}
function canEvalIdp() {
  return isChair() && idpStatus() === "reported";
}

function paLocked() {
  return ["reported", "committee", "chair", "ack", "disagree"].includes(paStatus());
}
function agreeLocked() {
  return !["draft", "back"].includes(paStatus());
}
function idpLocked() {
  return ["reported", "eval", "ack", "disagree"].includes(idpStatus());
}
function idpAgreeLocked() {
  return !["draft", "back"].includes(idpStatus());
}

function stepIndex() {
  const st = paStatus();
  if (st === "ack") return 5;
  if (st === "disagree") return 2;
  if (st === "chair") return 3;
  if (st === "committee") return 2;
  if (st === "reported") return 1;
  if (st === "approved") return 0;
  return -1;
}

function statusPill(st) {
  const map = {
    draft: ["pill-gray", "บันทึกร่าง"],
    wait: ["pill-gold", "ขออนุมัติ"],
    back: ["pill-red", "ไม่อนุมัติ / ส่งกลับ"],
    approved: ["pill-green", "อนุมัติแล้ว"],
    reported: ["pill-blue", "ส่งการประเมินตนเองแล้ว"],
    committee: ["pill-blue", "หัวหน้างานขั้นต้นประเมินแล้ว"],
    chair: ["pill-blue", "หัวหน้างานส่งคะแนนแล้ว"],
    ack: ["pill-green", "รับทราบแล้ว"],
    disagree: ["pill-red", "ไม่เห็นด้วย"],
    eval: ["pill-blue", "ประเมิน IDP แล้ว"]
  };
  const x = map[st] || ["pill-gray", st];
  return `<span class="pill ${x[0]}">${x[1]}</span>`;
}

function canOpen() {
  return true;
}

function currentModules() {
  return track() === "support" ? STAFF_MODULES : MODULES;
}

function moduleAllowed() {
  return true;
}

function supportFollowRows() {
  S.supportFollow = S.supportFollow || [];
  return S.supportItems.map((it) => {
    let row = S.supportFollow.find((x) => x.itemId === it.id);
    if (!row) {
      row = { id: uid(), itemId: it.id, progress: "", problem: "", help: "" };
      S.supportFollow.push(row);
    }
    return { it, row };
  });
}

function forEachTarget(fn) {
  S.groups.forEach((g) => {
    (g.agreements || []).forEach((a) => {
      (a.kpis || []).forEach((k) => {
        (k.targets || []).forEach((t) => fn(t, g, a, k));
      });
    });
  });
}

function findTarget(id) {
  let hit = null;
  forEachTarget((t) => { if (t.id === id) hit = t; });
  return hit;
}

function orderFacultyGroups(groups) {
  const by = Object.fromEntries((groups || []).map((g) => [g.id, g]));
  return C.GROUPS.map((meta) => {
    const g = by[meta.id];
    if (!g) return null;
    g.no = meta.no;
    return g;
  }).filter(Boolean);
}

function groupTargets(g) {
  const out = [];
  (g.agreements || []).forEach((a) => {
    (a.kpis || []).forEach((k) => {
      (k.targets || []).forEach((t) => out.push(t));
    });
  });
  return out;
}

function syncFacultyWeights() {
  C.GROUPS.forEach((meta) => {
    const g = (S.groups || []).find((x) => x.id === meta.id);
    if (!g) return;
    const targets = groupTargets(g);
    if (!targets.length) return;
    const each = +(meta.pct / targets.length).toFixed(2);
    targets.forEach((t, i) => {
      t.weight = i === targets.length - 1
        ? +(meta.pct - each * (targets.length - 1)).toFixed(2)
        : each;
    });
  });
}

function readPaForm() {
  document.querySelectorAll("[data-pa]").forEach((el) => {
    if (el.type === "radio" && !el.checked) return;
    const [kind, id, field] = el.dataset.pa.split(":");
    const val = el.type === "checkbox" ? el.checked : el.value;
    S.groups.forEach((g) => {
      g.agreements.forEach((a) => {
        if (kind === "a" && a.id === id) a[field] = val;
        a.kpis.forEach((k) => {
          if (kind === "k" && k.id === id) k[field] = val;
          k.targets.forEach((t) => {
            if (kind === "t" && t.id === id) {
              if (field === "inDb" || field === "withStudent") t[field] = !!val;
              else t[field] = val;
            }
          });
        });
      });
    });
  });
  if (track() !== "support") syncFacultyWeights();
}

function readSupportForm() {
  document.querySelectorAll("[data-sup]").forEach((el) => {
    const [id, field] = el.dataset.sup.split(":");
    const it = S.supportItems.find((x) => x.id === id);
    if (!it) return;
    it[field] = el.type === "checkbox" ? el.checked : el.value;
  });
}

function addAgreement(gid, crit) {
  if (!canEditAgreement()) return;
  const g = S.groups.find((x) => x.id === gid);
  const n = g.agreements.length + 1;
  const t = emptyTarget(`${g.no}.${n}.1.1`, 0);
  if (crit) t.criteriaId = crit;
  g.agreements.push({
    id: uid(), code: `${g.no}.${n}`, title: "",
    kpis: [{
      id: uid(), code: `${g.no}.${n}.1`, title: "",
      targets: [t]
    }]
  });
  syncFacultyWeights();
  persist(); render();
}

function removeAgreement(gid, aid) {
  if (!canEditAgreement()) return;
  const g = S.groups.find((x) => x.id === gid);
  if (g.agreements.length <= 1) { toast("ต้องมีรายการอย่างน้อย 1 รายการในภาระงานนี้"); return; }
  g.agreements = g.agreements.filter((a) => a.id !== aid);
  syncFacultyWeights();
  persist(); render();
}

function removeFacultyRow(gid, tid) {
  if (!canEditAgreement()) return;
  const g = S.groups.find((x) => x.id === gid);
  if (!g) return;
  if (groupTargets(g).length <= 1) { toast("ต้องมีรายการอย่างน้อย 1 รายการในภาระงานนี้"); return; }
  g.agreements.forEach((a) => {
    (a.kpis || []).forEach((k) => {
      k.targets = (k.targets || []).filter((t) => t.id !== tid);
    });
    a.kpis = (a.kpis || []).filter((k) => (k.targets || []).length);
  });
  g.agreements = g.agreements.filter((a) => (a.kpis || []).length);
  syncFacultyWeights();
  persist();
  render();
}

function checkWeight() {
  return track() === "support"
    ? +C.sumSupportWeight(S.supportItems).toFixed(2)
    : +C.sumWeight(S.groups).toFixed(2);
}

function currentTotal(useChair) {
  return track() === "support"
    ? C.supportTotalScore(S.supportItems, S.supportCc, useChair)
    : C.totalScore(S.groups, S.cc, useChair);
}

function saveDraft() {
  if (!canEditAgreement()) { toast("โหมดนี้กรอกข้อตกลงไม่ได้"); return; }
  if (track() === "support") readSupportForm();
  else readPaForm();
  persist();
  toast("บันทึกฉบับร่างแล้ว");
  render();
}

function requestApprove() {
  if (!canEditAgreement()) { toast("โหมดนี้ขออนุมัติไม่ได้"); return; }
  if (track() === "support") {
    readSupportForm();
    const w = checkWeight();
    if (w !== 100) { toast("ร้อยละค่าน้ำหนักรวมต้องได้ 100 (ตอนนี้ " + w + ")"); return; }
    if (S.supportItems.some((x) => !String(x.title || "").trim())) {
      toast("พิมพ์ข้อตกลงให้ครบทุกข้อ"); return;
    }
    S.supportStatus = "wait";
    S.supportItems.forEach((x) => { x.approved = "wait"; });
  } else {
    readPaForm();
    const w = checkWeight();
    if (w !== 100) { toast("ร้อยละค่าน้ำหนักรวมต้องได้ 100 (ตอนนี้ " + w + ")"); return; }
    let ok = true;
    forEachTarget((t) => {
      if (!String(t.title || "").trim()) ok = false;
      if (!t.criteriaId) ok = false;
    });
    if (!ok) { toast("กรอกชื่อบทความ/โครงการและเลือกเกณฑ์ให้ครบทุกรายการ"); return; }
    S.paStatus = "wait";
    forEachTarget((t) => { t.approved = "wait"; });
  }
  persist();
  toast("ส่งขออนุมัติแล้ว ให้หัวหน้างานพิจารณา");
  render();
}

function chairApproveAll() {
  if (!canApproveAgreement()) { toast("อนุมัติได้เฉพาะโหมดหัวหน้างาน เมื่อสถานะขออนุมัติ"); return; }
  if (track() === "support") {
    S.supportStatus = "approved";
    S.supportReject = "";
    S.supportItems.forEach((x) => { x.approved = "yes"; });
  } else {
    S.paStatus = "approved";
    S.paReject = "";
    forEachTarget((t) => { t.approved = "yes"; });
  }
  persist();
  toast("หัวหน้างานอนุมัติข้อตกลงทั้งหมดแล้ว");
  render();
}

function chairReject() {
  if (!canApproveAgreement()) { toast("ส่งกลับได้เฉพาะโหมดหัวหน้างาน"); return; }
  const reason = (document.getElementById("rejectReason") || {}).value || "";
  if (!String(reason).trim()) { toast("กรณีไม่อนุมัติต้องใส่เหตุผล"); return; }
  if (track() === "support") {
    S.supportStatus = "back";
    S.supportReject = reason;
  } else {
    S.paStatus = "back";
    S.paReject = reason;
  }
  persist();
  toast("ส่งกลับให้ผู้รับการประเมินแก้ไข");
  render();
}

function submitSelfPA() {
  if (!canReportPa()) { toast("ส่งการประเมินตนเองได้เฉพาะผู้รับการประเมิน เมื่อข้อตกลงอนุมัติแล้ว"); return; }
  if (track() === "support") {
    readSupportForm();
    if (S.supportItems.some((x) => x.selfScore === "" || x.selfScore == null)) {
      toast("กรอกประเมินตนเองเป็นตัวเลขให้ครบทุกข้อก่อนส่ง"); return;
    }
    if (!confirm("ตรวจคะแนนให้แน่ใจก่อนกดส่ง เพราะส่งแล้วแก้ไขไม่ได้")) return;
    S.supportStatus = "reported";
  } else {
    readPaForm();
    let missing = false;
    forEachTarget((t) => {
      if (t.selfScore === "" || t.selfScore == null) missing = true;
    });
    if (missing) { toast("กรอกประเมินตนเองเป็นตัวเลขให้ครบทุกรายการก่อนส่ง"); return; }
    if (!confirm("ตรวจคะแนนให้แน่ใจก่อนกดส่ง เพราะส่งแล้วแก้ไขไม่ได้")) return;
    S.paStatus = "reported";
    S.ccStatus = "reported";
  }
  persist();
  toast("ส่งการประเมินตนเองแล้ว แก้ไขไม่ได้");
  render();
}

function submitCommittee() {
  if (!canComment()) { toast("ให้คะแนนได้เฉพาะโหมดหัวหน้างานขั้นต้น เมื่อผู้รับการประเมินส่งการประเมินตนเองแล้ว"); return; }
  if (track() === "support") {
    readSupportForm();
    readCcFc();
    S.supportStatus = "committee";
  } else {
    readPaForm();
    readCcFc();
    S.paStatus = "committee";
  }
  persist();
  toast("หัวหน้างานขั้นต้นส่งคะแนนให้หัวหน้างานแล้ว");
  render();
}

function openScoreDialog() {
  if (!canChairScore()) { toast("ตรวจสอบคะแนนได้เฉพาะโหมดหัวหน้างาน"); return; }
  if (track() === "support") { readSupportForm(); readCcFc(); }
  else { readPaForm(); readCcFc(); }
  S.modal = "score";
  persist();
  render();
}

function sendChairScore() {
  if (!canChairScore()) return;
  if (track() === "support") {
    S.supportStrength = (document.getElementById("strength") || {}).value || S.supportStrength;
    S.supportDevelop = (document.getElementById("develop") || {}).value || S.supportDevelop;
    S.supportSuggest = (document.getElementById("suggest") || {}).value || S.supportSuggest;
    S.supportStatus = "chair";
    S.supportChairSent = true;
  } else {
    S.strength = (document.getElementById("strength") || {}).value || S.strength;
    S.develop = (document.getElementById("develop") || {}).value || S.develop;
    S.suggest = (document.getElementById("suggest") || {}).value || S.suggest;
    S.paStatus = "chair";
    S.chairSent = true;
  }
  S.modal = null;
  persist();
  toast("ส่งคะแนนแล้ว แก้ไขไม่ได้");
  render();
}

function ackResult(ok) {
  if (!canAck() && paStatus() !== "disagree") {
    if (!isRatee()) { toast("รับทราบได้เฉพาะผู้รับการประเมิน"); return; }
  }
  if (track() === "support") {
    if (ok) {
      S.supportStatus = "ack";
      S.supportDisagree = "";
      persist(); toast("รับทราบผลการประเมิน PA และ CC แล้ว"); render(); return;
    }
    const reason = (document.getElementById("disagreeReason") || {}).value || "";
    if (!String(reason).trim()) { toast("กรณีไม่เห็นด้วยต้องระบุเหตุผลละเอียดชัดเจน"); return; }
    S.supportStatus = "disagree";
    S.supportDisagree = reason;
  } else {
    if (ok) {
      S.paStatus = "ack";
      S.paDisagree = "";
      persist(); toast("รับทราบผลการประเมิน PA และ CC แล้ว"); render(); return;
    }
    const reason = (document.getElementById("disagreeReason") || {}).value || "";
    if (!String(reason).trim()) { toast("กรณีไม่เห็นด้วยต้องระบุเหตุผลละเอียดชัดเจน"); return; }
    S.paStatus = "disagree";
    S.paDisagree = reason;
  }
  persist();
  toast("ไม่เห็นด้วย — สถานะ PA และ CC กลับเป็นหัวหน้างาน");
  render();
}

function currentIdp() {
  return track() === "support" ? S.supportIdp : S.idp;
}

function readIdp() {
  document.querySelectorAll("[data-idp]").forEach((el) => {
    const [id, field] = el.dataset.idp.split(":");
    const it = currentIdp().find((x) => x.id === id);
    if (it) it[field] = el.value;
  });
}

function saveIdpDraft() {
  if (!canEditIdp()) { toast("โหมดนี้จัดทำ IDP ไม่ได้"); return; }
  readIdp();
  persist();
  toast("บันทึกฉบับร่างแผนพัฒนาแล้ว");
  render();
}

function addIdp() {
  if (!canEditIdp()) return;
  const list = currentIdp();
  if (list.length >= C.IDP_MAX) { toast("พัฒนาประมาณ 1–2 รายการต่อปี"); return; }
  list.push({
    id: uid(), competency: "", behavior: "", method: "70", detail: "",
    start: "", end: "", budget: "0", approved: "wait", report: "", file: "", result: ""
  });
  persist(); render();
}

function removeIdp(id) {
  if (!canEditIdp()) return;
  if (track() === "support") {
    if (S.supportIdp.length <= 1) { toast("ต้องมีอย่างน้อย 1 รายการ"); return; }
    S.supportIdp = S.supportIdp.filter((x) => x.id !== id);
  } else {
    if (S.idp.length <= 1) { toast("ต้องมีอย่างน้อย 1 รายการ"); return; }
    S.idp = S.idp.filter((x) => x.id !== id);
  }
  persist(); render();
}

function requestIdp() {
  if (!canEditIdp()) { toast("ขออนุมัติ IDP ได้เฉพาะผู้รับการประเมิน"); return; }
  readIdp();
  if (currentIdp().some((x) => !x.competency.trim() || !x.behavior.trim() || !x.method)) {
    toast("กรอกสมรรถนะ พฤติกรรมที่คาดหวัง และวิธีการพัฒนาให้ครบ");
    return;
  }
  setIdpStatus("wait");
  persist();
  toast("ส่งขออนุมัติ IDP แล้ว");
  render();
}

function approveIdp(yes) {
  if (!canApproveIdp()) { toast("อนุมัติ IDP ได้เฉพาะโหมดหัวหน้างาน"); return; }
  if (!yes) {
    const reason = (document.getElementById("idpReject") || {}).value || "";
    if (!String(reason).trim()) { toast("ไม่อนุมัติต้องใส่เหตุผล"); return; }
    setIdpStatus("back");
    if (track() === "support") S.supportIdpReject = reason;
    else S.idpReject = reason;
    persist(); toast("ส่งกลับแก้ IDP"); render(); return;
  }
  setIdpStatus("approved");
  currentIdp().forEach((x) => { x.approved = "yes"; });
  persist(); toast("หัวหน้างานอนุมัติ IDP แล้ว"); render();
}

function submitIdpReport() {
  if (!(isRatee() && idpStatus() === "approved")) {
    toast("ส่งรายงาน IDP ได้เฉพาะผู้รับการประเมินเมื่อแผนอนุมัติแล้ว"); return;
  }
  readIdp();
  if (currentIdp().some((x) => !String(x.report || "").trim())) {
    toast("พิมพ์รายงานการพัฒนาให้ครบทุกรายการ"); return;
  }
  if (!confirm("ส่งรายงานผล IDP แล้วแก้ไขไม่ได้")) return;
  setIdpStatus("reported");
  persist(); toast("ส่งรายงานผล IDP แล้ว แก้ไขไม่ได้"); render();
}

function evalIdp(result) {
  if (!canEvalIdp()) { toast("ประเมิน IDP ได้เฉพาะโหมดหัวหน้างาน"); return; }
  currentIdp().forEach((x) => { x.result = result; });
  setIdpStatus("eval");
  persist();
  toast(result === "ok" ? "เป็นไปตามที่คาดหวัง" : "ไม่เป็นไปตามที่คาดหวัง");
  render();
}

function ackIdp(ok) {
  if (!isRatee()) { toast("รับทราบผล IDP ได้เฉพาะผู้รับการประเมิน"); return; }
  if (ok) {
    setIdpStatus("ack");
    persist(); toast("รับทราบผล IDP แล้ว"); render(); return;
  }
  const reason = (document.getElementById("idpDisagree") || {}).value || "";
  if (!String(reason).trim()) { toast("ต้องระบุเหตุผล"); return; }
  setIdpStatus("disagree");
  if (track() === "support") S.supportIdpDisagree = reason;
  else S.idpDisagree = reason;
  persist(); toast("ไม่เห็นด้วย — สถานะกลับไปที่หัวหน้างาน"); render();
}

function lookingLine() {
  if (!isEval() || S.view === "home") return "";
  return `<span class="sep">|</span><span class="look">กำลังดู ${esc(rateeAccount().full)}</span>`;
}

function flowTabs() {
  if (isHr() || isAdmin()) return "";
  const staffPa = ["period", "profile", "rounds", "formset", "modules", "pa", "follow", "paReport", "competency", "scoreSum", "ack", "report"].includes(S.view);
  const facPa = ["period", "profile", "rounds", "formset", "modules", "pa", "kpi2570", "researchTrack", "paReport", "competency", "ack", "report"].includes(S.view);
  const idp = ["idp", "idpReport", "idpEval", "idpAck"].includes(S.view);
  if (!staffPa && !facPa && !idp) return "";
  let items;
  if (idp) {
    items = track() === "support" ? [
      ["idp", "IDP ผู้ปฏิบัติ"],
      ["idpReport", "รายงาน IDP"],
      ["idpEval", "IDP ผู้อนุมัติ"],
      ["idpAck", "รับทราบ IDP"]
    ] : [
      ["idp", "จัดทำ IDP"],
      ["idpReport", "รายงาน IDP"],
      ["idpEval", "ประเมิน IDP"],
      ["idpAck", "รับทราบ IDP"]
    ];
  } else if (track() === "support") {
    items = [
      ["modules", "วงจรบุคคลากร"],
      ["pa", "ข้อตกลง 05"],
      ["follow", "ติดตาม 06"],
      ["paReport", "ประเมินผลงาน"],
      ["scoreSum", "สรุปคะแนน 09"],
      ["ack", "แจ้งผล 08"]
    ];
  } else {
    items = [
      ["modules", "วงจร PMS"],
      ["pa", "PA ล่วงหน้า"],
      ["kpi2570", "ตัวชี้วัด 2570"],
      ["researchTrack", "โครงการวิจัย"],
      ["paReport", "หน้าประเมิน PA"],
      ["competency", "สมรรถนะ"],
      ["ack", "รับทราบ"]
    ];
  }
  return `<nav class="flow">${items.map(([id, t]) =>
    `<button type="button" class="flow-a ${S.view === id ? "on" : ""}" data-go="${id}">${esc(t)}</button>`
  ).join("")}</nav>`;
}

function chrome(inner) {
  const a = account();
  const home = S.view === "home";
  return `
  <div class="app ${home ? "app-home" : ""}">
    <header class="topbar">
      <div class="brand-text">ระบบสารสนเทศเพื่อการบริหารจัดการบุคลากร</div>
      <div class="who">
        <span class="uname">${esc(a ? a.full : "")}</span>
        <span class="sep">|</span>
        <span class="uline">${esc(a ? a.roleLabel + " · " + a.roleSub : "")}</span>
        ${lookingLine()}
        <span class="sep">|</span>
        <label class="year-lab">ปีงบประมาณ
          <select id="yearSel">${yearOptions()}</select>
        </label>
        <span class="sep">|</span>
        <button type="button" id="btnOut">ออกจากระบบ</button>
      </div>
    </header>
    ${home ? "" : `<div class="subbar">
      <button type="button" class="back" data-go="home">← กลับหน้าหลักระบบงาน</button>
    </div>`}
    <main class="main ${home ? "main-home" : ""}">${home ? "" : flowTabs()}${inner}</main>
  </div>`;
}

function profileBox(who) {
  const u = who || (isRatee() ? account() : rateeAccount());
  return `
  <div class="profile-grid">
    <b>ชื่อ-นามสกุล</b><span>${esc(u.full)}</span>
    <b>รหัสบุคลากร</b><span>${esc(u.staffId)}</span>
    <b>ตำแหน่ง</b><span>${esc(u.position)} (${esc(u.type)})</span>
    <b>สังกัด</b><span>${esc(FACULTY)} · ${esc(u.dept)}</span>
    <b>ผู้ประเมิน</b><span>${esc(u.supervisor || "หัวหน้างาน")}</span>
    <b>รอบ</b><span>${esc(S.round)}</span>
  </div>`;
}

function stepperHtml() {
  const idx = stepIndex();
  return `<div class="stepper">${STEPS.map((t, i) => {
    const cls = i < idx ? "done" : i === idx ? "now" : "";
    return `<div class="step ${cls}"><div class="dot"></div>${esc(t)}</div>`;
  }).join("")}</div>`;
}

function loginShell(inner) {
  return `
  <div class="login-wrap">
    <div class="login-head">
      <div class="login-logo">MU</div>
      <h1>มหาวิทยาลัยมหิดล</h1>
      <p>ระบบสารสนเทศเพื่อการบริหารจัดการบุคลากร · คณะสังคมศาสตร์และมนุษยศาสตร์</p>
    </div>
    ${inner}
  </div>`;
}

function viewLogin() {
  if (S.loginGate === "admin") return viewLoginAdmin();
  if (S.loginGate === "eval") return viewLoginEval();
  const picked = S.loginType;
  return loginShell(`
    <div class="login-box">
      <h2>เข้าสู่ระบบ</h2>
      <p class="hint">เลือกประเภทของตนเองเท่านั้น · ผู้ประเมินเข้าได้เมื่อผู้ดูแลสร้างบัญชีให้ · ปีงบประมาณเริ่มต้น <b>2570</b></p>
      <div class="type-pick">
        <button type="button" class="type-btn ${picked === "support" ? "on" : ""}" data-login-type="support">เจ้าหน้าที่</button>
        <button type="button" class="type-btn ${picked === "faculty" ? "on" : ""}" data-login-type="faculty">อาจารย์</button>
      </div>
      ${picked ? `
        <form id="loginForm">
          <label>ชื่อผู้ใช้</label>
          <input id="loginUser" autocomplete="username" required />
          <label>รหัสผ่าน</label>
          <input id="loginPass" type="password" autocomplete="current-password" required />
          <div class="year-pick login-year">
            <label for="yearSel">ปีงบประมาณ</label>
            <select id="yearSel">${yearOptions()}</select>
          </div>
          <button class="btn-navy full" type="submit">เข้าสู่ระบบ</button>
        </form>
        <p class="hint">บัญชีตั้งต้นของส่วนงาน${picked === "faculty" ? " อาจารย์: porntipa.c / 123456" : " เจ้าหน้าที่: staff.sh / 123456"}</p>
      ` : `<p class="hint">เลือกเจ้าหน้าที่ หรือ อาจารย์ ก่อนกรอกชื่อผู้ใช้</p>`}
      <p class="login-links">
        <button type="button" class="linkish" data-gate="eval">สำหรับผู้ประเมินที่ได้รับสิทธิ์</button>
        <button type="button" class="linkish quiet" data-gate="admin">ช่องทางผู้ดูแลระบบ</button>
      </p>
    </div>`);
}

function viewLoginEval() {
  return loginShell(`
    <div class="login-box">
      <h2>เข้าสู่ระบบผู้ประเมิน</h2>
      <p class="hint">เฉพาะบัญชีที่ผู้ดูแลสร้างและกำหนดสิทธิ์แล้ว</p>
      <form id="loginForm">
        <label>ชื่อผู้ใช้</label>
        <input id="loginUser" autocomplete="username" required />
        <label>รหัสผ่าน</label>
        <input id="loginPass" type="password" autocomplete="current-password" required />
        <div class="year-pick login-year">
          <label for="yearSel">ปีงบประมาณ</label>
          <select id="yearSel">${yearOptions()}</select>
        </div>
        <button class="btn-navy full" type="submit">เข้าสู่ระบบ</button>
      </form>
      <p class="login-links"><button type="button" class="linkish" data-gate="public">กลับเข้าสู่ระบบบุคลากร / อาจารย์</button></p>
    </div>`);
}

function viewLoginAdmin() {
  return loginShell(`
    <div class="login-box">
      <h2>ช่องทางผู้ดูแลระบบ</h2>
      <p class="hint">ไม่แสดงในหน้าเข้าสู่ระบบทั่วไป · ใช้สร้างบัญชีและกำหนดสิทธิ์ผู้ประเมิน</p>
      <form id="loginForm">
        <label>ชื่อผู้ใช้ผู้ดูแล</label>
        <input id="loginUser" autocomplete="username" required />
        <label>รหัสผ่าน</label>
        <input id="loginPass" type="password" autocomplete="current-password" required />
        <div class="year-pick login-year">
          <label for="yearSel">ปีงบประมาณ</label>
          <select id="yearSel">${yearOptions()}</select>
        </div>
        <button class="btn-navy full" type="submit">เข้าช่องทางผู้ดูแล</button>
      </form>
      <p class="hint">บัญชีตั้งต้น admin.mu / Admin#2570</p>
      <p class="login-links"><button type="button" class="linkish" data-gate="public">กลับเข้าสู่ระบบทั่วไป</button></p>
    </div>`);
}

function cardBtn(c) {
  return `<button class="dash-card${c.cream ? " cream" : ""}" type="button"
    data-go="${c.go}"${c.focus ? ` data-focus="${c.focus}"` : ""}>
    <div class="ico">${ico(c.ico)}</div>
    <b>${esc(c.title)}</b>
    <small class="${c.linkish ? "linkish" : ""}">${esc(c.sub)}</small>
  </button>`;
}

function sectionBlock(title, note, cards, tone) {
  const cols = cards.length === 1 ? "cols-1" : cards.length === 2 ? "cols-2" : "";
  return `<section class="sec${tone ? " sec-" + tone : ""}">
    <header class="sec-head">
      <h2>${esc(title)}</h2>
      ${note ? `<p>${esc(note)}</p>` : ""}
    </header>
    <div class="dash-grid ${cols}">${cards.map(cardBtn).join("")}</div>
  </section>`;
}

function dashCards(cards, heading) {
  return `
    <div class="dash">
      <h1>${esc(heading || "หน้าหลักระบบงาน (Dashboard)")}</h1>
      <div class="dash-grid">
        ${cards.map(cardBtn).join("")}
      </div>
    </div>`;
}

function facultyDashCards() {
  return [
    { go: "profile", ico: "person", title: "ข้อมูลส่วนบุคคล", sub: "ประวัติอาจารย์ผู้รับการประเมิน" },
    { go: "period", ico: "grad", title: "PA ภาระงานอาจารย์", sub: "ตารางแบบประเมินตามประกาศคณะฯ", cream: true },
    { go: "kpi2570", ico: "clip", title: "คำอธิบายตัวชี้วัด PA 2570", sub: "ฉบับจัดทำ PA · ฝั่งอาจารย์" },
    { go: "researchTrack", ico: "chart", title: "แบบติดตามโครงการวิจัย ปี 2570", sub: "กรอกตามคอลัมน์ในไฟล์ Excel" },
    { go: "competency", ico: "target", title: "ประเมินสมรรถนะ", sub: "CC และ FC ของสายวิชาการ", linkish: true },
    { go: "idp", ico: "chart", title: "IDP", sub: "แผนพัฒนารายบุคคลของอาจารย์" },
    { go: "report", ico: "cal", title: "รายงาน", sub: "ติดตามผลการดำเนินการ" }
  ];
}

function supportDashCards() {
  return [
    { go: "profile", ico: "person", title: "ข้อมูลบุคลากร", sub: "ประวัติและข้อมูลส่วนบุคคล" },
    { go: "leave", ico: "leave", title: "ข้อมูลวันลา", sub: "สถิติและการขออนุมัติวันลา" },
    { go: "time", ico: "clock", title: "ข้อมูลเวลาเข้า-ออกงาน", sub: "ลงเวลาปฏิบัติงานประจำวัน" },
    { go: "paStaff", ico: "clip", title: "PA ประเมินภาระงาน", sub: "สายสนับสนุน · แบบ 05–09", cream: true },
    { go: "competency", ico: "target", title: "Functional Competency", sub: "ประเมินสมรรถนะเฉพาะสายงาน", linkish: true },
    { go: "idp", ico: "chart", title: "IDP", sub: "แผนพัฒนารายบุคคล" }
  ];
}

function viewHome() {
  if (isFaculty()) {
    return chrome(dashCards(facultyDashCards(), "หน้าหลักระบบงาน · สายวิชาการ (อาจารย์)"));
  }
  if (isSupport()) {
    return chrome(dashCards(supportDashCards(), "หน้าหลักระบบงาน · สายสนับสนุน (บุคลากร)"));
  }
  if (isCommittee()) {
    return chrome(dashCards([
      { go: "evalHome", ico: "people", title: "รายชื่อผู้รับการประเมิน", sub: "คนที่ตนต้องให้ความเห็น" },
      { go: "competency", ico: "target", title: "ประเมินผล", sub: "ให้คะแนน PA / CC / FC แล้วส่งหัวหน้างาน" },
      { go: "report", ico: "chart", title: "สอบถาม / พิมพ์รายงาน", sub: "ดูสถานะและพิมพ์รายงาน" },
      { go: "help", ico: "clip", title: "การช่วยเหลือ", sub: "หน้าที่หัวหน้างานขั้นต้นตาม UM-01" }
    ]));
  }
  if (isChair()) {
    return chrome(dashCards([
      { go: "evalHome", ico: "people", title: "รายชื่อผู้รับการประเมิน", sub: "อนุมัติข้อตกลงและให้คะแนน" },
      { go: "pa", ico: "grad", title: "อนุมัติข้อตกลง PA", sub: "ตรวจน้ำหนัก 100 แล้วนุมัติหรือส่งกลับ" },
      { go: "competency", ico: "target", title: "ให้คะแนน PA + CC", sub: "Dialog สรุป 80 + 20 = 100" },
      { go: "idp", ico: "chart", title: "อนุมัติ / ประเมิน IDP", sub: "เป็นไปตามที่คาดหวัง หรือไม่เป็นไป" },
      { go: "report", ico: "cal", title: "รายงานภาพรวม", sub: "ติดตามสถานะรอบปี " + S.year },
      { go: "help", ico: "clip", title: "การช่วยเหลือ", sub: "หน้าที่หัวหน้างานตาม UM-01 / UM-03" }
    ]));
  }
  if (isHr()) {
    return chrome(dashCards([
      { go: "adminRound", ico: "cal", title: "รอบและปฏิทิน", sub: "สร้างรอบปีงบประมาณ 2569 / 2570" },
      { go: "formset", ico: "clip", title: "ชุดประเมิน", sub: "ตรวจ PA IDP CC FC ให้ครบตามตำแหน่ง" },
      { go: "adminPeople", ico: "people", title: "บุคลากรส่วนงาน", sub: "รายชื่อและผู้บังคับบัญชาในคณะ" },
      { go: "report", ico: "chart", title: "ติดตามตามปฏิทิน", sub: "สถานะข้อตกลงและคะแนน" },
      { go: "help", ico: "shield", title: "การช่วยเหลือ", sub: "หน้าที่ Admin ส่วนงาน" }
    ]));
  }
  return chrome(dashCards([
    { go: "users", ico: "people", title: "บัญชีและสิทธิ์", sub: "สร้างผู้ใช้ ตั้งรหัส กำหนดสิทธิ์ผู้ประเมิน" },
    { go: "adminPeople", ico: "people", title: "โครงสร้างส่วนงาน", sub: "นำเข้าส่วนงาน บุคลากร ผู้บังคับบัญชา" },
    { go: "adminRound", ico: "cal", title: "รอบประเมินทั้งมหาวิทยาลัย", sub: "ปีงบประมาณ 2569 และ 2570" },
    { go: "help", ico: "shield", title: "ให้คำปรึกษาการใช้ระบบ", sub: "ช่องทางผู้ดูแลระบบ" }
  ]));
}

function viewLeave() {
  if (isFaculty()) {
    return chrome(`<div class="warn-box">ข้อมูลวันลาเป็นของบุคลากรสายสนับสนุน ไม่ใช้กับสายวิชาการ</div>
      <button class="btn-navy" type="button" data-go="home">กลับหน้าหลักระบบงาน</button>`);
  }
  const lock = !isRatee() && !isHr() && !isAdmin();
  const rows = (S.leaveRows || []).map((it) => `<tr>
    <td><select data-leave="${it.id}:kind" ${lock ? "disabled" : ""}>
      ${["ลาพักผ่อน", "ลาป่วย", "ลากิจ", "ลาคลอด", "ลาอื่นๆ"].map((k) =>
        `<option ${it.kind === k ? "selected" : ""}>${esc(k)}</option>`).join("")}
    </select></td>
    <td><input type="date" data-leave="${it.id}:start" value="${esc(it.start)}" ${lock ? "disabled" : ""} /></td>
    <td><input type="date" data-leave="${it.id}:end" value="${esc(it.end)}" ${lock ? "disabled" : ""} /></td>
    <td><input type="number" data-leave="${it.id}:days" value="${esc(it.days)}" ${lock ? "disabled" : ""} /></td>
    <td><input data-leave="${it.id}:reason" value="${esc(it.reason)}" ${lock ? "disabled" : ""} /></td>
    <td><select data-leave="${it.id}:status" ${lock ? "disabled" : ""}>
      ${["ร่าง", "ยื่นขอ", "อนุมัติ", "ไม่อนุมัติ"].map((k) =>
        `<option ${it.status === k ? "selected" : ""}>${esc(k)}</option>`).join("")}
    </select></td>
    <td>${lock ? "" : `<button class="iconbtn" type="button" data-del-leave="${it.id}">−</button>`}</td>
  </tr>`).join("");
  return chrome(`
    <p class="crumb">ระบบงานบุคลากร</p>
    <h1 class="page-title">ข้อมูลวันลา</h1>
    <div class="card">
      <p class="hint">บันทึกและติดตามการลาของบุคลากรในรอบปีงบประมาณ ${esc(S.year)}</p>
      <div class="pa-wrap"><table class="data">
        <thead><tr><th>ประเภทการลา</th><th>ตั้งแต่วันที่</th><th>ถึงวันที่</th><th>จำนวนวัน</th><th>เหตุผล</th><th>สถานะ</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <div class="footbar">
        ${lock ? "" : `<button class="btn-teal" type="button" id="btnAddLeave">เพิ่มรายการลา</button>
        <button class="btn-navy" type="button" id="btnSaveLeave">บันทึกข้อมูลวันลา</button>`}
        <button class="btn-ghost" type="button" data-go="home">กลับหน้าหลักระบบงาน</button>
      </div>
    </div>`);
}

function viewTime() {
  if (isFaculty()) {
    return chrome(`<div class="warn-box">ข้อมูลเวลาเข้า-ออกงานเป็นของบุคลากรสายสนับสนุน ไม่ใช้กับสายวิชาการ</div>
      <button class="btn-navy" type="button" data-go="home">กลับหน้าหลักระบบงาน</button>`);
  }
  const lock = !isRatee() && !isHr() && !isAdmin();
  const rows = (S.timeRows || []).map((it) => `<tr>
    <td><input type="date" data-time="${it.id}:date" value="${esc(it.date)}" ${lock ? "disabled" : ""} /></td>
    <td><input type="time" data-time="${it.id}:timeIn" value="${esc(it.timeIn)}" ${lock ? "disabled" : ""} /></td>
    <td><input type="time" data-time="${it.id}:timeOut" value="${esc(it.timeOut)}" ${lock ? "disabled" : ""} /></td>
    <td><input data-time="${it.id}:note" value="${esc(it.note)}" ${lock ? "disabled" : ""} /></td>
    <td>${lock ? "" : `<button class="iconbtn" type="button" data-del-time="${it.id}">−</button>`}</td>
  </tr>`).join("");
  return chrome(`
    <p class="crumb">ระบบงานบุคลากร</p>
    <h1 class="page-title">ข้อมูลเวลาเข้า-ออกงาน</h1>
    <div class="card">
      <p class="hint">บันทึกเวลาปฏิบัติงานประจำวันของบุคลากร ปีงบประมาณ ${esc(S.year)}</p>
      <div class="pa-wrap"><table class="data">
        <thead><tr><th>วันที่</th><th>เวลาเข้า</th><th>เวลาออก</th><th>หมายเหตุ</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <div class="footbar">
        ${lock ? "" : `<button class="btn-teal" type="button" id="btnAddTime">เพิ่มรายการ</button>
        <button class="btn-navy" type="button" id="btnSaveTime">บันทึกเวลาปฏิบัติงาน</button>`}
        <button class="btn-ghost" type="button" data-go="home">กลับหน้าหลักระบบงาน</button>
      </div>
    </div>`);
}

function viewPaStaff() {
  if (isFaculty()) {
    return chrome(`<div class="warn-box">แบบประเมินภาระงานของเจ้าหน้าที่สายสนับสนุนไม่ใช้กับสายวิชาการ</div>
      <button class="btn-navy" type="button" data-go="home">กลับหน้าหลักระบบงาน</button>`);
  }
  S.focus = "support";
  persist();
  return viewModules();
}

function viewHelp() {
  const a = account();
  const blocks = {
    faculty: ["ตรวจสอบและแก้ไขข้อมูลส่วนบุคคลให้ถูกต้องก่อนจัดทำข้อตกลง", "กรอก PA ภาระงานอาจารย์ตามประกาศค่าน้ำหนัก / SHPA", "หน่วยและคะแนนตนเองคำนวณจากประกาศสายวิชาการ ฐาน 1,820", "ส่งการประเมินตนเองแล้วแก้ไขไม่ได้", "รับทราบ PA+CC พร้อมกัน · FC รับทราบแยก"],
    support: ["ตรวจสอบและแก้ไขข้อมูลส่วนบุคคลให้ถูกต้องก่อนจัดทำข้อตกลง", "ใช้เอกสาร PA บุคคลากร แบบ 05–09 ไม่ใช่ตารางหน่วยอาจารย์", "น้ำหนักรวม 100 เกณฑ์ 5 ระดับ ตาม rubrics สายสนับสนุน", "ติดตามกลางปีด้วยแบบ 06 · ประเมินผลงานด้วยแบบ 07", "สรุปคะแนน 09 · แจ้งผล 08 · IDP ผู้ปฏิบัติ/ผู้อนุมัติ"],
    committee: ["เข้าจากรายชื่อผู้รับการประเมิน (UM-01)", "ให้คะแนน PA / CC / FC เป็นตัวเลข 0–10", "ส่งให้หัวหน้างาน", "ไม่มีหน้ากรอกข้อตกลง และไม่อนุมัติ"],
    chair: ["ค้นผู้รับการประเมินแล้วเข้ากำหนดตัวชี้วัด", "อนุมัติ/ไม่อนุมัติข้อตกลงเมื่อสถานะขออนุมัติ", "ให้คะแนน PA 80 + CC 20 แล้วส่งคะแนน", "ประเมิน IDP เป็นไปตามที่คาดหวัง / ไม่เป็นไป", "ไม่กรอกภาระงานแทนผู้รับการประเมิน"],
    hr: ["สร้างรอบและปฏิทินของส่วนงาน", "ตรวจชุดประเมิน PA IDP CC FC MC ให้ครบตามตำแหน่ง", "นำเข้าผู้ประเมิน · ติดตามตามปฏิทิน", "ไม่ให้คะแนนและไม่กรอก PA"],
    admin: ["เข้าด้วยช่องทางผู้ดูแลระบบเท่านั้น", "สร้างบัญชีและกำหนดสิทธิ์ผู้ประเมิน", "ผู้ประเมินเห็นเฉพาะเมนูประเมิน", "บันทึกบัญชีและข้อตกลงลงฐานข้อมูล"]
  };
  return chrome(`
    <h1 class="page-title">การช่วยเหลือ · ${esc(a.roleLabel)}</h1>
    <div class="card">
      <p>${esc(a.hint)}</p>
      <ul>${(blocks[a.role] || blocks[a.id] || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>`);
}

function viewEvalHome() {
  if (!isEval() && !isHr()) {
    return chrome(`<div class="warn-box">หน้ารายชื่อผู้รับการประเมินเป็นของหัวหน้างานขั้นต้น หัวหน้างาน และฝ่ายบุคคลากร</div>
      <button class="btn-navy" data-go="home">กลับหน้าหลักของโหมดนี้</button>`);
  }
  const rows = rateeUsers().map((r) => {
    const st = r.track === "support" ? S.supportStatus : S.paStatus;
    const idp = r.track === "support" ? S.supportIdpStatus : S.idpStatus;
    return `<tr>
      <td>${esc(r.full)}</td>
      <td>${esc(r.position)}<div class="hint">${esc(r.type)}</div></td>
      <td>${statusPill(st)}</td>
      <td>${statusPill(idp)}</td>
      <td>
        <button class="act" data-focus="${r.track || r.id}" data-go="${isCommittee() ? "competency" : "pa"}">${isChair() ? "เปิดข้อตกลง" : "ให้คะแนน"}</button>
        ${isChair() ? `<button class="act" data-focus="${r.track || r.id}" data-go="competency">ให้คะแนน</button>
        <button class="act" data-focus="${r.track || r.id}" data-go="idp">IDP</button>` : ""}
      </td>
    </tr>`;
  }).join("");
  return chrome(`
    <p class="crumb">${esc(account().roleLabel)} · รายชื่อ</p>
    <h1 class="page-title">ผู้รับการประเมินในความดูแล</h1>
    <div class="card">
      <p class="hint">เลือกคนก่อน แล้วระบบจะเปิดหน้าที่ของโหมดนี้เท่านั้น · ปีงบประมาณ ${esc(S.year)}</p>
      <table class="data">
        <thead><tr><th>ชื่อ</th><th>ตำแหน่ง</th><th>สถานะ PA</th><th>สถานะ IDP</th><th>Action</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`);
}

function rolePreset(role) {
  const map = {
    faculty: { family: "ratee", track: "faculty", role: "faculty", roleLabel: "ผู้รับการประเมิน", roleSub: "อาจารย์", type: "สายวิชาการ", tone: "ratee", hint: "กรอกข้อตกลงสายวิชาการของตนเอง" },
    support: { family: "ratee", track: "support", role: "support", roleLabel: "ผู้รับการประเมิน", roleSub: "บุคลากรสายสนับสนุน", type: "สายสนับสนุน", tone: "support", hint: "กรอกแบบ PA บุคคลากรของตนเอง" },
    committee: { family: "eval", track: null, role: "committee", roleLabel: "หัวหน้างานขั้นต้น", roleSub: "ผู้ประเมิน", type: "ผู้ประเมิน", tone: "eval", canEval: true, hint: "ให้คะแนนตาม UM-01 แล้วส่งหัวหน้างาน" },
    chair: { family: "eval", track: null, role: "chair", roleLabel: "หัวหน้างาน", roleSub: "ผู้ประเมิน", type: "ผู้ประเมิน", tone: "chair", canEval: true, canChair: true, hint: "อนุมัติข้อตกลงและให้คะแนนตาม UM-01 / UM-03" },
    hr: { family: "admin", track: null, role: "hr", roleLabel: "ฝ่ายบุคคลากร", roleSub: "Admin ส่วนงาน", type: "ฝ่ายบุคคลากรส่วนงาน", tone: "hr", canHr: true, hint: "รอบและชุดประเมิน ไม่ให้คะแนน" }
  };
  return map[role] || map.committee;
}

function viewUsers() {
  if (!isAdmin()) {
    return chrome(`<div class="warn-box">สร้างบัญชีและกำหนดสิทธิ์ได้เฉพาะช่องทางผู้ดูแลระบบ</div>
      <button class="btn-navy" data-go="home">กลับหน้าหลัก</button>`);
  }
  const rows = (S.users || []).map((u) => `<tr>
    <td>${esc(u.username)}</td>
    <td>${esc(u.full)}</td>
    <td>${esc(u.roleLabel)} · ${esc(u.roleSub)}</td>
    <td>${u.active ? `<span class="pill pill-green">ใช้งาน</span>` : `<span class="pill pill-red">ปิด</span>`}</td>
    <td>
      <button class="act" data-toggle-user="${u.id}">${u.active ? "ปิดบัญชี" : "เปิดบัญชี"}</button>
      <button class="act" data-reset-user="${u.id}">ตั้งรหัสใหม่</button>
    </td>
  </tr>`).join("");
  return chrome(`
    <p class="crumb">ผู้ดูแลระบบ · ความปลอดภัย</p>
    <h1 class="page-title">บัญชีผู้ใช้และสิทธิ์</h1>
    <div class="card">
      <h3>สร้างบัญชีผู้ประเมิน / บุคลากร</h3>
      <p class="hint">ผู้ประเมินเข้าได้เฉพาะช่องทางผู้ประเมิน หลังผู้ดูแลสร้างให้แล้ว</p>
      <form id="createUserForm" class="user-form">
        <label>ประเภทสิทธิ์</label>
        <select id="newRole">
          <option value="committee">หัวหน้างานขั้นต้น</option>
          <option value="chair">หัวหน้างาน</option>
          <option value="faculty">อาจารย์ (ผู้รับการประเมิน)</option>
          <option value="support">เจ้าหน้าที่ (ผู้รับการประเมิน)</option>
          <option value="hr">ฝ่ายบุคคลากร</option>
        </select>
        <label>ชื่อ-นามสกุล</label>
        <input id="newFull" required />
        <label>ชื่อผู้ใช้</label>
        <input id="newUser" required />
        <label>รหัสผ่าน</label>
        <input id="newPass" type="password" required minlength="4" />
        <label>ตำแหน่ง</label>
        <input id="newPos" />
        <button class="btn-navy" type="submit">บันทึกลงฐานข้อมูล</button>
      </form>
    </div>
    <div class="card">
      <h3>บัญชีในฐานข้อมูล</h3>
      <table class="data">
        <thead><tr><th>ผู้ใช้</th><th>ชื่อ</th><th>สิทธิ์</th><th>สถานะ</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`);
}

function viewAdminPeople() {
  return chrome(`
    <p class="crumb">${isAdmin() ? "Admin มหาวิทยาลัย" : "ฝ่ายบุคคลากร"} · โครงสร้าง</p>
    <h1 class="page-title">โครงสร้างส่วนงานและบุคลากร</h1>
    <div class="card">
      <table class="data">
        <thead><tr><th>รหัส</th><th>ชื่อ</th><th>ตำแหน่ง</th><th>สังกัด</th><th>บทบาทในระบบ</th><th>ชุดประเมิน</th></tr></thead>
        <tbody>
          <tr><td>${esc(ACCOUNTS.faculty.staffId)}</td><td>${esc(ACCOUNTS.faculty.full)}</td><td>อาจารย์</td><td>${esc(FACULTY)}</td><td>ผู้รับการประเมิน</td><td>PA, CC, IDP, FC</td></tr>
          <tr><td>${esc(ACCOUNTS.support.staffId)}</td><td>${esc(ACCOUNTS.support.full)}</td><td>เจ้าหน้าที่บริหารงานทั่วไป</td><td>${esc(FACULTY)}</td><td>ผู้รับการประเมิน</td><td>PA, CC, IDP, FC</td></tr>
          <tr><td>${esc(ACCOUNTS.committee.staffId)}</td><td>${esc(ACCOUNTS.committee.full)}</td><td>หัวหน้างานขั้นต้น</td><td>${esc(FACULTY)}</td><td>ผู้ประเมิน</td><td>—</td></tr>
          <tr><td>${esc(ACCOUNTS.chair.staffId)}</td><td>${esc(ACCOUNTS.chair.full)}</td><td>หัวหน้างาน</td><td>${esc(FACULTY)}</td><td>ผู้ประเมิน</td><td>—</td></tr>
          <tr><td>${esc(ACCOUNTS.hr.staffId)}</td><td>${esc(ACCOUNTS.hr.full)}</td><td>เจ้าหน้าที่งานการเจ้าหน้าที่</td><td>${esc(FACULTY)}</td><td>Admin ส่วนงาน</td><td>—</td></tr>
        </tbody>
      </table>
      <p class="hint">ข้อมูลบุคลากรของคณะสังคมศาสตร์และมนุษยศาสตร์ สามารถนำเข้าจากไฟล์ที่มหาวิทยาลัยกำหนด</p>
    </div>`);
}

function viewAdminRound() {
  const y = S.year;
  const prev = String(Number(y) - 1);
  return chrome(`
    <p class="crumb">${isAdmin() ? "Admin มหาวิทยาลัย" : "ฝ่ายบุคคลากร"} · รอบและปฏิทิน</p>
    <h1 class="page-title">รอบประเมินปีงบประมาณ ${esc(y)}</h1>
    <div class="card">
      <div class="year-pick" style="justify-content:flex-start;margin:0 0 16px">
        <label for="yearSel">ปีงบประมาณ</label>
        <select id="yearSel">${yearOptions()}</select>
      </div>
      <table class="data">
        <thead><tr><th>กิจกรรม</th><th>เริ่ม</th><th>สิ้นสุด</th></tr></thead>
        <tbody>
          <tr><td>จัดทำข้อตกลง PA</td><td>1 ต.ค. ${esc(prev)}</td><td>31 ต.ค. ${esc(prev)}</td></tr>
          <tr><td>ประเมินผลงานและประเมินตนเอง</td><td>1 ก.ย. ${esc(y)}</td><td>15 ก.ย. ${esc(y)}</td></tr>
          <tr><td>หัวหน้างานขั้นต้น / หัวหน้างานให้คะแนน</td><td>16 ก.ย. ${esc(y)}</td><td>30 ก.ย. ${esc(y)}</td></tr>
          <tr><td>รับทราบผล</td><td>1 ต.ค. ${esc(y)}</td><td>15 ต.ค. ${esc(y)}</td></tr>
          <tr><td>จัดทำ IDP</td><td>16 ต.ค. ${esc(y)}</td><td>31 ต.ค. ${esc(y)}</td></tr>
        </tbody>
      </table>
      <p class="hint">ข้าราชการและลูกจ้างประเมิน 2 รอบต่อปี · พนักงานมหาวิทยาลัยประเมิน 1 รอบ · ปีงบประมาณที่ใช้คือ 2569 และ 2570</p>
    </div>`);
}

function viewPeriod() {
  return chrome(`
    <p class="crumb">เลือกปีงบประมาณ / รอบการประเมิน</p>
    <h1 class="page-title">ปีงบประมาณและรอบการประเมิน</h1>
    <div class="card">
      <label><b>ปีงบประมาณ</b></label>
      <select id="yearSel">${yearOptions()}</select>
      <p class="hint">ใช้ปีงบประมาณ <b>2570</b> เป็นค่าเริ่มต้น หรือเลือก <b>2569</b> · ข้าราชการ/ลูกจ้าง มี 2 รอบต่อปี · พนักงานมหาวิทยาลัยมี 1 รอบ</p>
      <button class="btn-navy" type="button" id="goProfile" style="margin-top:16px">${isRatee() ? "ถัดไป · ยืนยันประวัติ" : "ถัดไป · ดูผู้รับการประเมิน"}</button>
    </div>`);
}

function viewProfile() {
  const u = isRatee() ? account() : rateeAccount();
  const canEdit = isRatee() || isHr() || isAdmin();
  if (!canEdit) {
    return chrome(`
    <p class="crumb">ข้อมูลบุคลากร</p>
    <h1 class="page-title">ข้อมูลส่วนบุคคล</h1>
    <div class="card">${profileBox(u)}
      <p class="hint">ข้อมูลของผู้รับการประเมินที่กำลังดู</p>
      <button class="btn-navy" type="button" data-go="evalHome" style="margin-top:12px">กลับรายชื่อ</button>
    </div>`);
  }
  return chrome(`
    <p class="crumb">ระบบงานบุคลากร</p>
    <h1 class="page-title">ข้อมูลส่วนบุคคล</h1>
    <form id="profileForm" class="card profile-form">
      <p class="hint">แก้ไขประวัติส่วนบุคคลให้ถูกต้อง แล้วบันทึกลงฐานข้อมูลก่อนจัดทำข้อตกลงการปฏิบัติงาน</p>
      <label>ชื่อ-นามสกุล</label>
      <input id="pfFull" value="${esc(u.full)}" required />
      <label>รหัสบุคลากร</label>
      <input id="pfStaffId" value="${esc(u.staffId)}" required />
      <label>ตำแหน่ง</label>
      <input id="pfPos" value="${esc(u.position)}" />
      <label>ประเภทบุคลากร</label>
      <select id="pfType">
        <option value="สายวิชาการ" ${u.type === "สายวิชาการ" ? "selected" : ""}>สายวิชาการ</option>
        <option value="สายสนับสนุน" ${u.type === "สายสนับสนุน" ? "selected" : ""}>สายสนับสนุน</option>
      </select>
      <label>สังกัด / ภาควิชาหรืองาน</label>
      <input id="pfDept" value="${esc(u.dept)}" />
      <label>ส่วนงาน</label>
      <input value="${esc(FACULTY)}" disabled />
      <label>ผู้ประเมิน</label>
      <input id="pfSup" value="${esc(u.supervisor || "หัวหน้างาน")}" />
      <label>ไปรษณีย์อิเล็กทรอนิกส์</label>
      <input id="pfEmail" type="email" value="${esc(u.email || "")}" />
      <label>หมายเลขโทรศัพท์</label>
      <input id="pfPhone" value="${esc(u.phone || "")}" />
      <div class="footbar">
        <button class="btn-navy" type="submit">บันทึกข้อมูลส่วนบุคคล</button>
        <button class="btn-ghost" type="button" data-go="${isRatee() ? "modules" : "home"}">เข้าวงจรประเมิน</button>
      </div>
    </form>`);
}

function viewRounds() {
  return chrome(`
    <p class="crumb">KPI / รอบประเมิน</p>
    <h1 class="page-title">รอบประเมินปีงบประมาณ ${esc(S.year)}</h1>
    <div class="card">
      <table class="data">
        <thead><tr><th>Action</th><th>รอบ</th><th>สถานะรอบการประเมิน</th><th>แบบ</th></tr></thead>
        <tbody><tr>
          <td><button class="act" data-go="formset">รายละเอียด</button>
              <button class="act" data-go="modules">รอบประเมิน</button></td>
          <td>${esc(S.round)} · ${esc(FACULTY)}</td>
          <td><span class="pill pill-pink">กำลังดำเนินการ</span></td>
          <td>พนักงานมหาวิทยาลัย</td>
        </tr></tbody>
      </table>
    </div>`);
}

function viewFormset() {
  const tot = currentTotal(true);
  const who = rateeAccount();
  return chrome(`
    <p class="crumb">KPI / รอบการประเมิน / ชุดประเมิน</p>
    <h1 class="page-title">${esc(S.round)} - ชุดประเมิน</h1>
    ${profileBox(who)}
    <div class="card">
      <p>รายการทั้งหมด 4 · ของ ${esc(who.full)}</p>
      <table class="data">
        <thead><tr><th>Action</th><th>รหัส</th><th>ชื่อผู้ถูกประเมิน</th><th>ชื่อแบบประเมิน</th><th>แบบ</th></tr></thead>
        <tbody>
          ${[["pa", "แบบประเมินข้อตกลง PA", "PA"], ["idp", "แบบแผนพัฒนาตนเอง", "IDP"], ["competency", "แบบประเมินสมรรถนะหลัก", "CC"], ["competency", "แบบประเมินสมรรถนะตามสายอาชีพ", "FC"]].map(([go, name, code]) => `
          <tr>
            <td>
              ${isHr() || isAdmin() ? `<button class="act" data-go="${go}">ตรวจชุด</button>` : ""}
              ${isRatee() ? `<button class="act" data-go="${go}">${code === "IDP" || code === "PA" ? "กำหนดตัวชี้วัด" : "ประเมินผล"}</button>` : ""}
              ${isEval() ? `<button class="act" data-go="${go}">${isChair() && go === "pa" ? "อนุมัติ / กำหนดตัวชี้วัด" : "ประเมินผล"}</button>` : ""}
            </td>
            <td>${esc(who.staffId)}</td><td>${esc(who.full)}</td>
            <td>${esc(name)}</td><td>${esc(code)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
      <p style="margin:12px 0 0">ผลการประเมิน : PA ${C.fmtScore(tot.pa)} คะแนน , CC ${C.fmtScore(tot.cc)} คะแนน , รวม ${C.fmtScore(tot.total)} คะแนน
        · ${statusPill(paStatus())}</p>
    </div>`);
}

function viewModules() {
  const list = currentModules();
  const staff = track() === "support";
  const groups = staff ? [
    { title: "กลุ่ม PA บุคคลากร", note: "แบบข้อตกลง 05 ติดตาม 06 ประเมินผลงาน 07 สรุปคะแนน 09 และแจ้งผล 08", ids: ["pa", "follow", "paReport", "competency", "scoreSum", "ack"] },
    { title: "กลุ่ม IDP", note: "ผู้ปฏิบัติและผู้อนุมัติ", ids: ["idp", "idpEval"] },
    { title: "กลุ่มรายงาน", note: "", ids: ["report"] }
  ] : [
    { title: "กลุ่ม PA อาจารย์", note: "ข้อตกลงตามประกาศค่าน้ำหนักและแบบ SHPA", ids: ["pa", "paReport", "competency", "ack"] },
    { title: "กลุ่ม IDP", note: "แผนพัฒนารายบุคคล", ids: ["idp", "idpReport", "idpEval", "idpAck"] },
    { title: "กลุ่มรายงาน", note: "", ids: ["report"] }
  ];
  const byId = Object.fromEntries(list.map((m) => [m.id, m]));
  const blocks = groups.map((g) => {
    const mods = g.ids.map((id) => byId[id]).filter(Boolean);
    if (!mods.length) return "";
    return `<div class="mod-group">
      <h3>${esc(g.title)}</h3>
      ${g.note ? `<p>${esc(g.note)}</p>` : ""}
      <div class="mods">${mods.map((m) =>
        `<button class="mod" type="button" data-go="${m.id}">
          ${esc(m.title)}${m.sub ? `<small>${esc(m.sub)}</small>` : ""}
        </button>`).join("")}</div>
    </div>`;
  }).join("");
  const who = rateeAccount();
  return chrome(`
    <div class="pms-home">
      <div class="left">
        <h1>PA</h1>
        <p>${staff ? "วงจร PA บุคคลากร" : "วงจร PA อาจารย์"} · ${staff ? "เอกสารสายสนับสนุน" : "ประกาศค่าน้ำหนัก / SHPA"}</p>
        <p class="hint" style="margin-top:18px">${esc(who.full)} · ${esc(who.position)}<br>${esc(FACULTY)}<br>ปีงบประมาณ ${esc(S.year)}</p>
        <p>PA ${statusPill(paStatus())} · IDP ${statusPill(idpStatus())}</p>
      </div>
      <div>${blocks}</div>
    </div>`);
}

function critRadio(t, lock, value, label, hint) {
  const extra = hint
    ? ` class="opt has-hint" data-hint="${esc(hint)}"`
    : ` class="opt"`;
  return `<label${extra}><input type="radio" name="crit-${t.id}" data-crit="${t.id}" value="${esc(value)}" ${t.criteriaId === value ? "checked" : ""} ${lock ? "disabled" : ""} /><span>${esc(label)}</span></label>`;
}

function grantTierValue(kind, amount) {
  const src = C.GRANT_SOURCES[kind];
  if (!src) return "";
  const n = Number(amount) || 0;
  const hit = src.tiers.find((x) => n >= x.amount);
  return hit ? `${kind}|${hit.amount}` : "";
}

function shpaOpt(t, lock, field, value, label, type) {
  const checked = type === "check"
    ? (field === "shpaMedia" ? (t.shpaMedia || []).includes(value) : !!t[field])
    : t[field] === value;
  const name = type === "check" ? "" : ` name="shpa-${field}-${t.id}"`;
  const attr = type === "check"
    ? `data-shpa-check="${t.id}:${field}:${esc(value)}"`
    : `data-shpa="${t.id}:${field}"`;
  return `<label class="opt"><input type="${type === "check" ? "checkbox" : "radio"}"${name} ${attr} value="${esc(value)}" ${checked ? "checked" : ""} ${lock ? "disabled" : ""} /><span>${esc(label)}</span></label>`;
}

function shpa122Form(t, lock) {
  const F = C.SHPA_122;
  const progOn = !!t.shpaProgress && !t.shpaDone;
  const levels = F.levels.map((lv) =>
    `<label class="opt"><input type="radio" name="shpa-shpaLevel-${t.id}" data-shpa="${t.id}:shpaLevel" value="${esc(lv.id)}" ${t.shpaLevel === lv.id ? "checked" : ""} ${lock || !progOn ? "disabled" : ""} /><span>${esc(lv.label)}</span></label>`
  ).join("");
  return `<table class="shpa-grid">
    <thead>
      <tr><th>ภาระความรับผิดชอบ</th><th>การได้รับทุนสนับสนุนงบประมาณ</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>${F.duty.map((x) => shpaOpt(t, lock, "shpaDuty", x.id, x.label)).join("")}</td>
        <td>${F.grant.map((x) => shpaOpt(t, lock, "shpaGrant", x.id, x.label)).join("")}</td>
      </tr>
      <tr><th colspan="2">หน่วยภาระงานด้านกระบวนการดำเนินงาน</th></tr>
      <tr>
        <td>${shpaOpt(t, lock, "shpaDone", "1", "ดำเนินการเสร็จแล้ว", "check")}</td>
        <td>
          ${shpaOpt(t, lock, "shpaProgress", "1", "อยู่ในระหว่างดำเนินการ", "check")}
          ${levels}
        </td>
      </tr>
      <tr><th colspan="2">หน่วยภาระงานด้านวิธีการเผยแพร่ผลงาน</th></tr>
      <tr>
        <td>${F.author.map((x) => shpaOpt(t, lock, "shpaAuthor", x.id, x.label)).join("")}</td>
        <td>
          <div class="shpa-inline">${F.media.map((x) => shpaOpt(t, lock, "shpaMedia", x.id, x.label, "check")).join("")}</div>
          <div class="shpa-inline">${F.use.map((x) => shpaOpt(t, lock, "shpaUse", x.id, x.label)).join("")}</div>
        </td>
      </tr>
    </tbody>
  </table>`;
}

function facultyCriteriaCell(t, g, lock) {
  if (g.id === "main" && String(t.criteriaId) === "res_book") return shpa122Form(t, lock);
  if (g.id === "main") {
    const sec = C.mainSectionOf(t);
    const items = (C.CATALOG.main || []).filter((c) => c.id && C.mainSectionOf({ criteriaId: c.id }) === sec);
    if (sec === "book") return shpa122Form(t, lock);
    return `<div class="crit-list">${items.map((c) => critRadio(t, lock, c.id, c.label, c.hint)).join("")}</div>`;
  }
  if (g.id === "strat") {
    const pubs = C.PUB.map((p) =>
      critRadio(t, lock, p.id, p.formLabel || `${p.label} (${p.units} หน่วย / ${p.score} คะแนน)`, p.hint)
    ).join("");
    const grants = ["grant_th", "grant_en", "grant_mu"].map((kind) => {
      const src = C.GRANT_SOURCES[kind];
      const sel = t.criteriaId === kind ? grantTierValue(kind, t.amount) : "";
      const grantHint = src.note || "";
      return `<select class="has-hint" data-grant="${t.id}" data-hint="${esc(grantHint)}" ${lock ? "disabled" : ""}>
        <option value="">${esc(src.label)}</option>
        ${src.tiers.map((x) =>
          `<option value="${kind}|${x.amount}" ${sel === `${kind}|${x.amount}` ? "selected" : ""}>${esc(x.label)}</option>`
        ).join("")}
      </select>`;
    }).join("");
    const otherBucket = (C.STRAT_BUCKETS || []).find((b) => b.id === "other");
    const others = (C.CATALOG.strat || []).filter((c) => c.id && otherBucket && otherBucket.match(c)).map((c) =>
      `<option value="${esc(c.id)}" ${t.criteriaId === c.id ? "selected" : ""} data-hint="${esc(c.hint || "")}">${esc(c.label)}</option>`
    ).join("");
    return `<div class="crit-buckets">
      <div class="bucket"><h4>${esc((C.STRAT_BUCKETS.find((b) => b.id === "pub") || {}).title || "ยุทธศาสตร์ตีพิมพ์")}</h4>
        <div class="crit-list">${pubs}</div>
        <div class="hint has-hint" data-hint="${esc(C.SCORE_COND.corp)}">${esc(C.SCORE_COND.corpShort)}</div>
      </div>
      <div class="bucket"><h4>${esc((C.STRAT_BUCKETS.find((b) => b.id === "grant") || {}).title || "ยุทธศาสตร์ทุนวิจัย")}</h4>
        <div class="grant-stack">${grants}</div>
      </div>
      <div class="bucket"><h4>${esc((otherBucket || {}).title || "ยุทธศาสตร์อื่นๆ")}</h4>
        <div class="hint has-hint" data-hint="${esc(C.SCORE_COND.cta)}">${esc(C.SCORE_COND.ctaShort)}</div>
        <select data-crit-other="${t.id}" ${lock ? "disabled" : ""}>
          <option value="">เกณฑ์ยุทธศาสตร์อื่นตามประกาศ</option>
          ${others}
        </select>
      </div>
    </div>`;
  }
  const items = (C.CATALOG[g.id] || []).filter((c) => c.id);
  return `<div class="crit-list">${items.map((c) => critRadio(t, lock, c.id, c.label, c.hint)).join("")}</div>`;
}

function facultyRoleCell(t, g, lock) {
  if (g.id === "main" && C.mainSectionOf(t) === "book") return "";
  const c = C.findCrit(g.id, t.criteriaId);
  const dis = lock ? "disabled" : "";
  const role = `<select data-pa="t:${t.id}:role" ${dis}>${C.ROLES.map((r) =>
    `<option value="${r.id}" ${t.role === r.id ? "selected" : ""}>${esc(r.label)}</option>`).join("")}</select>`;
  const cond = `<label class="opt has-hint" data-hint="${esc(C.SCORE_COND.inDb)}"><input type="radio" name="cond-${t.id}" data-cond="${t.id}" value="inDb" ${t.inDb && !t.withStudent ? "checked" : ""} ${dis} /><span>${esc(C.SCORE_COND.inDbShort)}</span></label>
    <label class="opt has-hint" data-hint="${esc(C.SCORE_COND.student)}"><input type="radio" name="cond-${t.id}" data-cond="${t.id}" value="student" ${t.withStudent ? "checked" : ""} ${dis} /><span>${esc(C.SCORE_COND.studentShort)}</span></label>`;
  let extra = "";
  if (c && c.kind === "hours") {
    extra += syllabusBox(t, lock);
  }
  if (c && c.kind === "count") {
    extra += `<input type="number" data-pa="t:${t.id}:qty" value="${esc(t.qty)}" placeholder="จำนวน" ${dis} />`;
  }
  if (c && c.kind === "custom") {
    extra += `<input data-pa="t:${t.id}:customTitle" value="${esc(t.customTitle || "")}" placeholder="หัวข้องานอื่นตามที่ประชุม" ${dis} />
      <input type="number" data-pa="t:${t.id}:proposedUnits" value="${esc(t.proposedUnits)}" placeholder="หน่วยที่เสนอ" ${dis} />
      <input type="number" data-pa="t:${t.id}:proposedScore" value="${esc(t.proposedScore)}" placeholder="คะแนนที่เสนอ" ${dis} />`;
  }
  if (g.id === "strat") return `<div class="role-stack">${role}${cond}${extra}</div>`;
  return `<div class="role-stack">${role}${extra}</div>`;
}

function seqTools(g, t) {
  if (!canEditAgreement()) return "";
  return `<div class="row-tools">
    <button class="iconbtn" type="button" data-del-row="${g.id}:${t.id}" aria-label="ลบรายการ">−</button>
  </div>`;
}

function facultyItemRow(t, g, lock, seq, sec) {
  const cal = C.calcTarget(t, g.id);
  const self = C.effectiveScore(t, g.id);
  const warn = cal.blocked === "student"
    ? `<div class="warn-box">ผลงานวิจัยร่วมกับนักศึกษาไม่นับในยุทธศาสตร์</div>`
    : cal.blocked === "db"
      ? `<div class="warn-box">ต้องเผยแพร่แล้วและปรากฏในฐานข้อมูลก่อนจึงคิดหน่วย</div>`
      : "";
  if (S.paLayout === "plan") {
    const prev = C.expectedPreview(t, g.id);
    return `<tr>
      <td class="seq-cell">${seq}${seqTools(g, t)}</td>
      <td>
        <input class="plan-title" data-pa="t:${t.id}:title" value="${esc(t.title)}" placeholder="${esc((sec && sec.item) || C.paItemHeader(g.id))}" ${lock ? "disabled" : ""} />
        ${facultyCriteriaCell(t, g, lock)}
      </td>
      <td class="auto">${esc(prev.label)}</td>
      <td>
        <input type="number" min="0" max="10" step="0.5" data-pa="t:${t.id}:selfScore" value="${esc(t.selfScore === "" || t.selfScore == null ? "" : t.selfScore)}" placeholder="-" ${lock ? "disabled" : ""} />
        <div class="hint">${self ? `คำนวณ ${C.fmtScore(self)}` : ""}</div>
      </td>
    </tr>`;
  }
  const book = g.id === "main" && C.mainSectionOf(t) === "book";
  return `<tr>
    <td class="seq-cell">${seq}${seqTools(g, t)}</td>
    <td class="title-cell">
      <textarea data-pa="t:${t.id}:title" placeholder="${esc((sec && sec.item) || C.paItemHeader(g.id))}" ${lock ? "disabled" : ""}>${esc(t.title)}</textarea>
      <label class="date-lab">วันที่ตีพิมพ์ / วันที่เริ่มโครงการ</label>
      <input type="date" data-pa="t:${t.id}:date" value="${esc(t.date || "")}" ${lock ? "disabled" : ""} />
      ${showPubDoi(t, g) ? doiBox(t, lock) : ""}
      ${g.id === "strat" && (!t.criteriaId || String(t.criteriaId).startsWith("grant_")) ? `${projectSearchBox(t, lock)}<div class="hint has-hint" data-hint="${esc(C.SCORE_COND.contractAmount)}">${esc(C.SCORE_COND.contractAmountShort)}</div>` : ""}
    </td>
    <td${book ? " colspan=\"2\" class=\"shpa-cell\"" : ""}>${facultyCriteriaCell(t, g, lock)}</td>
    ${book ? "" : `<td>${facultyRoleCell(t, g, lock)}${warn}</td>`}
    <td class="auto">${C.fmtUnit(cal.units)}</td>
    <td>
      <input type="number" min="0" max="10" step="0.5" data-pa="t:${t.id}:selfScore" value="${esc(t.selfScore === "" || t.selfScore == null ? "" : t.selfScore)}" placeholder="-" ${lock ? "disabled" : ""} />
      <div class="hint">${self ? `คำนวณ ${C.fmtScore(self)}` : ""}</div>
    </td>
    <td>
      <textarea data-pa="t:${t.id}:report" placeholder="กรณีให้คะแนนระดับ 9 – 10 และ 0 – 2 ระบุเหตุผลเชิงรูปธรรมหรือหลักฐานเชิงประจักษ์" ${lock ? "disabled" : ""}>${esc(t.report)}</textarea>
      ${evidenceBox(t, lock)}
    </td>
  </tr>`;
}

function facultyGroupRows(g, lock, sec) {
  const rows = groupTargets(g).filter((t) => !sec || C.mainSectionOf(t) === sec.id);
  return rows.map((t, i) => facultyItemRow(t, g, lock, i + 1, sec)).join("");
}

function facultyTable(g, lock, sec) {
  const heads = sec ? C.sectionHeaders(sec, S.paLayout) : C.paHeaders(g.id, S.paLayout);
  const rows = facultyGroupRows(g, lock, sec);
  const addCrit = sec && sec.addCrit ? ` data-add-crit="${esc(sec.addCrit)}"` : "";
  return `<div class="pa-sub"${sec ? ` id="pa-g-${g.id}-${sec.id}"` : ""}>
    ${sec ? `<h3 class="pa-subhead">${esc(sec.no)} ${esc(sec.name)}</h3>` : ""}
    ${canEditAgreement() && sec ? `<button class="btn-teal" type="button" data-add-ag="${g.id}"${addCrit}>เพิ่มรายการ</button>` : ""}
    <div class="pa-wrap"><table class="pa pa-faculty${S.paLayout === "plan" ? " pa-plan" : ""}">
      <thead><tr>${(heads || []).map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>${rows || `<tr><td colspan="${(heads || []).length}">ยังไม่มีรายการ</td></tr>`}</tbody>
    </table></div>
  </div>`;
}

function viewPA() {
  if (track() === "support") return viewSupportPA();
  syncFacultyWeights();
  const lock = !canEditAgreement();
  const chairOn = canApproveAgreement();
  const w = checkWeight();
  const wcls = w === 100 ? "" : "warn";
  const jump = `<nav class="jump-bar">${C.GROUPS.map((meta) =>
    `<button type="button" data-jump="pa-g-${meta.id}">${esc(meta.title)}</button>`
  ).join("")}${(C.MAIN_SECTIONS || []).map((sec) =>
    `<button type="button" data-jump="pa-g-main-${sec.id}">${esc(sec.no)}</button>`
  ).join("")}</nav>`;
  const sections = C.GROUPS.map((meta) => {
    const g = (S.groups || []).find((x) => x.id === meta.id);
    if (!g) return "";
    const units = C.groupUnits(S.groups, g.id);
    return `<section class="sec pa-sec sec-faculty" id="pa-g-${g.id}">
      <header class="sec-head">
        <div>
          <h2>${esc(meta.title)} · ${esc(meta.name)}</h2>
          <p>${S.paLayout === "plan" ? "ช่วง PA ล่วงหน้า (ก่อนทำงาน)" : "ช่วงหน้าประเมิน PA"} · น้ำหนักตามประกาศ ${meta.pct}% · เพดาน ${meta.cap} หน่วย · ได้ ${C.fmtUnit(units)} หน่วย</p>
        </div>
        ${canEditAgreement() && g.id !== "main" ? `<button class="btn-teal" type="button" data-add-ag="${g.id}">เพิ่มรายการ</button>` : ""}
      </header>
      ${g.id === "main"
        ? (C.MAIN_SECTIONS || []).map((sec) => facultyTable(g, lock, sec)).join("")
        : facultyTable(g, lock)}
    </section>`;
  }).join("");

  const chairBar = chairOn ? `
    <div class="card chair-only">
      <h3>หัวหน้างานพิจารณาข้อตกลง</h3>
      <p>ตรวจรายการบทความ / โครงการ แล้วกดอนุมัติทั้งหมด หรือส่งกลับให้แก้ไข</p>
      <textarea id="rejectReason" placeholder="เหตุผลกรณีไม่อนุมัติ">${esc(S.paReject)}</textarea>
      <div class="footbar">
        <button class="btn-ok" type="button" id="btnApproveAll">อนุมัติทั้งหมด</button>
        <button class="btn-danger" type="button" id="btnReject">ไม่อนุมัติ / ส่งกลับ</button>
      </div>
    </div>` : "";

  const reject = (track() === "support" ? S.supportReject : S.paReject);
  return chrome(`
    <p class="crumb">ชุดประเมิน / แบบประเมินข้อตกลง PA · ${esc(rateeAccount().full)}</p>
    ${isRatee() ? `<div class="toolbar">
      <button class="btn-ghost" type="button" id="btnImport">Import Excel ชุดชี้วัด</button>
      <button class="btn-ghost" type="button">นำเข้ารอบประเมินก่อนหน้า</button>
    </div>` : ""}
    <div class="pa-banner">
      <div>
        <h2>แบบรายงานผลการปฏิบัติงาน</h2>
        <p class="sub">ส่วนที่ 2 รายงานผลการปฏิบัติงานตามข้อตกลง · ${statusPill(paStatus())} · ปี ${esc(S.year)} · ${S.paLayout === "plan" ? "ช่วง PA ล่วงหน้า (ก่อนทำงาน)" : "ช่วงหน้าประเมิน PA"}</p>
      </div>
      <div class="weight-box ${wcls}">น้ำหนักตามประกาศ : ${w}</div>
    </div>
    ${paStatus() === "back" ? `<div class="warn-box">ส่งกลับแก้ไข: ${esc(reject)}</div>` : ""}
    ${chairBar}
    ${jump}
    ${sections}
    <div class="footbar">
      ${canEditAgreement() ? `<button class="btn-navy" type="button" id="btnSave">บันทึกฉบับร่าง</button>
      <button class="btn-navy" type="button" id="btnAsk">ขออนุมัติ</button>` : ""}
      <button class="btn-ghost" type="button" data-go="${isEval() ? "evalHome" : "modules"}">กลับ</button>
    </div>
    <p class="hint">หัวข้อตามแบบฟอร์ม SHPA ร่าง · หน่วยและคะแนนตามประกาศคณะฯ พ.ศ. 2568 (ฐาน 1,820 หน่วย · PA 80 + CC 20) · ปีงบประมาณ ${esc(S.year)} · ไม่ใช้แบบข้อตกลงของบุคลากร</p>
  `);
}

function supportItemRow(it, lock, chairOn) {
  const autoW = ((Number(it.weight) || 0) * (Number(it.kpiWeight) || 0) / 100).toFixed(2);
  return `<tr>
    <td>${canEditAgreement() ? `<button class="iconbtn" data-del-sup="${it.id}">−</button>` : ""}</td>
    <td>${esc(it.no)}</td>
    <td><input data-sup="${it.id}:title" value="${esc(it.title)}" ${lock ? "disabled" : ""} /></td>
    <td><input type="number" data-sup="${it.id}:weight" value="${esc(it.weight)}" ${lock ? "disabled" : ""} /></td>
    <td><select data-sup="${it.id}:kpiType" ${lock ? "disabled" : ""}>${C.KPI_TYPES.map((x) =>
      `<option value="${x.id}" ${it.kpiType === x.id ? "selected" : ""}>${esc(x.label)}</option>`).join("")}</select>
      <input type="number" data-sup="${it.id}:kpiWeight" value="${esc(it.kpiWeight)}" ${lock ? "disabled" : ""} /></td>
    <td class="auto">${autoW}</td>
    <td><textarea data-sup="${it.id}:criteria" ${lock ? "disabled" : ""} placeholder="เกณฑ์ 5 ระดับ">${esc(it.criteria)}</textarea></td>
    <td>${chairOn ? `<select data-sup="${it.id}:approved">
      <option value="wait" ${it.approved === "wait" ? "selected" : ""}>รออนุมัติ</option>
      <option value="yes" ${it.approved === "yes" ? "selected" : ""}>อนุมัติ</option>
      <option value="no" ${it.approved === "no" ? "selected" : ""}>ไม่อนุมัติ</option>
    </select>` : `<span class="pill pill-gray">${it.approved === "yes" ? "อนุมัติ" : it.approved === "no" ? "ไม่อนุมัติ" : "รออนุมัติ"}</span>`}</td>
  </tr>`;
}

function viewSupportPA() {
  const lock = !canEditAgreement();
  const chairOn = canApproveAgreement();
  const w = checkWeight();
  const wcls = w === 100 ? "" : "warn";
  const jump = `<nav class="jump-bar">${C.WORK_TYPES.map((x) =>
    `<button type="button" data-jump="pa-s-${x.id}">${esc(x.label)}</button>`
  ).join("")}</nav>`;
  const sections = C.WORK_TYPES.map((type) => {
    const items = S.supportItems.filter((it) => it.workType === type.id);
    const wsum = items.reduce((n, it) => n + (Number(it.weight) || 0), 0);
    return `<section class="sec pa-sec sec-staff" id="pa-s-${type.id}">
      <header class="sec-head">
        <div>
          <h2>${esc(type.label)}</h2>
          <p>น้ำหนักของกลุ่มนี้ ${wsum}</p>
        </div>
        ${canEditAgreement() ? `<button class="btn-teal" type="button" data-add-sup="${type.id}">เพิ่มข้อตกลงกลุ่มนี้</button>` : ""}
      </header>
      <div class="pa-wrap"><table class="pa">
        <thead><tr>
          <th></th><th>ลำดับ</th><th>ข้อตกลง (ภาระงาน)</th>
          <th>ค่าน้ำหนัก</th><th>ตัวชี้วัด / น้ำหนักตัวชี้วัด</th><th>ร้อยละน้ำหนัก</th>
          <th>เกณฑ์ 5 ระดับ</th><th>อนุมัติ</th>
        </tr></thead>
        <tbody>${items.map((it) => supportItemRow(it, lock, chairOn)).join("") || `<tr><td colspan="8">ยังไม่มีข้อตกลงในกลุ่มนี้</td></tr>`}</tbody>
      </table></div>
    </section>`;
  }).join("");
  const chairBar = chairOn ? `
    <div class="card chair-only">
      <h3>หัวหน้างานพิจารณาข้อตกลงสายสนับสนุน</h3>
      <textarea id="rejectReason" placeholder="เหตุผลกรณีไม่อนุมัติ">${esc(S.supportReject)}</textarea>
      <div class="footbar">
        <button class="btn-ok" type="button" id="btnApproveAll">อนุมัติทั้งหมด</button>
        <button class="btn-danger" type="button" id="btnReject">ไม่อนุมัติ / ส่งกลับ</button>
      </div>
    </div>` : "";
  return chrome(`
    <p class="crumb">แบบประเมินข้อตกลง PA · สายสนับสนุน · ${esc(rateeAccount().full)}</p>
    <div class="pa-banner">
      <div>
        <h2>Performance Agreement (PA)</h2>
        <p class="sub">หน้า A ตาม UM-03 · ${statusPill(paStatus())} · ปี ${esc(S.year)}</p>
      </div>
      <div class="weight-box ${wcls}">รวมร้อยละ (ค่าน้ำหนัก) : ${w}</div>
    </div>
    ${paStatus() === "back" ? `<div class="warn-box">ส่งกลับแก้ไข: ${esc(S.supportReject)}</div>` : ""}
    ${chairBar}
    ${jump}
    ${sections}
    <div class="footbar">
      ${canEditAgreement() ? `<button class="btn-navy" type="button" id="btnSave">บันทึกฉบับร่าง</button>
      <button class="btn-navy" type="button" id="btnAsk">ขออนุมัติ</button>` : ""}
      <button class="btn-ghost" type="button" data-go="${isEval() ? "evalHome" : "modules"}">กลับ</button>
    </div>
    <p class="hint">แบบของบุคลากรตามเอกสาร PA บุคคลากร: ข้อตกลง 05 · ติดตาม 06 · ประเมินผลงาน 07 · แจ้งผล 08 · สรุปคะแนน 09 · IDP ผู้ปฏิบัติ/ผู้อนุมัติ · น้ำหนักรวม 100 · ประกาศหน่วย 1,820 ของอาจารย์ไม่ใช้กับหน้านี้</p>
  `);
}

function viewKpi2570() {
  if (track() === "support") {
    return chrome(`<div class="warn-box">คำอธิบายตัวชี้วัด PA 2570 เป็นของสายวิชาการ</div>
      <button class="btn-navy" type="button" data-go="home">กลับหน้าหลักระบบงาน</button>`);
  }
  const F = window.Faculty2570;
  const rows = (F.UNIT_KPI_2570 || []).map((k) => `<tr>
    <td>${esc(k.id)}</td>
    <td>${esc(k.title)}</td>
    <td>${k.inUnitPa ? "จัดทำ PA กับส่วนงาน" : "ไม่จัดทำ PA กับส่วนงาน"}</td>
    <td>${esc(k.unit)}</td>
    <td>${esc(k.year)}</td>
    <td>${esc(k.note || "")}</td>
  </tr>`).join("");
  return chrome(`
    <p class="crumb">สายวิชาการ</p>
    <h1 class="page-title">คำอธิบายตัวชี้วัด PA 2570 (ฉบับจัดทำ PA)</h1>
    <div class="card">
      <p class="hint">ปกเล่มเขียนว่าข้อตกลงการปฏิบัติงานของส่วนงาน เจ้าของงานใช้ฝั่งอาจารย์ อ่านนิยามตอนกรอกงานวิจัย ห้ามนำตัวหารระดับมหาวิทยาลัยไปคูณฐานหน่วย 1,820</p>
      <p><a href="${esc(F.SOURCE_PDF)}" target="_blank" rel="noopener">เปิดไฟล์ต้นฉบับ PDF</a></p>
      <div class="pa-wrap"><table class="data">
        <thead><tr><th>รหัส</th><th>ชื่อตามเล่ม</th><th>จัดทำ PA กับส่วนงาน</th><th>หน่วยนับ</th><th>ปีที่เก็บ</th><th>หมายเหตุตามเล่ม</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>`);
}

function viewResearchTrack() {
  if (track() === "support") {
    return chrome(`<div class="warn-box">แบบติดตามข้อมูลโครงการวิจัย ปี 2570 เป็นของสายวิชาการ ไม่ใช่แบบ 06</div>
      <button class="btn-navy" type="button" data-go="home">กลับหน้าหลักระบบงาน</button>`);
  }
  const F = window.Faculty2570;
  const lock = !canEditAgreement();
  const dis = lock ? "disabled" : "";
  function foundOpts(found, current) {
    return [""].concat(found).map((v) =>
      `<option value="${esc(v)}" ${v === (current || "") ? "selected" : ""}>${esc(v || "—")}</option>`
    ).join("");
  }
  const intRows = (S.researchInt || []).map((r) => `<tr>
    <td><select data-rint="${r.id}:status" ${dis}>${foundOpts(F.STATUS_FOUND, r.status)}</select></td>
    <td><input data-rint="${r.id}:no" value="${esc(r.no)}" ${dis} /></td>
    <td><textarea data-rint="${r.id}:name" ${dis}>${esc(r.name)}</textarea></td>
    <td><textarea data-rint="${r.id}:lead" ${dis}>${esc(r.lead)}</textarea></td>
    <td><input data-rint="${r.id}:dept" value="${esc(r.dept)}" ${dis} /></td>
    <td><input data-rint="${r.id}:funder" value="${esc(r.funder)}" ${dis} /></td>
    <td><input data-rint="${r.id}:start" value="${esc(r.start)}" ${dis} /></td>
    <td><input data-rint="${r.id}:end" value="${esc(r.end)}" ${dis} /></td>
    <td><input type="number" data-rint="${r.id}:amount" value="${esc(r.amount)}" ${dis} /></td>
    <td><textarea data-rint="${r.id}:objective" ${dis}>${esc(r.objective)}</textarea></td>
    <td><textarea data-rint="${r.id}:benefit" ${dis}>${esc(r.benefit)}</textarea></td>
    <td><textarea data-rint="${r.id}:output" ${dis}>${esc(r.output)}</textarea></td>
    <td><input data-rint="${r.id}:contract" value="${esc(r.contract)}" ${dis} /></td>
    <td>${lock ? "" : `<button class="iconbtn" type="button" data-del-rint="${r.id}">−</button>`}</td>
  </tr>`).join("");
  const noteRows = (S.researchNotify || []).map((r) => `<tr>
    <td><input data-rnote="${r.id}:no" value="${esc(r.no)}" ${dis} /></td>
    <td><textarea data-rnote="${r.id}:name" ${dis}>${esc(r.name)}</textarea></td>
    <td><textarea data-rnote="${r.id}:lead" ${dis}>${esc(r.lead)}</textarea></td>
    <td><input data-rnote="${r.id}:dept" value="${esc(r.dept)}" ${dis} /></td>
    <td><select data-rnote="${r.id}:remark" ${dis}>${foundOpts(F.REMARK_FOUND, r.remark)}</select></td>
    <td>${lock ? "" : `<button class="iconbtn" type="button" data-del-rnote="${r.id}">−</button>`}</td>
  </tr>`).join("");
  return chrome(`
    <p class="crumb">สายวิชาการ</p>
    <h1 class="page-title">แบบติดตามข้อมูลโครงการวิจัย ปี 2570</h1>
    <div class="card">
      <p class="hint">คอลัมน์ตามไฟล์ Excel สองชีต ห้ามรวมตาราง สถานะและหมายเหตุมีเฉพาะค่าที่ปรากฏในไฟล์ แถวว่างด้านล่างสำหรับกรอกของคณะสังคมศาสตร์และมนุษยศาสตร์ ตัวอย่างด้านบนอยู่ในฐานข้อมูลกลางเพื่อค้นหาและประกอบการพิจารณา ไม่ใช่ข้อตกลง PA ของผู้รับการประเมิน</p>
      <p><a href="${esc(F.SOURCE_XLSX)}" download>เปิดไฟล์ต้นฉบับ Excel</a>
         · <a href="${esc(F.SOURCE_JSON)}" download>ข้อมูลตัวอย่างในฐาน (JSON)</a></p>
      <h2>ตัวอย่างไฟล์เก็บข้อมูลโครงการวิจัยที่ใช้ประกอบการพิจารณา</h2>
      <div class="pa-wrap"><table class="data wide-track">
        <thead><tr><th>รหัสอ้างอิง</th><th>ชีต</th>${F.INT_COLS.map((c) => `<th>${esc(c[1])}</th>`).join("")}</tr></thead>
        <tbody>${(F.RESEARCH_SAMPLE || []).filter((r) => r.sheet === "iNT").map((r) => `<tr>
          <td>${esc(r.code)}</td><td>${esc(r.sheet)}</td>
          <td>${esc(r.status)}</td><td>${esc(r.no)}</td><td>${esc(r.name)}</td>
          <td>${esc(r.lead)}</td><td>${esc(r.dept)}</td><td>${esc(r.funder)}</td>
          <td>${esc(r.start)}</td><td>${esc(r.end)}</td><td>${esc(r.amount)}</td>
          <td>${esc(r.objective)}</td><td>${esc(r.benefit)}</td><td>${esc(r.output)}</td>
          <td>${esc(r.contract)}</td>
        </tr>`).join("")}</tbody>
      </table></div>
      <div class="pa-wrap"><table class="data">
        <thead><tr><th>รหัสอ้างอิง</th><th>ชีต</th>${F.NOTIFY_COLS.map((c) => `<th>${esc(c[1])}</th>`).join("")}</tr></thead>
        <tbody>${(F.RESEARCH_SAMPLE || []).filter((r) => r.sheet === "แจ้งทำวิจัย").map((r) => `<tr>
          <td>${esc(r.code)}</td><td>${esc(r.sheet)}</td>
          <td>${esc(r.no)}</td><td>${esc(r.name)}</td><td>${esc(r.lead)}</td>
          <td>${esc(r.dept)}</td><td>${esc(r.remark)}</td>
        </tr>`).join("")}</tbody>
      </table></div>
      <h2>ชีต iNT — กรอกของคณะสังคมศาสตร์และมนุษยศาสตร์</h2>
      <div class="pa-wrap"><table class="data wide-track">
        <thead><tr>${F.INT_COLS.map((c) => `<th>${esc(c[1])}</th>`).join("")}<th></th></tr></thead>
        <tbody>${intRows}</tbody>
      </table></div>
      ${lock ? "" : `<button class="btn-ghost" type="button" id="btnAddInt">เพิ่มแถว iNT</button>`}
      <h2>ชีต แจ้งทำวิจัย — กรอกของคณะสังคมศาสตร์และมนุษยศาสตร์</h2>
      <div class="pa-wrap"><table class="data">
        <thead><tr>${F.NOTIFY_COLS.map((c) => `<th>${esc(c[1])}</th>`).join("")}<th></th></tr></thead>
        <tbody>${noteRows}</tbody>
      </table></div>
      ${lock ? "" : `<button class="btn-ghost" type="button" id="btnAddNotify">เพิ่มแถวแจ้งทำวิจัย</button>`}
      <div class="footbar">
        ${lock ? "" : `<button class="btn-navy" type="button" id="btnSaveResearch">บันทึกแบบติดตามโครงการวิจัย</button>`}
        <button class="btn-ghost" type="button" data-go="home">กลับหน้าหลักระบบงาน</button>
      </div>
    </div>`);
}

function viewFollow() {
  if (track() !== "support") {
    return chrome(`<div class="warn-box">แบบติดตามผลการปฏิบัติงาน (แบบ 06) เป็นของบุคลากรสายสนับสนุน</div>
      <button class="btn-navy" data-go="home">กลับหน้าหลักระบบงาน</button>`);
  }
  const lock = !isRatee() && !isChair();
  const rows = supportFollowRows().map(({ it, row }) => `<tr>
    <td>${esc(it.no)}</td>
    <td>${esc(it.title)}</td>
    <td><input data-fol="${row.id}:progress" value="${esc(row.progress)}" placeholder="ความก้าวหน้า %" ${lock ? "disabled" : ""} /></td>
    <td><textarea data-fol="${row.id}:problem" ${lock ? "disabled" : ""} placeholder="ปัญหา / อุปสรรค">${esc(row.problem)}</textarea></td>
    <td><textarea data-fol="${row.id}:help" ${lock ? "disabled" : ""} placeholder="ความช่วยเหลือที่ต้องการ">${esc(row.help)}</textarea></td>
  </tr>`).join("");
  return chrome(`
    <p class="crumb">PA บุคคลากร · แบบ 06 · ${esc(rateeAccount().full)}</p>
    <h1 class="page-title">แบบติดตามผลการปฏิบัติงาน</h1>
    <p class="hint">ตามเอกสาร PA บุคคลากร แบบ 06 · ไม่ใช่แบบประเมินผลงานปลายปี และไม่ใช่ตารางหน่วยอาจารย์</p>
    <div class="pa-wrap"><table class="pa" style="min-width:1100px">
      <thead><tr><th>ลำดับ</th><th>ข้อตกลง</th><th>ความก้าวหน้า</th><th>ปัญหาอุปสรรค</th><th>ความช่วยเหลือ</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="footbar">
      ${isRatee() || isChair() ? `<button class="btn-navy" type="button" id="btnSaveFollow">บันทึกการติดตาม</button>` : ""}
      <button class="btn-ghost" data-go="modules">กลับวงจรบุคคลากร</button>
    </div>`);
}

function viewScoreSum() {
  if (track() !== "support") {
    return chrome(`<div class="warn-box">แบบสรุปคะแนน (แบบ 09) เป็นของบุคลากรสายสนับสนุน</div>
      <button class="btn-navy" data-go="report">ไปรายงานอาจารย์</button>`);
  }
  const tot = currentTotal(true);
  const rows = S.supportItems.map((it) => `<tr>
    <td>${esc(it.no)}</td><td>${esc(it.title)}</td><td>${esc(it.weight)}</td>
    <td>${C.fmtScore(it.selfScore)}</td><td>${C.fmtScore(it.chairScore)}</td>
  </tr>`).join("");
  return chrome(`
    <p class="crumb">PA บุคคลากร · แบบ 09 · ${esc(rateeAccount().full)}</p>
    <h1 class="page-title">แบบสรุปคะแนนผลการประเมินการปฏิบัติงาน</h1>
    ${profileBox()}
    <div class="card">
      <table class="data">
        <thead><tr><th>ลำดับ</th><th>ข้อตกลง</th><th>น้ำหนัก</th><th>ตนเอง</th><th>หัวหน้างาน</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="score-big">${C.fmtScore(tot.total)} คะแนน · ${esc(tot.level)}</p>
      <table class="data">
        <tr><td>ผลการปฏิบัติงาน (Performance)</td><td>80</td><td>${C.fmtScore(tot.pa)}</td></tr>
        <tr><td>สมรรถนะหลัก (Core Competency)</td><td>20</td><td>${C.fmtScore(tot.cc)}</td></tr>
        <tr><td>รวม</td><td>100</td><td>${C.fmtScore(tot.total)}</td></tr>
      </table>
      <p class="hint">ระดับ: ดีเด่น 90–100 · ดีมาก 80–89.99 · ดี 70–79.99 · พอใช้ 60–69.99 · ควรปรับปรุง ต่ำกว่า 60</p>
    </div>
    <button class="btn-navy" data-go="ack">ไปแบบสรุปและแจ้งผล 08</button>`);
}

function viewPledge() {
  return viewModules();
}

function showPubDoi(t, g) {
  const id = String(t.criteriaId || "");
  if (id.startsWith("grant_")) return false;
  if (id.startsWith("pub_")) return true;
  return g.id === "strat";
}

function doiBox(t, lock) {
  const st = C.doiStatus(t.doi);
  const href = st.url || "";
  return `<div class="doi-box">
    <label class="date-lab">${esc(C.SCORE_COND.doi)}</label>
    <input data-pa="t:${t.id}:doi" value="${esc(t.doi || "")}" placeholder="10.xxxx/xxxx หรือ https://doi.org/10.xxxx/xxxx" ${lock ? "disabled" : ""} />
    ${st.empty ? `<div class="hint">กรอกรหัส DOI หรือวางลิงก์ doi.org แล้วระบบแนบเป็นลิงก์เปิดได้</div>` : ""}
    ${!st.empty && !st.ok ? `<div class="warn-box">${esc(st.label)}</div>` : ""}
    ${href ? `<div class="ok-box">${esc(st.label)} · <a href="${esc(href)}" target="_blank" rel="noopener">เปิดลิงก์ DOI ที่แนบ</a></div>` : ""}
  </div>`;
}

function doiHint(t) {
  return doiBox(t, true);
}

function evidenceBox(t, lock) {
  const files = C.evidenceFiles(t);
  const full = files.length >= C.MAX_EVIDENCE_FILES;
  const list = files.map((name, i) =>
    `<li>${esc(name)}${lock ? "" : ` <button class="btn-ghost" type="button" data-del-ev="${t.id}:${i}">ลบ</button>`}</li>`
  ).join("");
  const doiHref = C.doiUrl(t.doi);
  const doiLink = doiHref
    ? `<div class="hint">ลิงก์ DOI ที่แนบ: <a href="${esc(doiHref)}" target="_blank" rel="noopener">${esc(doiHref)}</a></div>`
    : "";
  return `<div class="file-box">
    ${doiLink}
    <div class="date-lab">หลักฐาน (ไม่เกิน ${C.MAX_EVIDENCE_FILES} ไฟล์ต่อเรื่อง)</div>
    <input type="file" data-files="${t.id}" ${lock || full ? "disabled" : ""} />
    ${t.fileError ? `<div class="warn-box">${esc(t.fileError)}</div>` : ""}
    ${full ? `<div class="warn-box">ครบ ${C.MAX_EVIDENCE_FILES} ไฟล์ต่อเรื่อง ระบบตรวจจับไม่ให้เพิ่มต่อ</div>` : ""}
    <ul class="file-list">${list || "<li class=\"hint\">ยังไม่มีไฟล์</li>"}</ul>
  </div>`;
}

function projectSearchBox(t, lock) {
  const opts = C.searchProjects("").map((p) =>
    `<option value="${esc(p.code)}">${esc(p.code)} · ${esc(p.name)}</option>`
  ).join("");
  return `<div class="search-box">
    <label class="date-lab">ค้นหาชื่อหรือรหัสโครงการจากฐานข้อมูลกลาง</label>
    <input list="proj-${t.id}" data-proj-q="${t.id}" value="${esc(t.projectCode || "")}" placeholder="พิมพ์รหัส INT-2570 / PERS-2570 หรือชื่อโครงการ" ${lock ? "disabled" : ""} />
    <datalist id="proj-${t.id}">${opts}</datalist>
    <div class="hint">${t.contractDate
      ? `วันที่จากฐานกลาง ${esc(t.contractDate)}${t.contractDateNote ? " · " + esc(t.contractDateNote) : ""}`
      : (t.contractDateNote || "เลือกแล้วระบบดึงชื่อโครงการและวันที่จากฐานกลางให้อัตโนมัติ")}</div>
  </div>`;
}

function syllabusBox(t, lock) {
  const dis = lock ? "disabled" : "";
  const opts = C.searchSyllabus("").map((c) =>
    `<option value="${esc(c.id)}">${esc(c.code)} · ${esc(c.title)}</option>`
  ).join("");
  const formula = (C.TEACH_FORMULAS || []).map((f) =>
    `<option value="${esc(f.id)}" ${t.teachFormula === f.id ? "selected" : ""}>${esc(f.label)} · ${esc(f.hint)}</option>`
  ).join("");
  return `<div class="search-box fill-box">
    <label class="date-lab">รหัส / ชื่อรายวิชา (กรอกได้)</label>
    <input list="syl-${t.id}" data-syl-q="${t.id}" value="${esc(t.syllabusId || "")}" placeholder="กรอกรหัสหรือชื่อรายวิชา" ${dis} />
    <datalist id="syl-${t.id}">${opts}</datalist>
    <label class="date-lab">จำนวนชั่วโมงสอน (กรอกได้)</label>
    <input type="number" min="0" step="0.5" data-pa="t:${t.id}:hours" value="${esc(t.hours)}" placeholder="ชั่วโมง" ${dis} />
    <label class="date-lab">สูตรคำนวณ 3 แบบตามประกาศคณะฯ</label>
    <select data-pa="t:${t.id}:teachFormula" ${dis}>
      <option value="">-- เลือกสูตรตามลักษณะภาระงาน --</option>
      ${formula}
    </select>
    <div class="hint">กรอกชั่วโมงเองได้ ถ้ามีในฐานประมวลรายวิชาเลือกแล้วระบบเติมชั่วโมงให้ แล้วยังแก้ต่อได้</div>
  </div>`;
}

function viewPaReport() {
  const lock = !canReportPa();
  if (track() === "support") {
    const rows = S.supportItems.map((it) => `<tr>
      <td>${esc(it.no)}</td><td>${esc(it.title)}</td>
      <td class="auto">${esc(it.weight)}</td>
      <td><input type="number" min="0" max="10" step="0.5" data-sup="${it.id}:selfScore" value="${esc(it.selfScore)}" ${lock ? "disabled" : ""} /></td>
      <td>${esc(C.scaleLabel(it.selfScore))}</td>
    </tr>`).join("");
    return chrome(`
      <h1 class="page-title">ประเมินผลงาน</h1>
      ${stepperHtml()}
      ${paLocked() ? `<div class="lock-note">ส่งการประเมินตนเองแล้วแก้ไขไม่ได้</div>` : ""}
      <div class="pa-wrap"><table class="pa">
        <thead><tr><th>ลำดับ</th><th>ข้อตกลง</th><th>ผลการดำเนินงาน</th><th>ประเมินตนเอง (0–10)</th><th>เกณฑ์</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <div class="footbar">
        ${canReportPa() ? `<button class="btn-navy" type="button" id="btnSaveReport">บันทึก</button>
        <button class="btn-navy" type="button" id="btnSendReport">ส่งการประเมิน</button>` : ""}
        <button class="btn-ghost" data-go="competency">ไปประเมินสมรรถนะ</button>
      </div>`);
  }
  const rows = [];
  forEachTarget((t, g) => {
    const cal = C.calcTarget(t, g.id);
    const self = C.effectiveScore(t, g.id);
    rows.push(`<tr>
      <td>${esc(t.code)}</td>
      <td>${esc(t.title)}</td>
      <td class="auto">${C.fmtUnit(cal.units)}</td>
      <td><input type="number" min="0" max="10" step="0.5" data-pa="t:${t.id}:selfScore" value="${esc(t.selfScore === "" || t.selfScore == null ? self : t.selfScore)}" ${lock ? "disabled" : ""} /></td>
      <td>${esc(C.scaleLabel(self))}</td>
    </tr>`);
  });
  return chrome(`
    <p class="crumb">แบบประเมินข้อตกลง PA / ประเมินผล</p>
    <h1 class="page-title">ประเมินผลงาน</h1>
    ${stepperHtml()}
    ${paLocked() ? `<div class="lock-note">ส่งการประเมินตนเองแล้วแก้ไขไม่ได้</div>` : ""}
    <div class="pa-wrap"><table class="pa">
      <thead><tr><th>เป้าหมาย</th><th>ภารกิจ</th><th>ผลการดำเนินงาน</th><th>ประเมินตนเอง (0–10)</th><th>เกณฑ์</th></tr></thead>
      <tbody>${rows.join("")}</tbody>
    </table></div>
    <div class="footbar">
      ${canReportPa() ? `<button class="btn-navy" type="button" id="btnSaveReport">บันทึก</button>
      <button class="btn-navy" type="button" id="btnSendReport">ส่งการประเมิน</button>` : ""}
      <button class="btn-ghost" data-go="competency">ไปประเมินสมรรถนะ</button>
    </div>`);
}

function ccList() { return track() === "support" ? S.supportCc : S.cc; }
function fcList() { return track() === "support" ? S.supportFc : S.fc; }

function viewCompetency() {
  const lockChair = ["chair", "ack"].includes(paStatus());
  const selfOn = isRatee() && paStatus() === "reported";
  const comOn = canComment();
  const chairOn = canChairScore();
  const cc = ccList();
  const fc = fcList();
  const ccRows = cc.map((it, i) => `
    <tr>
      <td><b>${i + 1}. ${esc(it.name)}</b><div class="hint">${esc(it.full)}</div></td>
      <td class="auto">${C.fmtScore(it.self)}</td>
      <td>0–10 ตามพฤติกรรม</td>
      <td>${selfOn || isRatee() ? `<input type="number" min="0" max="10" data-cc="${it.id}:self" value="${esc(it.self)}" ${selfOn ? "" : "disabled"} />` : C.fmtScore(it.self)}</td>
      <td>${isCommittee() || isChair() ? `<input type="number" min="0" max="10" data-cc="${it.id}:committee" value="${esc(it.committee)}" ${comOn ? "" : "disabled"} />` : (it.committee !== "" ? C.fmtScore(it.committee) : "—")}</td>
      <td>${isChair() ? `<input type="number" min="0" max="10" data-cc="${it.id}:chair" value="${esc(it.chair)}" ${chairOn ? "" : "disabled"} />` : (it.chair !== "" ? C.fmtScore(it.chair) : "—")}</td>
    </tr>`).join("");
  const fcRows = fc.map((it) => `
    <tr>
      <td><b>${esc(it.name)}</b></td>
      <td class="auto">${C.fmtScore(it.self)}</td>
      <td>${isRatee() ? `<input type="number" min="0" max="10" data-fc="${it.id}:self" value="${esc(it.self)}" ${lockChair ? "disabled" : ""} />` : C.fmtScore(it.self)}</td>
      <td>${isCommittee() || isChair() ? `<input type="number" min="0" max="10" data-fc="${it.id}:committee" value="${esc(it.committee)}" ${comOn ? "" : "disabled"} />` : (it.committee !== "" ? C.fmtScore(it.committee) : "—")}</td>
      <td>${isChair() ? `<input type="number" min="0" max="10" data-fc="${it.id}:chair" value="${esc(it.chair)}" ${chairOn ? "" : "disabled"} />` : (it.chair !== "" ? C.fmtScore(it.chair) : "—")}</td>
    </tr>`).join("");
  const tot = currentTotal(true);
  let paRows = "";
  if (track() === "support") {
    paRows = S.supportItems.map((it) => `<tr>
      <td>${esc(it.no)} ${esc(it.title)}</td>
      <td class="auto">${esc(it.weight)}</td>
      <td>${C.fmtScore(it.selfScore)}</td>
      <td>${isCommittee() || isChair() ? `<input type="number" min="0" max="10" data-sup="${it.id}:committeeComment" value="${esc(it.committeeComment)}" ${comOn ? "" : "disabled"} />` : (it.committeeComment !== "" ? C.fmtScore(it.committeeComment) : "—")}</td>
      <td>${isChair() ? `<input type="number" min="0" max="10" data-sup="${it.id}:chairScore" value="${esc(it.chairScore)}" ${chairOn ? "" : "disabled"} />` : C.fmtScore(it.chairScore)}</td>
    </tr>`).join("");
  } else {
    forEachTarget((t, g) => {
      const cal = C.calcTarget(t, g.id);
      const self = C.effectiveScore(t, g.id);
      paRows += `<tr><td>${esc(t.code)} ${esc(t.title)}</td>
        <td class="auto">${C.fmtUnit(cal.units)}</td>
        <td>${C.fmtScore(self)}</td>
        <td>${isCommittee() || isChair() ? `<input type="number" min="0" max="10" data-pa="t:${t.id}:committeeScore" value="${esc(t.committeeScore)}" ${comOn ? "" : "disabled"} />` : C.fmtScore(t.committeeScore)}</td>
        <td>${isChair() ? `<input type="number" min="0" max="10" data-pa="t:${t.id}:chairScore" value="${esc(t.chairScore)}" ${chairOn ? "" : "disabled"} />` : C.fmtScore(t.chairScore)}</td></tr>`;
    });
  }
  return chrome(`
    <p class="crumb">ประเมินผลงาน และประเมินสมรรถนะ · ${esc(rateeAccount().full)}</p>
    <h1 class="page-title">ประเมินผลงาน และประเมินสมรรถนะ</h1>
    ${stepperHtml()}
    <p class="hint">${isRatee() ? "โหมดผู้รับการประเมิน: กรอกคะแนนตนเองเป็นตัวเลข 0–10" : isCommittee() ? "โหมดหัวหน้างานขั้นต้น: ให้คะแนนแล้วส่งหัวหน้างาน" : isChair() ? "โหมดหัวหน้างาน: ให้คะแนนแล้วกดตรวจสอบคะแนน" : "ดูอย่างเดียว"}</p>
    <div class="card">
      <h3>ประเมินผลงาน (Performance)</h3>
      <div class="pa-wrap"><table class="pa" style="min-width:900px">
        <thead><tr><th>รายการ</th><th>ผลการดำเนินงาน</th><th>ประเมินตนเอง</th><th>${esc(firstHeadLabel())}</th><th>${esc(headLabel())}</th></tr></thead>
        <tbody>${paRows}</tbody>
      </table></div>
    </div>
    <div class="card">
      <h3>ประเมินสมรรถนะหลัก (Core Competency) · คิดคะแนน (รวม÷70)×20</h3>
      <div class="pa-wrap"><table class="pa" style="min-width:1100px">
        <thead><tr>
          <th>สมรรถนะหลัก</th><th>ผลการดำเนินงาน</th><th>เกณฑ์</th>
          <th>ประเมินตนเอง</th><th>${esc(firstHeadLabel())}</th><th>${esc(headLabel())}</th>
        </tr></thead>
        <tbody>${ccRows}</tbody>
      </table></div>
    </div>
    <div class="card">
      <h3>สมรรถนะตามสายอาชีพ (Functional Competency) · ไม่รวมใน PA 80+CC 20 · รับทราบแยก</h3>
      <div class="pa-wrap"><table class="pa" style="min-width:900px">
        <thead><tr><th>รายการ</th><th>ผลการดำเนินงาน</th><th>ประเมินตนเอง</th><th>${esc(firstHeadLabel())}</th><th>${esc(headLabel())}</th></tr></thead>
        <tbody>${fcRows}</tbody>
      </table></div>
    </div>
    <p>ผลการประเมินขณะนี้ PA ${C.fmtScore(tot.pa)} + CC ${C.fmtScore(tot.cc)} = <b>${C.fmtScore(tot.total)}</b> (${esc(tot.level)})</p>
    <div class="footbar">
      <button class="btn-navy" type="button" id="btnSaveComp">บันทึก</button>
      ${isCommittee() ? `<button class="btn-gold" type="button" id="btnCommittee" ${canComment() ? "" : "disabled"}>หัวหน้างานขั้นต้นส่งให้หัวหน้างาน</button>` : ""}
      ${isChair() ? `<button class="btn-navy" type="button" id="btnCheckScore" ${canChairScore() ? "" : "disabled"}>ตรวจสอบคะแนน</button>` : ""}
      <button class="btn-ghost" data-go="${isEval() ? "evalHome" : "formset"}">กลับ</button>
    </div>
    ${S.modal === "score" ? scoreModal(tot) : ""}
  `);
}

function scoreModal(tot) {
  const sent = track() === "support" ? S.supportChairSent : S.chairSent;
  const lock = sent || paStatus() === "chair" || paStatus() === "ack";
  const strength = track() === "support" ? S.supportStrength : S.strength;
  const develop = track() === "support" ? S.supportDevelop : S.develop;
  const suggest = track() === "support" ? S.supportSuggest : S.suggest;
  return `<div class="modal-bg"><div class="modal">
    <h3>สรุปผลการประเมิน</h3>
    <table>
      <tr><th></th><th>ค่าน้ำหนัก (%)</th><th>คะแนนที่ได้</th></tr>
      <tr><td>ผลการประเมินผลการปฏิบัติงาน (Performance)</td><td>80</td><td>${C.fmtScore(tot.pa)}</td></tr>
      <tr><td>ผลการประเมินสมรรถนะหลัก (Core Competency)</td><td>20</td><td>${C.fmtScore(tot.cc)}</td></tr>
      <tr><td><b>รวม</b></td><td>100</td><td class="score-big">${C.fmtScore(tot.total)}</td></tr>
    </table>
    <p>ระดับ: <b>${esc(tot.level)}</b> · ดีเด่น 90–100 · ดีมาก 80–89.99 · ดี 70–79.99 · พอใช้ 60–69.99 · ควรปรับปรุง ต่ำกว่า 60</p>
    <label>จุดเด่น</label>
    <textarea id="strength" ${lock ? "disabled" : ""}>${esc(strength)}</textarea>
    <label>ข้อควรพัฒนา</label>
    <textarea id="develop" ${lock ? "disabled" : ""}>${esc(develop)}</textarea>
    <label>ข้อเสนอแนะของผู้บังคับบัญชาชั้นต้น</label>
    <textarea id="suggest" ${lock ? "disabled" : ""}>${esc(suggest)}</textarea>
    <div class="footbar">
      <button class="btn-ghost" type="button" id="closeModal">ยกเลิก</button>
      <button class="btn-navy" type="button" id="btnSendScore" ${lock ? "disabled" : ""}>ส่งคะแนน</button>
    </div>
  </div></div>`;
}

function viewAck() {
  const tot = currentTotal(true);
  const locked = paStatus() === "ack";
  const disagree = track() === "support" ? S.supportDisagree : S.paDisagree;
  const strength = track() === "support" ? S.supportStrength : S.strength;
  const develop = track() === "support" ? S.supportDevelop : S.develop;
  const suggest = track() === "support" ? S.supportSuggest : S.suggest;
  const fcAck = track() === "support" ? S.supportFcAck : S.fcAck;
  return chrome(`
    <p class="crumb">แจ้งผลและรับทราบ</p>
    <h1 class="page-title">แจ้งผลและรับทราบผลการประเมินการปฏิบัติงาน</h1>
    ${stepperHtml()}
    ${paStatus() === "disagree" ? `<div class="warn-box">เหตุผลพนักงานไม่ยินยอม : ${esc(disagree)}</div>` : ""}
    ${profileBox()}
    <div class="card">
      <h3>สรุปคะแนน</h3>
      <p>PA ${C.fmtScore(tot.pa)} + CC ${C.fmtScore(tot.cc)} = <b>${C.fmtScore(tot.total)}</b> ระดับ ${esc(tot.level)}</p>
      <p>จุดเด่น: ${esc(strength) || "-"}</p>
      <p>ข้อควรพัฒนา: ${esc(develop) || "-"}</p>
      <p>ข้อเสนอแนะ: ${esc(suggest) || "-"}</p>
      <p class="hint">คลิกรับทราบในแบบ PA หรือ CC = รับทราบทั้งสองแบบพร้อมกัน · FC รับทราบแยก</p>
    </div>
    ${isRatee() ? `<div class="card">
      <label>กรณีไม่เห็นด้วย ต้องระบุเหตุผลละเอียดชัดเจน</label>
      <textarea id="disagreeReason" ${locked ? "disabled" : ""}>${esc(disagree)}</textarea>
      <div class="footbar">
        <button class="btn-ok" type="button" id="btnAck" ${locked ? "disabled" : ""}>รับทราบ</button>
        <button class="btn-danger" type="button" id="btnDisagree" ${locked ? "disabled" : ""}>ไม่เห็นด้วย</button>
        <label class="chk"><input type="checkbox" id="fcAck" ${fcAck ? "checked" : ""} /> รับทราบผล FC แยก</label>
      </div>
    </div>` : `<p class="hint">การรับทราบเป็นหน้าที่ผู้รับการประเมิน</p>`}
  `);
}

function viewIdp() {
  const lock = !canEditIdp();
  const list = currentIdp();
  const rows = list.map((it) => `
    <tr>
      <td><input data-idp="${it.id}:competency" value="${esc(it.competency)}" ${lock ? "disabled" : ""} placeholder="ระบุสมรรถนะ/ทักษะ" /></td>
      <td><input data-idp="${it.id}:behavior" value="${esc(it.behavior)}" ${lock ? "disabled" : ""} placeholder="พฤติกรรม/ผลลัพธ์ที่คาดหวัง" /></td>
      <td><select data-idp="${it.id}:method" ${lock ? "disabled" : ""}>${C.IDP_METHODS.map((m) =>
        `<option value="${m.id}" ${it.method === m.id ? "selected" : ""}>${esc(m.label)}</option>`).join("")}</select></td>
      <td><input data-idp="${it.id}:detail" value="${esc(it.detail)}" ${lock ? "disabled" : ""} /></td>
      <td><input type="date" data-idp="${it.id}:start" value="${esc(it.start)}" ${lock ? "disabled" : ""} /></td>
      <td><input type="date" data-idp="${it.id}:end" value="${esc(it.end)}" ${lock ? "disabled" : ""} /></td>
      <td><input type="number" data-idp="${it.id}:budget" value="${esc(it.budget)}" ${lock ? "disabled" : ""} /></td>
      <td>${canEditIdp() ? `<button class="iconbtn" data-del-idp="${it.id}">ลบ</button>` : ""}</td>
    </tr>`).join("");
  const reject = track() === "support" ? S.supportIdpReject : S.idpReject;
  return chrome(`
    <p class="crumb">ชุดประเมิน / แบบแผนพัฒนาตนเอง · ${esc(rateeAccount().full)}</p>
    <div class="pa-banner">
      <div>
        <h2>Individual Development Plan (IDP)</h2>
        <p class="sub">แผนพัฒนารายบุคคล · ${statusPill(idpStatus())}</p>
      </div>
      ${canEditIdp() ? `<button class="btn-teal" type="button" id="btnAddIdp">กำหนดตัวชี้วัดสมรรถนะ</button>` : ""}
    </div>
    <div class="card">
      <p>คำชี้แจง: ให้ผู้รับการพัฒนาระบุสมรรถนะ 1–2 รายการต่อปี ตกลงกับผู้บังคับบัญชาชั้นต้น วิธีพัฒนา 70 / 20 / 10</p>
    </div>
    ${idpStatus() === "back" ? `<div class="warn-box">ส่งกลับแก้ไข: ${esc(reject)}</div>` : ""}
    <div class="pa-wrap"><table class="pa" style="min-width:1200px">
      <thead><tr>
        <th>สมรรถนะ/ทักษะที่จะได้รับการพัฒนา</th><th>พฤติกรรม / ผลลัพธ์ที่คาดหวัง</th><th>วิธีการพัฒนา</th>
        <th>รายละเอียด</th><th>เริ่มต้น</th><th>สิ้นสุด</th><th>งบประมาณ</th><th></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${canApproveIdp() ? `<div class="card chair-only">
      <h3>หัวหน้างานอนุมัติ IDP</h3>
      <textarea id="idpReject" placeholder="เหตุผลกรณีไม่อนุมัติ">${esc(reject)}</textarea>
      <div class="footbar">
        <button class="btn-ok" type="button" id="btnIdpYes">อนุมัติทั้งหมด</button>
        <button class="btn-danger" type="button" id="btnIdpNo">ไม่อนุมัติ</button>
      </div>
    </div>` : ""}
    <div class="footbar">
      ${canEditIdp() ? `<button class="btn-navy" type="button" id="btnIdpDraft">บันทึกฉบับร่าง</button>
      <button class="btn-navy" type="button" id="btnIdpAsk">ขออนุมัติ</button>` : ""}
      <button class="btn-ghost" data-go="${isEval() ? "evalHome" : "formset"}">กลับ</button>
    </div>`);
}

function viewIdpReport() {
  const lock = !(isRatee() && idpStatus() === "approved");
  const rows = currentIdp().map((it) => `
    <tr>
      <td>${esc(it.competency)}</td>
      <td>${esc(it.behavior)}</td>
      <td><textarea data-idp="${it.id}:report" ${lock ? "disabled" : ""}>${esc(it.report)}</textarea>
        <input data-idp="${it.id}:file" value="${esc(it.file)}" placeholder="ไฟล์หลักฐาน" ${lock ? "disabled" : ""} /></td>
    </tr>`).join("");
  return chrome(`
    <h1 class="page-title">รายงานผลการพัฒนารายบุคคล (IDP)</h1>
    ${idpLocked() ? `<div class="lock-note">ส่งรายงานผลแล้วแก้ไขไม่ได้</div>` : ""}
    <div class="pa-wrap"><table class="pa">
      <thead><tr><th>สมรรถนะ</th><th>ผลลัพธ์ที่คาดหวัง</th><th>รายงานการพัฒนา</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="footbar">
      ${isRatee() && idpStatus() === "approved" ? `<button class="btn-navy" type="button" id="btnIdpSaveR">บันทึก</button>
      <button class="btn-navy" type="button" id="btnIdpSendR">ส่งการประเมิน</button>` : ""}
    </div>`);
}

function viewIdpEval() {
  const lock = !canEvalIdp();
  return chrome(`
    <h1 class="page-title">ประเมินผลการพัฒนารายบุคคล (IDP)</h1>
    <p>ผลที่หัวหน้างานให้เป็นข้อความ <b>เป็นไปตามที่คาดหวัง</b> หรือ <b>ไม่เป็นไปตามที่คาดหวัง</b></p>
    ${currentIdp().map((it) => `<div class="card"><h3>${esc(it.competency)}</h3><p>${esc(it.report) || "-"}</p>
      <p>สถานะรายการ: ${it.result === "ok" ? "เป็นไปตามที่คาดหวัง" : it.result === "no" ? "ไม่เป็นไปตามที่คาดหวัง" : "-"}</p></div>`).join("")}
    <div class="footbar">
      <button class="btn-ok" type="button" id="btnIdpOk" ${lock ? "disabled" : ""}>เป็นไปตามที่คาดหวัง</button>
      <button class="btn-danger" type="button" id="btnIdpNot" ${lock ? "disabled" : ""}>ไม่เป็นไปตามที่คาดหวัง</button>
    </div>`);
}

function viewIdpAck() {
  const lock = idpStatus() === "ack" || !isRatee();
  const disagree = track() === "support" ? S.supportIdpDisagree : S.idpDisagree;
  return chrome(`
    <h1 class="page-title">แจ้งผลและรับทราบผลการพัฒนารายบุคคล (IDP)</h1>
    ${idpStatus() === "disagree" ? `<div class="warn-box">${esc(disagree)}</div>` : ""}
    ${currentIdp().map((it) => `<div class="card"><h3>${esc(it.competency)}</h3>
      <p>${it.result === "ok" ? "เป็นไปตามที่คาดหวัง" : it.result === "no" ? "ไม่เป็นไปตามที่คาดหวัง" : "-"}</p></div>`).join("")}
    ${isRatee() ? `<textarea id="idpDisagree" ${lock ? "disabled" : ""} placeholder="เหตุผลกรณีไม่เห็นด้วย">${esc(disagree)}</textarea>
    <div class="footbar">
      <button class="btn-ok" type="button" id="btnIdpAck" ${lock ? "disabled" : ""}>รับทราบ</button>
      <button class="btn-danger" type="button" id="btnIdpDis" ${lock ? "disabled" : ""}>ไม่เห็นด้วย</button>
    </div>` : `<p class="hint">การรับทราบเป็นหน้าที่ผู้รับการประเมิน</p>`}
  `);
}

function viewReport() {
  const tot = currentTotal(true);
  const w = checkWeight();
  const who = rateeAccount();
  let body = "";
  if (track() === "support") {
    body = `<table class="data"><thead><tr><th>ลำดับ</th><th>ข้อตกลง</th><th>น้ำหนัก</th><th>ตนเอง</th><th>หัวหน้างาน</th></tr></thead><tbody>` +
      S.supportItems.map((it) => `<tr><td>${esc(it.no)}</td><td>${esc(it.title)}</td><td>${esc(it.weight)}</td>
        <td>${C.fmtScore(it.selfScore)}</td><td>${C.fmtScore(it.chairScore)}</td></tr>`).join("") +
      `</tbody></table>`;
  } else {
    S.groups.forEach((g) => {
      const meta = C.GROUPS.find((x) => x.id === g.id);
      const units = C.groupUnits(S.groups, g.id);
      body += `<h3>${esc(meta.title)} ${esc(meta.name)} · ${meta.pct}% · ${C.fmtUnit(units)} / ${meta.cap} หน่วย</h3>
        <table class="data"><thead><tr><th>รหัส</th><th>ภารกิจ</th><th>เกณฑ์</th><th>หน่วย</th><th>ตนเอง</th><th>หัวหน้างาน</th></tr></thead><tbody>`;
      forEachTarget((t, gg) => {
        if (gg.id !== g.id) return;
        const cal = C.calcTarget(t, g.id);
        const c = C.findCrit(g.id, t.criteriaId);
        body += `<tr><td>${esc(t.code)}</td><td>${esc(t.title)}</td><td>${esc(c ? c.label : "-")}</td>
          <td>${C.fmtUnit(cal.units)}</td><td>${C.fmtScore(C.effectiveScore(t, g.id))}</td>
          <td>${C.fmtScore(t.chairScore)}</td></tr>`;
      });
      body += `</tbody></table>`;
    });
  }
  return chrome(`
    <h1 class="page-title">รายงานและติดตามผลการดำเนินการ · ปี ${esc(S.year)}</h1>
    <div class="toolbar">
      <button class="btn-navy" type="button" onclick="window.print()">พิมพ์รายงาน 2 หน้า</button>
    </div>
    <section class="print-page card">
      <h2>หน้า 1 สรุปผล</h2>
      ${profileBox(who)}
      <p>น้ำหนักข้อตกลงรวม ${w} · สถานะ PA ${statusPill(paStatus())} · IDP ${statusPill(idpStatus())}</p>
      <p class="score-big">${C.fmtScore(tot.total)} คะแนน · ${esc(tot.level)}</p>
      <table class="data">
        <tr><td>Performance (PA)</td><td>80</td><td>${C.fmtScore(tot.pa)}</td></tr>
        <tr><td>Core Competency (CC)</td><td>20</td><td>${C.fmtScore(tot.cc)}</td></tr>
        <tr><td>รวม</td><td>100</td><td>${C.fmtScore(tot.total)}</td></tr>
      </table>
    </section>
    <section class="print-page card">
      <h2>หน้า 2 ตารางรายการ</h2>
      ${body}
      <h3>CC 7 ข้อ</h3>
      <ul>${ccList().map((x) => `<li>${esc(x.name)} · ตนเอง ${C.fmtScore(x.self)} · หัวหน้างาน ${C.fmtScore(x.chair)}</li>`).join("")}</ul>
      <h3>IDP</h3>
      <ul>${currentIdp().map((x) => `<li>${esc(x.competency)} · ${x.result === "ok" ? "เป็นไปตามที่คาดหวัง" : x.result === "no" ? "ไม่เป็นไปตามที่คาดหวัง" : "-"}</li>`).join("")}</ul>
    </section>`);
}

function render() {
  const root = document.getElementById("app");
  if (!root) return;
  const v = S.loggedIn ? (S.view || "home") : "login";
  const map = {
    login: viewLogin, home: viewHome, period: viewPeriod, profile: viewProfile, rounds: viewRounds,
    formset: viewFormset, modules: viewModules, pa: viewPA,
    paReport: () => (track() === "support" ? viewPaReport() : viewPA()),
    competency: viewCompetency, ack: viewAck, idp: viewIdp, idpReport: viewIdpReport,
    idpEval: viewIdpEval, idpAck: viewIdpAck, report: viewReport,
    evalHome: viewEvalHome, adminPeople: viewAdminPeople, adminRound: viewAdminRound,
    leave: viewLeave, time: viewTime, help: viewHelp,
    paStaff: viewPaStaff, follow: viewFollow, scoreSum: viewScoreSum, pledge: viewPledge,
    users: viewUsers, kpi2570: viewKpi2570, researchTrack: viewResearchTrack
  };
  try {
    root.innerHTML = (map[v] || viewHome)();
    bind();
  } catch (err) {
    root.innerHTML = `<div class="warn-box">เปิดหน้าไม่สำเร็จ ${esc(err && err.message ? err.message : err)}</div>`;
  }
}

function readCcFc() {
  const cc = ccList();
  const fc = fcList();
  document.querySelectorAll("[data-cc]").forEach((el) => {
    const [id, field] = el.dataset.cc.split(":");
    const it = cc.find((x) => x.id === id);
    if (it) it[field] = el.value;
  });
  document.querySelectorAll("[data-fc]").forEach((el) => {
    const [id, field] = el.dataset.fc.split(":");
    const it = fc.find((x) => x.id === id);
    if (it) it[field] = el.value;
  });
}

function bindHoverHints() {
  let tip = document.getElementById("hint-float");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "hint-float";
    tip.className = "hint-float";
    tip.hidden = true;
    document.body.appendChild(tip);
  }
  const hide = () => { tip.hidden = true; };
  const place = (ev, el) => {
    const text = el.getAttribute("data-hint");
    if (!text) return;
    tip.textContent = text;
    tip.hidden = false;
    const pad = 16;
    const w = 420;
    let x = (ev && ev.clientX != null ? ev.clientX : el.getBoundingClientRect().left) + 14;
    let y = (ev && ev.clientY != null ? ev.clientY : el.getBoundingClientRect().bottom) + 12;
    if (x + w > window.innerWidth - pad) x = window.innerWidth - w - pad;
    if (y > window.innerHeight - 140) y = Math.max(pad, y - 160);
    tip.style.left = Math.max(pad, x) + "px";
    tip.style.top = Math.max(pad, y) + "px";
  };
  document.querySelectorAll("[data-hint]").forEach((el) => {
    el.removeAttribute("title");
    el.addEventListener("mouseenter", (ev) => place(ev, el));
    el.addEventListener("mousemove", (ev) => { if (!tip.hidden) place(ev, el); });
    el.addEventListener("mouseleave", hide);
    el.addEventListener("focus", () => place(null, el));
    el.addEventListener("blur", hide);
  });
}

function bind() {
  bindHoverHints();
  document.querySelectorAll("[data-lock]").forEach((b) => {
    b.addEventListener("click", () => toast(b.getAttribute("data-lock")));
  });
  document.querySelectorAll("[data-go]").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-go");
      const focus = b.getAttribute("data-focus");
      if (focus && !isRatee()) S.focus = focus;
      if (isRatee()) S.focus = account().track;
      if (id === "home") { go("home"); return; }
      if (id === "paStaff" && !isFaculty()) S.focus = "support";
      if (id === "period" && !isRatee()) S.focus = S.focus || "faculty";
      go(id);
    });
  });
  document.querySelectorAll("[data-jump]").forEach((b) => {
    b.addEventListener("click", () => {
      const el = document.getElementById(b.getAttribute("data-jump"));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelectorAll("[data-login-type]").forEach((b) => {
    b.addEventListener("click", () => {
      S.loginType = b.getAttribute("data-login-type");
      render();
    });
  });
  document.querySelectorAll("[data-gate]").forEach((b) => {
    b.addEventListener("click", () => {
      S.loginGate = b.getAttribute("data-gate");
      S.loginType = "";
      render();
    });
  });
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const sel = document.getElementById("yearSel");
    if (sel) setYear(sel.value);
    const username = (document.getElementById("loginUser") || {}).value || "";
    const password = (document.getElementById("loginPass") || {}).value || "";
    let gate = "eval";
    if (S.loginGate === "admin") gate = "admin";
    else if (S.loginGate === "public" && S.loginType === "faculty") gate = "ratee-faculty";
    else if (S.loginGate === "public" && S.loginType === "support") gate = "ratee-support";
    try {
      let res = loginLocal(username, password, gate);
      const fileMode = location.protocol === "file:";
      if (!fileMode && DB) {
        try {
          const dbRes = await DB.verify(username, password, gate);
          if (dbRes && dbRes.ok) res = dbRes;
        } catch { /* ใช้บัญชีเดโมถ้าฐานไม่พร้อม */ }
      }
      if (!res.ok) { toast(res.reason); return; }
      if (!fileMode && DB) {
        try { S.users = await DB.listUsers(); } catch { S.users = S.users || []; }
      }
      await enterUser(res.user);
      toast("เข้าสู่ระบบแล้ว");
    } catch (err) {
      toast("เข้าสู่ระบบไม่ได้: " + (err && err.message ? err.message : "ลองเปิดไฟล์ เปิดตรงนี้.html"));
    }
  });
  const pf = document.getElementById("profileForm");
  if (pf) pf.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const u = isRatee() ? account() : rateeAccount();
    if (!u) return;
    const patch = {
      full: (document.getElementById("pfFull") || {}).value || u.full,
      staffId: (document.getElementById("pfStaffId") || {}).value || u.staffId,
      position: (document.getElementById("pfPos") || {}).value || "",
      type: (document.getElementById("pfType") || {}).value || u.type,
      dept: (document.getElementById("pfDept") || {}).value || "",
      supervisor: (document.getElementById("pfSup") || {}).value || "",
      email: (document.getElementById("pfEmail") || {}).value || "",
      phone: (document.getElementById("pfPhone") || {}).value || ""
    };
    Object.assign(u, patch);
    if (S.user && S.user.id === u.id) S.user = u;
    if (S.users) {
      const i = S.users.findIndex((x) => x.id === u.id);
      if (i >= 0) S.users[i] = { ...S.users[i], ...patch };
    }
    if (DB && DB.updateProfile) {
      try { await DB.updateProfile(u.id, patch, account().username); } catch (err) { toast(err.message || String(err)); return; }
    }
    persist();
    toast("บันทึกข้อมูลส่วนบุคคลแล้ว");
    render();
  });
  function readKeyedRows(attr, list) {
    document.querySelectorAll(`[${attr}]`).forEach((el) => {
      const [id, field] = el.getAttribute(attr).split(":");
      const row = (list || []).find((x) => x.id === id);
      if (row) row[field] = el.value;
    });
  }
  const sl = document.getElementById("btnSaveLeave");
  if (sl) sl.addEventListener("click", () => {
    readKeyedRows("data-leave", S.leaveRows);
    persist();
    toast("บันทึกข้อมูลวันลาแล้ว");
  });
  const st = document.getElementById("btnSaveTime");
  if (st) st.addEventListener("click", () => {
    readKeyedRows("data-time", S.timeRows);
    persist();
    toast("บันทึกเวลาปฏิบัติงานแล้ว");
  });
  const al = document.getElementById("btnAddLeave");
  if (al) al.addEventListener("click", () => {
    readKeyedRows("data-leave", S.leaveRows);
    S.leaveRows.push({ id: uid(), kind: "ลาพักผ่อน", start: "", end: "", days: "", reason: "", status: "ร่าง" });
    persist(); render();
  });
  const sr = document.getElementById("btnSaveResearch");
  if (sr) sr.addEventListener("click", () => {
    readKeyedRows("data-rint", S.researchInt);
    readKeyedRows("data-rnote", S.researchNotify);
    persist();
    toast("บันทึกแบบติดตามโครงการวิจัยแล้ว");
  });
  const ai = document.getElementById("btnAddInt");
  if (ai) ai.addEventListener("click", () => {
    readKeyedRows("data-rint", S.researchInt);
    S.researchInt.push(emptyResearchInt());
    persist(); render();
  });
  const an = document.getElementById("btnAddNotify");
  if (an) an.addEventListener("click", () => {
    readKeyedRows("data-rnote", S.researchNotify);
    S.researchNotify.push(emptyResearchNotify());
    persist(); render();
  });
  document.querySelectorAll("[data-del-rint]").forEach((b) => {
    b.addEventListener("click", () => {
      readKeyedRows("data-rint", S.researchInt);
      S.researchInt = S.researchInt.filter((x) => x.id !== b.getAttribute("data-del-rint"));
      if (!S.researchInt.length) S.researchInt = [emptyResearchInt()];
      persist(); render();
    });
  });
  document.querySelectorAll("[data-del-rnote]").forEach((b) => {
    b.addEventListener("click", () => {
      readKeyedRows("data-rnote", S.researchNotify);
      S.researchNotify = S.researchNotify.filter((x) => x.id !== b.getAttribute("data-del-rnote"));
      if (!S.researchNotify.length) S.researchNotify = [emptyResearchNotify()];
      persist(); render();
    });
  });
  const at = document.getElementById("btnAddTime");
  if (at) at.addEventListener("click", () => {
    readKeyedRows("data-time", S.timeRows);
    S.timeRows.push({ id: uid(), date: "", timeIn: "", timeOut: "", note: "" });
    persist(); render();
  });
  document.querySelectorAll("[data-del-leave]").forEach((b) => {
    b.addEventListener("click", () => {
      S.leaveRows = (S.leaveRows || []).filter((x) => x.id !== b.getAttribute("data-del-leave"));
      persist(); render();
    });
  });
  document.querySelectorAll("[data-del-time]").forEach((b) => {
    b.addEventListener("click", () => {
      S.timeRows = (S.timeRows || []).filter((x) => x.id !== b.getAttribute("data-del-time"));
      persist(); render();
    });
  });
  const cu = document.getElementById("createUserForm");
  if (cu) cu.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!isAdmin() || !DB) return;
    try {
      const preset = rolePreset(document.getElementById("newRole").value);
      await DB.createUser({
        ...preset,
        username: document.getElementById("newUser").value,
        password: document.getElementById("newPass").value,
        full: document.getElementById("newFull").value,
        position: document.getElementById("newPos").value
      }, account().username);
      S.users = await DB.listUsers();
      persist();
      render();
      toast("สร้างบัญชีลงฐานข้อมูลแล้ว");
    } catch (err) {
      toast(err.message || String(err));
    }
  });
  document.querySelectorAll("[data-toggle-user]").forEach((b) => {
    b.addEventListener("click", async () => {
      if (!isAdmin() || !DB) return;
      const u = (S.users || []).find((x) => x.id === b.getAttribute("data-toggle-user"));
      if (!u) return;
      if (u.canAdmin) { toast("ปิดบัญชีผู้ดูแลตั้งต้นไม่ได้"); return; }
      await DB.setActive(u.id, !u.active, account().username);
      S.users = await DB.listUsers();
      render();
    });
  });
  document.querySelectorAll("[data-reset-user]").forEach((b) => {
    b.addEventListener("click", async () => {
      if (!isAdmin() || !DB) return;
      const pass = prompt("รหัสผ่านใหม่ (อย่างน้อย 4 ตัว)");
      if (!pass) return;
      try {
        await DB.setPassword(b.getAttribute("data-reset-user"), pass, account().username);
        toast("ตั้งรหัสใหม่ลงฐานข้อมูลแล้ว");
      } catch (err) {
        toast(err.message || String(err));
      }
    });
  });
  const yp = document.getElementById("goProfile");
  if (yp) yp.addEventListener("click", () => {
    const sel = document.getElementById("yearSel");
    if (sel) setYear(sel.value);
    persist();
    go(isRatee() ? "profile" : "evalHome");
  });
  const ys = document.getElementById("yearSel");
  if (ys) {
    ys.addEventListener("change", () => {
      setYear(ys.value);
      persist();
      toast("ใช้ปีงบประมาณ " + S.year);
      render();
    });
  }
  document.querySelectorAll("#btnOut").forEach((out) => out.addEventListener("click", logout));
  document.querySelectorAll("#btnSwitch").forEach((sw) => sw.addEventListener("click", logout));
  document.querySelectorAll("#btnReset").forEach((rst) => rst.addEventListener("click", resetDemo));

  document.querySelectorAll("[data-add-ag]").forEach((b) => b.addEventListener("click", () => addAgreement(b.dataset.addAg, b.getAttribute("data-add-crit") || "")));
  document.querySelectorAll("[data-shpa]").forEach((el) => {
    el.addEventListener("change", () => {
      const [id, field] = el.getAttribute("data-shpa").split(":");
      const t = findTarget(id);
      if (!t) return;
      t[field] = el.value;
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-shpa-check]").forEach((el) => {
    el.addEventListener("change", () => {
      const [id, field, value] = el.getAttribute("data-shpa-check").split(":");
      const t = findTarget(id);
      if (!t) return;
      if (field === "shpaMedia") {
        const cur = Array.isArray(t.shpaMedia) ? t.shpaMedia.slice() : [];
        t.shpaMedia = el.checked ? Array.from(new Set(cur.concat(value))) : cur.filter((x) => x !== value);
      } else if (field === "shpaDone") {
        t.shpaDone = el.checked;
        if (el.checked) { t.shpaProgress = false; t.shpaLevel = ""; }
      } else if (field === "shpaProgress") {
        t.shpaProgress = el.checked;
        if (el.checked) t.shpaDone = false;
      } else {
        t[field] = el.checked;
      }
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-del-ag]").forEach((b) => {
    b.addEventListener("click", () => {
      const [g, a] = b.dataset.delAg.split(":");
      removeAgreement(g, a);
    });
  });
  document.querySelectorAll("[data-del-row]").forEach((b) => {
    b.addEventListener("click", () => {
      const [g, tid] = b.dataset.delRow.split(":");
      removeFacultyRow(g, tid);
    });
  });
  document.querySelectorAll("[data-crit]").forEach((el) => {
    el.addEventListener("change", () => {
      const t = findTarget(el.getAttribute("data-crit"));
      if (!t || !el.checked) return;
      t.criteriaId = el.value;
      if (String(el.value).startsWith("pub_")) t.amount = "";
      const f = (C.TEACH_FORMULAS || []).find((x) => x.criteriaId === el.value);
      if (f) t.teachFormula = f.id;
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-grant]").forEach((el) => {
    el.addEventListener("change", () => {
      const t = findTarget(el.getAttribute("data-grant"));
      if (!t || !el.value) return;
      const [kind, amt] = el.value.split("|");
      t.criteriaId = kind;
      t.amount = amt;
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-crit-other]").forEach((el) => {
    el.addEventListener("change", () => {
      const t = findTarget(el.getAttribute("data-crit-other"));
      if (!t || !el.value) return;
      t.criteriaId = el.value;
      t.amount = "";
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-cond]").forEach((el) => {
    el.addEventListener("change", () => {
      const t = findTarget(el.getAttribute("data-cond"));
      if (!t || !el.checked) return;
      t.inDb = el.value === "inDb";
      t.withStudent = el.value === "student";
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-file]").forEach((el) => {
    el.addEventListener("change", () => {
      const t = findTarget(el.getAttribute("data-file"));
      if (!t) return;
      t.file = el.files && el.files[0] ? el.files[0].name : "";
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-files]").forEach((el) => {
    el.addEventListener("change", () => {
      const t = findTarget(el.getAttribute("data-files"));
      if (!t) return;
      const names = Array.from(el.files || []).map((f) => f.name);
      const res = C.attachEvidence(t, names);
      t.files = res.files;
      t.file = t.files[0] || "";
      t.fileError = res.message;
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-del-ev]").forEach((b) => {
    b.addEventListener("click", () => {
      const [id, idx] = b.getAttribute("data-del-ev").split(":");
      const t = findTarget(id);
      if (!t) return;
      t.files = C.evidenceFiles(t).filter((_, i) => i !== Number(idx));
      t.file = t.files[0] || "";
      t.fileError = "";
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-proj-q]").forEach((el) => {
    el.addEventListener("change", () => {
      const t = findTarget(el.getAttribute("data-proj-q"));
      if (!t) return;
      const q = el.value;
      const hit = C.findProject(q) || C.searchProjects(q).find((p) => p.code === q || p.name === q)
        || (C.searchProjects(q).length === 1 ? C.searchProjects(q)[0] : null);
      if (!hit) { t.projectCode = q; persist(); return; }
      t.projectCode = hit.code;
      t.title = hit.name;
      t.contractDate = hit.contractDate || "";
      t.contractDateNote = hit.contractDateNote || "";
      if (hit.amount) t.amount = hit.amount;
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-syl-q]").forEach((el) => {
    el.addEventListener("change", () => {
      const t = findTarget(el.getAttribute("data-syl-q"));
      if (!t) return;
      const q = el.value;
      const hit = C.findSyllabus(q) || (C.searchSyllabus(q).length === 1 ? C.searchSyllabus(q)[0] : null);
      if (!hit) { t.syllabusId = q; persist(); return; }
      t.syllabusId = hit.id;
      t.title = `${hit.code} ${hit.title}`;
      t.hours = hit.hours;
      if (hit.formulaId) {
        t.teachFormula = hit.formulaId;
        const f = C.findTeachFormula(hit.formulaId);
        if (f) t.criteriaId = f.criteriaId;
      }
      persist();
      render();
    });
  });
  document.querySelectorAll("[data-del-sup]").forEach((b) => {
    b.addEventListener("click", () => {
      if (S.supportItems.length <= 1) { toast("ต้องมีอย่างน้อย 1 ข้อ"); return; }
      S.supportItems = S.supportItems.filter((x) => x.id !== b.dataset.delSup);
      persist(); render();
    });
  });
  document.querySelectorAll("[data-add-sup]").forEach((b) => {
    b.addEventListener("click", () => {
      const it = emptySupportItem(S.supportItems.length + 1);
      it.workType = b.getAttribute("data-add-sup") || "main";
      S.supportItems.push(it);
      persist(); render();
    });
  });
  document.querySelectorAll("[data-pa]").forEach((el) => {
    el.addEventListener("change", () => {
      readPaForm();
      persist();
      const field = el.dataset.pa.split(":")[2];
      if (field === "teachFormula") {
        const t = findTarget(el.dataset.pa.split(":")[1]);
        const f = t ? C.findTeachFormula(t.teachFormula) : null;
        if (t && f) t.criteriaId = f.criteriaId;
      }
      if (["criteriaId", "role", "inDb", "withStudent", "amount", "hours", "qty", "weight", "selfScore", "teachFormula", "doi", "proposedUnits", "proposedScore"].includes(field)) render();
    });
  });
  document.querySelectorAll("[data-sup]").forEach((el) => {
    el.addEventListener("change", () => {
      readSupportForm();
      persist();
      if (["weight", "kpiWeight", "workType"].includes(el.dataset.sup.split(":")[1])) render();
    });
  });

  const save = document.getElementById("btnSave");
  if (save) save.addEventListener("click", saveDraft);
  const ask = document.getElementById("btnAsk");
  if (ask) ask.addEventListener("click", requestApprove);
  const ap = document.getElementById("btnApproveAll");
  if (ap) ap.addEventListener("click", chairApproveAll);
  const rj = document.getElementById("btnReject");
  if (rj) rj.addEventListener("click", chairReject);
  const imp = document.getElementById("btnImport");
  if (imp) imp.addEventListener("click", () => toast("กรอกชุดชี้วัดในระบบตามกรณีที่ 2 ของคำแนะนำการใช้ระบบ PMS"));

  const saveRep = document.getElementById("btnSaveReport");
  if (saveRep) saveRep.addEventListener("click", () => {
    if (track() === "support") readSupportForm(); else readPaForm();
    persist(); toast("บันทึกการประเมินตนเองแล้ว");
  });
  const srr = document.getElementById("btnSendReport");
  if (srr) srr.addEventListener("click", submitSelfPA);

  const sc = document.getElementById("btnSaveComp");
  if (sc) sc.addEventListener("click", () => {
    if (track() === "support") readSupportForm(); else readPaForm();
    readCcFc(); persist(); toast("บันทึกสมรรถนะแล้ว"); render();
  });
  const cm = document.getElementById("btnCommittee");
  if (cm) cm.addEventListener("click", submitCommittee);
  const ck = document.getElementById("btnCheckScore");
  if (ck) ck.addEventListener("click", openScoreDialog);
  const cl = document.getElementById("closeModal");
  if (cl) cl.addEventListener("click", () => { S.modal = null; persist(); render(); });
  const ss = document.getElementById("btnSendScore");
  if (ss) ss.addEventListener("click", sendChairScore);

  const ba = document.getElementById("btnAck");
  if (ba) ba.addEventListener("click", () => {
    const fc = document.getElementById("fcAck");
    if (fc) {
      if (track() === "support") S.supportFcAck = fc.checked;
      else S.fcAck = fc.checked;
    }
    ackResult(true);
  });
  const bd = document.getElementById("btnDisagree");
  if (bd) bd.addEventListener("click", () => ackResult(false));

  const addI = document.getElementById("btnAddIdp");
  if (addI) addI.addEventListener("click", addIdp);
  document.querySelectorAll("[data-del-idp]").forEach((b) => b.addEventListener("click", () => removeIdp(b.dataset.delIdp)));
  const idd = document.getElementById("btnIdpDraft");
  if (idd) idd.addEventListener("click", saveIdpDraft);
  const ida = document.getElementById("btnIdpAsk");
  if (ida) ida.addEventListener("click", requestIdp);
  const idy = document.getElementById("btnIdpYes");
  if (idy) idy.addEventListener("click", () => approveIdp(true));
  const idn = document.getElementById("btnIdpNo");
  if (idn) idn.addEventListener("click", () => approveIdp(false));
  const ids = document.getElementById("btnIdpSaveR");
  if (ids) ids.addEventListener("click", () => { readIdp(); persist(); toast("บันทึก"); });
  const ide = document.getElementById("btnIdpSendR");
  if (ide) ide.addEventListener("click", submitIdpReport);
  const iok = document.getElementById("btnIdpOk");
  if (iok) iok.addEventListener("click", () => evalIdp("ok"));
  const ino = document.getElementById("btnIdpNot");
  if (ino) ino.addEventListener("click", () => evalIdp("no"));
  const iack = document.getElementById("btnIdpAck");
  if (iack) iack.addEventListener("click", () => ackIdp(true));
  const idis = document.getElementById("btnIdpDis");
  if (idis) idis.addEventListener("click", () => ackIdp(false));

  const sf = document.getElementById("btnSaveFollow");
  if (sf) sf.addEventListener("click", () => {
    document.querySelectorAll("[data-fol]").forEach((el) => {
      const [id, field] = el.dataset.fol.split(":");
      const row = (S.supportFollow || []).find((x) => x.id === id);
      if (row) row[field] = el.value;
    });
    persist();
    toast("บันทึกแบบติดตาม 06 แล้ว");
  });
}

window.addEventListener("hashchange", () => {
  const h = location.hash.replace("#", "");
  if (!h) return;
  if (!S.loggedIn) {
    if (h === "admin") { S.loginGate = "admin"; render(); }
    return;
  }
  S.view = h;
  render();
});

function applyQuery() {
  const q = new URLSearchParams(location.search);
  if (q.get("admin") === "1" || location.hash === "#admin") S.loginGate = "admin";
  const view = q.get("view");
  const seed = q.get("seed");
  const acc = q.get("account");
  if (acc) {
    const u = (S.users || []).find((x) => x.id === acc || x.username === acc) || ACCOUNTS[acc];
    if (u) {
      S.loggedIn = true;
      S.user = u;
      S.account = u.id;
      if (!q.get("focus") && u.track) S.focus = u.track;
    }
  }
  if (view || seed) {
    if (!S.user && ACCOUNTS.faculty) {
      S.user = ACCOUNTS.faculty;
      S.account = "faculty";
    }
    S.loggedIn = true;
    if (seed === "approved") setPaStatus("approved");
    if (seed === "reported") {
      setPaStatus("reported");
      ccList().forEach((x) => { x.self = x.self || 8; });
    }
    if (seed === "chair") {
      setPaStatus("chair");
      if (track() === "support") S.supportChairSent = true;
      else S.chairSent = true;
      ccList().forEach((x) => { x.self = x.self || 8; x.chair = x.chair || 8; });
    }
    if (seed === "idpwait") setIdpStatus("wait");
    if (seed === "wait") setPaStatus("wait");
    if (view) S.view = view;
    if (track() !== "support" && view === "pa") S.paLayout = "plan";
    if (track() !== "support" && view === "paReport") S.paLayout = "eval";
    if (q.get("modal") === "score") S.modal = "score";
    if (q.get("focus") && !isRatee()) S.focus = q.get("focus");
  }
  if (isRatee() && account().track) S.focus = account().track;
  const h = location.hash.replace("#", "");
  if (h && S.loggedIn) S.view = h;
}

applyQuery();
render();

async function boot() {
  if (isFileMode()) {
    applyQuery();
    render();
    return;
  }
  try {
    if (DB) {
      await DB.open();
      await DB.seed();
      S.users = await DB.listUsers();
      const sess = await DB.loadSession();
      if (sess && sess.userId && !new URLSearchParams(location.search).get("account")) {
        const u = await DB.getUser(sess.userId);
        if (u && u.active) {
          S.user = u;
          S.account = u.id;
          S.loggedIn = true;
          if (sess.year) setYear(sess.year);
          const rec = await DB.loadRecord(u.id, S.year);
          if (rec) {
            const keep = { user: u, users: S.users, loggedIn: true, account: u.id, year: S.year, focus: u.track || "faculty" };
            S = hydrate(rec);
            Object.assign(S, keep);
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  applyQuery();
  render();
}

boot();
