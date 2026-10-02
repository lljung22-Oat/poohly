const KEY = "mu-pms-demo-v6";
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
    family: "ratee",
    track: "faculty",
    roleLabel: "ผู้รับการประเมิน",
    roleSub: "อาจารย์",
    hint: "กรอกข้อตกลงตามประกาศสายวิชาการ รายงานผล ประเมินตนเอง และรับทราบผลของตนเอง",
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
    family: "ratee",
    track: "support",
    roleLabel: "ผู้รับการประเมิน",
    roleSub: "บุคลากรสายสนับสนุน",
    hint: "กรอกแบบข้อตกลง PA บุคคลากร (แบบ 05–11) รายงานผล และรับทราบผลของตนเอง — ไม่ใช้ตารางหน่วยอาจารย์",
    tone: "support"
  },
  committee: {
    id: "committee",
    username: "committee.sh",
    aliases: ["committee.sh", "committee"],
    full: "กรรมการประเมิน",
    position: "กรรมการประเมิน",
    type: "คณะประเมิน",
    staffId: "COM-01",
    dept: "คณะกรรมการประเมิน",
    family: "eval",
    track: null,
    roleLabel: "กรรมการประเมิน",
    roleSub: "คณะประเมิน",
    hint: "ให้ความเห็น PA / CC / FC แล้วส่งประธาน — ไม่กรอกข้อตกลงเอง",
    tone: "eval"
  },
  chair: {
    id: "chair",
    username: "chair.sh",
    aliases: ["chair.sh", "chair"],
    full: "ประธานกรรมการประเมิน",
    position: "ประธานกรรมการประเมิน",
    type: "ผู้ประเมิน",
    staffId: "CHR-01",
    dept: "คณะกรรมการประเมิน",
    family: "eval",
    track: null,
    roleLabel: "ประธานกรรมการประเมิน",
    roleSub: "ผู้บังคับบัญชาชั้นต้น",
    hint: "อนุมัติข้อตกลง ให้คะแนน PA 80 + CC 20 และประเมิน IDP",
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
    roleLabel: "ฝ่ายบุคคลากร",
    roleSub: "Admin ส่วนงาน",
    hint: "สร้างรอบ ปฏิทิน ตรวจชุดประเมิน นำเข้ากรรมการ — ไม่ให้คะแนน",
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
  "กรรมการประเมิน",
  "ประธานกรรมการประเมิน",
  "คณะติดลงนาม",
  "พนักงานรับทราบประเมินผล",
  "เสร็จสิ้น"
];

const MODULES = [
  { id: "pa", title: "จัดทำข้อตกลงการปฏิบัติงาน (PA)", need: null },
  { id: "paReport", title: "รายงานผลการปฏิบัติงาน (PA)", need: "approved" },
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
  { id: "paReport", title: "แบบรายงานผลการปฏิบัติงาน (แบบ 07)", need: "approved" },
  { id: "competency", title: "ประเมินสมรรถนะหลัก / ตามสายงาน", need: "reported" },
  { id: "scoreSum", title: "แบบสรุปคะแนนผลการประเมิน (แบบ 09)", need: "chair" },
  { id: "ack", title: "แบบสรุปและแจ้งผลการประเมิน (แบบ 08)", need: "chair" },
  { id: "pledge", title: "แบบคำมั่น (แบบ 11)", need: null },
  { id: "idp", title: "IDP ผู้ปฏิบัติ", need: null },
  { id: "idpEval", title: "IDP ผู้อนุมัติ", need: "idpReported", sub: "เป็นไปตามที่คาดหวัง / ไม่เป็นไปตามที่คาดหวัง" },
  { id: "report", title: "รายงานและติดตามผลการดำเนินการ", need: null }
];

function uid() {
  return "id" + Math.random().toString(36).slice(2, 9);
}

function emptyTarget(code, weight) {
  return {
    id: uid(), code, title: "", kpiType: "quantity", weight: weight || 0,
    criteriaId: "", role: "", inDb: false, withStudent: false,
    amount: "", hours: "", qty: 1, report: "", file: "",
    selfScore: "", committeeComment: "", committeeScore: "",
    chairComment: "", chairScore: "", approved: "wait", approveReason: ""
  };
}

