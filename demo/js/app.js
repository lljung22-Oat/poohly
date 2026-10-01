const KEY = "mu-pms-demo-v3";
const C = PAScore;

const USER = {
  prefix: "น.ส.",
  name: "พรทิพา เซี่ยงฉิน",
  full: "น.ส.พรทิพา เซี่ยงฉิน",
  username: "porntipa.c",
  position: "อาจารย์",
  faculty: "คณะสังคมศาสตร์และมนุษยศาสตร์",
  dept: "ภาควิชาสังคมศาสตร์",
  staffId: "10101642",
  supervisor: "ประธานกรรมการประเมิน",
  type: "สายวิชาการ"
};

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

function defaultState() {
  return {
    loggedIn: false,
    year: "2570",
    round: "รอบประเมินปีงบประมาณ 2570",
    view: "login",
    paStatus: "draft",
    paReject: "",
    paDisagree: "",
    groups: defaultGroups(),
    ccStatus: "draft",
    cc: C.CC_ITEMS.map((x) => ({ id: x.id, name: x.name, full: x.full, report: "", file: "", self: "", committee: "", chair: "" })),
    fc: C.FC_ITEMS.map((x) => ({ id: x.id, name: x.name, report: "", self: "", committee: "", chair: "", ack: false })),
    fcAck: false,
    strength: "",
    develop: "",
    suggest: "",
    chairSent: false,
    desk: "home",
    idpStatus: "draft",
    idpReject: "",
    idpDisagree: "",
    idp: [{
      id: uid(), competency: "SFC02 ทักษะการวิจัย", behavior: "จัดทำข้อเสนอโครงการวิจัยและตีพิมพ์ผลงาน",
      method: "70", detail: "เป็นนักวิจัยร่วมในโครงการของภาควิชา", start: "2026-10-01", end: "2027-09-30",
      budget: "0", approved: "wait", report: "", file: "", result: ""
    }],
    idpEvalNote: "",
    modal: null
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const s = { ...defaultState(), ...JSON.parse(raw) };
    if (!s.groups || !s.groups.length) s.groups = defaultGroups();
    s.modal = null;
    return s;
  } catch {
    return defaultState();
  }
}

function persist() {
  const copy = { ...S, modal: null };
  localStorage.setItem(KEY, JSON.stringify(copy));
}

let S = load();

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
  S.view = "login";
  persist();
  render();
}

