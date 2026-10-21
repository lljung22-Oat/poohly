/**
 * OWNER: Cursor หัวหน้าชุด (C1 C2)
 * ลำดับภาระงานอาจารย์ตามโค้ดอ้างอิงที่เจ้าของงานระบุว่าเรียงถูก
 * เลข 1.1 ในไฟล์นี้คือเกณฑ์ประกาศคณะ (Top1) ไม่ใช่รหัส 1.1 ของเล่มตัวชี้วัดส่วนงาน (Q1)
 * ห้ามเรียงเกณฑ์ชุดนี้ด้วยรหัสใน unitPaFy2570.catalog
 */

export const FACULTY_GROUPS = [
  { no: 1, id: "strat", pct: 25, cap: 455, title: "ภาระงานที่ 1", name: "งานตามภารกิจที่สอดคล้องกับประเด็นยุทธศาสตร์ของมหาวิทยาลัยและแผนกลยุทธ์ของส่วนงาน" },
  { no: 2, id: "main", pct: 55, cap: 1000, title: "ภาระงานที่ 2", name: "งานตามภารกิจหลักของตำแหน่งงาน ตามหน้าที่ความรับผิดชอบ ตามคำบรรยายลักษณะงาน" },
  { no: 3, id: "assign", pct: 15, cap: 273, title: "ภาระงานที่ 3", name: "งานที่ได้รับมอบหมาย" },
  { no: 4, id: "community", pct: 5, cap: 92, title: "ภาระงานที่ 4", name: "งานเพื่อส่วนรวม" },
];

const pub = "ยุทธศาสตร์ตีพิมพ์";
const grant = "ยุทธศาสตร์ทุนวิจัย";
const other = "ยุทธศาสตร์อื่นๆ";