function defaultGroups() {
  return [
    {
      id: "strat", no: 1,
      agreements: [
        {
          id: uid(), code: "1.1", title: "ยุทธศาสตร์การวิจัย",
          kpis: [{
            id: uid(), code: "1.1.1", title: "ผลงานตีพิมพ์ / ทุนวิจัย ตามเกณฑ์ประกาศคณะ",
            targets: [{
              ...emptyTarget("1.1.1.1", 10),
              title: "บทความตีพิมพ์ในวารสารที่อยู่ในฐานข้อมูล",
              criteriaId: "pub_q1", role: "pi", inDb: true, kpiType: "quantity"
            }]
          }]
        },
        {
          id: uid(), code: "1.2", title: "ยุทธศาสตร์การจัดการศึกษา",
          kpis: [{
            id: uid(), code: "1.2.1", title: "ระดับคุณภาพการจัดการเรียนการสอน MUPSF",
            targets: [{
              ...emptyTarget("1.2.1.1", 10),
              title: "ได้รับการรับรอง MUPSF ตามเกณฑ์ประกาศ",
              criteriaId: "mupsf2", kpiType: "quality"
            }]
          }]
        },
        {
          id: uid(), code: "1.3", title: "ยุทธศาสตร์บริการวิชาการ",
          kpis: [{
            id: uid(), code: "1.3.1", title: "การมีส่วนร่วมในกระบวนการกำหนดนโยบาย",
            targets: [{
              ...emptyTarget("1.3.1.1", 5),
              title: "มีส่วนร่วมระดับชาติ",
              criteriaId: "part_nat", kpiType: "quality"
            }]
          }]
        }
      ]
    },
    {
      id: "main", no: 2,
      agreements: [
        {
          id: uid(), code: "2.1", title: "ภาระงานสอน",
          kpis: [{
            id: uid(), code: "2.1.1", title: "ชั่วโมงสอนตามตารางที่ 4",
            targets: [{
              ...emptyTarget("2.1.1.1", 30),
              title: "สอนภาคบรรยาย ปริญญาโท/เอก",
              criteriaId: "teach_grad_main", hours: "45", kpiType: "quantity"
            }]
          }]
        },
        {
          id: uid(), code: "2.2", title: "ภาระงานวิจัย",
          kpis: [{
            id: uid(), code: "2.2.1", title: "ความก้าวหน้ากระบวนการวิจัย ตารางที่ 11",
            targets: [{
              ...emptyTarget("2.2.1.1", 15),
              title: "โครงการวิจัยที่อยู่ในระหว่างดำเนินการ",
              criteriaId: "res_proc_3", kpiType: "quantity"
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
        }
      ]
    },
    {
      id: "assign", no: 3,
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
      id: "community", no: 4,
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
    loginType: ""
  };
}

function hydrate(raw) {
  const s = { ...defaultState(), ...(raw || {}) };
  if (!s.groups || !s.groups.length) s.groups = defaultGroups();
  if (!s.supportItems || !s.supportItems.length) s.supportItems = defaultSupportItems();
  if (!s.year || !["2569", "2570"].includes(String(s.year))) s.year = "2570";
  if (!s.supportFollow) s.supportFollow = [];
  if (!s.supportPledge) s.supportPledge = defaultState().supportPledge;
  s.modal = null;
  return s;
}

function persist() {
  const copy = { ...S, modal: null, users: undefined };
  try { localStorage.setItem(KEY, JSON.stringify(copy)); } catch { /* ignore */ }
  if (DB && S.user && S.loggedIn) {
    DB.saveRecord(S.user.id, S.year, copy);
    DB.saveSession({ userId: S.user.id, year: S.year, view: S.view });
    DB.audit(S.user.username, "save", S.view || "state");
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
  if (isRatee()) return account().track;
  return S.focus === "support" ? "support" : "faculty";
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
  S.view = view;
  S.modal = null;
  persist();
  location.hash = view;
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

async function enterUser(user) {
  S.loggedIn = true;
  S.user = user;
  S.account = user.id;
  S.focus = user.track || S.focus || "faculty";
  let rec = null;
  if (DB) rec = await DB.loadRecord(user.id, S.year);
  if (rec) {
    const keep = { user: S.user, users: S.users, loggedIn: true, account: user.id, year: S.year };
    S = hydrate(rec);
    Object.assign(S, keep);
  }
  S.view = "home";
  S.round = "รอบประเมินปีงบประมาณ " + S.year;
  persist();
  location.hash = "home";
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
    reported: ["pill-blue", "ส่งรายงานผลแล้ว"],
    committee: ["pill-blue", "กรรมการประเมินแล้ว"],
    chair: ["pill-blue", "ประธานส่งคะแนนแล้ว"],
    ack: ["pill-green", "รับทราบแล้ว"],
    disagree: ["pill-red", "ไม่เห็นด้วย"],
    eval: ["pill-blue", "ประเมิน IDP แล้ว"]
  };
  const x = map[st] || ["pill-gray", st];
  return `<span class="pill ${x[0]}">${x[1]}</span>`;
}

function canOpen(mod) {
  if (!mod.need) return true;
  const pa = paStatus();
  const idp = idpStatus();
  if (mod.need === "approved") return ["approved", "reported", "committee", "chair", "ack", "disagree"].includes(pa);
  if (mod.need === "reported") return ["reported", "committee", "chair", "ack", "disagree"].includes(pa);
  if (mod.need === "chair") return ["chair", "ack", "disagree"].includes(pa);
  if (mod.need === "idpApproved") return ["approved", "reported", "eval", "ack", "disagree"].includes(idp);
  if (mod.need === "idpReported") return ["reported", "eval", "ack", "disagree"].includes(idp);
  if (mod.need === "idpEval") return ["eval", "ack", "disagree"].includes(idp);
  return true;
}

function currentModules() {
  return track() === "support" ? STAFF_MODULES : MODULES;
}

function moduleAllowed(mod) {
  if (isHr() || isAdmin()) return ["report", "formset", "adminRound", "adminPeople"].includes(mod.id);
  if (isCommittee()) return ["competency", "report"].includes(mod.id);
  if (isChair()) return true;
  if (isRatee()) return !["idpEval"].includes(mod.id) || canOpen(mod);
  return false;
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

function readPaForm() {
  document.querySelectorAll("[data-pa]").forEach((el) => {
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
}

function readSupportForm() {
  document.querySelectorAll("[data-sup]").forEach((el) => {
    const [id, field] = el.dataset.sup.split(":");
    const it = S.supportItems.find((x) => x.id === id);
    if (!it) return;
    it[field] = el.type === "checkbox" ? el.checked : el.value;
  });
}

function addAgreement(gid) {
  if (!canEditAgreement()) return;
  const g = S.groups.find((x) => x.id === gid);
  const n = g.agreements.length + 1;
  g.agreements.push({
    id: uid(), code: `${g.no}.${n}`, title: "",
    kpis: [{
      id: uid(), code: `${g.no}.${n}.1`, title: "",
      targets: [emptyTarget(`${g.no}.${n}.1.1`, 0)]
    }]
  });
  persist(); render();
}

function removeAgreement(gid, aid) {
  if (!canEditAgreement()) return;
  const g = S.groups.find((x) => x.id === gid);
  if (g.agreements.length <= 1) { toast("ต้องมีข้อตกลงอย่างน้อย 1 ข้อในภาระงานนี้"); return; }
  g.agreements = g.agreements.filter((a) => a.id !== aid);
  persist(); render();
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
    if (!ok) { toast("กรอกภารกิจและเลือกเกณฑ์ให้ครบทุกเป้าหมาย"); return; }
    S.paStatus = "wait";
    forEachTarget((t) => { t.approved = "wait"; });
  }
  persist();
  toast("ส่งขออนุมัติแล้ว ให้ประธานพิจารณาในโหมดประธานกรรมการ");
  render();
}

function chairApproveAll() {
  if (!canApproveAgreement()) { toast("อนุมัติได้เฉพาะโหมดประธาน เมื่อสถานะขออนุมัติ"); return; }
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
  toast("ประธานอนุมัติข้อตกลงทั้งหมดแล้ว");
  render();
}

function chairReject() {
  if (!canApproveAgreement()) { toast("ส่งกลับได้เฉพาะโหมดประธาน"); return; }
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
  if (!canReportPa()) { toast("ส่งรายงานผลได้เฉพาะผู้รับการประเมิน เมื่อข้อตกลงอนุมัติแล้ว"); return; }
  if (track() === "support") {
    readSupportForm();
    if (S.supportItems.some((x) => !String(x.report || "").trim())) {
      toast("พิมพ์คำอธิบายรายงานผลให้ครบทุกข้อก่อนส่ง"); return;
    }
    if (!confirm("ตรวจคะแนนให้แน่ใจก่อนกดส่ง เพราะส่งแล้วแก้ไขไม่ได้")) return;
    S.supportStatus = "reported";
  } else {
    readPaForm();
    let missing = false;
    forEachTarget((t) => {
      if (!String(t.report || "").trim()) missing = true;
    });
    if (missing) { toast("พิมพ์คำอธิบายรายงานผลให้ครบทุกเป้าหมายก่อนส่ง"); return; }
    if (!confirm("ตรวจคะแนนให้แน่ใจก่อนกดส่ง เพราะส่งแล้วแก้ไขไม่ได้")) return;
    S.paStatus = "reported";
    S.ccStatus = "reported";
  }
  persist();
  toast("ส่งรายงานผลการปฏิบัติงานแล้ว แก้ไขไม่ได้");
  render();
}

function submitCommittee() {
  if (!canComment()) { toast("ส่งความเห็นได้เฉพาะโหมดกรรมการ เมื่อผู้รับการประเมินส่งรายงานแล้ว"); return; }
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
  toast("กรรมการส่งความเห็นให้ประธานแล้ว");
  render();
}

function openScoreDialog() {
  if (!canChairScore()) { toast("ตรวจสอบคะแนนได้เฉพาะโหมดประธาน"); return; }
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
  toast("ไม่เห็นด้วย — สถานะ PA และ CC กลับเป็นประธานกรรมการประเมิน");
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
  if (!canApproveIdp()) { toast("อนุมัติ IDP ได้เฉพาะโหมดประธาน"); return; }
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
  persist(); toast("ประธานอนุมัติ IDP แล้ว"); render();
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
  if (!canEvalIdp()) { toast("ประเมิน IDP ได้เฉพาะโหมดประธาน"); return; }
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
  persist(); toast("ไม่เห็นด้วย — สถานะกลับไปที่ประธาน"); render();
}

function lookingLine() {
  if (!isEval() || S.view === "home") return "";
  return `<span class="sep">|</span><span class="look">กำลังดู ${esc(rateeAccount().full)}</span>`;
}

function flowTabs() {
  if (isHr() || isAdmin()) return "";
  const staffPa = ["period", "profile", "rounds", "formset", "modules", "pa", "follow", "paReport", "competency", "scoreSum", "ack", "pledge", "report"].includes(S.view);
  const facPa = ["period", "profile", "rounds", "formset", "modules", "pa", "paReport", "competency", "ack", "report"].includes(S.view);
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
      ["paReport", "รายงาน 07"],
      ["scoreSum", "สรุปคะแนน 09"],
      ["ack", "แจ้งผล 08"],
      ["pledge", "คำมั่น 11"]
    ];
  } else {
    items = [
      ["modules", "วงจร PMS"],
      ["pa", "ข้อตกลง PA"],
      ["paReport", "รายงานผล"],
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
    <b>ผู้ประเมิน</b><span>ประธานกรรมการประเมิน</span>
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
        <p class="hint">บัญชีตัวอย่าง${picked === "faculty" ? " อาจารย์: porntipa.c / 123456" : " เจ้าหน้าที่: staff.sh / 123456"}</p>
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

function dashCards(cards) {
  return `
    <div class="dash">
      <h1>หน้าหลักระบบงาน (Dashboard)</h1>
      <div class="dash-grid">
        ${cards.map((c) => `
          <button class="dash-card${c.cream ? " cream" : ""}${c.locked ? " locked" : ""}" type="button"
            ${c.locked ? `data-lock="${esc(c.lockMsg || "ไม่ใช่แบบของโหมดนี้")}"` : `data-go="${c.go}"`}>
            <div class="ico">${ico(c.ico)}</div>
            <b>${esc(c.title)}</b>
            <small class="${c.linkish ? "linkish" : ""}">${esc(c.sub)}</small>
          </button>`).join("")}
      </div>
    </div>`;
}

function hrisCards() {
  const pa = isFaculty()
    ? { go: "period", ico: "grad", title: "PA ภาระงานอาจารย์", sub: "ข้อตกลงตามประกาศสายวิชาการ / SHPA", cream: true }
    : { go: "paStaff", ico: "clip", title: "PA ประเมินภาระงาน", sub: "ข้อตกลง PA บุคคลากร แบบ 05–11", cream: true };
  return [
    { go: "profile", ico: "person", title: "ข้อมูลบุคลากร", sub: "ประวัติและข้อมูลส่วนบุคคล" },
    { go: "leave", ico: "leave", title: "ข้อมูลวันลา", sub: "สถิติและการขออนุมัติวันลา" },
    { go: "time", ico: "clock", title: "ข้อมูลเวลาเข้า-ออกงาน", sub: "ลงเวลาปฏิบัติงานประจำวัน" },
    pa,
    { go: "competency", ico: "target", title: "Functional Competency", sub: "ประเมินสมรรถนะเฉพาะงาน", linkish: true },
    { go: "idp", ico: "chart", title: "IDP", sub: "แผนพัฒนารายบุคคล" }
  ];
}

function viewHome() {
  if (isFaculty() || isSupport()) {
    return chrome(dashCards(hrisCards()));
  }
  if (isCommittee()) {
    return chrome(dashCards([
      { go: "evalHome", ico: "people", title: "รายชื่อผู้รับการประเมิน", sub: "คนที่ตนต้องให้ความเห็น" },
      { go: "competency", ico: "target", title: "ประเมินผล", sub: "ให้ความเห็น PA / CC / FC แล้วส่งประธาน" },
      { go: "report", ico: "chart", title: "สอบถาม / พิมพ์รายงาน", sub: "ดูสถานะและพิมพ์รายงาน" },
      { go: "help", ico: "clip", title: "การช่วยเหลือ", sub: "หน้าที่กรรมการตาม UM-01 และ PMS" }
    ]));
  }
  if (isChair()) {
    return chrome(dashCards([
      { go: "evalHome", ico: "people", title: "รายชื่อผู้รับการประเมิน", sub: "อนุมัติข้อตกลงและให้คะแนน" },
      { go: "pa", ico: "grad", title: "อนุมัติข้อตกลง PA", sub: "ตรวจน้ำหนัก 100 แล้วนุมัติหรือส่งกลับ" },
      { go: "competency", ico: "target", title: "ให้คะแนน PA + CC", sub: "Dialog สรุป 80 + 20 = 100" },
      { go: "idp", ico: "chart", title: "อนุมัติ / ประเมิน IDP", sub: "เป็นไปตามที่คาดหวัง หรือไม่เป็นไป" },
      { go: "report", ico: "cal", title: "รายงานภาพรวม", sub: "ติดตามสถานะรอบปี " + S.year },
      { go: "help", ico: "clip", title: "การช่วยเหลือ", sub: "หน้าที่ประธานตามคำแนะนำ PMS" }
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

function viewSoon(title, sub) {
  return chrome(`
    <p class="crumb">หน้าหลักระบบงาน</p>
    <h1 class="page-title">${esc(title)}</h1>
    <div class="card">
      <p>${esc(sub)}</p>
      <p class="hint">โมดูลนี้เป็นส่วนของระบบบุคลากรตามหน้าหลัก · เดโมคณะสังคมฯ ใช้งานจริงที่การ์ด PA ของโหมดที่เลือก</p>
      <button class="btn-navy" type="button" data-go="home">กลับหน้าหลักระบบงาน</button>
    </div>`);
}

function viewLeave() {
  return viewSoon("ข้อมูลวันลา", "สถิติและการขออนุมัติวันลา");
}
function viewTime() {
  return viewSoon("ข้อมูลเวลาเข้า-ออกงาน", "ลงเวลาปฏิบัติงานประจำวัน");
}

function viewPaStaff() {
  if (isFaculty()) {
    return chrome(`<div class="warn-box">การ์ดนี้เป็นแบบของบุคลากรสายสนับสนุน ตามเอกสาร PA บุคคลากร ไม่ใช่แบบอาจารย์</div>
      <button class="btn-navy" data-go="period">ไป PA ภาระงานอาจารย์</button>`);
  }
  if (isEval()) {
    S.focus = "support";
    persist();
    return viewPeriod();
  }
  return viewPeriod();
}

function viewHelp() {
  const a = account();
  const blocks = {
    faculty: ["ยืนยันประวัติก่อนกรอกข้อตกลง", "กรอก PA ภาระงานอาจารย์ตามประกาศค่าน้ำหนัก / SHPA", "หน่วยและคะแนนตนเองคำนวณจากประกาศสายวิชาการ ฐาน 1,820", "ส่งรายงานผลแล้วแก้ไม่ได้", "รับทราบ PA+CC พร้อมกัน · FC รับทราบแยก", "การ์ด PA ประเมินภาระงานของบุคลากรเปิดไม่ได้ในโหมดนี้"],
    support: ["ยืนยันประวัติก่อนกรอกข้อตกลง", "ใช้เอกสาร PA บุคคลากร แบบ 05–11 ไม่ใช่ตารางหน่วยอาจารย์", "น้ำหนักรวม 100 เกณฑ์ 5 ระดับ ตาม rubrics สายสนับสนุน", "ติดตามกลางปีด้วยแบบ 06 · รายงานผลด้วยแบบ 07", "สรุปคะแนน 09 · แจ้งผล 08 · คำมั่น 11 · IDP ผู้ปฏิบัติ/ผู้อนุมัติ", "การ์ด PA ภาระงานอาจารย์เปิดไม่ได้ในโหมดนี้"],
    committee: ["เข้าจากรายชื่อผู้รับการประเมิน (UM-01)", "ให้ความเห็น PA / CC / FC เมื่อส่งรายงานแล้ว", "ส่งให้ประธาน — ไม่ใช่คะแนนหลัก", "ไม่มีหน้ากรอกข้อตกลง และไม่อนุมัติ"],
    chair: ["ค้นผู้รับการประเมินแล้วเข้ากำหนดตัวชี้วัด", "อนุมัติ/ไม่อนุมัติข้อตกลงเมื่อสถานะขออนุมัติ", "ให้คะแนน PA 80 + CC 20 แล้วส่งคะแนน", "ประเมิน IDP เป็นไปตามที่คาดหวัง / ไม่เป็นไป", "ไม่กรอกภาระงานแทนผู้รับการประเมิน"],
    hr: ["สร้างรอบและปฏิทินของส่วนงาน", "ตรวจชุดประเมิน PA IDP CC FC MC ให้ครบตามตำแหน่ง", "นำเข้ากรรมการ · ติดตามตามปฏิทิน", "ไม่ให้คะแนนและไม่กรอก PA"],
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
    return chrome(`<div class="warn-box">หน้ารายชื่อผู้รับการประเมินเป็นของกรรมการ ประธาน และฝ่ายบุคคลากร</div>
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
        <button class="act" data-focus="${r.track || r.id}" data-go="${isCommittee() ? "competency" : "pa"}">${isChair() ? "เปิดข้อตกลง" : "ให้ความเห็น"}</button>
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
    committee: { family: "eval", track: null, role: "committee", roleLabel: "กรรมการประเมิน", roleSub: "ผู้ประเมิน", type: "คณะประเมิน", tone: "eval", canEval: true, hint: "ให้ความเห็นแล้วส่งประธาน" },
    chair: { family: "eval", track: null, role: "chair", roleLabel: "ประธานกรรมการประเมิน", roleSub: "ผู้ประเมิน", type: "ผู้ประเมิน", tone: "chair", canEval: true, canChair: true, hint: "อนุมัติข้อตกลงและให้คะแนน" },
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
          <option value="committee">กรรมการประเมิน</option>
          <option value="chair">ประธานกรรมการประเมิน</option>
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
          <tr><td>${esc(ACCOUNTS.committee.staffId)}</td><td>${esc(ACCOUNTS.committee.full)}</td><td>กรรมการประเมิน</td><td>${esc(FACULTY)}</td><td>คณะประเมิน</td><td>—</td></tr>
          <tr><td>${esc(ACCOUNTS.chair.staffId)}</td><td>${esc(ACCOUNTS.chair.full)}</td><td>ประธานกรรมการประเมิน</td><td>${esc(FACULTY)}</td><td>ผู้ประเมิน</td><td>—</td></tr>
          <tr><td>${esc(ACCOUNTS.hr.staffId)}</td><td>${esc(ACCOUNTS.hr.full)}</td><td>เจ้าหน้าที่งานการเจ้าหน้าที่</td><td>${esc(FACULTY)}</td><td>Admin ส่วนงาน</td><td>—</td></tr>
        </tbody>
      </table>
      <p class="hint">ของจริงนำเข้าจากไฟล์ที่มหาวิทยาลัยกำหนด · เดโมโชว์เฉพาะคณะสังคมฯ</p>
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
          <tr><td>รายงานผลและประเมินตนเอง</td><td>1 ก.ย. ${esc(y)}</td><td>15 ก.ย. ${esc(y)}</td></tr>
          <tr><td>กรรมการ / ประธานให้คะแนน</td><td>16 ก.ย. ${esc(y)}</td><td>30 ก.ย. ${esc(y)}</td></tr>
          <tr><td>รับทราบผล</td><td>1 ต.ค. ${esc(y)}</td><td>15 ต.ค. ${esc(y)}</td></tr>
          <tr><td>จัดทำ IDP</td><td>16 ต.ค. ${esc(y)}</td><td>31 ต.ค. ${esc(y)}</td></tr>
        </tbody>
      </table>
      <p class="hint">ข้าราชการ/ลูกจ้าง 2 รอบต่อปี · พนักงานมหาวิทยาลัย 1 รอบ · เดโมเลือกได้ปี 2569 และ 2570</p>
    </div>`);
}

function viewPeriod() {
  if (isHr() || isAdmin()) {
    return chrome(`<div class="warn-box">ฝ่ายบุคคลากรและ Admin ไม่จัดทำข้อตกลงของตนเองในหน้านี้</div>
      <button class="btn-navy" data-go="adminRound">ไปรอบและปฏิทิน</button>`);
  }
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
  return chrome(`
    <p class="crumb">ยืนยันประวัติส่วนตัว</p>
    <h1 class="page-title">ข้อมูลส่วนบุคคล</h1>
    <div class="card">${profileBox()}
      <p class="hint">${isRatee() ? "ตรวจชื่อ ตำแหน่ง สังกัดให้ถูกต้องก่อนจัดทำข้อตกลง" : "ข้อมูลของผู้รับการประเมินที่กำลังดู"}</p>
      <button class="btn-navy" type="button" data-go="${isEval() ? "evalHome" : "modules"}" style="margin-top:12px">${isRatee() ? "ยืนยันและเข้าวงจรประเมิน" : "กลับรายชื่อ"}</button>
    </div>`);
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
  if (isHr() || isAdmin()) {
    return chrome(`<div class="warn-box">วงจรประเมินเป็นของผู้อยู่ในรอบ ไม่ใช่หน้าที่ฝ่ายบุคคลากร/Admin</div>
      <button class="btn-navy" data-go="formset">ไปชุดประเมิน</button>`);
  }
  const list = currentModules();
  const staff = track() === "support";
  const cards = list.map((m) => {
    const allowed = moduleAllowed(m);
    const open = canOpen(m);
    const dis = allowed && open ? "" : "disabled";
    let why = "";
    if (!allowed) why = isCommittee() ? "โมดูลนี้ไม่ใช่หน้าที่กรรมการ" : isRatee() && m.id === "idpEval" ? "ประเมิน IDP เป็นหน้าที่ผู้อนุมัติ" : "ไม่ใช่หน้าที่ของโหมดนี้";
    else if (!open) why = "ยังไม่ถึงขั้นตอนนี้";
    return `<button class="mod" type="button" data-go="${m.id}" ${dis}>
      ${esc(m.title)}${m.sub ? `<small>${esc(m.sub)}</small>` : ""}
      ${why ? `<small class="mod-why">${esc(why)}</small>` : ""}
    </button>`;
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
      <div class="mods">${cards}</div>
    </div>`);
}

function criteriaOptions(gid, selected) {
  return (C.CATALOG[gid] || []).map((c) =>
    `<option value="${esc(c.id)}" ${c.id === selected ? "selected" : ""}>${esc(c.label)}</option>`
  ).join("");
}

function extraFields(t, g, lock) {
  const c = C.findCrit(g.id, t.criteriaId);
  const dis = lock ? "disabled" : "";
  if (!c || !c.id) return "";
  let html = "";
  if (c.kind === "pub") {
    html += `<select data-pa="t:${t.id}:role" ${dis}>${C.ROLES.map((r) =>
      `<option value="${r.id}" ${t.role === r.id ? "selected" : ""}>${esc(r.label)}</option>`).join("")}</select>`;
    html += `<label class="chk"><input type="checkbox" data-pa="t:${t.id}:inDb" ${t.inDb ? "checked" : ""} ${dis}/> ปรากฏในฐานข้อมูลแล้ว</label>`;
    html += `<label class="chk"><input type="checkbox" data-pa="t:${t.id}:withStudent" ${t.withStudent ? "checked" : ""} ${dis}/> ตีพิมพ์ร่วมกับนักศึกษา</label>`;
  }
  if (c.kind === "grant_th" || c.kind === "grant_en" || c.kind === "grant_mu") {
    html += `<select data-pa="t:${t.id}:role" ${dis}>${C.ROLES.map((r) =>
      `<option value="${r.id}" ${t.role === r.id ? "selected" : ""}>${esc(r.label)}</option>`).join("")}</select>`;
    html += `<input type="number" data-pa="t:${t.id}:amount" value="${esc(t.amount)}" placeholder="จำนวนเงิน (บาท)" ${dis} />`;
  }
  if (c.kind === "hours") {
    html += `<input type="number" data-pa="t:${t.id}:hours" value="${esc(t.hours)}" placeholder="จำนวนชั่วโมง" ${dis} />`;
  }
  if (c.kind === "count") {
    html += `<input type="number" data-pa="t:${t.id}:qty" value="${esc(t.qty)}" placeholder="จำนวน" ${dis} />`;
  }
  return html;
}

function viewPA() {
  if (track() === "support") return viewSupportPA();
  const lock = !canEditAgreement();
  const chairOn = canApproveAgreement();
  const w = checkWeight();
  const wcls = w === 100 ? "" : "warn";
  const rows = [];
  S.groups.forEach((g) => {
    const meta = C.GROUPS.find((x) => x.id === g.id);
    const units = C.groupUnits(S.groups, g.id);
    rows.push(`<tr class="g"><td></td><td>${esc(meta.title)}</td>
      <td colspan="6">${esc(meta.name)} · น้ำหนักตามประกาศ ${meta.pct}% (เพดาน ${meta.cap} หน่วย) · ได้ ${C.fmtUnit(units)} หน่วย</td>
      <td>${canEditAgreement() ? `<button class="iconbtn add" type="button" data-add-ag="${g.id}">+</button>` : ""}</td></tr>`);
    g.agreements.forEach((a) => {
      rows.push(`<tr class="a"><td>${canEditAgreement() ? `<button class="iconbtn" type="button" data-del-ag="${g.id}:${a.id}">−</button>` : ""}</td>
        <td>ข้อตกลง ${esc(a.code)}</td>
        <td colspan="7"><input data-pa="a:${a.id}:title" value="${esc(a.title)}" ${lock ? "disabled" : ""} /></td></tr>`);
      a.kpis.forEach((k) => {
        rows.push(`<tr class="k"><td></td><td>ตัวชี้วัด ${esc(k.code)}</td>
          <td colspan="7"><input data-pa="k:${k.id}:title" value="${esc(k.title)}" ${lock ? "disabled" : ""} /></td></tr>`);
        k.targets.forEach((t) => {
          const cal = C.calcTarget(t, g.id);
          const self = C.effectiveScore(t, g.id);
          rows.push(`<tr>
            <td></td>
            <td>เป้าหมาย ${esc(t.code)}</td>
            <td>
              <input data-pa="t:${t.id}:title" value="${esc(t.title)}" ${lock ? "disabled" : ""} />
              <div class="extra">${extraFields(t, g, lock)}
                ${cal.blocked === "student" ? `<div class="warn-box">ผลงานร่วมนักศึกษาไม่นับในยุทธศาสตร์</div>` : ""}
                ${cal.blocked === "db" ? `<div class="warn-box">ต้องปรากฏในฐานข้อมูลก่อนจึงคิดหน่วย</div>` : ""}
              </div>
            </td>
            <td><select data-pa="t:${t.id}:kpiType" ${lock ? "disabled" : ""}>${C.KPI_TYPES.map((x) =>
              `<option value="${x.id}" ${t.kpiType === x.id ? "selected" : ""}>${esc(x.label)}</option>`).join("")}</select></td>
            <td><input type="number" data-pa="t:${t.id}:weight" value="${esc(t.weight)}" ${lock ? "disabled" : ""} /></td>
            <td><select data-pa="t:${t.id}:criteriaId" ${lock ? "disabled" : ""}>${criteriaOptions(g.id, t.criteriaId)}</select>
              <div class="hint">เกณฑ์ 5 ระดับ: สูงกว่า 9–10 · ตามเป้า 7–8 · ใกล้เคียง 5–6 · ต่ำกว่า 3–4 · ต่ำกว่ามาก 0–2</div></td>
            <td>${chairOn ? `<select data-pa="t:${t.id}:approved">
              <option value="wait" ${t.approved === "wait" ? "selected" : ""}>รออนุมัติ</option>
              <option value="yes" ${t.approved === "yes" ? "selected" : ""}>อนุมัติ</option>
              <option value="no" ${t.approved === "no" ? "selected" : ""}>ไม่อนุมัติ</option>
            </select>` : `<span class="pill pill-gray">${t.approved === "yes" ? "อนุมัติ" : t.approved === "no" ? "ไม่อนุมัติ" : "รออนุมัติ"}</span>`}</td>
            <td>
              <div class="auto">${C.fmtUnit(cal.units)} หน่วย</div>
              <div class="auto">คะแนน ${C.fmtScore(self)}</div>
            </td>
            <td>${chairOn ? `<input data-pa="t:${t.id}:approveReason" value="${esc(t.approveReason)}" placeholder="ความคิดเห็นผู้อนุมัติ" />` : esc(t.approveReason || "—")}</td>
          </tr>`);
        });
      });
    });
  });

  const chairBar = chairOn ? `
    <div class="card chair-only">
      <h3>ประธานพิจารณาข้อตกลง</h3>
      <p>ตรวจรวมร้อยละค่าน้ำหนัก แล้วอนุมัติทีละข้อ หรือกดอนุมัติทั้งหมด · ถ้าจะส่งกลับแก้ เปลี่ยนเป็นไม่อนุมัติแล้วใส่เหตุผล</p>
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
        <h2>Performance Agreement (PA)</h2>
        <p class="sub">การประเมินผลการปฏิบัติงาน · ${statusPill(paStatus())} · ปี ${esc(S.year)}</p>
      </div>
      <div class="weight-box ${wcls}">รวมร้อยละ (ค่าน้ำหนัก) ของตัวชี้วัด : ${w}</div>
    </div>
    ${paStatus() === "back" ? `<div class="warn-box">ส่งกลับแก้ไข: ${esc(reject)}</div>` : ""}
    ${chairBar}
    <div class="pa-wrap"><table class="pa">
      <thead><tr>
        <th>จัดการ</th><th>ลำดับ</th><th>ภารกิจ</th><th>ประเภทตัวชี้วัด</th>
        <th>ร้อยละ (ค่าน้ำหนัก)</th><th>เกณฑ์การประเมิน</th><th>อนุมัติ</th>
        <th>หน่วย / คะแนนตนเอง</th><th>ความคิดเห็นของผู้อนุมัติ</th>
      </tr></thead>
      <tbody>${rows.join("")}</tbody>
    </table></div>
    <div class="footbar">
      ${canEditAgreement() ? `<button class="btn-navy" type="button" id="btnSave">บันทึกฉบับร่าง</button>
      <button class="btn-navy" type="button" id="btnAsk">ขออนุมัติ</button>` : ""}
      <button class="btn-ghost" type="button" data-go="${isEval() ? "evalHome" : "modules"}">กลับ</button>
    </div>
    <p class="hint">แบบของอาจารย์ตามเอกสาร DOC-PA.อ · หน่วยและคะแนนคำนวณจากประกาศคณะฯ พ.ศ. 2568 สายวิชาการ (ฐาน 1,820 หน่วย · PA 80 + CC 20) · ปีงบประมาณ ${esc(S.year)} · ไม่ใช้แบบข้อตกลงของบุคลากร</p>
  `);
}

function viewSupportPA() {
  const lock = !canEditAgreement();
  const chairOn = canApproveAgreement();
  const w = checkWeight();
  const wcls = w === 100 ? "" : "warn";
  const rows = S.supportItems.map((it) => {
    const autoW = ((Number(it.weight) || 0) * (Number(it.kpiWeight) || 0) / 100).toFixed(2);
    return `<tr>
      <td>${canEditAgreement() ? `<button class="iconbtn" data-del-sup="${it.id}">−</button>` : ""}</td>
      <td>${esc(it.no)}</td>
      <td><select data-sup="${it.id}:workType" ${lock ? "disabled" : ""}>${C.WORK_TYPES.map((x) =>
        `<option value="${x.id}" ${it.workType === x.id ? "selected" : ""}>${esc(x.label)}</option>`).join("")}</select></td>
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
  }).join("");
  const chairBar = chairOn ? `
    <div class="card chair-only">
      <h3>ประธานพิจารณาข้อตกลงสายสนับสนุน</h3>
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
    <div class="pa-wrap"><table class="pa">
      <thead><tr>
        <th></th><th>ลำดับ</th><th>ประเภทของงาน</th><th>ข้อตกลง (ภาระงาน)</th>
        <th>ค่าน้ำหนัก</th><th>ตัวชี้วัด / น้ำหนักตัวชี้วัด</th><th>ร้อยละน้ำหนัก</th>
        <th>เกณฑ์ 5 ระดับ</th><th>อนุมัติ</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="footbar">
      ${canEditAgreement() ? `<button class="btn-teal" type="button" id="btnAddSup">เพิ่มข้อตกลง</button>
      <button class="btn-navy" type="button" id="btnSave">บันทึกฉบับร่าง</button>
      <button class="btn-navy" type="button" id="btnAsk">ขออนุมัติ</button>` : ""}
      <button class="btn-ghost" type="button" data-go="${isEval() ? "evalHome" : "modules"}">กลับ</button>
    </div>
    <p class="hint">แบบของบุคลากรตามเอกสาร PA บุคคลากร: ข้อตกลง 05 · ติดตาม 06 · รายงานผล 07 · แจ้งผล 08 · สรุปคะแนน 09 · คำมั่น 11 · IDP ผู้ปฏิบัติ/ผู้อนุมัติ · น้ำหนักรวม 100 · ประกาศหน่วย 1,820 ของอาจารย์ไม่ใช้กับหน้านี้</p>
  `);
}

function viewFollow() {
  if (track() !== "support") {
    return chrome(`<div class="warn-box">แบบติดตามผลการปฏิบัติงาน (แบบ 06) เป็นของบุคลากรสายสนับสนุน</div>
      <button class="btn-navy" data-go="home">กลับหน้าหลักระบบงาน</button>`);
  }
  if (!canOpen({ need: "approved" })) {
    return chrome(`<div class="warn-box">ติดตามผลได้เมื่อประธานอนุมัติข้อตกลงแล้ว</div>
      <button class="btn-navy" data-go="pa">ไปแบบข้อตกลง 05</button>`);
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
    <p class="hint">ตามเอกสาร PA บุคคลากร แบบ 06 · ไม่ใช่แบบรายงานผลปลายปี และไม่ใช่ตารางหน่วยอาจารย์</p>
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
  if (!canOpen({ need: "chair" })) {
    return chrome(`<div class="warn-box">สรุปคะแนนได้เมื่อประธานส่งคะแนนแล้ว</div>
      <button class="btn-navy" data-go="competency">ไปประเมินสมรรถนะ</button>`);
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
        <thead><tr><th>ลำดับ</th><th>ข้อตกลง</th><th>น้ำหนัก</th><th>ตนเอง</th><th>ประธาน</th></tr></thead>
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
  if (track() !== "support") {
    return chrome(`<div class="warn-box">แบบคำมั่น (แบบ 11) เป็นของบุคลากรสายสนับสนุน</div>
      <button class="btn-navy" data-go="home">กลับหน้าหลักระบบงาน</button>`);
  }
  const p = S.supportPledge || { text: "", rateeSigned: false, chairSigned: false };
  const rateeOn = isRatee();
  const chairOn = isChair();
  return chrome(`
    <p class="crumb">PA บุคคลากร · แบบ 11 · ${esc(rateeAccount().full)}</p>
    <h1 class="page-title">แบบคำมั่น ปีงบประมาณ ${esc(S.year)}</h1>
    <div class="card">
      <p>ผู้รับการประเมินให้คำมั่นต่อผู้บังคับบัญชาชั้นต้น ตามเอกสาร PA บุคคลากร แบบ 11</p>
      <label>ข้อความคำมั่น</label>
      <textarea id="pledgeText" ${rateeOn ? "" : "disabled"}>${esc(p.text)}</textarea>
      <label class="chk"><input type="checkbox" id="pledgeRatee" ${p.rateeSigned ? "checked" : ""} ${rateeOn ? "" : "disabled"} /> ผู้รับการประเมินลงนามคำมั่น</label>
      <label class="chk"><input type="checkbox" id="pledgeChair" ${p.chairSigned ? "checked" : ""} ${chairOn ? "" : "disabled"} /> ผู้บังคับบัญชาชั้นต้นรับทราบคำมั่น</label>
      <div class="footbar">
        ${rateeOn || chairOn ? `<button class="btn-navy" type="button" id="btnSavePledge">บันทึกแบบคำมั่น</button>` : ""}
        <button class="btn-ghost" data-go="modules">กลับวงจรบุคคลากร</button>
      </div>
    </div>`);
}

function viewPaReport() {
  if (!canOpen(MODULES[1])) {
    return chrome(`<div class="warn-box">รายงานผลได้เมื่อประธานอนุมัติข้อตกลงแล้ว</div>
      <button class="btn-navy" data-go="pa">ไปจัดทำข้อตกลง</button>`);
  }
  const lock = !canReportPa();
  if (track() === "support") {
    const rows = S.supportItems.map((it) => `<tr>
      <td>${esc(it.no)}</td><td>${esc(it.title)}</td>
      <td><input type="number" min="0" max="10" step="0.5" data-sup="${it.id}:selfScore" value="${esc(it.selfScore)}" ${lock ? "disabled" : ""} /></td>
      <td>${esc(C.scaleLabel(it.selfScore))}</td>
      <td><textarea data-sup="${it.id}:report" ${lock ? "disabled" : ""} placeholder="คำอธิบายผลการดำเนินงาน">${esc(it.report)}</textarea>
        <input data-sup="${it.id}:file" placeholder="ชื่อไฟล์หลักฐาน" value="${esc(it.file)}" ${lock ? "disabled" : ""} /></td>
    </tr>`).join("");
    return chrome(`
      <h1 class="page-title">รายงานผลการปฏิบัติงาน (PA) · สายสนับสนุน</h1>
      ${stepperHtml()}
      ${paLocked() ? `<div class="lock-note">ส่งรายงานผลแล้วแก้ไขไม่ได้</div>` : ""}
      <div class="pa-wrap"><table class="pa">
        <thead><tr><th>ลำดับ</th><th>ข้อตกลง</th><th>ประเมินตนเอง (0–10)</th><th>เกณฑ์</th><th>รายงานผล / หลักฐาน</th></tr></thead>
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
      <td><textarea data-pa="t:${t.id}:report" ${lock ? "disabled" : ""} placeholder="คำอธิบายผลการดำเนินงาน">${esc(t.report)}</textarea>
        <input data-pa="t:${t.id}:file" placeholder="ชื่อไฟล์หลักฐาน" value="${esc(t.file)}" ${lock ? "disabled" : ""} /></td>
    </tr>`);
  });
  return chrome(`
    <p class="crumb">แบบประเมินข้อตกลง PA / ประเมินผล</p>
    <h1 class="page-title">รายงานผลการปฏิบัติงาน (PA)</h1>
    ${stepperHtml()}
    ${paLocked() ? `<div class="lock-note">ส่งรายงานผลแล้วแก้ไขไม่ได้</div>` : ""}
    <div class="pa-wrap"><table class="pa">
      <thead><tr><th>เป้าหมาย</th><th>ภารกิจ</th><th>หน่วยภาระงาน</th><th>ประเมินตนเอง (0–10)</th><th>เกณฑ์</th><th>รายงานผล / หลักฐาน</th></tr></thead>
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
  const reportOn = isRatee() && !lockChair && ["approved", "reported"].includes(paStatus());
  const comOn = canComment();
  const chairOn = canChairScore();
  const cc = ccList();
  const fc = fcList();
  const ccRows = cc.map((it, i) => `
    <tr>
      <td><b>${i + 1}. ${esc(it.name)}</b><div class="hint">${esc(it.full)}</div></td>
      <td>${isRatee() ? `<textarea data-cc="${it.id}:report" ${reportOn ? "" : "disabled"} placeholder="รายงานผล">${esc(it.report)}</textarea>` : `<div>${esc(it.report || "—")}</div>`}</td>
      <td>0–10 ตามพฤติกรรม</td>
      <td>${selfOn || isRatee() ? `<input type="number" min="0" max="10" data-cc="${it.id}:self" value="${esc(it.self)}" ${selfOn ? "" : "disabled"} />` : C.fmtScore(it.self)}</td>
      <td>${isCommittee() || isChair() ? `<input type="number" min="0" max="10" data-cc="${it.id}:committee" value="${esc(it.committee)}" ${comOn ? "" : "disabled"} placeholder="ความเห็น/ตัวเลข" />` : (it.committee !== "" ? C.fmtScore(it.committee) : "—")}</td>
      <td>${isChair() ? `<input type="number" min="0" max="10" data-cc="${it.id}:chair" value="${esc(it.chair)}" ${chairOn ? "" : "disabled"} />` : (it.chair !== "" ? C.fmtScore(it.chair) : "—")}</td>
    </tr>`).join("");
  const fcRows = fc.map((it) => `
    <tr>
      <td><b>${esc(it.name)}</b></td>
      <td>${isRatee() ? `<textarea data-fc="${it.id}:report" ${lockChair ? "disabled" : ""}>${esc(it.report)}</textarea>` : esc(it.report || "—")}</td>
      <td>${isRatee() ? `<input type="number" min="0" max="10" data-fc="${it.id}:self" value="${esc(it.self)}" ${lockChair ? "disabled" : ""} />` : C.fmtScore(it.self)}</td>
      <td>${isCommittee() || isChair() ? `<input type="number" min="0" max="10" data-fc="${it.id}:committee" value="${esc(it.committee)}" ${comOn ? "" : "disabled"} />` : (it.committee !== "" ? C.fmtScore(it.committee) : "—")}</td>
      <td>${isChair() ? `<input type="number" min="0" max="10" data-fc="${it.id}:chair" value="${esc(it.chair)}" ${chairOn ? "" : "disabled"} />` : (it.chair !== "" ? C.fmtScore(it.chair) : "—")}</td>
    </tr>`).join("");
  const tot = currentTotal(true);
  let paRows = "";
  if (track() === "support") {
    paRows = S.supportItems.map((it) => `<tr>
      <td>${esc(it.no)} ${esc(it.title)}</td>
      <td>${C.fmtScore(it.selfScore)}</td>
      <td>${isCommittee() || isChair() ? `<input data-sup="${it.id}:committeeComment" value="${esc(it.committeeComment)}" ${comOn ? "" : "disabled"} />` : esc(it.committeeComment || "—")}</td>
      <td>${isChair() ? `<input type="number" min="0" max="10" data-sup="${it.id}:chairScore" value="${esc(it.chairScore)}" ${chairOn ? "" : "disabled"} />` : C.fmtScore(it.chairScore)}</td>
    </tr>`).join("");
  } else {
    forEachTarget((t, g) => {
      const self = C.effectiveScore(t, g.id);
      paRows += `<tr><td>${esc(t.code)} ${esc(t.title)}</td>
        <td>${C.fmtScore(self)}</td>
        <td>${isCommittee() || isChair() ? `<input data-pa="t:${t.id}:committeeComment" value="${esc(t.committeeComment)}" ${comOn ? "" : "disabled"} />` : esc(t.committeeComment || "—")}</td>
        <td>${isChair() ? `<input type="number" min="0" max="10" data-pa="t:${t.id}:chairScore" value="${esc(t.chairScore)}" ${chairOn ? "" : "disabled"} />` : C.fmtScore(t.chairScore)}</td></tr>`;
    });
  }
  return chrome(`
    <p class="crumb">แบบประเมินสมรรถนะ / ประเมินผลงาน · ${esc(rateeAccount().full)}</p>
    <h1 class="page-title">ประเมินผลงาน และประเมินสมรรถนะ</h1>
    ${stepperHtml()}
    <p class="hint">${isRatee() ? "โหมดผู้รับการประเมิน: กรอกรายงานผลและคะแนนตนเอง" : isCommittee() ? "โหมดกรรมการ: ให้ความเห็นแล้วส่งประธาน" : isChair() ? "โหมดประธาน: ให้คะแนนแล้วกดตรวจสอบคะแนน" : "ดูอย่างเดียว"}</p>
    <div class="card">
      <h3>สมรรถนะหลัก (Core Competency) · คิดคะแนน (รวม÷70)×20</h3>
      <div class="pa-wrap"><table class="pa" style="min-width:1100px">
        <thead><tr>
          <th>สมรรถนะหลัก</th><th>ผลการดำเนินงาน</th><th>เกณฑ์</th>
          <th>ประเมินตนเอง</th><th>กรรมการ</th><th>ประธาน</th>
        </tr></thead>
        <tbody>${ccRows}</tbody>
      </table></div>
    </div>
    <div class="card">
      <h3>สมรรถนะตามสายอาชีพ (Functional Competency) · ไม่รวมใน PA 80+CC 20 · รับทราบแยก</h3>
      <div class="pa-wrap"><table class="pa" style="min-width:900px">
        <thead><tr><th>รายการ</th><th>รายงานผล</th><th>ตนเอง</th><th>กรรมการ</th><th>ประธาน</th></tr></thead>
        <tbody>${fcRows}</tbody>
      </table></div>
    </div>
    <div class="card">
      <h3>คะแนนผลงาน (PA)</h3>
      <div class="pa-wrap"><table class="pa" style="min-width:900px">
        <thead><tr><th>รายการ</th><th>ตนเอง</th><th>กรรมการ (ความเห็น)</th><th>ประธาน (0–10)</th></tr></thead>
        <tbody>${paRows}</tbody>
      </table></div>
    </div>
    <p>ผลการประเมินขณะนี้ PA ${C.fmtScore(tot.pa)} + CC ${C.fmtScore(tot.cc)} = <b>${C.fmtScore(tot.total)}</b> (${esc(tot.level)})</p>
    <div class="footbar">
      <button class="btn-navy" type="button" id="btnSaveComp">บันทึก</button>
      ${isCommittee() ? `<button class="btn-gold" type="button" id="btnCommittee" ${canComment() ? "" : "disabled"}>กรรมการส่งให้ประธาน</button>` : ""}
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
  if (!canOpen(MODULES[3])) {
    return chrome(`<div class="warn-box">รับทราบได้เมื่อประธานส่งคะแนนแล้ว</div>
      <button class="btn-navy" data-go="competency">ไปประเมินผลงานและสมรรถนะ</button>`);
  }
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
  if (isCommittee()) {
    return chrome(`<div class="warn-box">กรรมการไม่ได้จัดทำหรืออนุมัติ IDP · เป็นหน้าที่ผู้รับการประเมินและประธาน</div>
      <button class="btn-navy" data-go="evalHome">กลับรายชื่อ</button>`);
  }
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
      <h3>ประธานอนุมัติ IDP</h3>
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
  if (!canOpen(MODULES[5])) {
    return chrome(`<div class="warn-box">รายงานผล IDP ได้เมื่อประธานอนุมัติแผนแล้ว</div>
      <button class="btn-navy" data-go="idp">ไปจัดทำ IDP</button>`);
  }
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
  if (!isChair()) {
    return chrome(`<div class="warn-box">ประเมิน IDP เป็นหน้าที่ประธานกรรมการเท่านั้น</div>
      <button class="btn-navy" data-go="home">กลับหน้าหลักของโหมดนี้</button>`);
  }
  if (!canOpen(MODULES[6]) && idpStatus() !== "reported") {
    return chrome(`<div class="warn-box">ประเมิน IDP ได้เมื่อผู้รับการประเมินส่งรายงานผลแล้ว</div>`);
  }
  const lock = !canEvalIdp();
  return chrome(`
    <h1 class="page-title">ประเมินผลการพัฒนารายบุคคล (IDP)</h1>
    <p>ผลที่ประธานให้เป็นข้อความ <b>เป็นไปตามที่คาดหวัง</b> หรือ <b>ไม่เป็นไปตามที่คาดหวัง</b></p>
    ${currentIdp().map((it) => `<div class="card"><h3>${esc(it.competency)}</h3><p>${esc(it.report) || "-"}</p>
      <p>สถานะรายการ: ${it.result === "ok" ? "เป็นไปตามที่คาดหวัง" : it.result === "no" ? "ไม่เป็นไปตามที่คาดหวัง" : "-"}</p></div>`).join("")}
    <div class="footbar">
      <button class="btn-ok" type="button" id="btnIdpOk" ${lock ? "disabled" : ""}>เป็นไปตามที่คาดหวัง</button>
      <button class="btn-danger" type="button" id="btnIdpNot" ${lock ? "disabled" : ""}>ไม่เป็นไปตามที่คาดหวัง</button>
    </div>`);
}

function viewIdpAck() {
  if (!canOpen(MODULES[7])) {
    return chrome(`<div class="warn-box">รับทราบผล IDP ได้เมื่อประธานประเมินแล้ว</div>`);
  }
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
    body = `<table class="data"><thead><tr><th>ลำดับ</th><th>ข้อตกลง</th><th>น้ำหนัก</th><th>ตนเอง</th><th>ประธาน</th></tr></thead><tbody>` +
      S.supportItems.map((it) => `<tr><td>${esc(it.no)}</td><td>${esc(it.title)}</td><td>${esc(it.weight)}</td>
        <td>${C.fmtScore(it.selfScore)}</td><td>${C.fmtScore(it.chairScore)}</td></tr>`).join("") +
      `</tbody></table>`;
  } else {
    S.groups.forEach((g) => {
      const meta = C.GROUPS.find((x) => x.id === g.id);
      const units = C.groupUnits(S.groups, g.id);
      body += `<h3>${esc(meta.title)} ${esc(meta.name)} · ${meta.pct}% · ${C.fmtUnit(units)} / ${meta.cap} หน่วย</h3>
        <table class="data"><thead><tr><th>รหัส</th><th>ภารกิจ</th><th>เกณฑ์</th><th>หน่วย</th><th>ตนเอง</th><th>ประธาน</th></tr></thead><tbody>`;
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
      <ul>${ccList().map((x) => `<li>${esc(x.name)} · ตนเอง ${C.fmtScore(x.self)} · ประธาน ${C.fmtScore(x.chair)}</li>`).join("")}</ul>
      <h3>IDP</h3>
      <ul>${currentIdp().map((x) => `<li>${esc(x.competency)} · ${x.result === "ok" ? "เป็นไปตามที่คาดหวัง" : x.result === "no" ? "ไม่เป็นไปตามที่คาดหวัง" : "-"}</li>`).join("")}</ul>
    </section>`);
}

function render() {
  const root = document.getElementById("app");
  const v = S.loggedIn ? (S.view || "home") : "login";
  const map = {
    login: viewLogin, home: viewHome, period: viewPeriod, profile: viewProfile, rounds: viewRounds,
    formset: viewFormset, modules: viewModules, pa: viewPA, paReport: viewPaReport,
    competency: viewCompetency, ack: viewAck, idp: viewIdp, idpReport: viewIdpReport,
    idpEval: viewIdpEval, idpAck: viewIdpAck, report: viewReport,
    evalHome: viewEvalHome, adminPeople: viewAdminPeople, adminRound: viewAdminRound,
    leave: viewLeave, time: viewTime, help: viewHelp,
    paStaff: viewPaStaff, follow: viewFollow, scoreSum: viewScoreSum, pledge: viewPledge,
    users: viewUsers
  };
  root.innerHTML = (map[v] || viewHome)();
  bind();
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

function bind() {
  document.querySelectorAll("[data-lock]").forEach((b) => {
    b.addEventListener("click", () => toast(b.getAttribute("data-lock")));
  });
  document.querySelectorAll("[data-go]").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-go");
      const focus = b.getAttribute("data-focus");
      if (focus) S.focus = focus;
      if (id === "home") { go("home"); return; }
      if (["period", "profile", "modules", "pa", "paReport", "follow", "scoreSum", "pledge", "ack", "idp", "idpReport", "idpAck", "competency", "paStaff"].includes(id)) {
        if (isRatee() && S.focus !== account().track) S.focus = account().track;
      }
      const mod = currentModules().find((m) => m.id === id);
      if (mod && !moduleAllowed(mod)) { toast("โมดูลนี้ไม่ใช่หน้าที่ของโหมด " + account().roleLabel); return; }
      if (mod && isRatee() && !canOpen(mod) && !["pa", "idp", "report", "competency", "pledge", "follow"].includes(id)) {
        toast("ยังไม่ถึงขั้นตอนนี้ของวงจรที่เลือก"); return;
      }
      go(id);
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
    if (!DB) { toast("ฐานข้อมูลยังไม่พร้อม"); return; }
    let gate = "eval";
    if (S.loginGate === "admin") gate = "admin";
    else if (S.loginGate === "public" && S.loginType === "faculty") gate = "ratee-faculty";
    else if (S.loginGate === "public" && S.loginType === "support") gate = "ratee-support";
    const res = await DB.verify(username, password, gate);
    if (!res.ok) { toast(res.reason); return; }
    S.users = await DB.listUsers();
    await enterUser(res.user);
    toast("เข้าสู่ระบบแล้ว · บันทึกลงฐานข้อมูล");
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

  document.querySelectorAll("[data-add-ag]").forEach((b) => b.addEventListener("click", () => addAgreement(b.dataset.addAg)));
  document.querySelectorAll("[data-del-ag]").forEach((b) => {
    b.addEventListener("click", () => {
      const [g, a] = b.dataset.delAg.split(":");
      removeAgreement(g, a);
    });
  });
  document.querySelectorAll("[data-del-sup]").forEach((b) => {
    b.addEventListener("click", () => {
      if (S.supportItems.length <= 1) { toast("ต้องมีอย่างน้อย 1 ข้อ"); return; }
      S.supportItems = S.supportItems.filter((x) => x.id !== b.dataset.delSup);
      persist(); render();
    });
  });
  const addSup = document.getElementById("btnAddSup");
  if (addSup) addSup.addEventListener("click", () => {
    S.supportItems.push(emptySupportItem(S.supportItems.length + 1));
    persist(); render();
  });
  document.querySelectorAll("[data-pa]").forEach((el) => {
    el.addEventListener("change", () => {
      readPaForm();
      persist();
      const field = el.dataset.pa.split(":")[2];
      if (["criteriaId", "role", "inDb", "withStudent", "amount", "hours", "qty", "weight"].includes(field)) render();
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
  if (imp) imp.addEventListener("click", () => toast("เดโม: กรอกในระบบตามกรณีที่ 2 ของคำแนะนำ PMS"));

  const sr = document.getElementById("btnSaveReport");
  if (sr) sr.addEventListener("click", () => {
    if (track() === "support") readSupportForm(); else readPaForm();
    persist(); toast("บันทึกรายงานผลแล้ว");
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
  const sp = document.getElementById("btnSavePledge");
  if (sp) sp.addEventListener("click", () => {
    S.supportPledge = S.supportPledge || {};
    const t = document.getElementById("pledgeText");
    const r = document.getElementById("pledgeRatee");
    const c = document.getElementById("pledgeChair");
    if (t && isRatee()) S.supportPledge.text = t.value;
    if (r && isRatee()) S.supportPledge.rateeSigned = r.checked;
    if (c && isChair()) S.supportPledge.chairSigned = c.checked;
    persist();
    toast("บันทึกแบบคำมั่น 11 แล้ว");
    render();
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
    if (q.get("modal") === "score") S.modal = "score";
    if (q.get("focus")) S.focus = q.get("focus");
  }
  const h = location.hash.replace("#", "");
  if (h && S.loggedIn) S.view = h;
}

applyQuery();
render();

async function boot() {
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
            const keep = { user: u, users: S.users, loggedIn: true, account: u.id, year: S.year };
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
