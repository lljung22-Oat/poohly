/* คำอธิบายตัวชี้วัด PA 2570 และหัวคอลัมน์แบบติดตามโครงการวิจัย ปี 2570
   ใช้ฝั่งอาจารย์ตามคำสั่งเจ้าของงาน ห้ามคิดหน่วยจากเล่มนี้ และห้ามใส่แถวตัวอย่างศึกษาศาสตร์ */
(function (root) {
  const UNIT_KPI_2570 = [
    { id: "intl-pub", title: "Number of International Publications", inUnitPa: false, unit: "เรื่อง", year: "ปีงบ 2570" },
    { id: "1.1", title: "Number of International Publications in Q1 Journal", inUnitPa: true, unit: "เรื่อง", year: "ปีงบ 2570" },
    { id: "1.2", title: "Number of International Publications in Top 10 Journal", inUnitPa: true, unit: "เรื่อง", year: "ปีงบ 2570" },
    { id: "1.3", title: "Number of Publications with Academic-Corporate Collaboration", inUnitPa: true, unit: "เรื่อง", year: "ปีงบ 2570" },
    { id: "1.9.1", title: "จำนวนเงินทุนวิจัยจากแหล่งทุนภายนอก (ในประเทศ)", inUnitPa: true, unit: "บาท", year: "ปีงบ 2570", note: "นับเงินในสัญญา ไม่นับเบิกจ่ายจริงใน PA ส่วนงาน ไม่นับ Fundamental Fund เงินทุนรับทำวิจัย และคลินิก" },
    { id: "1.9.2", title: "จำนวนเงินทุนวิจัยจากแหล่งทุนภายนอก (ต่างประเทศ)", inUnitPa: true, unit: "บาท", year: "ปีงบ 2570", note: "นับเงินในสัญญา ไม่นับเบิกจ่ายจริงใน PA ส่วนงาน ไม่นับเงินทุนรับทำวิจัยและคลินิก" },
    { id: "1.9.3", title: "จำนวนเงินทุนวิจัยจากการวิจัยทางคลินิก (CTA) ทั้งในประเทศและต่างประเทศ", inUnitPa: true, unit: "บาท", year: "ปีงบ 2570", note: "นับเงินในสัญญา ไม่นับเบิกจ่ายจริงใน PA ส่วนงาน" },
    { id: "2.1.1", title: "ระดับ 3 การจัดการเรียนการสอนข้ามศาสตร์ หรือเทียบเท่า", inUnitPa: true, unit: "คน", year: "ปีงบ 2570", note: "MUPSF ระดับ 3 และ 4 และ UKPSF Senior Fellow / Principal Fellow" },
    { id: "2.1.2", title: "ระดับ 2 การจัดการเรียนการสอนเฉพาะกลุ่ม หรือเทียบเท่า", inUnitPa: true, unit: "คน", year: "ปีงบ 2570", note: "MUPSF ระดับ 2 และ UKPSF Fellow" },
    { id: "2.2.1", title: "ร้อยละของหลักสูตรระดับปริญญาตรีที่ได้รับการรับรองคุณภาพตามมาตรฐานระดับสากล", inUnitPa: true, unit: "ร้อยละ", year: "ปีงบ 2570", note: "ตัวหาร 79 ตามเล่ม ห้ามนำไปคูณฐานหน่วย 1,820" },
    { id: "2.2.2", title: "ร้อยละของหลักสูตรระดับบัณฑิตศึกษาที่ได้รับการรับรองคุณภาพตามมาตรฐานระดับสากล", inUnitPa: true, unit: "ร้อยละ", year: "ปีงบ 2570", note: "ตัวหาร 248 ตามเล่ม" },
    { id: "2.3", title: "ร้อยละของหลักสูตรระดับปริญญาตรี สาขาวิชาวิทยาศาสตร์สุขภาพที่ครบวงรอบ ที่ได้รับการรับรองคุณภาพตามมาตรฐานระดับสากล", inUnitPa: true, unit: "ร้อยละ", year: "ปีงบ 2570", note: "ตัวหาร 26 ตามเล่ม" },
    { id: "2.16.1", title: "นักศึกษา inbound ระยะเวลาตั้งแต่ 12 สัปดาห์ขึ้นไป", inUnitPa: true, unit: "คน", year: "ปีการศึกษา 2569", note: "Physical Mobility เท่านั้น" },
    { id: "2.16.2", title: "นักศึกษา inbound ระยะเวลาน้อยกว่า 12 สัปดาห์", inUnitPa: true, unit: "คน", year: "ปีการศึกษา 2569", note: "Physical Mobility เท่านั้น" },
    { id: "2.16.3", title: "นักศึกษา outbound ระยะเวลาตั้งแต่ 12 สัปดาห์ขึ้นไป", inUnitPa: true, unit: "คน", year: "ปีการศึกษา 2569", note: "Physical Mobility เท่านั้น" },
    { id: "2.16.4", title: "นักศึกษา outbound ระยะเวลาน้อยกว่า 12 สัปดาห์", inUnitPa: true, unit: "คน", year: "ปีการศึกษา 2569", note: "Physical Mobility เท่านั้น" },
    { id: "3.1", title: "จำนวนนโยบายชี้นำสังคมของมหาวิทยาลัยที่สำคัญระดับชาติและนานาชาติ", inUnitPa: true, unit: "เรื่อง", year: "ปีงบ 2570", note: "ไม่นับสะสมปีก่อน" },
    { id: "3.2", title: "จำนวน Changemaker/ Change Agent", inUnitPa: true, unit: "คน", year: "ปีงบ 2570", note: "มติคณะกรรมการเป็นที่สุด ไม่นับการตีพิมพ์อย่างเดียว" },
    { id: "4.4", title: "รายงานการวิเคราะห์การจัดการทางการเงินเชิงกลยุทธ์ (Strategic Financial Management)", inUnitPa: true, unit: "ร้อยละ", year: "ปีงบ 2570", note: "สูตรร้อยละยังไม่มีในเล่ม" },
    { id: "4.10.1", title: "ประสิทธิภาพการใช้งบประมาณแผ่นดิน เมื่อจบปีงบประมาณ", inUnitPa: true, unit: "ร้อยละ", year: "ปีงบ 2570" },
    { id: "4.10.2", title: "ประสิทธิภาพการใช้งบประมาณเงินรายได้ เมื่อจบปีงบประมาณ", inUnitPa: true, unit: "ร้อยละ", year: "ปีงบ 2570" },
    { id: "4.11.1.1", title: "ค่า EBIDA เป็นบวก (รวมทุกแหล่งเงิน)", inUnitPa: true, unit: "เป็นบวก/เป็นลบ", year: "ปีงบ 2570" },
    { id: "4.11.1.2", title: "ค่า EBIDA เป็นบวก (ไม่รวมรายได้จากรัฐบาล)", inUnitPa: true, unit: "เป็นบวก/เป็นลบ", year: "ปีงบ 2570" },
    { id: "4.11.2", title: "ค่า Net Income เป็นบวก", inUnitPa: true, unit: "เป็นบวก/เป็นลบ", year: "ปีงบ 2570" },
    { id: "4.11.3", title: "ค่า Net Profit Margin มากกว่าร้อยละ 5", inUnitPa: true, unit: "ร้อยละ", year: "ปีงบ 2570" },
    { id: "4.11.4", title: "ค่า ROA มากกว่าร้อยละ 5", inUnitPa: true, unit: "ร้อยละ", year: "ปีงบ 2570" },
    { id: "4.12", title: "ร้อยละของห้องปฏิบัติการที่มีการใช้สารเคมีได้รับการรับรองมาตรฐานห้องปฏิบัติการปลอดภัยในรูปแบบ Peer Evaluation", inUnitPa: true, unit: "ร้อยละ", year: "ปีงบ 2570", note: "ตัวหารยังไม่มีในเล่ม" }
  ];

  const INT_COLS = [
    ["status", "สถานะ"],
    ["no", "ที่"],
    ["name", "ชื่อโครงการ"],
    ["lead", "หัวหน้าโครงการ"],
    ["dept", "สังกัด"],
    ["funder", "ชื่อแหล่งทุน"],
    ["start", "ระยะเวลาเริ่มโครงการ"],
    ["end", "ระยะเวลาสิ้นสุดโครงการ"],
    ["amount", "จำนวนเงินตลอดโครงการ"],
    ["objective", "วัตถุประสงค์"],
    ["benefit", "ประโยชน์ของโครงการ"],
    ["output", "ผลผลิต (output)"],
    ["contract", "สัญญาเลขที่"]
  ];

  const NOTIFY_COLS = [
    ["no", "ที่"],
    ["name", "ชื่อโครงการ"],
    ["lead", "หัวหน้าโครงการ"],
    ["dept", "สังกัด"],
    ["remark", "หมายเหตุ"]
  ];

  const STATUS_FOUND = ["รออนุมัติดำเนินโครงการ"];
  const REMARK_FOUND = ["ทุนส่วนตัว"];

  const api = {
    UNIT_KPI_2570, INT_COLS, NOTIFY_COLS, STATUS_FOUND, REMARK_FOUND,
    SOURCE_PDF: "sources/คำอธิบายตัวชี้วัด-PA-2570-ฉบับจัดทำ-PA.pdf",
    SOURCE_XLSX: "sources/แบบติดตามข้อมูลโครงการวิจัย-ปี-2570.xlsx"
  };
  root.Faculty2570 = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
