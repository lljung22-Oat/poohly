/* หลักเกณฑ์ ค่าน้ำหนัก และการจัดทำข้อตกลง — ประกาศคณะสังคมศาสตร์และมนุษยศาสตร์
   มหาวิทยาลัยมหิดล พ.ศ. 2568 สายวิชาการ
   ใช้คำนวณหน่วยภาระงานและคะแนนประเมินตนเองของอาจารย์ ไม่ใช่หน้าจอเพิ่ม */
(function (root) {
  const PA_WEIGHT = 80;
  const CC_WEIGHT = 20;
  const CC_MAX_EACH = 10;
  const CC_COUNT = 7;
  const CC_SUM_MAX = CC_MAX_EACH * CC_COUNT; // 70
  const IDP_MAX = 2;
  const TOTAL_UNITS = 1820;

  const GROUPS = [
    { id: "strat", no: 1, pct: 25, cap: 455, title: "ภาระงานที่ 1", name: "งานตามภารกิจที่สอดคล้องกับประเด็นยุทธศาสตร์ของมหาวิทยาลัยและแผนกลยุทธ์ของส่วนงาน" },
    { id: "main", no: 2, pct: 55, cap: 1000, title: "ภาระงานที่ 2", name: "งานตามภารกิจหลักของตำแหน่งงาน ตามหน้าที่ความรับผิดชอบ ตามคำบรรยายลักษณะงาน" },
    { id: "assign", no: 3, pct: 15, cap: 273, title: "ภาระงานที่ 3", name: "งานที่ได้รับมอบหมาย" },
    { id: "community", no: 4, pct: 5, cap: 92, title: "ภาระงานที่ 4", name: "งานเพื่อส่วนรวม" }
  ];

  const ROLES = [
    { id: "", label: "-- เลือกบทบาท --", pct: 0 },
    { id: "pi", label: "หัวหน้าโครงการ (100%)", pct: 1 },
    { id: "corr", label: "ผู้ประพันธ์บรรณกิจ / Corresponding Author (100%)", pct: 1 },
    { id: "co", label: "ผู้ร่วมวิจัย หรือชื่อลำดับอื่น ๆ (50%)", pct: 0.5 }
  ];

  const KPI_TYPES = [
    { id: "quantity", label: "ปริมาณ" },
    { id: "quality", label: "คุณภาพ" },
    { id: "time", label: "เวลา" },
    { id: "value", label: "ความคุ้มค่า" },
    { id: "satisfy", label: "ความพึงพอใจ" },
    { id: "other", label: "อื่นๆ" }
  ];

  const SCALE5 = [
    { min: 9, max: 10, label: "สูงกว่าเป้าหมาย", hint: "9–10" },
    { min: 7, max: 8, label: "ตามเป้าหมาย", hint: "7–8" },
    { min: 5, max: 6, label: "ใกล้เคียงเป้าหมาย", hint: "5–6" },
    { min: 3, max: 4, label: "ต่ำกว่าเป้าหมาย", hint: "3–4" },
    { min: 0, max: 2, label: "ต่ำกว่าเป้าหมายมาก", hint: "0–2" }
  ];

  const LEVELS = [
    { min: 90, max: 100, label: "ดีเด่น" },
    { min: 80, max: 89.99, label: "ดีมาก" },
    { min: 70, max: 79.99, label: "ดี" },
    { min: 60, max: 69.99, label: "พอใช้" },
    { min: 0, max: 59.99, label: "ควรปรับปรุง" }
  ];

  const CC_ITEMS = [
    { id: "cc1", name: "Mastery มีสติ เป็นเลิศในงานที่รับผิดชอบ", full: "มีสติ ควบคุมกำกับจิตใจและความคิด มุ่งเรียนรู้เพื่อพัฒนาตนอย่างต่อเนื่อง นำไปสู่การรู้ลึก รู้จริง และรอบรู้ในงานของตน" },
    { id: "cc2", name: "Altruism ทำเพื่อผู้อื่น", full: "ให้ความช่วยเหลือผู้อื่นโดยไม่ต้องร้องขอ พร้อมเสียสละเวลาส่วนตัวเพื่อประโยชน์ส่วนรวมให้งานสำเร็จ" },
    { id: "cc3", name: "Harmony ประสานความต่าง", full: "รับฟัง ให้เกียรติ และเห็นคุณค่าของผู้อื่น สามารถทำงานร่วมกับผู้ที่มีความแตกต่าง ร่วมคิด วางแผน และลงมือปฏิบัติเพื่อความสำเร็จของงานโดยยึดเป้าหมายร่วมกัน" },
    { id: "cc4", name: "Integrity ซื่อสัตย์ สุจริต มีคุณธรรม รักษาคำพูด", full: "มีสัจจะ เชื่อถือได้ ปฏิบัติหน้าที่โดยคำนึงถึงความถูกต้อง ความยุติธรรม และจรรยาบรรณของวิชาชีพ" },
    { id: "cc5", name: "Determination มุ่งมั่น ฝ่าฟัน จนสำเร็จ", full: "ตั้งใจทำงานที่ได้รับมอบหมายอย่างเต็มความสามารถ มีความเพียรพยายามอดทนเพื่อให้งานสำเร็จตามเป้าหมาย แม้พบปัญหา อุปสรรค และความยากลำบาก" },
    { id: "cc6", name: "Originality คิดและทำสิ่งใหม่", full: "แสดงความเห็น คิดริเริ่ม ปรับปรุง และพัฒนาวิธีการหรือกระบวนการทำงานให้มีประสิทธิภาพเกินมาตรฐาน เกิดสิ่งใหม่ๆ หรือนวัตกรรม" },
    { id: "cc7", name: "Leadership กล้าคิด กล้าทำ กล้านำ กล้าเปลี่ยนแปลง", full: "ทำให้เกิดการเปลี่ยนแปลงที่ท้าทายไปจากเดิม โดยสามารถสื่อสาร โน้มน้าว จูงใจให้ผู้อื่นเกิดความเชื่อมั่น และร่วมมือในการสร้างการเปลี่ยนแปลงให้เกิดขึ้นจริง" }
  ];

  const FC_ITEMS = [
    { id: "CFC01", name: "CFC01 ความเป็นอาจารย์มหาวิทยาลัยมหิดล" },
    { id: "SFC01", name: "SFC01 ทักษะการจัดการเรียนการสอน" },
    { id: "SFC02", name: "SFC02 ทักษะการวิจัย" }
  ];

  const SUPPORT_FC_ITEMS = [
    { id: "SUP01", name: "การปฏิบัติงานตามระเบียบและขั้นตอนของส่วนงาน" },
    { id: "SUP02", name: "การให้บริการและการประสานงาน" }
  ];

  const WORK_TYPES = [
    { id: "strat", label: "งานยุทธศาสตร์ (มหาวิทยาลัย/ส่วนงาน)" },
    { id: "main", label: "งานประจำตามตำแหน่ง" },
    { id: "assign", label: "งานที่ได้รับมอบหมาย" },
    { id: "community", label: "งานเพื่อส่วนรวม" }
  ];

  const IDP_METHODS = [
    { id: "70", label: "70 : เรียนรู้จากการปฏิบัติงานจริง" },
    { id: "20", label: "20 : เรียนรู้จากผู้อื่น (โค้ช / พี่เลี้ยง)" },
    { id: "10", label: "10 : เรียนรู้จากหลักสูตร อบรม" }
  ];

  /* ตารางที่ 1 ยุทธศาสตร์การวิจัย */
  const PUB = [
    { id: "pub_top1", label: "บทความตีพิมพ์วารสารนานาชาติ Top1", units: 455, score: 10, pub: true },
    { id: "pub_top10", label: "บทความตีพิมพ์วารสารนานาชาติ Top10", units: 410, score: 9, pub: true },
    { id: "pub_q1", label: "บทความตีพิมพ์วารสารนานาชาติ Q1", units: 364, score: 8, pub: true },
    { id: "pub_q2", label: "บทความตีพิมพ์วารสารนานาชาติ Q2", units: 273, score: 6, pub: true },
    { id: "pub_q3", label: "บทความตีพิมพ์วารสารนานาชาติ Q3", units: 228, score: 5, pub: true },
    { id: "pub_q4", label: "บทความตีพิมพ์วารสารนานาชาติ Q4", units: 182, score: 4, pub: true }
  ];

  const CATALOG = {
    strat: [
      { id: "", label: "-- เลือกเกณฑ์จากประกาศ --" },
      { id: "pub_top1", label: "1.1 บทความตีพิมพ์ Top1 (455 หน่วย / 10 คะแนน)", kind: "pub", units: 455, score: 10 },
      { id: "pub_top10", label: "1.2 บทความตีพิมพ์ Top10 (410 / 9)", kind: "pub", units: 410, score: 9 },
      { id: "pub_q1", label: "1.3 บทความตีพิมพ์ Q1 (364 / 8)", kind: "pub", units: 364, score: 8 },
      { id: "pub_q2", label: "1.4 บทความตีพิมพ์ Q2 (273 / 6)", kind: "pub", units: 273, score: 6 },
      { id: "pub_q3", label: "1.5 บทความตีพิมพ์ Q3 (228 / 5)", kind: "pub", units: 228, score: 5 },
      { id: "pub_q4", label: "1.6 บทความตีพิมพ์ Q4 (182 / 4)", kind: "pub", units: 182, score: 4 },
      { id: "grant_th", label: "1.7 ทุนสนับสนุนจากหน่วยงานในประเทศ (กรอกจำนวนเงิน)", kind: "grant_th" },
      { id: "grant_en", label: "1.8 ทุนสนับสนุนจากหน่วยงานต่างประเทศ (กรอกจำนวนเงิน)", kind: "grant_en" },
      { id: "grant_mu", label: "1.9 ทุนเงินรายได้มหาวิทยาลัย/ส่วนงาน (กรอกจำนวนเงิน)", kind: "grant_mu" },
      { id: "mupsf4", label: "2.1 UKPSF Principal Fellow / MUPSF ระดับ 4 (455 / 10)", kind: "fixed", units: 455, score: 10 },
      { id: "mupsf3", label: "2.2 UKPSF Senior Fellow / MUPSF ระดับ 3 (410 / 9)", kind: "fixed", units: 410, score: 9 },
      { id: "mupsf2", label: "2.3 MUPSF ระดับ 2 (319 / 7)", kind: "fixed", units: 319, score: 7 },
      { id: "mupsf1", label: "2.4 MUPSF ระดับ 1 (182 / 4)", kind: "fixed", units: 182, score: 4 },
      { id: "policy_intl", label: "3.1 นโยบายชี้นำสังคมระดับนานาชาติ (455 / 10)", kind: "fixed", units: 455, score: 10 },
      { id: "policy_nat", label: "3.1 นโยบายชี้นำสังคมระดับชาติ (410 / 9)", kind: "fixed", units: 410, score: 9 },
      { id: "policy_prov", label: "3.1 นโยบายชี้นำสังคมระดับจังหวัด (364 / 8)", kind: "fixed", units: 364, score: 8 },
      { id: "policy_amp", label: "3.1 นโยบายชี้นำสังคมระดับอำเภอ (319 / 7)", kind: "fixed", units: 319, score: 7 },
      { id: "policy_tam", label: "3.1 นโยบายชี้นำสังคมระดับตำบล (273 / 6)", kind: "fixed", units: 273, score: 6 },
      { id: "part_intl", label: "3.2 มีส่วนร่วมกำหนดนโยบายระดับนานาชาติ (137 / 3)", kind: "fixed", units: 137, score: 3 },
      { id: "part_nat", label: "3.2 มีส่วนร่วมกำหนดนโยบายระดับชาติ (91 / 2)", kind: "fixed", units: 91, score: 2 }
    ],
    main: [
      { id: "", label: "-- เลือกเกณฑ์จากประกาศ --" },
      { id: "teach_grad_main", label: "ตารางที่ 4 สอนป.โท/เอก ผู้สอนหลัก (1 ชม. = 4 หน่วย) กรอกชั่วโมง", kind: "hours", per: 4 },
      { id: "teach_ug_lec", label: "ตารางที่ 4 สอนป.ตรี บรรยาย ผู้สอนหลัก (1 ชม. = 3 หน่วย) กรอกชั่วโมง", kind: "hours", per: 3 },
      { id: "teach_ug_lab", label: "ตารางที่ 4 สอนป.ตรี ปฏิบัติ ผู้สอนหลัก (1 ชม. = 1.5 หน่วย) กรอกชั่วโมง", kind: "hours", per: 1.5 },
      { id: "thesis_ug", label: "ตารางที่ 9 ควบคุมโครงงานป.ตรี (1 หน่วย/สัปดาห์/คน) กรอกจำนวน", kind: "count", per: 1 },
      { id: "course_proj", label: "ตารางที่ 10 โครงการหลักสูตร (1 ชม. = 3 หน่วย) กรอกชั่วโมง", kind: "hours", per: 3 },
      { id: "res_proc_1", label: "ตารางที่ 11 กระบวนการวิจัย ระดับ 1 สัญญา/ธุรการ (80 หน่วย)", kind: "fixed", units: 80, score: null },
      { id: "res_proc_2", label: "ตารางที่ 11 กระบวนการวิจัย ระดับ 2 ก้าวหน้า 20% หรือมี IRB (120)", kind: "fixed", units: 120, score: null },
      { id: "res_proc_3", label: "ตารางที่ 11 กระบวนการวิจัย ระดับ 3 ก้าวหน้า 21–50% (160)", kind: "fixed", units: 160, score: null },
      { id: "res_proc_4", label: "ตารางที่ 11 กระบวนการวิจัย ระดับ 4 ก้าวหน้า 51–90% (200)", kind: "fixed", units: 200, score: null },
      { id: "res_proc_5", label: "ตารางที่ 11 กระบวนการวิจัย ระดับ 5 ร่างรายงานขั้นสุดท้าย (240)", kind: "fixed", units: 240, score: null }
    ],
    assign: [
      { id: "", label: "-- เลือกเกณฑ์จากประกาศ --" },
      { id: "asg_chair", label: "ตารางที่ 21 ประธานกรรมการ/เลขานุการ 1 โครงการ = 20 หน่วย", kind: "count", per: 20 },
      { id: "asg_member", label: "ตารางที่ 21 กรรมการ 1 โครงการ = 15 หน่วย", kind: "count", per: 15 },
      { id: "asg_attend", label: "ตารางที่ 21 เข้าร่วม 1 โครงการ = 10 หน่วย", kind: "count", per: 10 },
      { id: "asg_prog_chair", label: "ประธานคณะกรรมการบริหาร 1 หลักสูตร = 78 หน่วย", kind: "fixed", units: 78, score: null },
      { id: "asg_prog_sec", label: "กรรมการและเลขานุการบริหารหลักสูตร = 62 หน่วย", kind: "fixed", units: 62, score: null },
      { id: "asg_prog_mem", label: "กรรมการบริหารหลักสูตร = 15 หน่วย", kind: "fixed", units: 15, score: null },
      { id: "asg_prog_resp", label: "อาจารย์ผู้รับผิดชอบหลักสูตร = 10 หน่วย", kind: "fixed", units: 10, score: null },
      { id: "asg_vice_dept", label: "รองหัวหน้าภาควิชา = 9 หน่วย/สัปดาห์ กรอกจำนวนสัปดาห์", kind: "count", per: 9 },
      { id: "asg_assist_dept", label: "ผู้ช่วยหัวหน้าภาควิชา = 6 หน่วย/สัปดาห์ กรอกจำนวนสัปดาห์", kind: "count", per: 6 }
    ],
    community: [
      { id: "", label: "-- เลือกเกณฑ์จากประกาศ --" },
      { id: "com_chair", label: "ตารางที่ 22 ประธาน/เลขานุการกิจกรรมนักศึกษา = 20 หน่วย", kind: "count", per: 20 },
      { id: "com_member", label: "ตารางที่ 22 กรรมการกิจกรรมนักศึกษา = 15 หน่วย", kind: "count", per: 15 },
      { id: "com_attend", label: "ตารางที่ 22 เข้าร่วมกิจกรรมนักศึกษา = 5 หน่วย", kind: "count", per: 5 },
      { id: "sport_fac", label: "กีฬา ระดับส่วนงาน = 10 หน่วย", kind: "fixed", units: 10, score: null },
      { id: "sport_uni", label: "กีฬา ระดับมหาวิทยาลัย = 15 หน่วย", kind: "fixed", units: 15, score: null },
      { id: "sport_nat", label: "กีฬา ระดับชาติ = 20 หน่วย", kind: "fixed", units: 20, score: null },
      { id: "sport_intl", label: "กีฬา ระดับนานาชาติ = 30 หน่วย", kind: "fixed", units: 30, score: null },
      { id: "media_uni", label: "ให้ความรู้ผ่านสื่อระดับมหาวิทยาลัย ครั้งละ 10 หน่วย กรอกครั้ง", kind: "count", per: 10 },
      { id: "media_nat", label: "ให้ความรู้ผ่านสื่อระดับชาติ/นานาชาติ ครั้งละ 15 หน่วย กรอกครั้ง", kind: "count", per: 15 }
    ]
  };

  function findCrit(groupId, critId) {
    const list = CATALOG[groupId] || [];
    return list.find((x) => x.id === critId) || null;
  }

  function grantUnits(type, amount) {
    const n = Number(amount) || 0;
    if (n <= 0) return { units: 0, score: 0 };
    if (type === "grant_th") {
      if (n >= 3000000) return { units: 455, score: 10 };
      if (n >= 2000000) return { units: 410, score: 9 };
      if (n >= 1000000) return { units: 364, score: 8 };
      if (n >= 500000) return { units: 319, score: 7 };
      return { units: 273, score: 6 };
    }
    if (type === "grant_en") {
      if (n >= 1000000) return { units: 455, score: 10 };
      if (n >= 700000) return { units: 410, score: 9 };
      if (n >= 500000) return { units: 364, score: 8 };
      if (n >= 200000) return { units: 319, score: 7 };
      return { units: 273, score: 6 };
    }
    if (type === "grant_mu") {
      if (n >= 500000) return { units: 455, score: 10 };
      if (n >= 400000) return { units: 410, score: 9 };
      if (n >= 300000) return { units: 364, score: 8 };
      if (n >= 200000) return { units: 319, score: 7 };
      return { units: 273, score: 6 };
    }
    return { units: 0, score: 0 };
  }

  function rolePct(roleId) {
    const r = ROLES.find((x) => x.id === roleId);
    return r ? r.pct : 0;
  }

  function unitsToScore(units, cap) {
    if (!cap) return 0;
    return +Math.min(10, (Number(units) / cap) * 10).toFixed(2);
  }

  function calcTarget(t, groupId) {
    const g = GROUPS.find((x) => x.id === groupId) || GROUPS[0];
    const c = findCrit(groupId, t && t.criteriaId);
    if (!c || !c.id) return { units: 0, score: 0, autoScore: 0 };

    if (c.kind === "pub") {
      if (t.withStudent) return { units: 0, score: 0, autoScore: 0, blocked: "student" };
      if (!t.inDb) return { units: 0, score: 0, autoScore: 0, blocked: "db" };
      const pct = rolePct(t.role);
      if (!pct) return { units: 0, score: 0, autoScore: 0 };
      const units = +(c.units * pct).toFixed(2);
      const score = +(c.score * pct).toFixed(2);
      return { units, score, autoScore: score };
    }

    if (c.kind === "grant_th" || c.kind === "grant_en" || c.kind === "grant_mu") {
      const pct = rolePct(t.role) || 1;
      const gres = grantUnits(c.kind, t.amount);
      const units = +(gres.units * pct).toFixed(2);
      const score = +(gres.score * pct).toFixed(2);
      return { units, score, autoScore: score };
    }

    if (c.kind === "hours") {
      const h = Number(t.hours) || 0;
      const units = +(h * (c.per || 0)).toFixed(2);
      const autoScore = units > 0 ? 8 : 0;
      return { units, score: autoScore, autoScore };
    }

    if (c.kind === "count") {
      const n = Number(t.qty) || 0;
      const units = +(n * (c.per || 0)).toFixed(2);
      const autoScore = units > 0 ? 8 : 0;
      return { units, score: autoScore, autoScore };
    }

    if (c.kind === "fixed") {
      const units = c.units || 0;
      const score = c.score != null ? c.score : (units > 0 ? 8 : 0);
      return { units, score, autoScore: score };
    }

    return { units: 0, score: 0, autoScore: 0 };
  }

  function collectTargets(groups) {
    const out = [];
    (groups || []).forEach((g) => {
      (g.agreements || []).forEach((a) => {
        (a.kpis || []).forEach((k) => {
          (k.targets || []).forEach((t) => out.push({ groupId: g.id, target: t, group: g }));
        });
      });
    });
    return out;
  }

  function sumWeight(groups) {
    return +collectTargets(groups).reduce((s, x) => s + (Number(x.target.weight) || 0), 0).toFixed(2);
  }

  function groupUnits(groups, groupId) {
    const g = GROUPS.find((x) => x.id === groupId);
    const raw = collectTargets(groups)
      .filter((x) => x.groupId === groupId)
      .reduce((s, x) => s + calcTarget(x.target, groupId).units, 0);
    return Math.min(g ? g.cap : Infinity, +raw.toFixed(2));
  }

  function effectiveScore(t, groupId) {
    const auto = calcTarget(t, groupId);
    if (t.selfScore === 0 || (t.selfScore != null && t.selfScore !== "")) {
      const n = Number(t.selfScore);
      if (!Number.isNaN(n)) return n;
    }
    return auto.autoScore;
  }

  function paScore100(groups) {
    const rows = collectTargets(groups);
    const wsum = sumWeight(groups);
    if (!wsum) return 0;
    let acc = 0;
    rows.forEach((x) => {
      const sc = effectiveScore(x.target, x.groupId);
      acc += (Number(x.target.weight) || 0) * (Number(sc) || 0);
    });
    return +((acc / wsum) * 10).toFixed(2) > 100 ? 100 : +((acc / wsum)).toFixed(2);
  }

  /* น้ำหนักข้อตกลงรวม 100, คะแนนรายข้อ 0–10 → PA เต็ม 100 = Σ(score * weight/100)*10
     ให้ PA 0–100 = Σ((score/10) * weight) */
  function paPoints(groups) {
    const rows = collectTargets(groups);
    let acc = 0;
    rows.forEach((x) => {
      const sc = effectiveScore(x.target, x.groupId);
      acc += ((Number(sc) || 0) / 10) * (Number(x.target.weight) || 0);
    });
    return +acc.toFixed(2);
  }

  function chairPaScore(groups) {
    const rows = collectTargets(groups);
    let acc = 0;
    let w = 0;
    rows.forEach((x) => {
      const wt = Number(x.target.weight) || 0;
      const sc = x.target.chairScore != null && x.target.chairScore !== ""
        ? Number(x.target.chairScore)
        : effectiveScore(x.target, x.groupId);
      acc += ((Number(sc) || 0) / 10) * wt;
      w += wt;
    });
    return +acc.toFixed(2);
  }

  function ccRaw(items) {
    return (items || []).reduce((s, it) => {
      const n = it.chair != null && it.chair !== "" ? Number(it.chair)
        : it.self != null && it.self !== "" ? Number(it.self) : 0;
      return s + (Number.isNaN(n) ? 0 : n);
    }, 0);
  }

  function ccPoints(items) {
    const raw = ccRaw(items);
    return +((raw / CC_SUM_MAX) * CC_WEIGHT).toFixed(2);
  }

  function paWeighted80(groups, useChair) {
    const p = useChair ? chairPaScore(groups) : paPoints(groups);
    return +((p / 100) * PA_WEIGHT).toFixed(2);
  }

  function totalScore(groups, ccItems, useChair) {
    const pa = paWeighted80(groups, useChair);
    const cc = ccPoints(ccItems);
    const total = +(pa + cc).toFixed(2);
    return { pa, cc, total, level: levelOf(total) };
  }

  function sumSupportWeight(items) {
    return (items || []).reduce((s, it) => s + (Number(it.weight) || 0), 0);
  }

  function supportPaPoints(items, useChair) {
    let acc = 0;
    (items || []).forEach((it) => {
      const wt = Number(it.weight) || 0;
      const raw = useChair && it.chairScore !== "" && it.chairScore != null
        ? it.chairScore : it.selfScore;
      const sc = Number(raw);
      acc += ((Number.isNaN(sc) ? 0 : sc) / 10) * wt;
    });
    return +acc.toFixed(2);
  }

  function supportTotalScore(items, ccItems, useChair) {
    const pa = +((supportPaPoints(items, useChair) / 100) * PA_WEIGHT).toFixed(2);
    const cc = ccPoints(ccItems);
    const total = +(pa + cc).toFixed(2);
    return { pa, cc, total, level: levelOf(total) };
  }

  function levelOf(n) {
    const x = Number(n) || 0;
    const hit = LEVELS.find((lv) => x >= lv.min && x <= lv.max);
    return hit ? hit.label : "ควรปรับปรุง";
  }

  function scaleLabel(score) {
    const n = Number(score);
    if (Number.isNaN(n)) return "-";
    const hit = SCALE5.find((s) => n >= s.min && n <= s.max);
    return hit ? `${hit.label} (${hit.hint})` : "-";
  }

  function fmtUnit(n) {
    if (!n) return "0";
    return Number.isInteger(n) ? String(n) : Number(n).toFixed(2);
  }

  function fmtScore(n) {
    if (n == null || n === "") return "-";
    const x = Number(n);
    if (Number.isNaN(x)) return "-";
    return x.toFixed(2);
  }

  /* compatibility with เดโมตารางที่ 1 เดิม */
  function calc(w) {
    const t = {
      criteriaId: w.crit ? "pub_" + w.crit.replace(/^pub_/, "") : w.other,
      role: w.role,
      inDb: w.inDb,
      withStudent: w.withStudent,
      amount: w.amount
    };
    if (w.crit && !String(w.crit).startsWith("pub_")) t.criteriaId = "pub_" + w.crit;
    if (w.other && String(w.other).startsWith("grant")) t.criteriaId = w.other;
    if (w.other && (w.other === "q3" || w.other === "q4")) t.criteriaId = "pub_" + w.other;
    return calcTarget(t, "strat");
  }

  function sumUnits(works) {
    const raw = (works || []).reduce((a, w) => a + calc(w).units, 0);
    return Math.min(455, +raw.toFixed(2));
  }

  const api = {
    PA_WEIGHT, CC_WEIGHT, CC_SUM_MAX, IDP_MAX, TOTAL_UNITS,
    GROUPS, ROLES, KPI_TYPES, SCALE5, LEVELS, CC_ITEMS, FC_ITEMS, SUPPORT_FC_ITEMS,
    WORK_TYPES, IDP_METHODS,
    PUB, CATALOG,
    findCrit, grantUnits, rolePct, unitsToScore, calcTarget,
    collectTargets, sumWeight, groupUnits, effectiveScore,
    paPoints, chairPaScore, ccRaw, ccPoints, paWeighted80, totalScore,
    sumSupportWeight, supportPaPoints, supportTotalScore,
    levelOf, scaleLabel,
    fmtUnit, fmtScore, calc, sumUnits
  };
  root.PAScore = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
