/**
 * OWNER: Cursor หัวหน้าชุด — C4 และ C10
 * แต่ละบทบาทเห็นเฉพาะหน้าของตน ไม่มีปุ่มสลับบทบาท
 */

const RATEE = new Set(["faculty", "support"]);
const EVALUATOR = new Set(["firstHead", "head"]);

export function menusFor(user, config, paApproved) {
  const year = config.defaultYear;
  if (user.role === "faculty") {
    return [
      { id: "home", label: "หน้าหลัก", to: "/" },
      { id: "profile", label: "ข้อมูลบุคลากร", to: "/profile" },
      { id: "leave", label: "วันลา", to: "/leave" },
      { id: "time", label: "เวลาเข้าออก", to: "/time" },
      { id: "paFaculty", label: "PA ภาระงานอาจารย์", to: "/pa" },
      { id: "cc", label: "สมรรถนะ", to: "/cc" },
      { id: "idp", label: "แผนพัฒนารายบุคคล (IDP)", to: "/idp" },
      { id: "research2570", label: "แบบติดตามข้อมูลโครงการวิจัย ปี 2570", to: "/research" },
      { id: "indicator2570", label: "คำอธิบายตัวชี้วัด PA 2570 (ฉบับจัดทำ PA)", to: "/indicators" },
      { id: "report", label: "รายงานและติดตามผลการดำเนินการ (REPORT)", to: "/report" },
      { id: "help", label: "ช่วยเหลือ", to: "/help" },
    ];
  }
  if (user.role === "support") {
    const items = [
      { id: "home", label: "หน้าหลัก", to: "/" },
      { id: "profile", label: "ข้อมูลบุคลากร", to: "/profile" },
      { id: "leave", label: "วันลา", to: "/leave" },
      { id: "time", label: "เวลาเข้าออก", to: "/time" },
      { id: "paSupport", label: "ประเมินภาระงานสายสนับสนุน", to: "/pa" },
      { id: "form05", label: "แบบ 05", to: "/staff/form05" },
    ];
    if (paApproved) items.push({ id: "follow", label: "แบบ 06 ติดตาม", to: "/staff/form06" });
    items.push(
      { id: "form07", label: "ประเมินผลงาน (แบบ 07)", to: "/staff/form07" },
      { id: "form08", label: "แบบ 08", to: "/staff/form08" },
      { id: "form09", label: "แบบ 09", to: "/staff/form09" },
      { id: "cc", label: "สมรรถนะ", to: "/cc" },
      { id: "idp", label: "แผนพัฒนารายบุคคล (IDP)", to: "/idp" },
      { id: "report", label: "รายงานและติดตามผลการดำเนินการ (REPORT)", to: "/report" },
      { id: "help", label: "ช่วยเหลือ", to: "/help" },
    );
    return items;
  }
  if (user.role === "firstHead") {
    return [
      { id: "team", label: "รายชื่อผู้รับการประเมิน", to: "/team" },
      { id: "help", label: "ช่วยเหลือ", to: "/help" },
    ];
  }
  if (user.role === "head") {
    return [
      { id: "team", label: "รายชื่อผู้รับการประเมิน", to: "/team" },
      { id: "help", label: "ช่วยเหลือ", to: "/help" },
    ];
  }
  if (user.role === "hr") {
    return [
      { id: "calendar", label: `รอบและปฏิทิน ${year}`, to: "/calendar" },
      { id: "sets", label: "ชุดประเมิน", to: "/sets" },
      { id: "people", label: "บุคลากรส่วนงาน", to: "/people" },
      { id: "dispatch", label: "รายการส่งไฟล์ต่อซอง", to: "/dispatch" },
      { id: "help", label: "ช่วยเหลือ", to: "/help" },
    ];
  }
  return [
    { id: "structure", label: "โครงสร้าง", to: "/people" },
    { id: "accounts", label: "บัญชีกำหนดสิทธิ์", to: "/people" },
    { id: "dispatch", label: "รายการส่งไฟล์ต่อซอง", to: "/dispatch" },
    { id: "help", label: "ช่วยเหลือ", to: "/help" },
  ];
}

export function portalOf(role) {
  if (RATEE.has(role)) return "ratee";
  if (EVALUATOR.has(role)) return "evaluator";
  if (role === "hr" || role === "admin") return "admin";
  return null;
}

export function roleLabel(role, labelMap) {
  if (role === "faculty" || role === "support") return labelMap.ratee;
  return labelMap[role] || role;
}

export function isInTeam(actor, target, rowsById) {
  if (!target) return false;
  if (actor.role === "admin") return true;
  if (actor.role === "hr") return actor.faculty_name === target.faculty_name;
  if (actor.role === "firstHead") return target.supervisor_id === actor.id;
  if (actor.role === "head") {
    if (target.supervisor_id === actor.id) return true;
    const supervisor = rowsById.get(target.supervisor_id);
    return Boolean(supervisor && supervisor.supervisor_id === actor.id);
  }
  return actor.id === target.id;
}

export function can(actor, action, target) {
  const self = target && actor.id === target.id;
  const track = target?.track || actor.track;
  switch (action) {
    case "editOwnProfile":
      return self && RATEE.has(actor.role);
    case "editUnitProfile":
      return actor.role === "hr" && actor.faculty_name === target?.faculty_name;
    case "manageAccounts":
      return actor.role === "admin";
    case "viewCalendar":
      return actor.role === "hr" || actor.role === "admin";
    case "editPa":
      return self && RATEE.has(actor.role);
    case "approvePa":
    case "idpDecide":
    case "idpEvaluate":
    case "scoreHead":
    case "signFaculty":
      return actor.role === "head";
    case "scoreFirst":
      return actor.role === "firstHead";
    case "selfScore":
    case "scoreSelf":
    case "idpEdit":
    case "idpReport":
    case "ack":
    case "disagree":
      return self && RATEE.has(actor.role);
    case "research":
      return track === "faculty" && (self || actor.role === "firstHead" || actor.role === "head" || actor.role === "hr");
    case "researchWrite":
      return self && actor.role === "faculty";
    case "indicators":
      return track === "faculty" && actor.role !== "admin";
    case "staffForm":
      return track === "support" && actor.role !== "faculty";
    case "viewScores":
      return actor.role !== "admin";
    case "dispatch":
      return actor.role === "hr" || actor.role === "admin";
    default:
      return false;
  }
}

export const HIDDEN_FROM_FACULTY = ["paStaff", "follow", "scoreSum", "form05", "form06", "form07", "form08", "form09"];
export const HIDDEN_FROM_SUPPORT = ["paFaculty", "research2570", "indicator2570", "shpa", "unitTable"];