function resetDemo() {
  if (!confirm("ล้างข้อมูลเดโมแล้วเริ่มใหม่?")) return;
  S = defaultState();
  S.loggedIn = true;
  S.view = "home";
  S.desk = "home";
  persist();
  render();
  toast("เริ่มเดโมใหม่แล้ว");
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

function ico(name) {
  const common = 'xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="#3d5a80" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  if (name === "person") return `<svg ${common}><circle cx="24" cy="16" r="7"/><path d="M10 38c2-8 8-12 14-12s12 4 14 12"/></svg>`;
  if (name === "leave") return `<svg ${common}><rect x="10" y="12" width="28" height="24" rx="3"/><path d="M10 20h28M18 8v8M30 8v8"/><circle cx="24" cy="28" r="2.2" fill="#3d5a80" stroke="none"/></svg>`;
  if (name === "clock") return `<svg ${common}><circle cx="24" cy="24" r="14"/><path d="M24 16v9l6 4"/></svg>`;
  if (name === "clip") return `<svg ${common}><rect x="14" y="12" width="20" height="26" rx="3"/><path d="M18 12V9h12v3M18 22h12M18 28h8"/></svg>`;
  if (name === "grad") return `<svg ${common}><path d="M8 20l16-8 16 8-16 8-16-8z"/><path d="M16 24v8c4 3 12 3 16 0v-8"/><path d="M40 20v10"/></svg>`;
  if (name === "target") return `<svg ${common}><circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="7"/><circle cx="24" cy="24" r="2" fill="#c2410c" stroke="#c2410c"/><path d="M24 10v4M38 24h-4M24 38v-4M10 24h4" stroke="#c2410c"/></svg>`;
  return `<svg ${common}><path d="M10 32l8-10 6 6 8-12 8 16H10z"/><path d="M10 36h28"/></svg>`;
}

function flowTabs() {
  const pa = ["period", "profile", "rounds", "formset", "modules", "pa", "paReport", "competency", "ack", "report"].includes(S.view);
  const idp = ["idp", "idpReport", "idpEval", "idpAck"].includes(S.view);
  if (!pa && !idp) return "";
  const items = pa ? [
    ["period", "ปีงบประมาณ"],
    ["profile", "ประวัติ"],
    ["modules", "วงจร PMS"],
    ["pa", "ข้อตกลง PA"],
    ["paReport", "รายงานผล"],
    ["competency", "สมรรถนะ"],
    ["ack", "รับทราบ"]
  ] : [
    ["idp", "จัดทำ IDP"],
    ["idpReport", "รายงาน IDP"],
    ["idpEval", "ประเมิน IDP"],
    ["idpAck", "รับทราบ IDP"]
  ];
  return `<nav class="flow">${items.map(([id, t]) =>
    `<button type="button" class="flow-a ${S.view === id ? "on" : ""}" data-go="${id}">${esc(t)}</button>`
  ).join("")}</nav>`;
}

function paLocked() {
  return ["reported", "committee", "chair", "ack", "disagree"].includes(S.paStatus);
}
function agreeLocked() {
  return !["draft", "back"].includes(S.paStatus);
}
function idpLocked() {
  return ["reported", "eval", "ack", "disagree"].includes(S.idpStatus);
}
function idpAgreeLocked() {
  return !["draft", "back"].includes(S.idpStatus);
}

function stepIndex() {
  if (S.paStatus === "ack") return 5;
  if (S.paStatus === "disagree") return 2;
  if (S.paStatus === "chair") return 3;
  if (S.paStatus === "committee") return 2;
  if (S.paStatus === "reported") return 1;
  if (S.paStatus === "approved") return 0;
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
  const pa = S.paStatus;
  const idp = S.idpStatus;
  if (mod.need === "approved") return ["approved", "reported", "committee", "chair", "ack", "disagree"].includes(pa);
  if (mod.need === "reported") return ["reported", "committee", "chair", "ack", "disagree"].includes(pa);
  if (mod.need === "chair") return ["chair", "ack", "disagree"].includes(pa);
  if (mod.need === "idpApproved") return ["approved", "reported", "eval", "ack", "disagree"].includes(idp);
  if (mod.need === "idpReported") return ["reported", "eval", "ack", "disagree"].includes(idp);
  if (mod.need === "idpEval") return ["eval", "ack", "disagree"].includes(idp);
  return true;
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
      if (kind === "g" && g.id === id && field === "title") { /* group title fixed */ }
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

function addAgreement(gid) {
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
  const g = S.groups.find((x) => x.id === gid);
  if (g.agreements.length <= 1) { toast("ต้องมีข้อตกลงอย่างน้อย 1 ข้อในภาระงานนี้"); return; }
  g.agreements = g.agreements.filter((a) => a.id !== aid);
  persist(); render();
}

function checkWeight() {
  return +C.sumWeight(S.groups).toFixed(2);
}

function saveDraft() {
  readPaForm();
  persist();
  toast("บันทึกฉบับร่างแล้ว");
  render();
}

function requestApprove() {
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
  persist();
  toast("ส่งขออนุมัติแล้ว สถานะเป็นขออนุมัติ ให้ประธานพิจารณาในฟอร์มนี้");
  render();
}

function chairApproveAll() {
  S.paStatus = "approved";
  S.paReject = "";
  forEachTarget((t) => { t.approved = "yes"; });
  persist();
  toast("ประธานอนุมัติข้อตกลงทั้งหมดแล้ว");
  render();
}

function chairReject() {
  const reason = (document.getElementById("rejectReason") || {}).value || S.paReject;
  if (!String(reason).trim()) { toast("กรณีไม่อนุมัติต้องใส่เหตุผล"); return; }
  S.paStatus = "back";
  S.paReject = reason;
  persist();
  toast("ส่งกลับให้แก้ไข");
  render();
}

function submitSelfPA() {
  readPaForm();
  let missing = false;
  forEachTarget((t) => {
    if (!String(t.report || "").trim()) missing = true;
  });
  if (missing) { toast("พิมพ์คำอธิบายรายงานผลให้ครบทุกเป้าหมายก่อนส่ง"); return; }
  if (!confirm("ตรวจคะแนนให้แน่ใจก่อนกดส่ง เพราะส่งแล้วแก้ไขไม่ได้")) return;
  S.paStatus = "reported";
  S.ccStatus = "reported";
  persist();
  toast("ส่งรายงานผลการปฏิบัติงานแล้ว แก้ไขไม่ได้");
  render();
}

function submitCommittee() {
  S.paStatus = "committee";
  persist();
  toast("กรรมการส่งความเห็นให้ประธานแล้ว");
  render();
}

function openScoreDialog() {
  readPaForm();
  S.modal = "score";
  persist();
  render();
}

function sendChairScore() {
  S.strength = (document.getElementById("strength") || {}).value || S.strength;
  S.develop = (document.getElementById("develop") || {}).value || S.develop;
  S.suggest = (document.getElementById("suggest") || {}).value || S.suggest;
  S.paStatus = "chair";
  S.chairSent = true;
  S.modal = null;
  persist();
  toast("ส่งคะแนนแล้ว แก้ไขไม่ได้");
  render();
}

function ackResult(ok) {
  if (ok) {
    S.paStatus = "ack";
    S.paDisagree = "";
    persist();
    toast("รับทราบผลการประเมิน PA และ CC แล้ว");
    render();
    return;
  }
  const reason = (document.getElementById("disagreeReason") || {}).value || "";
  if (!String(reason).trim()) { toast("กรณีไม่เห็นด้วยต้องระบุเหตุผลละเอียดชัดเจน"); return; }
  S.paStatus = "disagree";
  S.paDisagree = reason;
  persist();
  toast("ไม่เห็นด้วย — สถานะ PA และ CC กลับเป็นประธานกรรมการประเมิน");
  render();
}

function saveIdpDraft() {
  readIdp();
  persist();
  toast("บันทึกฉบับร่างแผนพัฒนาแล้ว");
  render();
}

function readIdp() {
  document.querySelectorAll("[data-idp]").forEach((el) => {
    const [id, field] = el.dataset.idp.split(":");
    const it = S.idp.find((x) => x.id === id);
    if (it) it[field] = el.value;
  });
}

function addIdp() {
  if (S.idp.length >= C.IDP_MAX) { toast("พัฒนาประมาณ 1–2 รายการต่อปี"); return; }
  S.idp.push({
    id: uid(), competency: "", behavior: "", method: "70", detail: "",
    start: "", end: "", budget: "0", approved: "wait", report: "", file: "", result: ""
  });
  persist(); render();
}

function removeIdp(id) {
  if (S.idp.length <= 1) { toast("ต้องมีอย่างน้อย 1 รายการ"); return; }
  S.idp = S.idp.filter((x) => x.id !== id);
  persist(); render();
}

function requestIdp() {
  readIdp();
  if (S.idp.some((x) => !x.competency.trim() || !x.behavior.trim() || !x.method)) {
    toast("กรอกสมรรถนะ พฤติกรรมที่คาดหวัง และวิธีการพัฒนาให้ครบ");
    return;
  }
  S.idpStatus = "wait";
  persist();
  toast("ส่งขออนุมัติ IDP แล้ว");
  render();
}

function approveIdp(yes) {
  if (!yes) {
    const reason = (document.getElementById("idpReject") || {}).value || "";
    if (!String(reason).trim()) { toast("ไม่อนุมัติต้องใส่เหตุผล"); return; }
    S.idpStatus = "back";
    S.idpReject = reason;
    persist(); toast("ส่งกลับแก้ IDP"); render(); return;
  }
  S.idpStatus = "approved";
  S.idp.forEach((x) => { x.approved = "yes"; });
  persist(); toast("ประธานอนุมัติ IDP แล้ว"); render();
}

function submitIdpReport() {
  readIdp();
  if (S.idp.some((x) => !String(x.report || "").trim())) {
    toast("พิมพ์รายงานการพัฒนาให้ครบทุกรายการ"); return;
  }
  if (!confirm("ส่งรายงานผล IDP แล้วแก้ไขไม่ได้")) return;
  S.idpStatus = "reported";
  persist(); toast("ส่งรายงานผล IDP แล้ว แก้ไขไม่ได้"); render();
}

function evalIdp(result) {
  S.idp.forEach((x) => { x.result = result; });
  S.idpStatus = "eval";
  persist();
  toast(result === "ok" ? "เป็นไปตามที่คาดหวัง" : "ไม่เป็นไปตามที่คาดหวัง");
  render();
}

function ackIdp(ok) {
  if (ok) {
    S.idpStatus = "ack";
    persist(); toast("รับทราบผล IDP แล้ว"); render(); return;
  }
  const reason = (document.getElementById("idpDisagree") || {}).value || "";
  if (!String(reason).trim()) { toast("ต้องระบุเหตุผล"); return; }
  S.idpStatus = "disagree";
  S.idpDisagree = reason;
  persist(); toast("ไม่เห็นด้วย — สถานะกลับไปที่ประธาน"); render();
}

/* ---------- chrome ---------- */
function chrome(inner) {
  const home = S.view === "home";
  return `
  <div class="app ${home ? "app-home" : ""}">
    <header class="topbar">
      <div class="brand-text">ระบบสารสนเทศเพื่อการบริหารจัดการบุคลากร</div>
      <div class="who">
        <span class="uname">${esc(USER.full)}</span>
        <span class="uline">(${esc(USER.type)})</span>
        <span class="sep">|</span>
        <button type="button" data-go="profile">ข้อมูลส่วนตัว</button>
        <button type="button" id="btnOut">ออกจากระบบ</button>
      </div>
    </header>
    ${home ? "" : `<div class="subbar">
      <button type="button" class="back" data-go="home">← กลับหน้าหลักระบบงาน</button>
      <span class="year-chip">ปีงบประมาณ ${esc(S.year)}</span>
      <button type="button" id="btnReset">เริ่มเดโมใหม่</button>
    </div>`}
    <main class="main ${home ? "main-home" : ""}">${home ? "" : flowTabs()}${inner}</main>
  </div>`;
}

function profileBox() {
  return `
  <div class="profile-grid">
    <b>ชื่อ-นามสกุล</b><span>${esc(USER.full)}</span>
    <b>รหัสบุคลากร</b><span>${esc(USER.staffId)}</span>
    <b>ตำแหน่ง</b><span>${esc(USER.position)} (${esc(USER.type)})</span>
    <b>สังกัด</b><span>${esc(USER.faculty)} · ${esc(USER.dept)}</span>
    <b>ผู้ประเมิน (ผู้บังคับบัญชาชั้นต้น)</b><span>${esc(USER.supervisor)}</span>
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

/* ---------- screens ---------- */
function viewLogin() {
  return `
  <div class="login-wrap">
    <div class="login-head">
      <div class="login-logo">MU</div>
      <h1>มหาวิทยาลัยมหิดล</h1>
      <p>ระบบสารสนเทศเพื่อการบริหารจัดการบุคลากร</p>
    </div>
    <form class="login-box" id="loginForm">
      <h2>เข้าสู่ระบบ</h2>
      <label>รหัสผู้ใช้งาน</label>
      <input name="user" value="porntipa.c" autocomplete="username" />
      <label>รหัสผ่าน</label>
      <input name="pass" type="password" value="demo" autocomplete="current-password" />
      <p class="hint">Internet Account รูปแบบ ชื่อ.นามสกุลอังกฤษ 3 ตัว · เดโมใช้น.ส.พรทิพา เซี่ยงฉิน · ปีงบประมาณ ${esc(S.year)}</p>
      <button class="btn-navy full" type="submit">Log in</button>
    </form>
  </div>`;
}

function viewHome() {
  const cards = [
    { go: "profile", ico: "person", title: "ข้อมูลบุคลากร", sub: "ประวัติและข้อมูลส่วนบุคคล" },
    { go: "leave", ico: "leave", title: "ข้อมูลวันลา", sub: "สถิติและการขออนุมัติวันลา" },
    { go: "time", ico: "clock", title: "ข้อมูลเวลาเข้า-ออกงาน", sub: "ลงเวลาปฏิบัติงานประจำวัน" },
    { go: "paSupport", ico: "clip", title: "PA ประเมินภาระงาน", sub: "(สายสนับสนุน / บุคลากรทั่วไป)" },
    { go: "period", ico: "grad", title: "PA ภาระงานอาจารย์", sub: "(สายวิชาการ / กรอบแบบฟอร์ม Matrix)", cream: true },
    { go: "competency", ico: "target", title: "Functional Competency", sub: "ประเมินสมรรถนะเฉพาะงาน", linkish: true },
    { go: "idp", ico: "chart", title: "IDP", sub: "แผนพัฒนารายบุคคล" }
  ];
  return chrome(`
    <div class="dash">
      <h1>หน้าหลักระบบงาน (Dashboard)</h1>
      <div class="year-pick">
        <label for="yearSel">ปีงบประมาณ</label>
        <select id="yearSel">${yearOptions()}</select>
        <button type="button" id="btnReset">เริ่มเดโมใหม่</button>
      </div>
      <div class="dash-grid">
        ${cards.map((c) => `
          <button class="dash-card${c.cream ? " cream" : ""}" type="button" data-go="${c.go}">
            <div class="ico">${ico(c.ico)}</div>
            <b>${esc(c.title)}</b>
            <small class="${c.linkish ? "linkish" : ""}">${esc(c.sub)}</small>
          </button>`).join("")}
      </div>
    </div>`);
}

function viewSoon(title, sub) {
  return chrome(`
    <p class="crumb">หน้าหลักระบบงาน</p>
    <h1 class="page-title">${esc(title)}</h1>
    <div class="card">
      <p>${esc(sub)}</p>
      <p class="hint">โมดูลนี้เป็นส่วนของระบบบุคลากรตามหน้าหลัก · เดโมคณะสังคมฯ สายวิชาการใช้งานจริงที่การ์ด <b>PA ภาระงานอาจารย์</b>, Functional Competency และ IDP</p>
      <button class="btn-navy" type="button" data-go="home">กลับหน้าหลัก</button>
    </div>`);
}

function viewLeave() {
  return viewSoon("ข้อมูลวันลา", "สถิติและการขออนุมัติวันลา");
}
function viewTime() {
  return viewSoon("ข้อมูลเวลาเข้า-ออกงาน", "ลงเวลาปฏิบัติงานประจำวัน");
}
function viewPaSupport() {
  return viewSoon("PA ประเมินภาระงาน (สายสนับสนุน)", "ผู้ใช้เดโมนี้เป็นสายวิชาการ จึงใช้การ์ด PA ภาระงานอาจารย์ (กรอบแบบฟอร์ม Matrix) ตามประกาศคณะ");
}

function viewEvalHome() {
  return chrome(`
    <p class="crumb">ผู้ประเมิน · รายชื่อ</p>
    <h1 class="page-title">ผู้รับการประเมินในความดูแล</h1>
    <div class="card">
      <table class="data">
        <thead><tr><th>ชื่อ</th><th>ตำแหน่ง</th><th>สถานะ PA</th><th>Action</th></tr></thead>
        <tbody><tr>
          <td>${esc(USER.full)}</td>
          <td>${esc(USER.position)}</td>
          <td>${statusPill(S.paStatus)}</td>
          <td>
            <button class="act" data-go="pa">อนุมัติข้อตกลง</button>
            <button class="act" data-go="competency">ให้คะแนน PA/CC</button>
            <button class="act" data-go="idp">อนุมัติ IDP</button>
            <button class="act" data-go="idpEval">ประเมิน IDP</button>
          </td>
        </tr></tbody>
      </table>
    </div>`);
}

function viewAdminHome() {
  return chrome(`
    <p class="crumb">Admin</p>
    <h1 class="page-title">หน้าที่ผู้ดูแลระบบ</h1>
    <div class="two-admin">
      <div class="card">
        <h3>Admin มหาวิทยาลัย</h3>
        <ul>
          <li>นำเข้าโครงสร้างส่วนงาน บุคลากร ผู้บังคับบัญชา ผู้บริหาร</li>
          <li>ให้คำปรึกษาการใช้ระบบ</li>
        </ul>
        <button class="btn-navy" type="button" data-go="adminPeople">เปิดโครงสร้าง / บุคลากร</button>
      </div>
      <div class="card">
        <h3>Admin ส่วนงาน</h3>
        <ul>
          <li>สร้างรอบและปฏิทิน</li>
          <li>ตรวจชุดประเมิน PA IDP CC FC MC ให้ครบตามตำแหน่ง</li>
          <li>นำเข้ากรรมการ · ติดตามตามปฏิทิน</li>
        </ul>
        <button class="btn-navy" type="button" data-go="adminRound">เปิดรอบและปฏิทิน</button>
      </div>
    </div>`);
}

function viewAdminPeople() {
  return chrome(`
    <p class="crumb">Admin · โครงสร้าง</p>
    <h1 class="page-title">โครงสร้างส่วนงานและบุคลากร (เดโม)</h1>
    <div class="card">
      <table class="data">
        <thead><tr><th>รหัส</th><th>ชื่อ</th><th>ตำแหน่ง</th><th>สังกัด</th><th>ผู้บังคับบัญชา</th><th>ชุดประเมิน</th></tr></thead>
        <tbody>
          <tr><td>${esc(USER.staffId)}</td><td>${esc(USER.full)}</td><td>อาจารย์</td><td>${esc(USER.faculty)}</td><td>${esc(USER.supervisor)}</td><td>PA, CC, IDP, FC</td></tr>
        </tbody>
      </table>
      <p class="hint">ของจริงนำเข้าจากไฟล์ที่มหาวิทยาลัยกำหนด · เดโมโชว์คนเดียวในคณะสังคมฯ</p>
    </div>`);
}

function viewAdminRound() {
  return chrome(`
    <p class="crumb">Admin · รอบและปฏิทิน</p>
    <h1 class="page-title">รอบประเมินและปฏิทิน</h1>
    <div class="card">
      <table class="data">
        <thead><tr><th>กิจกรรม</th><th>เริ่ม</th><th>สิ้นสุด</th></tr></thead>
        <tbody>
          <tr><td>จัดทำข้อตกลง PA</td><td>1 ต.ค. 2569</td><td>31 ต.ค. 2569</td></tr>
          <tr><td>รายงานผลและประเมินตนเอง</td><td>1 ก.ย. 2570</td><td>15 ก.ย. 2570</td></tr>
          <tr><td>กรรมการ / ประธานให้คะแนน</td><td>16 ก.ย. 2570</td><td>30 ก.ย. 2570</td></tr>
          <tr><td>รับทราบผล</td><td>1 ต.ค. 2570</td><td>15 ต.ค. 2570</td></tr>
          <tr><td>จัดทำ IDP</td><td>16 ต.ค. 2570</td><td>31 ต.ค. 2570</td></tr>
        </tbody>
      </table>
      <p class="hint">ข้าราชการ/ลูกจ้าง 2 รอบต่อปี · พนักงานมหาวิทยาลัย 1 รอบ</p>
    </div>`);
}

function viewPeriod() {
  return chrome(`
    <p class="crumb">เลือกปีงบประมาณ / รอบการประเมิน</p>
    <h1 class="page-title">ปีงบประมาณและรอบการประเมิน</h1>
    <div class="card">
      <label><b>ปีงบประมาณ</b></label>
      <select id="yearSel">${yearOptions()}</select>
      <p class="hint">ใช้ปีงบประมาณ 2570 (ค่าเริ่มต้น) หรือ 2569 · ข้าราชการ/ลูกจ้าง มี 2 รอบต่อปี · พนักงานมหาวิทยาลัย/พนักงานส่วนงาน มี 1 รอบ</p>
      <button class="btn-navy" type="button" id="goProfile" style="margin-top:16px">ถัดไป · ยืนยันประวัติ</button>
    </div>`);
}

function viewProfile() {
  return chrome(`
    <p class="crumb">ยืนยันประวัติส่วนตัว</p>
    <h1 class="page-title">ข้อมูลส่วนบุคคล</h1>
    <div class="card">${profileBox()}
      <p class="hint">ตรวจชื่อ ตำแหน่ง สังกัดให้ถูกต้องก่อนจัดทำข้อตกลง</p>
      <button class="btn-navy" type="button" data-go="modules" style="margin-top:12px">ยืนยันและเข้าวงจรประเมิน</button>
    </div>`);
}

function viewRounds() {
  return chrome(`
    <p class="crumb">KPI / รอบประเมิน</p>
    <h1 class="page-title">รอบประเมิน</h1>
    <input class="search" placeholder="ค้นหา" />
    <div class="card">
      <p>รายการทั้งหมด 1</p>
      <table class="data">
        <thead><tr><th>Action</th><th>พนักงานมหาวิทยาลัย/ส่วนงาน</th><th>สถานะรอบการประเมิน</th><th>แบบ</th></tr></thead>
        <tbody><tr>
          <td><button class="act" data-go="formset">รายละเอียด</button>
              <button class="act" data-go="modules">รอบประเมิน</button></td>
          <td>${esc(S.round)} · ${esc(USER.faculty)}</td>
          <td><span class="pill pill-pink">กำลังดำเนินการ</span></td>
          <td>พนักงานมหาวิทยาลัย</td>
        </tr></tbody>
      </table>
    </div>`);
}

function viewFormset() {
  const tot = C.totalScore(S.groups, S.cc, true);
  return chrome(`
    <p class="crumb">KPI / รอบการประเมิน / ชุดประเมิน</p>
    <h1 class="page-title">${esc(S.round)} - ชุดประเมิน</h1>
    ${profileBox()}
    <div class="toolbar">
      <button class="btn-ghost" type="button">Export</button>
      <button class="btn-navy" type="button">การแต่งตั้งกรรมการ</button>
    </div>
    <input class="search" placeholder="ค้นหา" />
    <div class="card">
      <p>รายการทั้งหมด 4</p>
      <table class="data">
        <thead><tr><th>Action</th><th>รหัสผู้ถูกประเมิน</th><th>ชื่อผู้ถูกประเมิน</th><th>ชื่อแบบประเมิน</th><th>แบบประเมิน</th></tr></thead>
        <tbody>
          <tr>
            <td><button class="act" data-go="pa">กำหนดตัวชี้วัด</button>
                <button class="act">กำหนดกรรมการประเมิน</button>
                <button class="act" data-go="paReport">ประเมินผล</button></td>
            <td>${esc(USER.staffId)}</td><td>${esc(USER.full)}</td>
            <td>แบบประเมินข้อตกลง PA</td><td>PA</td>
          </tr>
          <tr>
            <td><button class="act" data-go="idp">กำหนดตัวชี้วัด</button>
                <button class="act">กำหนดกรรมการประเมิน</button>
                <button class="act" data-go="idpReport">ประเมินผล</button></td>
            <td>${esc(USER.staffId)}</td><td>${esc(USER.full)}</td>
            <td>แบบแผนพัฒนาตนเอง</td><td>IDP</td>
          </tr>
          <tr>
            <td><button class="act" data-go="competency">กำหนดตัวชี้วัด</button>
                <button class="act">กำหนดกรรมการประเมิน</button>
                <button class="act" data-go="competency">ประเมินผล</button></td>
            <td>${esc(USER.staffId)}</td><td>${esc(USER.full)}</td>
            <td>แบบประเมินสมรรถนะหลัก</td><td>CC</td>
          </tr>
          <tr>
            <td><button class="act" data-go="competency">กำหนดตัวชี้วัด</button>
                <button class="act">กำหนดกรรมการประเมิน</button>
                <button class="act" data-go="competency">ประเมินผล</button></td>
            <td>${esc(USER.staffId)}</td><td>${esc(USER.full)}</td>
            <td>แบบประเมินสมรรถนะตามสายอาชีพ</td><td>FC</td>
          </tr>
        </tbody>
      </table>
      <p style="margin:12px 0 0">ผลการประเมิน : PA ${C.fmtScore(tot.pa)} คะแนน , CC ${C.fmtScore(tot.cc)} คะแนน , รวม ${C.fmtScore(tot.total)} คะแนน
        · ${statusPill(S.paStatus)}</p>
    </div>`);
}

function viewModules() {
  const cards = MODULES.map((m, i) => {
    const dis = canOpen(m) ? "" : "disabled";
    return `<button class="mod" type="button" data-go="${m.id}" ${dis}>
      ${esc(m.title)}${m.sub ? `<small>${esc(m.sub)}</small>` : ""}
    </button>`;
  }).join("");
  return chrome(`
    <div class="pms-home">
      <div class="left">
        <h1>PA</h1>
        <p>ภาระงานอาจารย์ · วงจร PMS</p>
        <p class="hint" style="margin-top:18px">${esc(USER.full)} · ${esc(USER.position)}<br>${esc(USER.faculty)}<br>ปีงบประมาณ ${esc(S.year)}</p>
        <p>PA ${statusPill(S.paStatus)} · IDP ${statusPill(S.idpStatus)}</p>
      </div>
      <div class="mods">${cards}</div>
    </div>
    <div class="card">
      <h3>ชุดประเมินของรอบปีงบประมาณ ${esc(S.year)}</h3>
      <p>วงจร 9 โมดูลอยู่ในการ์ด PA ภาระงานอาจารย์ ไม่ปนกับหน้าหลักระบบงาน</p>
      <button class="btn-navy" type="button" data-go="formset">เปิดชุดประเมิน</button>
      <button class="btn-ghost" type="button" data-go="evalHome">หน้าที่ผู้ประเมิน</button>
      <button class="btn-ghost" type="button" data-go="adminHome">หน้าที่ผู้ดูแลระบบ</button>
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
    html += `<label style="display:flex;gap:6px;align-items:center;margin-top:6px;font-weight:700"><input type="checkbox" data-pa="t:${t.id}:inDb" ${t.inDb ? "checked" : ""} ${dis}/> ปรากฏในฐานข้อมูลแล้ว</label>`;
    html += `<label style="display:flex;gap:6px;align-items:center;font-weight:700"><input type="checkbox" data-pa="t:${t.id}:withStudent" ${t.withStudent ? "checked" : ""} ${dis}/> ตีพิมพ์ร่วมกับนักศึกษา</label>`;
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
  const lock = agreeLocked();
  const w = checkWeight();
  const wcls = w === 100 ? "" : "warn";
  const rows = [];
  S.groups.forEach((g) => {
    const meta = C.GROUPS.find((x) => x.id === g.id);
    const units = C.groupUnits(S.groups, g.id);
    rows.push(`<tr class="g"><td></td><td>${esc(meta.title)}</td>
      <td colspan="6">${esc(meta.name)} · น้ำหนักตามประกาศ ${meta.pct}% (เพดาน ${meta.cap} หน่วย) · ได้ ${C.fmtUnit(units)} หน่วย</td>
      <td>${lock ? "" : `<button class="iconbtn add" type="button" data-add-ag="${g.id}">+</button>`}</td></tr>`);
    g.agreements.forEach((a) => {
      rows.push(`<tr class="a"><td>${lock ? "" : `<button class="iconbtn" type="button" data-del-ag="${g.id}:${a.id}">−</button>`}</td>
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
              <div style="margin-top:6px">${extraFields(t, g, lock)}
                ${cal.blocked === "student" ? `<div class="warn-box">ผลงานร่วมนักศึกษาไม่นับในยุทธศาสตร์</div>` : ""}
                ${cal.blocked === "db" ? `<div class="warn-box">ต้องปรากฏในฐานข้อมูลก่อนจึงคิดหน่วย</div>` : ""}
              </div>
            </td>
            <td><select data-pa="t:${t.id}:kpiType" ${lock ? "disabled" : ""}>${C.KPI_TYPES.map((x) =>
              `<option value="${x.id}" ${t.kpiType === x.id ? "selected" : ""}>${esc(x.label)}</option>`).join("")}</select></td>
            <td><input type="number" data-pa="t:${t.id}:weight" value="${esc(t.weight)}" ${lock ? "disabled" : ""} /></td>
            <td><select data-pa="t:${t.id}:criteriaId" ${lock ? "disabled" : ""}>${criteriaOptions(g.id, t.criteriaId)}</select>
              <div class="hint">เกณฑ์ 5 ระดับ: สูงกว่า 9–10 · ตามเป้า 7–8 · ใกล้เคียง 5–6 · ต่ำกว่า 3–4 · ต่ำกว่ามาก 0–2</div></td>
            <td><select data-pa="t:${t.id}:approved" ${S.paStatus === "wait" ? "" : "disabled"}>
              <option value="wait" ${t.approved === "wait" ? "selected" : ""}>รออนุมัติ</option>
              <option value="yes" ${t.approved === "yes" ? "selected" : ""}>อนุมัติ</option>
              <option value="no" ${t.approved === "no" ? "selected" : ""}>ไม่อนุมัติ</option>
            </select></td>
            <td>
              <div class="auto">${C.fmtUnit(cal.units)} หน่วย</div>
              <div class="auto">คะแนน ${C.fmtScore(self)}</div>
            </td>
            <td><input data-pa="t:${t.id}:approveReason" value="${esc(t.approveReason)}" placeholder="ความคิดเห็นผู้อนุมัติ" ${S.paStatus === "wait" ? "" : "disabled"} /></td>
          </tr>`);
        });
      });
    });
  });

  const chairBar = S.paStatus === "wait" ? `
    <div class="card">
      <h3>ประธานพิจารณาข้อตกลง</h3>
      <p>ตรวจรวมร้อยละค่าน้ำหนัก แล้วอนุมัติทีละข้อ หรือกดอนุมัติทั้งหมด · ถ้าจะส่งกลับแก้ เปลี่ยนเป็นไม่อนุมัติแล้วใส่เหตุผล</p>
      <textarea id="rejectReason" placeholder="เหตุผลกรณีไม่อนุมัติ">${esc(S.paReject)}</textarea>
      <div class="footbar">
        <button class="btn-ok" type="button" id="btnApproveAll">อนุมัติทั้งหมด</button>
        <button class="btn-danger" type="button" id="btnReject">ไม่อนุมัติ / ส่งกลับ</button>
      </div>
    </div>` : "";

  return chrome(`
    <p class="crumb">ชุดประเมิน / แบบประเมินข้อตกลง PA</p>
    <div class="toolbar">
      <button class="btn-ghost" type="button" id="btnImport">Import Excel ชุดชี้วัด</button>
      <button class="btn-ghost" type="button">นำเข้ารอบประเมินก่อนหน้า</button>
    </div>
    <div class="pa-banner">
      <div>
        <h2>Performance Agreement (PA)</h2>
        <p class="sub">การประเมินผลการปฏิบัติงาน · ${statusPill(S.paStatus)}</p>
      </div>
      <div class="weight-box ${wcls}">รวมร้อยละ (ค่าน้ำหนัก) ของตัวชี้วัด : ${w}</div>
    </div>
    ${S.paStatus === "back" ? `<div class="warn-box">ส่งกลับแก้ไข: ${esc(S.paReject)}</div>` : ""}
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
      <button class="btn-navy" type="button" id="btnSave" ${lock ? "disabled" : ""}>บันทึกฉบับร่าง</button>
      <button class="btn-ghost" type="button" data-go="modules">ยกเลิก</button>
      <button class="btn-navy" type="button" id="btnAsk" ${lock ? "disabled" : ""}>ขออนุมัติ</button>
    </div>
    <p class="hint">ช่องหน่วยภาระงานและคะแนนประเมินตนเองคำนวณอัตโนมัติจากประกาศคณะฯ พ.ศ. 2568 สายวิชาการ (ฐาน 1,820 หน่วย · PA 80 + CC 20) · ปีงบประมาณ ${esc(S.year)}</p>
  `);
}

