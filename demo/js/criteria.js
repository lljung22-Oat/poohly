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
  const REASON_H = "กรณีให้คะแนนระดับ 9 – 10 และ 0 – 2 โปรดระบุเหตุผลเชิงรูปธรรมที่ชัดเจนหรือหลักฐานเชิงประจักษ์";
  function evalHeads(item, detail, col3) {
    return ["ลำดับ", item, detail, col3, "รวมหน่วยภาระงาน", "ผลการประเมินตนเอง", REASON_H];
  }
  function planHeads(item, qtyLabel) {
    return qtyLabel
      ? ["ลำดับ", item, qtyLabel, "รวมหน่วยภาระงาน", "ผลการประเมินตนเอง"]
      : ["ลำดับ", item, "รวมหน่วยภาระงาน", "ผลการประเมินตนเอง"];
  }
  /* ชื่อหัวตารางตามแบบ SHPA ร่าง คนละชุดต่อภาระงาน ไม่ทำแบบฟอร์มทั้งใบ */
  const GROUP_HEADERS = {
    main: { item: "วิชา", plan: planHeads("วิชา"), eval: evalHeads("วิชา", "รายละเอียด", "จำนวนชั่วโมง") },
    assign: { item: "กิจกรรม", plan: planHeads("กิจกรรม"), eval: evalHeads("กิจกรรม", "รายละเอียด", "จำนวนชั่วโมง") },
    community: { item: "ชื่อกิจกรรม", plan: planHeads("ชื่อกิจกรรม"), eval: evalHeads("ชื่อกิจกรรม", "รายละเอียด", "จำนวนชั่วโมง") },
    strat: { item: "ชื่อบทความ", plan: planHeads("ชื่อบทความ"), eval: evalHeads("ชื่อบทความ", "ภาระงาน", "หน่วยภาระงานด้าน") }
  };
  const PA_HEADERS = GROUP_HEADERS.main.eval;
  const PA_PLAN_HEADERS = GROUP_HEADERS.main.plan;
  function paHeaders(groupId, layout) {
    const h = GROUP_HEADERS[groupId] || GROUP_HEADERS.main;
    return layout === "plan" ? h.plan : h.eval;
  }
  function paItemHeader(groupId) {
    return (GROUP_HEADERS[groupId] || GROUP_HEADERS.main).item;
  }

  const MAIN_SECTIONS = [
    { id: "teach", no: "1.1", name: "ภาระงานหลักด้านการเรียนการสอน", item: "วิชา", detail: "รายละเอียด", col3: "จำนวนชั่วโมง", planQty: "จำนวนชั่วโมง", addCrit: "" },
    { id: "research", no: "1.2.1", name: "ภาระงานหลักด้านการวิจัย", item: "ชื่อเรื่องงานวิจัย", detail: "ภาระความรับผิดชอบ", col3: "หน่วยภาระงานด้านกระบวนการวิจัย", addCrit: "res_proc_1" },
    { id: "book", no: "1.2.2", name: "การผลิตหนังสือ และผลงานทางวิชาการในลักษณะอื่นที่เปรียบเทียบเท่างานวิจัย", item: "ชื่อผลงาน", detail: "ภาระความรับผิดชอบ", col3: "หน่วยภาระงานด้านกระบวนการดำเนินงาน", addCrit: "res_book" },
    { id: "service", no: "1.3", name: "ภาระงานด้านการบริการวิชาการ", item: "การบริการวิชาการ", detail: "รายละเอียด", col3: "จำนวนชั่วโมง", planQty: "จำนวนชั่วโมง", addCrit: "svc_consult" }
  ];
  function mainSectionOf(t) {
    const id = String((t && t.criteriaId) || "");
    if (id === "res_book") return "book";
    if (id.startsWith("res_")) return "research";
    if (id === "course_proj" || id.startsWith("svc_")) return "service";
    return "teach";
  }
  function sectionHeaders(sec, layout) {
    if (!sec) return layout === "plan" ? PA_PLAN_HEADERS : PA_HEADERS;
    return layout === "plan" ? planHeads(sec.item, sec.planQty) : evalHeads(sec.item, sec.detail, sec.col3);
  }

  /* ลำดับหัวข้อตามแบบฟอร์ม SHPA ร่าง หน่วย/ร้อยละตามประกาศคณะฯ */
  const GROUPS = [
    { id: "main", no: 1, pct: 55, cap: 1000, title: "ภาระงานที่ 1", name: "ภาระงานหลัก" },
    { id: "assign", no: 2, pct: 15, cap: 273, title: "ภาระงานที่ 2", name: "ภาระงานที่ได้รับมอบหมาย" },
    { id: "community", no: 3, pct: 5, cap: 92, title: "ภาระงานที่ 3", name: "ภาระงานเพื่อส่วนรวม" },
    { id: "strat", no: 4, pct: 25, cap: 455, title: "ภาระงานที่ 4", name: "ภาระงานที่สอดคล้องยุทธศาสตร์" }
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

  /* ยุทธศาสตร์การวิจัย — หน่วย/คะแนนตามประกาศคณะฯ นิยามเงื่อนไขตามเล่มตัวชี้วัด PA 2570 */
  const PUB = [
    { id: "pub_top1", label: "บทความตีพิมพ์วารสารนานาชาติ Top1", formLabel: "บทความตีพิมพ์วารสารนานาชาติอยู่ใน Top1 (455 หน่วย / 10 คะแนน)", hint: "Top1 ตาม SJR ใน SciVal/Scopus นับเฉพาะที่ปรากฏในฐาน ไม่นับซ้ำบทความในตัวชี้วัดเดียวกัน", units: 455, score: 10, pub: true },
    { id: "pub_top10", label: "บทความตีพิมพ์วารสารนานาชาติ Top10", formLabel: "บทความตีพิมพ์วารสารนานาชาติอยู่ใน Top10 (410 หน่วย / 9 คะแนน)", hint: "Top10 Percentile ตาม SJR ใน SciVal/Scopus นับเฉพาะที่ปรากฏในฐาน ไม่นับซ้ำบทความในตัวชี้วัดเดียวกัน", units: 410, score: 9, pub: true },
    { id: "pub_q1", label: "บทความตีพิมพ์วารสารนานาชาติ Q1", formLabel: "บทความตีพิมพ์วารสารนานาชาติอยู่ใน Q1 (364 หน่วย / 8 คะแนน)", hint: "Qurtile 1 ตาม SJR ใน SciVal/Scopus นับเฉพาะที่ปรากฏในฐาน ไม่นับซ้ำบทความในตัวชี้วัดเดียวกัน", units: 364, score: 8, pub: true },
    { id: "pub_q2", label: "บทความตีพิมพ์วารสารนานาชาติ Q2", formLabel: "บทความตีพิมพ์วารสารนานาชาติอยู่ใน Q2 (273 หน่วย / 6 คะแนน)", hint: "นับเฉพาะที่ปรากฏใน SciVal หรือ Scopus ไม่นับซ้ำบทความในตัวชี้วัดเดียวกัน", units: 273, score: 6, pub: true },
    { id: "pub_q3", label: "บทความตีพิมพ์วารสารนานาชาติ Q3", formLabel: "บทความตีพิมพ์วารสารนานาชาติอยู่ใน Q3 (228 หน่วย / 5 คะแนน)", hint: "นับเฉพาะที่ปรากฏใน SciVal หรือ Scopus ไม่นับซ้ำบทความในตัวชี้วัดเดียวกัน", units: 228, score: 5, pub: true },
    { id: "pub_q4", label: "บทความตีพิมพ์วารสารนานาชาติ Q4", formLabel: "บทความตีพิมพ์วารสารนานาชาติอยู่ใน Q4 (182 หน่วย / 4 คะแนน)", hint: "นับเฉพาะที่ปรากฏใน SciVal หรือ Scopus ไม่นับซ้ำบทความในตัวชี้วัดเดียวกัน", units: 182, score: 4, pub: true }
  ];

  const GRANT_SOURCES = {
    grant_th: {
      id: "grant_th",
      label: "ทุนสนับสนุนจากหน่วยงานที่จัดสรรเงินทุนวิจัยภายในประเทศ",
      note: "นับจำนวนเงินที่ระบุในสัญญารับทุนของปีงบที่รายงาน ไม่นับเบิกจ่ายจริงใน PA ส่วนงาน ไม่นับ Fundamental Fund เงินทุนรับทำวิจัย และเงินสนับสนุนโครงการวิจัยทางคลินิก",
      tiers: [
        { amount: 3000000, label: "ตั้งแต่ 3,000,000 บาท ตามสัญญา (455 หน่วย / 10 คะแนน)" },
        { amount: 2000000, label: "2,000,000–2,999,999 บาท ตามสัญญา (410 หน่วย / 9 คะแนน)" },
        { amount: 1000000, label: "1,000,000–1,999,999 บาท ตามสัญญา (364 หน่วย / 8 คะแนน)" },
        { amount: 500000, label: "500,000–999,999 บาท ตามสัญญา (319 หน่วย / 7 คะแนน)" },
        { amount: 1, label: "น้อยกว่า 500,000 บาท ตามสัญญา (273 หน่วย / 6 คะแนน)" }
      ]
    },
    grant_en: {
      id: "grant_en",
      label: "ทุนสนับสนุนจากหน่วยงานที่จัดสรรเงินทุนวิจัยจากต่างประเทศ",
      note: "นับจำนวนเงินที่ระบุในสัญญารับทุนของปีงบที่รายงาน ไม่นับเบิกจ่ายจริงใน PA ส่วนงาน ไม่นับเงินทุนรับทำวิจัยและเงินสนับสนุนโครงการวิจัยทางคลินิก",
      tiers: [
        { amount: 1000000, label: "ตั้งแต่ 1,000,000 บาท ตามสัญญา (455 หน่วย / 10 คะแนน)" },
        { amount: 700000, label: "700,000–999,999 บาท ตามสัญญา (410 หน่วย / 9 คะแนน)" },
        { amount: 500000, label: "500,000–699,999 บาท ตามสัญญา (364 หน่วย / 8 คะแนน)" },
        { amount: 200000, label: "200,000–499,999 บาท ตามสัญญา (319 หน่วย / 7 คะแนน)" },
        { amount: 1, label: "น้อยกว่า 200,000 บาท ตามสัญญา (273 หน่วย / 6 คะแนน)" }
      ]
    },
    grant_mu: {
      id: "grant_mu",
      label: "ทุนสนับสนุนจากงบประมาณรายได้ของมหาวิทยาลัยและส่วนงาน",
      note: "นับจำนวนเงินที่ระบุในสัญญา หน่วยรายคนยังใช้ขั้นเงินตามประกาศคณะฯ ไม่คิดหน่วยจากตัวชี้วัดส่วนงาน",
      tiers: [
        { amount: 500000, label: "ตั้งแต่ 500,000 บาท ตามสัญญา (455 หน่วย / 10 คะแนน)" },
        { amount: 400000, label: "400,000–499,999 บาท ตามสัญญา (410 หน่วย / 9 คะแนน)" },
        { amount: 300000, label: "300,000–399,999 บาท ตามสัญญา (364 หน่วย / 8 คะแนน)" },
        { amount: 200000, label: "200,000–299,999 บาท ตามสัญญา (319 หน่วย / 7 คะแนน)" },
        { amount: 1, label: "น้อยกว่า 200,000 บาท ตามสัญญา (273 หน่วย / 6 คะแนน)" }
      ]
    }
  };

  const CATALOG = {
    strat: [
      { id: "", label: "-- เลือกเกณฑ์จากประกาศ --" },
      { id: "pub_top1", label: "1.1 บทความตีพิมพ์ Top1 ตาม SJR (455 หน่วย / 10 คะแนน)", kind: "pub", units: 455, score: 10 },
      { id: "pub_top10", label: "1.2 บทความตีพิมพ์ Top10 Percentile ตาม SJR (410 / 9)", kind: "pub", units: 410, score: 9 },
      { id: "pub_q1", label: "1.3 บทความตีพิมพ์ Q1 ตาม SJR (364 / 8)", kind: "pub", units: 364, score: 8 },
      { id: "pub_q2", label: "1.4 บทความตีพิมพ์ Q2 (273 / 6)", kind: "pub", units: 273, score: 6 },
      { id: "pub_q3", label: "1.5 บทความตีพิมพ์ Q3 (228 / 5)", kind: "pub", units: 228, score: 5 },
      { id: "pub_q4", label: "1.6 บทความตีพิมพ์ Q4 (182 / 4)", kind: "pub", units: 182, score: 4 },
      { id: "grant_th", label: "1.7 ทุนสนับสนุนจากหน่วยงานในประเทศ (นับเงินในสัญญา)", kind: "grant_th" },
      { id: "grant_en", label: "1.8 ทุนสนับสนุนจากหน่วยงานต่างประเทศ (นับเงินในสัญญา)", kind: "grant_en" },
      { id: "grant_mu", label: "1.9 ทุนเงินรายได้มหาวิทยาลัย/ส่วนงาน (นับเงินในสัญญา)", kind: "grant_mu" },
      { id: "mupsf4", label: "2.1 UKPSF Principal Fellow / MUPSF ระดับ 4 (455 / 10)", hint: "ผู้นำเชิงนโยบายการศึกษา", kind: "fixed", units: 455, score: 10 },
      { id: "mupsf3", label: "2.2 UKPSF Senior Fellow / MUPSF ระดับ 3 (410 / 9)", hint: "การจัดการเรียนการสอนข้ามศาสตร์", kind: "fixed", units: 410, score: 9 },
      { id: "mupsf2", label: "2.3 UKPSF Fellow / MUPSF ระดับ 2 (319 / 7)", hint: "การจัดการเรียนการสอนเฉพาะกลุ่ม", kind: "fixed", units: 319, score: 7 },
      { id: "mupsf1", label: "2.4 MUPSF ระดับ 1 (182 / 4)", hint: "ระดับเบื้องต้น", kind: "fixed", units: 182, score: 4 },
      { id: "policy_intl", label: "3.1 นโยบายชี้นำสังคมระดับนานาชาติ (455 / 10)", hint: "นับเฉพาะปีงบที่รายงาน ไม่นับสะสมปีก่อน", kind: "fixed", units: 455, score: 10 },
      { id: "policy_nat", label: "3.1 นโยบายชี้นำสังคมระดับชาติ (410 / 9)", hint: "นับเฉพาะปีงบที่รายงาน ไม่นับสะสมปีก่อน", kind: "fixed", units: 410, score: 9 },
      { id: "policy_prov", label: "3.1 นโยบายชี้นำสังคมระดับจังหวัด (364 / 8)", hint: "นับเฉพาะปีงบที่รายงาน", kind: "fixed", units: 364, score: 8 },
      { id: "policy_amp", label: "3.1 นโยบายชี้นำสังคมระดับอำเภอ (319 / 7)", hint: "นับเฉพาะปีงบที่รายงาน", kind: "fixed", units: 319, score: 7 },
      { id: "policy_tam", label: "3.1 นโยบายชี้นำสังคมระดับตำบล (273 / 6)", hint: "นับเฉพาะปีงบที่รายงาน", kind: "fixed", units: 273, score: 6 },
      { id: "part_intl", label: "3.2 มีส่วนร่วมกำหนดนโยบายระดับนานาชาติ (137 / 3)", hint: "มติคณะกรรมการเป็นที่สุด ไม่นับการตีพิมพ์อย่างเดียว", kind: "fixed", units: 137, score: 3 },
      { id: "part_nat", label: "3.2 มีส่วนร่วมกำหนดนโยบายระดับชาติ (91 / 2)", hint: "มติคณะกรรมการเป็นที่สุด ไม่นับการตีพิมพ์อย่างเดียว", kind: "fixed", units: 91, score: 2 }
    ],
    main: [
      { id: "", label: "-- เลือกเกณฑ์จากประกาศ --" },
      { id: "teach_grad_main", label: "สอนป.โท/เอก ผู้สอนหลัก (1 ชม. = 4 หน่วย) กรอกชั่วโมง", kind: "hours", per: 4 },
      { id: "teach_ug_lec", label: "สอนป.ตรี บรรยาย ผู้สอนหลัก (1 ชม. = 3 หน่วย) กรอกชั่วโมง", kind: "hours", per: 3 },
      { id: "teach_ug_lab", label: "สอนป.ตรี ปฏิบัติ ผู้สอนหลัก (1 ชม. = 1.5 หน่วย) กรอกชั่วโมง", kind: "hours", per: 1.5 },
      { id: "thesis_ug", label: "ควบคุมโครงงานป.ตรี (1 หน่วย/สัปดาห์/คน) กรอกจำนวน", kind: "count", per: 1 },
      { id: "course_proj", label: "โครงการหลักสูตร (1 ชม. = 3 หน่วย) กรอกชั่วโมง", kind: "hours", per: 3 },
      { id: "res_proc_1", label: "กระบวนการวิจัย ระดับ 1 สัญญา/ธุรการ (80 หน่วย)", kind: "fixed", units: 80, score: null },
      { id: "res_proc_2", label: "กระบวนการวิจัย ระดับ 2 ก้าวหน้า 20% หรือมี IRB (120)", kind: "fixed", units: 120, score: null },
      { id: "res_proc_3", label: "กระบวนการวิจัย ระดับ 3 ก้าวหน้า 21–50% (160)", kind: "fixed", units: 160, score: null },
      { id: "res_proc_4", label: "กระบวนการวิจัย ระดับ 4 ก้าวหน้า 51–90% (200)", kind: "fixed", units: 200, score: null },
      { id: "res_proc_5", label: "กระบวนการวิจัย ระดับ 5 ร่างรายงานขั้นสุดท้าย (240)", kind: "fixed", units: 240, score: null },
      { id: "res_book", label: "การผลิตหนังสือ และผลงานทางวิชาการในลักษณะอื่นที่เปรียบเทียบเท่างานวิจัย", kind: "fixed", units: 160, score: null },
      { id: "svc_consult", label: "ผู้ทรงคุณวุฒิ / ที่ปรึกษาทางวิชาการให้หน่วยงาน", kind: "count", per: 10 }
    ],
    assign: [
      { id: "", label: "-- เลือกเกณฑ์จากประกาศ --" },
      { id: "asg_chair", label: "ประธานกรรมการ/เลขานุการ 1 โครงการ = 20 หน่วย", kind: "count", per: 20 },
      { id: "asg_member", label: "กรรมการ 1 โครงการ = 15 หน่วย", kind: "count", per: 15 },
      { id: "asg_attend", label: "เข้าร่วม 1 โครงการ = 10 หน่วย", kind: "count", per: 10 },
      { id: "asg_prog_chair", label: "ประธานคณะกรรมการบริหาร 1 หลักสูตร = 78 หน่วย", kind: "fixed", units: 78, score: null },
      { id: "asg_prog_sec", label: "กรรมการและเลขานุการบริหารหลักสูตร = 62 หน่วย", kind: "fixed", units: 62, score: null },
      { id: "asg_prog_mem", label: "กรรมการบริหารหลักสูตร = 15 หน่วย", kind: "fixed", units: 15, score: null },
      { id: "asg_prog_resp", label: "อาจารย์ผู้รับผิดชอบหลักสูตร = 10 หน่วย", kind: "fixed", units: 10, score: null },
      { id: "asg_vice_dept", label: "รองหัวหน้าภาควิชา = 9 หน่วย/สัปดาห์ กรอกจำนวนสัปดาห์", kind: "count", per: 9 },
      { id: "asg_assist_dept", label: "ผู้ช่วยหัวหน้าภาควิชา = 6 หน่วย/สัปดาห์ กรอกจำนวนสัปดาห์", kind: "count", per: 6 },
      { id: "asg_other", label: "หัวข้องานอื่น (ระบุเอง พร้อมหน่วยและคะแนนที่เสนอ)", kind: "custom" }
    ],
    community: [
      { id: "", label: "-- เลือกเกณฑ์จากประกาศ --" },
      { id: "com_chair", label: "ประธาน/เลขานุการกิจกรรมนักศึกษา = 20 หน่วย", kind: "count", per: 20 },
      { id: "com_member", label: "กรรมการกิจกรรมนักศึกษา = 15 หน่วย", kind: "count", per: 15 },
      { id: "com_attend", label: "เข้าร่วมกิจกรรมนักศึกษา = 5 หน่วย", kind: "count", per: 5 },
      { id: "sport_fac", label: "กีฬา ระดับส่วนงาน = 10 หน่วย", kind: "fixed", units: 10, score: null },
      { id: "sport_uni", label: "กีฬา ระดับมหาวิทยาลัย = 15 หน่วย", kind: "fixed", units: 15, score: null },
      { id: "sport_nat", label: "กีฬา ระดับชาติ = 20 หน่วย", kind: "fixed", units: 20, score: null },
      { id: "sport_intl", label: "กีฬา ระดับนานาชาติ = 30 หน่วย", kind: "fixed", units: 30, score: null },
      { id: "media_uni", label: "ให้ความรู้ผ่านสื่อระดับมหาวิทยาลัย ครั้งละ 10 หน่วย กรอกครั้ง", kind: "count", per: 10 },
      { id: "media_nat", label: "ให้ความรู้ผ่านสื่อระดับชาติ/นานาชาติ ครั้งละ 15 หน่วย กรอกครั้ง", kind: "count", per: 15 },
      { id: "com_other", label: "หัวข้องานอื่น (ระบุเอง พร้อมหน่วยและคะแนนที่เสนอ)", kind: "custom" }
    ]
  };

  const STRAT_BUCKETS = [
    { id: "pub", title: "ยุทธศาสตร์ตีพิมพ์", match: (c) => c.kind === "pub" },
    { id: "grant", title: "ยุทธศาสตร์ทุนวิจัย", match: (c) => String(c.kind || "").startsWith("grant") },
    { id: "other", title: "ยุทธศาสตร์อื่นๆ", match: (c) => c.kind === "fixed" }
  ];

  /* สามสูตรตามประกาศคณะฯ พ.ศ. 2568 ไม่คิดสูตรคณะอื่น */
  const TEACH_FORMULAS = [
    { id: "grad_main", criteriaId: "teach_grad_main", label: "สูตรป.โท/เอก ผู้สอนหลัก", per: 4, hint: "1 ชั่วโมง = 4 หน่วย" },
    { id: "ug_lec", criteriaId: "teach_ug_lec", label: "สูตรป.ตรี บรรยาย ผู้สอนหลัก", per: 3, hint: "1 ชั่วโมง = 3 หน่วย" },
    { id: "ug_lab", criteriaId: "teach_ug_lab", label: "สูตรป.ตรี ปฏิบัติ ผู้สอนหลัก", per: 1.5, hint: "1 ชั่วโมง = 1.5 หน่วย" }
  ];

  /* เลือก ป. ที่สอน แล้วเลือกเงื่อนไข ไม่โชว์ข้อความประกาศยาว */
  const TEACH_PICK = [
    { id: "ug", label: "ป.ตรี", conds: [
      { id: "lec", label: "บรรยาย", criteriaId: "teach_ug_lec" },
      { id: "lab", label: "ปฏิบัติ", criteriaId: "teach_ug_lab" }
    ] },
    { id: "grad", label: "ป.โท/เอก", conds: [
      { id: "main", label: "ผู้สอนหลัก", criteriaId: "teach_grad_main" }
    ] }
  ];

  function teachPickOf(criteriaId) {
    for (const lv of TEACH_PICK) {
      const cond = lv.conds.find((x) => x.criteriaId === criteriaId);
      if (cond) return { level: lv.id, cond: cond.id, criteriaId: cond.criteriaId, per: (findCrit("main", cond.criteriaId) || {}).per };
    }
    return { level: "", cond: "", criteriaId: "", per: 0 };
  }

  function teachCriteriaFromPick(levelId, condId) {
    const lv = TEACH_PICK.find((x) => x.id === levelId);
    if (!lv) return "";
    const cond = lv.conds.find((x) => x.id === condId) || (lv.conds.length === 1 ? lv.conds[0] : null);
    return cond ? cond.criteriaId : "";
  }

  const MAX_EVIDENCE_FILES = 3;

  const SCORE_COND = {
    inDb: "เผยแพร่แล้วและปรากฏในฐานข้อมูล SciVal หรือ Scopus เรียบร้อยแล้ว (วันที่ดึงอยู่ในปีงบที่รายงาน ไม่นับซ้ำบทความในตัวชี้วัดเดียวกัน)",
    inDbShort: "ปรากฏใน SciVal/Scopus แล้ว",
    student: "ผลงานวิจัยร่วมกับนักศึกษา (ไม่นับในยุทธศาสตร์ตามประกาศคณะฯ)",
    studentShort: "ร่วมกับนักศึกษา ไม่นับยุทธศาสตร์",
    corp: "ตัวชี้วัด 1.3 Academic-Corporate Collaboration นับผลงานตีพิมพ์ร่วมภาคเอกชนที่ปรากฏใน SciVal หรือ Scopus — ไม่คิดหน่วยจากเล่มส่วนงาน หน่วยรายคนยังใช้ขั้นวารสารตามประกาศคณะฯ",
    corpShort: "1.3 ร่วมภาคเอกชน",
    cta: "ตัวชี้วัด 1.9.3 ทุนวิจัยทางคลินิก (CTA) นับเงินในสัญญา ทั้งในประเทศและต่างประเทศ — ไม่เปิดขั้นคะแนนแยก เพราะประกาศคณะฯ ไม่มีขั้น CTA",
    ctaShort: "1.9.3 CTA นับเงินในสัญญา",
    doi: "ช่องกรอกและแนบลิงก์ DOI ของงานตีพิมพ์",
    evidence: "หลักฐานไม่เกิน 3 ไฟล์ต่อเรื่อง",
    contractAmount: "จำนวนเงินใช้ค่าในสัญญารับทุน ดึงจากฐานกลางถ้ามีในไฟล์ ห้ามสร้างวันที่ลงนามถ้าไฟล์ไม่มี",
    contractAmountShort: "ค้นหาโครงการจากฐานกลาง"
  };

  function researchSample() {
    if (typeof Faculty2570 !== "undefined" && Faculty2570.RESEARCH_SAMPLE) return Faculty2570.RESEARCH_SAMPLE;
    if (typeof require === "function") {
      try { return require("./faculty-2570.js").RESEARCH_SAMPLE || []; } catch (e) { return []; }
    }
    return [];
  }

  function toRegistryProject(row) {
    const startLooksDate = /^\d{4}-\d{2}-\d{2}$/.test(String(row.start || ""));
    return {
      code: row.code,
      name: row.name,
      lead: row.lead || "",
      affiliation: row.dept || "",
      funder: row.funder || "",
      amount: row.amount || "",
      start: row.start || "",
      end: row.end || "",
      contractNo: row.contract || "",
      contractDate: startLooksDate ? row.start : "",
      contractDateNote: row.contract
        ? ""
        : (startLooksDate
          ? "ไฟล์ตัวอย่างไม่มีวันที่ลงนามในสัญญา แสดงระยะเวลาเริ่มโครงการแทน"
          : "ไฟล์ตัวอย่างไม่มีวันที่ลงนามในสัญญา"),
      sheet: row.sheet,
      status: row.status || "",
      remark: row.remark || "",
      source: "แบบติดตามข้อมูลโครงการวิจัย ปี 2570"
    };
  }

  /* ฐานกลางจากไฟล์ตัวอย่างประกอบการพิจารณา ไม่คิดหน่วยจากสังกัดในไฟล์ */
  const PROJECT_REGISTRY = researchSample().map(toRegistryProject);

  const SYLLABUS_REGISTRY = [
    { id: "SHSS501", code: "SHSS 501", title: "ทฤษฎีสังคมศาสตร์", hours: 45, formulaId: "grad_main" },
    { id: "SHSS201", code: "SHSS 201", title: "สังคมวิทยาเบื้องต้น", hours: 30, formulaId: "ug_lec" },
    { id: "SHSS215", code: "SHSS 215", title: "ปฏิบัติการวิจัยภาคสนาม", hours: 24, formulaId: "ug_lab" }
  ];

  function searchProjects(q) {
    const s = String(q || "").trim().toLowerCase();
    if (!s) return PROJECT_REGISTRY.slice();
    return PROJECT_REGISTRY.filter((p) =>
      [p.code, p.name, p.lead, p.affiliation, p.funder].some((x) =>
        String(x || "").toLowerCase().includes(s)
      )
    );
  }

  function findProject(code) {
    return PROJECT_REGISTRY.find((p) => p.code === code) || null;
  }

  function searchSyllabus(q) {
    const s = String(q || "").trim().toLowerCase();
    if (!s) return SYLLABUS_REGISTRY.slice();
    return SYLLABUS_REGISTRY.filter((c) =>
      c.code.toLowerCase().includes(s) || c.title.toLowerCase().includes(s) || c.id.toLowerCase().includes(s)
    );
  }

  function findSyllabus(id) {
    return SYLLABUS_REGISTRY.find((c) => c.id === id || c.code === id) || null;
  }

  function findTeachFormula(id) {
    return TEACH_FORMULAS.find((f) => f.id === id) || null;
  }

  function normalizeDoi(raw) {
    const v = String(raw || "").trim();
    if (!v) return "";
    const m = v.match(/(?:https?:\/\/(?:dx\.)?doi\.org\/)?(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)/i);
    return m ? m[1] : v;
  }

  function doiUrl(raw) {
    const st = doiStatus(raw);
    return st.url || "";
  }

  function doiStatus(raw) {
    const v = String(raw || "").trim();
    if (!v) return { ok: true, empty: true, label: "", url: "", normalized: "" };
    const n = normalizeDoi(v);
    const ok = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i.test(n);
    return {
      ok,
      empty: false,
      normalized: ok ? n : "",
      url: ok ? "https://doi.org/" + n : "",
      label: ok ? "รูปแบบ DOI / ลิงก์ DOI ถูกต้อง" : "รูปแบบ DOI ไม่ตรงมาตรฐาน (ขึ้นต้น 10. หรือลิงก์ doi.org)"
    };
  }

  function evidenceFiles(t) {
    if (t && Array.isArray(t.files)) return t.files.filter(Boolean);
    if (t && t.file) return [t.file];
    return [];
  }

  function attachEvidence(t, names) {
    const cur = evidenceFiles(t);
    const add = (names || []).map((x) => String(x || "").trim()).filter(Boolean);
    const room = Math.max(0, MAX_EVIDENCE_FILES - cur.length);
    const kept = add.slice(0, room);
    const blocked = add.length > room;
    return {
      files: cur.concat(kept),
      blocked,
      message: blocked
        ? `อัปโหลดได้ไม่เกิน ${MAX_EVIDENCE_FILES} ไฟล์ต่อเรื่อง`
        : (cur.length + kept.length >= MAX_EVIDENCE_FILES ? `ครบ ${MAX_EVIDENCE_FILES} ไฟล์ต่อเรื่อง` : "")
    };
  }

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
      const per = c.per || 0;
      const h = Number(t.hours) || 0;
      const units = +(h * per).toFixed(2);
      const autoScore = units > 0 ? 8 : 0;
      return { units, score: autoScore, autoScore, per };
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

    if (c.kind === "custom") {
      const units = Number(t.proposedUnits) || 0;
      const raw = t.proposedScore;
      const score = raw === "" || raw == null ? 0 : Number(raw) || 0;
      return { units, score, autoScore: score, proposed: true };
    }

    return { units: 0, score: 0, autoScore: 0 };
  }

  /* หน่วยที่คาดว่าจะได้รับในหน้า PA ล่วงหน้า ไม่คูณบทบาท ไม่บล็อกฐานข้อมูล */
  function expectedPreview(t, groupId) {
    const c = findCrit(groupId, t && t.criteriaId);
    if (!c || !c.id) return { units: 0, label: "—" };
    if (c.kind === "pub") return { units: c.units, label: fmtUnit(c.units) };
    if (c.kind === "grant_th" || c.kind === "grant_en" || c.kind === "grant_mu") {
      const gres = grantUnits(c.kind, t.amount);
      return { units: gres.units, label: gres.units ? fmtUnit(gres.units) : "—" };
    }
    if (c.kind === "hours") {
      const per = c.per || 0;
      const h = Number(t.hours) || 0;
      if (h) return { units: +(h * per).toFixed(2), label: fmtUnit(+(h * per).toFixed(2)) };
      return { units: 0, label: "—" };
    }
    if (c.kind === "count") {
      const n = Number(t.qty) || 0;
      if (n) return { units: +(n * (c.per || 0)).toFixed(2), label: fmtUnit(+(n * (c.per || 0)).toFixed(2)) };
      return { units: 0, label: `${c.per || 0} หน่วย/รายการ` };
    }
    if (c.kind === "fixed") return { units: c.units || 0, label: fmtUnit(c.units || 0) };
    if (c.kind === "custom") {
      const n = Number(t.proposedUnits) || 0;
      return { units: n, label: n ? fmtUnit(n) : "เสนอหน่วยเองเมื่อประเมิน" };
    }
    return { units: 0, label: "—" };
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

  /* compatibility with เดโมเดิม */
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
    PA_WEIGHT, CC_WEIGHT, CC_SUM_MAX, IDP_MAX, TOTAL_UNITS, PA_HEADERS, PA_PLAN_HEADERS,
    GROUP_HEADERS, paHeaders, paItemHeader, MAIN_SECTIONS, mainSectionOf, sectionHeaders,
    GROUPS, ROLES, KPI_TYPES, SCALE5, LEVELS, CC_ITEMS, FC_ITEMS, SUPPORT_FC_ITEMS,
    WORK_TYPES, IDP_METHODS,
    PUB, GRANT_SOURCES, CATALOG, STRAT_BUCKETS, TEACH_FORMULAS, TEACH_PICK, teachPickOf, teachCriteriaFromPick, MAX_EVIDENCE_FILES, SCORE_COND,
    PROJECT_REGISTRY, SYLLABUS_REGISTRY,
    searchProjects, findProject, searchSyllabus, findSyllabus, findTeachFormula,
    doiStatus, normalizeDoi, doiUrl, evidenceFiles, attachEvidence, expectedPreview,
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