export const FACULTY_CRITERIA = [
  { groupId: "strat", bucket: pub, id: "pub_top1", label: "1.1 บทความตีพิมพ์ Top1 ตาม SJR", units: 455, score: 10 },
  { groupId: "strat", bucket: pub, id: "pub_top10", label: "1.2 บทความตีพิมพ์ Top10 Percentile ตาม SJR", units: 410, score: 9 },
  { groupId: "strat", bucket: pub, id: "pub_q1", label: "1.3 บทความตีพิมพ์ Q1 ตาม SJR", units: 364, score: 8 },
  { groupId: "strat", bucket: pub, id: "pub_q2", label: "1.4 บทความตีพิมพ์ Q2", units: 273, score: 6 },
  { groupId: "strat", bucket: pub, id: "pub_q3", label: "1.5 บทความตีพิมพ์ Q3", units: 228, score: 5 },
  { groupId: "strat", bucket: pub, id: "pub_q4", label: "1.6 บทความตีพิมพ์ Q4", units: 182, score: 4 },
  {
    groupId: "strat",
    bucket: grant,
    id: "grant_th",
    label: "1.7 ทุนสนับสนุนจากหน่วยงานในประเทศ",
    tiers: ["ตั้งแต่ 3,000,000 บาท", "2,000,000–2,999,999 บาท", "1,000,000–1,999,999 บาท", "500,000–999,999 บาท", "น้อยกว่า 500,000 บาท"],
  },
  {
    groupId: "strat",
    bucket: grant,
    id: "grant_en",
    label: "1.8 ทุนสนับสนุนจากหน่วยงานต่างประเทศ",
    tiers: ["ตั้งแต่ 1,000,000 บาท", "700,000–999,999 บาท", "500,000–699,999 บาท", "200,000–499,999 บาท", "น้อยกว่า 200,000 บาท"],
  },
  {
    groupId: "strat",
    bucket: grant,
    id: "grant_mu",
    label: "1.9 ทุนเงินรายได้มหาวิทยาลัย/ส่วนงาน",
    tiers: ["ตั้งแต่ 500,000 บาท", "400,000–499,999 บาท", "300,000–399,999 บาท", "200,000–299,999 บาท", "น้อยกว่า 200,000 บาท"],
  },
  { groupId: "strat", bucket: other, id: "mupsf4", label: "2.1 UKPSF Principal Fellow / MUPSF ระดับ 4", units: 455, score: 10 },
  { groupId: "strat", bucket: other, id: "mupsf3", label: "2.2 UKPSF Senior Fellow / MUPSF ระดับ 3", units: 410, score: 9 },
  { groupId: "strat", bucket: other, id: "mupsf2", label: "2.3 UKPSF Fellow / MUPSF ระดับ 2", units: 319, score: 7 },
  { groupId: "strat", bucket: other, id: "mupsf1", label: "2.4 MUPSF ระดับ 1", units: 182, score: 4 },
  { groupId: "strat", bucket: other, id: "policy_intl", label: "3.1 นโยบายชี้นำสังคมระดับนานาชาติ", units: 455, score: 10 },
  { groupId: "strat", bucket: other, id: "policy_nat", label: "3.1 นโยบายชี้นำสังคมระดับชาติ", units: 410, score: 9 },
  { groupId: "strat", bucket: other, id: "policy_prov", label: "3.1 นโยบายชี้นำสังคมระดับจังหวัด", units: 364, score: 8 },
  { groupId: "strat", bucket: other, id: "policy_amp", label: "3.1 นโยบายชี้นำสังคมระดับอำเภอ", units: 319, score: 7 },
  { groupId: "strat", bucket: other, id: "policy_tam", label: "3.1 นโยบายชี้นำสังคมระดับตำบล", units: 273, score: 6 },
  { groupId: "strat", bucket: other, id: "part_intl", label: "3.2 มีส่วนร่วมกำหนดนโยบายระดับนานาชาติ", units: 137, score: 3 },
  { groupId: "strat", bucket: other, id: "part_nat", label: "3.2 มีส่วนร่วมกำหนดนโยบายระดับชาติ", units: 91, score: 2 },
  { groupId: "main", bucket: "ภาระงานสอน", id: "teach_grad_main", label: "สอนป.โท/เอก ผู้สอนหลัก (1 ชม. = 4 หน่วย)" },
  { groupId: "main", bucket: "ภาระงานสอน", id: "teach_ug_lec", label: "สอนป.ตรี บรรยาย ผู้สอนหลัก (1 ชม. = 3 หน่วย)" },
  { groupId: "main", bucket: "ภาระงานสอน", id: "teach_ug_lab", label: "สอนป.ตรี ปฏิบัติ ผู้สอนหลัก (1 ชม. = 1.5 หน่วย)" },
  { groupId: "main", bucket: "ภาระงานสอน", id: "thesis_ug", label: "ควบคุมโครงงานป.ตรี (1 หน่วย/สัปดาห์/คน)" },
  { groupId: "main", bucket: "ภาระงานบริการวิชาการ", id: "course_proj", label: "โครงการหลักสูตร (1 ชม. = 3 หน่วย)" },
  { groupId: "main", bucket: "ภาระงานวิจัย", id: "res_proc_1", label: "กระบวนการวิจัย ระดับ 1 สัญญา/ธุรการ (80 หน่วย)", units: 80 },
  { groupId: "main", bucket: "ภาระงานวิจัย", id: "res_proc_2", label: "กระบวนการวิจัย ระดับ 2 ก้าวหน้า 20% หรือมี IRB (120)", units: 120 },
  { groupId: "main", bucket: "ภาระงานวิจัย", id: "res_proc_3", label: "กระบวนการวิจัย ระดับ 3 ก้าวหน้า 21–50% (160)", units: 160 },
  { groupId: "main", bucket: "ภาระงานวิจัย", id: "res_proc_4", label: "กระบวนการวิจัย ระดับ 4 ก้าวหน้า 51–90% (200)", units: 200 },
  { groupId: "main", bucket: "ภาระงานวิจัย", id: "res_proc_5", label: "กระบวนการวิจัย ระดับ 5 ร่างรายงานขั้นสุดท้าย (240)", units: 240 },
  { groupId: "assign", bucket: "งานที่ได้รับมอบหมาย", id: "asg_chair", label: "ประธานกรรมการ/เลขานุการ 1 โครงการ = 20 หน่วย" },
  { groupId: "assign", bucket: "งานที่ได้รับมอบหมาย", id: "asg_member", label: "กรรมการ 1 โครงการ = 15 หน่วย" },
  { groupId: "assign", bucket: "งานที่ได้รับมอบหมาย", id: "asg_attend", label: "เข้าร่วม 1 โครงการ = 10 หน่วย" },
  { groupId: "assign", bucket: "งานที่ได้รับมอบหมาย", id: "asg_prog_chair", label: "ประธานคณะกรรมการบริหาร 1 หลักสูตร = 78 หน่วย", units: 78 },
  { groupId: "assign", bucket: "งานที่ได้รับมอบหมาย", id: "asg_prog_sec", label: "กรรมการและเลขานุการบริหารหลักสูตร = 62 หน่วย", units: 62 },
  { groupId: "assign", bucket: "งานที่ได้รับมอบหมาย", id: "asg_prog_mem", label: "กรรมการบริหารหลักสูตร = 15 หน่วย", units: 15 },
  { groupId: "assign", bucket: "งานที่ได้รับมอบหมาย", id: "asg_prog_resp", label: "อาจารย์ผู้รับผิดชอบหลักสูตร = 10 หน่วย", units: 10 },
  { groupId: "assign", bucket: "งานที่ได้รับมอบหมาย", id: "asg_vice_dept", label: "รองหัวหน้าภาควิชา = 9 หน่วย/สัปดาห์" },
  { groupId: "assign", bucket: "งานที่ได้รับมอบหมาย", id: "asg_assist_dept", label: "ผู้ช่วยหัวหน้าภาควิชา = 6 หน่วย/สัปดาห์" },
  { groupId: "assign", bucket: "งานที่ได้รับมอบหมาย", id: "asg_other", label: "หัวข้องานอื่น (ระบุเอง)" },
  { groupId: "community", bucket: "งานเพื่อส่วนรวม", id: "com_chair", label: "ประธาน/เลขานุการกิจกรรมนักศึกษา = 20 หน่วย" },
  { groupId: "community", bucket: "งานเพื่อส่วนรวม", id: "com_member", label: "กรรมการกิจกรรมนักศึกษา = 15 หน่วย" },
  { groupId: "community", bucket: "งานเพื่อส่วนรวม", id: "com_attend", label: "เข้าร่วมกิจกรรมนักศึกษา = 5 หน่วย" },
  { groupId: "community", bucket: "งานเพื่อส่วนรวม", id: "sport_fac", label: "กีฬา ระดับส่วนงาน = 10 หน่วย", units: 10 },
  { groupId: "community", bucket: "งานเพื่อส่วนรวม", id: "sport_uni", label: "กีฬา ระดับมหาวิทยาลัย = 15 หน่วย", units: 15 },
  { groupId: "community", bucket: "งานเพื่อส่วนรวม", id: "sport_nat", label: "กีฬา ระดับชาติ = 20 หน่วย", units: 20 },
  { groupId: "community", bucket: "งานเพื่อส่วนรวม", id: "sport_intl", label: "กีฬา ระดับนานาชาติ = 30 หน่วย", units: 30 },
  { groupId: "community", bucket: "งานเพื่อส่วนรวม", id: "media_uni", label: "ให้ความรู้ผ่านสื่อระดับมหาวิทยาลัย ครั้งละ 10 หน่วย" },
  { groupId: "community", bucket: "งานเพื่อส่วนรวม", id: "media_nat", label: "ให้ความรู้ผ่านสื่อระดับชาติ/นานาชาติ ครั้งละ 15 หน่วย" },
  { groupId: "community", bucket: "งานเพื่อส่วนรวม", id: "com_other", label: "หัวข้องานอื่น (ระบุเอง)" },
];

export function findFacultyCriterion(id) {
  return FACULTY_CRITERIA.find((item) => item.id === id) || null;
}