function viewPaReport() {
  if (!canOpen(MODULES[1])) {
    return chrome(`<div class="warn-box">รายงานผลได้เมื่อประธานอนุมัติข้อตกลงแล้ว</div>
      <button class="btn-navy" data-go="pa">ไปจัดทำข้อตกลง</button>`);
  }
  const lock = paLocked();
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
    ${lock ? `<div class="lock-note">ส่งรายงานผลแล้วแก้ไขไม่ได้</div>` : ""}
    <div class="pa-wrap"><table class="pa">
      <thead><tr><th>เป้าหมาย</th><th>ภารกิจ</th><th>หน่วยภาระงาน</th><th>ประเมินตนเอง (0–10)</th><th>เกณฑ์</th><th>รายงานผล / หลักฐาน</th></tr></thead>
      <tbody>${rows.join("")}</tbody>
    </table></div>
    <div class="footbar">
      <button class="btn-navy" type="button" id="btnSaveReport" ${lock ? "disabled" : ""}>บันทึก</button>
      <button class="btn-navy" type="button" id="btnSendReport" ${lock ? "disabled" : ""}>ส่งการประเมิน</button>
      <button class="btn-ghost" data-go="competency">ไปประเมินสมรรถนะ</button>
    </div>`);
}

function viewCompetency() {
  const lock = ["chair", "ack"].includes(S.paStatus);
  const canCommittee = ["reported", "committee", "chair", "ack", "disagree"].includes(S.paStatus);
  const canChair = ["committee", "chair", "ack", "disagree"].includes(S.paStatus) || S.paStatus === "reported";
  const ccRows = S.cc.map((it, i) => `
    <tr>
      <td><b>${i + 1}. ${esc(it.name)}</b><div class="hint">${esc(it.full)}</div></td>
      <td><textarea data-cc="${it.id}:report" ${lock ? "disabled" : ""} placeholder="รายงานผล">${esc(it.report)}</textarea></td>
      <td>0–10 ตามพฤติกรรม</td>
      <td><input type="number" min="0" max="10" data-cc="${it.id}:self" value="${esc(it.self)}" ${S.paStatus === "reported" && !lock ? "" : "disabled"} /></td>
      <td><input type="number" min="0" max="10" data-cc="${it.id}:committee" value="${esc(it.committee)}" ${canCommittee && !lock ? "" : "disabled"} placeholder="ความเห็น/ตัวเลข" /></td>
      <td><input type="number" min="0" max="10" data-cc="${it.id}:chair" value="${esc(it.chair)}" ${canChair && !lock ? "" : "disabled"} /></td>
      <td class="auto">${C.fmtScore(it.chair !== "" ? it.chair : it.self)}</td>
    </tr>`).join("");
  const fcRows = S.fc.map((it) => `
    <tr>
      <td><b>${esc(it.name)}</b></td>
      <td><textarea data-fc="${it.id}:report" ${lock ? "disabled" : ""}>${esc(it.report)}</textarea></td>
      <td><input type="number" min="0" max="10" data-fc="${it.id}:self" value="${esc(it.self)}" ${lock ? "disabled" : ""} /></td>
      <td><input type="number" min="0" max="10" data-fc="${it.id}:committee" value="${esc(it.committee)}" ${canCommittee && !lock ? "" : "disabled"} /></td>
      <td><input type="number" min="0" max="10" data-fc="${it.id}:chair" value="${esc(it.chair)}" ${canChair && !lock ? "" : "disabled"} /></td>
    </tr>`).join("");

  const tot = C.totalScore(S.groups, S.cc, true);
  return chrome(`
    <p class="crumb">แบบประเมินสมรรถนะ / ประเมินผลงาน</p>
    <h1 class="page-title">ประเมินผลงาน และประเมินสมรรถนะ</h1>
    ${stepperHtml()}
    <div class="card">
      <h3>สมรรถนะหลัก (Core Competency) · รวมน้ำหนัก (ร้อยละ) 700 ตามจอต้นฉบับ · คิดคะแนน (รวม÷70)×20</h3>
      <div class="pa-wrap"><table class="pa" style="min-width:1100px">
        <thead><tr>
          <th>สมรรถนะหลัก (Core Competency)</th><th>ผลการดำเนินงาน</th><th>เกณฑ์การประเมิน</th>
          <th>ประเมินตนเอง</th><th>ผลการประเมินกรรมการ</th><th>ผลการประเมินประธาน</th><th>ผลการประเมิน</th>
        </tr></thead>
        <tbody>${ccRows}</tbody>
      </table></div>
    </div>
    <div class="card">
      <h3>สมรรถนะตามสายอาชีพ (Functional Competency) ของอาจารย์ · ไม่รวมใน PA 80+CC 20 · รับทราบแยก</h3>
      <div class="pa-wrap"><table class="pa" style="min-width:900px">
        <thead><tr><th>รายการ</th><th>รายงานผล</th><th>ตนเอง</th><th>กรรมการ</th><th>ประธาน</th></tr></thead>
        <tbody>${fcRows}</tbody>
      </table></div>
    </div>
    <div class="card">
      <h3>คะแนนผลงาน (PA) ที่ประธานให้รายเป้าหมาย</h3>
      <div class="pa-wrap"><table class="pa" style="min-width:900px">
        <thead><tr><th>เป้าหมาย</th><th>ตนเอง</th><th>กรรมการ (ความเห็น)</th><th>ประธาน (0–10)</th></tr></thead>
        <tbody>${(() => {
          let h = "";
          forEachTarget((t, g) => {
            const self = C.effectiveScore(t, g.id);
            h += `<tr><td>${esc(t.code)} ${esc(t.title)}</td>
              <td>${C.fmtScore(self)}</td>
              <td><input data-pa="t:${t.id}:committeeComment" value="${esc(t.committeeComment)}" ${canCommittee && !lock ? "" : "disabled"} /></td>
              <td><input type="number" min="0" max="10" data-pa="t:${t.id}:chairScore" value="${esc(t.chairScore)}" ${canChair && !lock ? "" : "disabled"} /></td></tr>`;
          });
          return h;
        })()}</tbody>
      </table></div>
    </div>
    <p>ผลการประเมินขณะนี้ PA ${C.fmtScore(tot.pa)} + CC ${C.fmtScore(tot.cc)} = <b>${C.fmtScore(tot.total)}</b> (${esc(tot.level)})</p>
    <div class="footbar">
      <button class="btn-navy" type="button" id="btnSaveComp">บันทึก</button>
      <button class="btn-ghost" type="button" id="btnCommittee" ${S.paStatus === "reported" ? "" : "disabled"}>กรรมการส่งให้ประธาน</button>
      <button class="btn-navy" type="button" id="btnCheckScore" ${["reported","committee","disagree"].includes(S.paStatus) ? "" : "disabled"}>ตรวจสอบคะแนน</button>
      <button class="btn-ghost" data-go="formset">ยกเลิก</button>
    </div>
    ${S.modal === "score" ? scoreModal(tot) : ""}
  `);
}

function scoreModal(tot) {
  const lock = S.chairSent || S.paStatus === "chair" || S.paStatus === "ack";
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
    <textarea id="strength" ${lock ? "disabled" : ""}>${esc(S.strength)}</textarea>
    <label>ข้อควรพัฒนา</label>
    <textarea id="develop" ${lock ? "disabled" : ""}>${esc(S.develop)}</textarea>
    <label>ข้อเสนอแนะของผู้บังคับบัญชาชั้นต้น</label>
    <textarea id="suggest" ${lock ? "disabled" : ""}>${esc(S.suggest)}</textarea>
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
  const tot = C.totalScore(S.groups, S.cc, true);
  const locked = S.paStatus === "ack";
  return chrome(`
    <p class="crumb">แจ้งผลและรับทราบ</p>
    <h1 class="page-title">แจ้งผลและรับทราบผลการประเมินการปฏิบัติงาน</h1>
    ${stepperHtml()}
    ${S.paStatus === "disagree" ? `<div class="warn-box">เหตุผลพนักงานไม่ยินยอม : ${esc(S.paDisagree)}</div>` : ""}
    ${profileBox()}
    <div class="card">
      <h3>สรุปคะแนน</h3>
      <p>PA ${C.fmtScore(tot.pa)} + CC ${C.fmtScore(tot.cc)} = <b>${C.fmtScore(tot.total)}</b> ระดับ ${esc(tot.level)}</p>
      <p>จุดเด่น: ${esc(S.strength) || "-"}</p>
      <p>ข้อควรพัฒนา: ${esc(S.develop) || "-"}</p>
      <p>ข้อเสนอแนะ: ${esc(S.suggest) || "-"}</p>
      <p class="hint">คลิกรับทราบในแบบ PA หรือ CC = รับทราบทั้งสองแบบพร้อมกัน · FC รับทราบแยก</p>
    </div>
    <div class="card">
      <label>กรณีไม่เห็นด้วย ต้องระบุเหตุผลละเอียดชัดเจน</label>
      <textarea id="disagreeReason" ${locked ? "disabled" : ""}>${esc(S.paDisagree)}</textarea>
      <div class="footbar">
        <button class="btn-ok" type="button" id="btnAck" ${locked ? "disabled" : ""}>รับทราบ</button>
        <button class="btn-danger" type="button" id="btnDisagree" ${locked ? "disabled" : ""}>ไม่เห็นด้วย</button>
        <label style="display:flex;gap:8px;align-items:center;font-weight:700">
          <input type="checkbox" id="fcAck" ${S.fcAck ? "checked" : ""} /> รับทราบผล FC แยก
        </label>
      </div>
    </div>`);
}

function viewIdp() {
  const lock = idpAgreeLocked();
  const rows = S.idp.map((it) => `
    <tr>
      <td><input data-idp="${it.id}:competency" value="${esc(it.competency)}" ${lock ? "disabled" : ""} placeholder="ระบุสมรรถนะ/ทักษะ" /></td>
      <td><input data-idp="${it.id}:behavior" value="${esc(it.behavior)}" ${lock ? "disabled" : ""} placeholder="พฤติกรรม/ผลลัพธ์ที่คาดหวัง" /></td>
      <td><select data-idp="${it.id}:method" ${lock ? "disabled" : ""}>${C.IDP_METHODS.map((m) =>
        `<option value="${m.id}" ${it.method === m.id ? "selected" : ""}>${esc(m.label)}</option>`).join("")}</select></td>
      <td><input data-idp="${it.id}:detail" value="${esc(it.detail)}" ${lock ? "disabled" : ""} /></td>
      <td><input type="date" data-idp="${it.id}:start" value="${esc(it.start)}" ${lock ? "disabled" : ""} /></td>
      <td><input type="date" data-idp="${it.id}:end" value="${esc(it.end)}" ${lock ? "disabled" : ""} /></td>
      <td><input type="number" data-idp="${it.id}:budget" value="${esc(it.budget)}" ${lock ? "disabled" : ""} /></td>
      <td>${lock ? "" : `<button class="iconbtn" data-del-idp="${it.id}">ลบ</button>`}</td>
    </tr>`).join("");
  return chrome(`
    <p class="crumb">ชุดประเมิน / แบบแผนพัฒนาตนเอง</p>
    <div class="pa-banner">
      <div>
        <h2>Individual Development Plan (IDP)</h2>
        <p class="sub">แผนพัฒนารายบุคคล · ${statusPill(S.idpStatus)}</p>
      </div>
      ${lock ? "" : `<button class="btn-teal" type="button" id="btnAddIdp">กำหนดตัวชี้วัดสมรรถนะ</button>`}
    </div>
    <div class="card">
      <p>คำชี้แจง: ให้ผู้รับการพัฒนาระบุ (1) สมรรถนะและหรือทักษะที่ท่านต้องการพัฒนา 1–2 รายการ (2) พฤติกรรม/ผลลัพธ์ที่คาดหวัง (3) วิธีการพัฒนา (4) ระยะเวลา และ (5) งบประมาณ จากที่ได้ตกลงร่วมกับผู้บังคับบัญชาชั้นต้น</p>
    </div>
    ${S.idpStatus === "back" ? `<div class="warn-box">ส่งกลับแก้ไข: ${esc(S.idpReject)}</div>` : ""}
    <div class="pa-wrap"><table class="pa" style="min-width:1200px">
      <thead><tr>
        <th>สมรรถนะ/ทักษะที่จะได้รับการพัฒนา</th><th>พฤติกรรม / ผลลัพธ์ที่คาดหวัง</th><th>วิธีการพัฒนา</th>
        <th>รายละเอียด</th><th>ระยะเวลา (เริ่มต้น)</th><th>ระยะเวลา (สิ้นสุด)</th><th>งบประมาณ</th><th>จัดการ</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${S.idpStatus === "wait" ? `<div class="card">
      <h3>ประธานอนุมัติ IDP</h3>
      <textarea id="idpReject" placeholder="เหตุผลกรณีไม่อนุมัติ">${esc(S.idpReject)}</textarea>
      <div class="footbar">
        <button class="btn-ok" type="button" id="btnIdpYes">อนุมัติทั้งหมด</button>
        <button class="btn-danger" type="button" id="btnIdpNo">ไม่อนุมัติ</button>
      </div>
    </div>` : ""}
    <div class="footbar">
      <button class="btn-navy" type="button" id="btnIdpDraft" ${lock ? "disabled" : ""}>บันทึกฉบับร่าง</button>
      <button class="btn-ghost" data-go="formset">ยกเลิก</button>
      <button class="btn-navy" type="button" id="btnIdpAsk" ${lock ? "disabled" : ""}>ขออนุมัติ</button>
    </div>`);
}

function viewIdpReport() {
  if (!canOpen(MODULES[5])) {
    return chrome(`<div class="warn-box">รายงานผล IDP ได้เมื่อประธานอนุมัติแผนแล้ว</div>
      <button class="btn-navy" data-go="idp">ไปจัดทำ IDP</button>`);
  }
  const lock = idpLocked();
  const rows = S.idp.map((it) => `
    <tr>
      <td>${esc(it.competency)}</td>
      <td>${esc(it.behavior)}</td>
      <td><textarea data-idp="${it.id}:report" ${lock ? "disabled" : ""}>${esc(it.report)}</textarea>
        <input data-idp="${it.id}:file" value="${esc(it.file)}" placeholder="ไฟล์หลักฐาน" ${lock ? "disabled" : ""} /></td>
    </tr>`).join("");
  return chrome(`
    <h1 class="page-title">รายงานผลการพัฒนารายบุคคล (IDP)</h1>
    ${lock ? `<div class="lock-note">ส่งรายงานผลแล้วแก้ไขไม่ได้</div>` : ""}
    <div class="pa-wrap"><table class="pa">
      <thead><tr><th>สมรรถนะ</th><th>ผลลัพธ์ที่คาดหวัง</th><th>รายงานการพัฒนา</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="footbar">
      <button class="btn-navy" type="button" id="btnIdpSaveR" ${lock ? "disabled" : ""}>บันทึก</button>
      <button class="btn-navy" type="button" id="btnIdpSendR" ${lock ? "disabled" : ""}>ส่งการประเมิน</button>
    </div>`);
}

function viewIdpEval() {
  if (!canOpen(MODULES[6])) {
    return chrome(`<div class="warn-box">ประเมิน IDP ได้เมื่อผู้รับการประเมินส่งรายงานผลแล้ว</div>`);
  }
  const lock = ["eval", "ack"].includes(S.idpStatus);
  return chrome(`
    <h1 class="page-title">ประเมินผลการพัฒนารายบุคคล (IDP)</h1>
    <p>ผลที่ประธานให้เป็นข้อความ <b>เป็นไปตามที่คาดหวัง</b> หรือ <b>ไม่เป็นไปตามที่คาดหวัง</b></p>
    ${S.idp.map((it) => `<div class="card"><h3>${esc(it.competency)}</h3><p>${esc(it.report) || "-"}</p>
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
  const lock = S.idpStatus === "ack";
  return chrome(`
    <h1 class="page-title">แจ้งผลและรับทราบผลการพัฒนารายบุคคล (IDP)</h1>
    ${S.idpStatus === "disagree" ? `<div class="warn-box">${esc(S.idpDisagree)}</div>` : ""}
    ${S.idp.map((it) => `<div class="card"><h3>${esc(it.competency)}</h3>
      <p>${it.result === "ok" ? "เป็นไปตามที่คาดหวัง" : it.result === "no" ? "ไม่เป็นไปตามที่คาดหวัง" : "-"}</p></div>`).join("")}
    <textarea id="idpDisagree" ${lock ? "disabled" : ""} placeholder="เหตุผลกรณีไม่เห็นด้วย">${esc(S.idpDisagree)}</textarea>
    <div class="footbar">
      <button class="btn-ok" type="button" id="btnIdpAck" ${lock ? "disabled" : ""}>รับทราบ</button>
      <button class="btn-danger" type="button" id="btnIdpDis" ${lock ? "disabled" : ""}>ไม่เห็นด้วย</button>
    </div>`);
}

function viewReport() {
  const tot = C.totalScore(S.groups, S.cc, true);
  const w = checkWeight();
  let body = "";
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
  return chrome(`
    <h1 class="page-title">รายงานและติดตามผลการดำเนินการ</h1>
    <div class="toolbar">
      <button class="btn-navy" type="button" onclick="window.print()">พิมพ์รายงาน 2 หน้า</button>
    </div>
    <section class="print-page card">
      <h2>หน้า 1 สรุปผล</h2>
      ${profileBox()}
      <p>น้ำหนักข้อตกลงรวม ${w} · สถานะ PA ${statusPill(S.paStatus)} · IDP ${statusPill(S.idpStatus)}</p>
      <p class="score-big">${C.fmtScore(tot.total)} คะแนน · ${esc(tot.level)}</p>
      <table class="data">
        <tr><td>Performance (PA)</td><td>80</td><td>${C.fmtScore(tot.pa)}</td></tr>
        <tr><td>Core Competency (CC)</td><td>20</td><td>${C.fmtScore(tot.cc)}</td></tr>
        <tr><td>รวม</td><td>100</td><td>${C.fmtScore(tot.total)}</td></tr>
      </table>
      <p>จุดเด่น: ${esc(S.strength) || "-"}</p>
      <p>ข้อควรพัฒนา: ${esc(S.develop) || "-"}</p>
    </section>
    <section class="print-page card">
      <h2>หน้า 2 ตารางรายการตามภาระงานที่ 1–4</h2>
      ${body}
      <h3>CC 7 ข้อ</h3>
      <ul>${S.cc.map((x) => `<li>${esc(x.name)} · ตนเอง ${C.fmtScore(x.self)} · ประธาน ${C.fmtScore(x.chair)}</li>`).join("")}</ul>
      <h3>IDP</h3>
      <ul>${S.idp.map((x) => `<li>${esc(x.competency)} · ${x.result === "ok" ? "เป็นไปตามที่คาดหวัง" : x.result === "no" ? "ไม่เป็นไปตามที่คาดหวัง" : "-"}</li>`).join("")}</ul>
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
    evalHome: viewEvalHome, adminHome: viewAdminHome, adminPeople: viewAdminPeople, adminRound: viewAdminRound,
    leave: viewLeave, time: viewTime, paSupport: viewPaSupport
  };
  root.innerHTML = (map[v] || viewHome)();
  bind();
}

function readCcFc() {
  document.querySelectorAll("[data-cc]").forEach((el) => {
    const [id, field] = el.dataset.cc.split(":");
    const it = S.cc.find((x) => x.id === id);
    if (it) it[field] = el.value;
  });
  document.querySelectorAll("[data-fc]").forEach((el) => {
    const [id, field] = el.dataset.fc.split(":");
    const it = S.fc.find((x) => x.id === id);
    if (it) it[field] = el.value;
  });
}

function bind() {
  document.querySelectorAll("[data-go]").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-go");
      if (id === "home") { S.desk = "home"; go("home"); return; }
      if (id === "rateeHome") { S.desk = "ratee"; go("modules"); return; }
      if (id === "evalHome") { S.desk = "eval"; go("evalHome"); return; }
      if (id === "adminHome" || id === "adminPeople" || id === "adminRound") {
        S.desk = "admin";
        go(id);
        return;
      }
      if (["period", "profile", "rounds", "modules", "pa", "paReport", "ack", "idpReport", "idpAck"].includes(id) && S.desk === "home") {
        S.desk = "ratee";
      }
      const mod = MODULES.find((m) => m.id === id);
      if (mod && S.desk === "ratee" && !canOpen(mod)) { toast("ยังไม่ถึงขั้นตอนนี้ตามวงจร PMS"); return; }
      go(id);
    });
  });
  const login = document.getElementById("loginForm");
  if (login) {
    login.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = login.user.value.trim().toLowerCase();
      if (u !== "porntipa.c" && u !== "พรทิพา.เซี่ยงฉิน" && !u.includes("porntipa")) {
        toast("เดโมนี้ใช้บัญชี porntipa.c (น.ส.พรทิพา เซี่ยงฉิน)");
        return;
      }
      S.loggedIn = true;
      S.desk = "home";
      go("home");
    });
  }
  const yp = document.getElementById("goProfile");
  if (yp) yp.addEventListener("click", () => {
    const sel = document.getElementById("yearSel");
    if (sel) setYear(sel.value);
    persist();
    go("profile");
  });
  const ys = document.getElementById("yearSel");
  if (ys) {
    ys.addEventListener("change", () => {
      setYear(ys.value);
      persist();
      toast("ใช้ปีงบประมาณ " + S.year);
    });
  }
  const out = document.getElementById("btnOut");
  if (out) out.addEventListener("click", logout);
  const rst = document.getElementById("btnReset");
  if (rst) rst.addEventListener("click", resetDemo);

  document.querySelectorAll("[data-add-ag]").forEach((b) => b.addEventListener("click", () => addAgreement(b.dataset.addAg)));
  document.querySelectorAll("[data-del-ag]").forEach((b) => {
    b.addEventListener("click", () => {
      const [g, a] = b.dataset.delAg.split(":");
      removeAgreement(g, a);
    });
  });
  document.querySelectorAll("[data-pa]").forEach((el) => {
    el.addEventListener("change", () => {
      readPaForm();
      persist();
      const field = el.dataset.pa.split(":")[2];
      if (["criteriaId", "role", "inDb", "withStudent", "amount", "hours", "qty", "weight"].includes(field)) render();
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
  if (sr) sr.addEventListener("click", () => { readPaForm(); persist(); toast("บันทึกรายงานผลแล้ว"); });
  const srr = document.getElementById("btnSendReport");
  if (srr) srr.addEventListener("click", submitSelfPA);

  const sc = document.getElementById("btnSaveComp");
  if (sc) sc.addEventListener("click", () => { readPaForm(); readCcFc(); persist(); toast("บันทึกสมรรถนะแล้ว"); render(); });
  const cm = document.getElementById("btnCommittee");
  if (cm) cm.addEventListener("click", () => { readPaForm(); readCcFc(); persist(); submitCommittee(); });
  const ck = document.getElementById("btnCheckScore");
  if (ck) ck.addEventListener("click", () => { readPaForm(); readCcFc(); persist(); openScoreDialog(); });
  const cl = document.getElementById("closeModal");
  if (cl) cl.addEventListener("click", () => { S.modal = null; persist(); render(); });
  const ss = document.getElementById("btnSendScore");
  if (ss) ss.addEventListener("click", sendChairScore);

  const ba = document.getElementById("btnAck");
  if (ba) ba.addEventListener("click", () => {
    const fc = document.getElementById("fcAck");
    if (fc) S.fcAck = fc.checked;
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
}

window.addEventListener("hashchange", () => {
  const h = location.hash.replace("#", "");
  if (!h) return;
  if (!S.loggedIn && h !== "login") return;
  S.view = h;
  render();
});

(function applyQuery() {
  const q = new URLSearchParams(location.search);
  const view = q.get("view");
  const seed = q.get("seed");
  if (view || seed) {
    S.loggedIn = true;
    if (seed === "approved") S.paStatus = "approved";
    if (seed === "reported") {
      S.paStatus = "reported";
      S.cc.forEach((x) => { x.self = x.self || 8; });
    }
    if (seed === "chair") {
      S.paStatus = "chair";
      S.chairSent = true;
      S.cc.forEach((x) => { x.self = x.self || 8; x.chair = x.chair || 8; });
      S.strength = S.strength || "มุ่งมั่นในงานสอนและวิจัย";
      S.develop = S.develop || "ขยายเครือข่ายวิจัย";
    }
    if (seed === "idpwait") S.idpStatus = "wait";
    if (seed === "wait") S.paStatus = "wait";
    if (view) S.view = view;
    if (q.get("modal") === "score") S.modal = "score";
  }
  const h = location.hash.replace("#", "");
  if (h && S.loggedIn) S.view = h;
})();

render();
