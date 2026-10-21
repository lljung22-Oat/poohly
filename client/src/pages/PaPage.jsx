import { useEffect, useState } from "react";
import { api } from "../api.js";

const emptyAgreement = () => ({ title: "", indicators: [{ title: "", kind: "", weight: "", target: "", indicatorRef: "" }] });

export default function PaPage() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    setData(await api("/api/pa/me"));
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, []);

  if (!data) return <p>{message || "กำลังโหลด"}</p>;
  const locked = ["reported", "firstHead", "head", "ack", "disagree"].includes(data.status);
  const workloads = [...data.workloads].sort((a, b) => a.groupNo - b.groupNo);

  function updateWorkload(groupId, patch) {
    setData({
      ...data,
      workloads: data.workloads.map((workload) => (workload.groupId === groupId ? { ...workload, ...patch } : workload)),
    });
  }

  async function save() {
    const saved = await api("/api/pa/me", {
      method: "PUT",
      body: {
        workloads: workloads.map((workload) => ({
          groupId: workload.groupId,
          weight: workload.weight,
          agreements: workload.agreements.map((agreement) => ({
            title: agreement.title,
            indicators: agreement.indicators.map((indicator) => ({
              title: indicator.title,
              kind: indicator.kind,
              weight: indicator.weight,
              target: indicator.target,
              indicatorRef: indicator.indicatorRef || null,
            })),
          })),
        })),
      },
    });
    setData(saved);
    return saved;
  }

  async function submit() {
    setMessage("");
    try {
      await save();
      setData(await api("/api/pa/me/submit", { method: "POST" }));
      setMessage("ส่งขออนุมัติแล้ว");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveScores() {
    const scores = data.workloads.flatMap((workload) =>
      workload.agreements.flatMap((agreement) => agreement.indicators.map((indicator) => ({ indicatorId: indicator.id, selfScore: indicator.selfScore }))),
    );
    setData(await api("/api/pa/me/self-score", { method: "PUT", body: { scores } }));
  }

  return (
    <div className="grid gap-4">
      <header>
        <h2 className="text-xl font-semibold">จัดทำข้อตกลงการปฏิบัติงาน (PA)</h2>
        <p className="text-sm text-[#5c564c]">สถานะ {data.statusLabel} · ผลการดำเนินงานเป็นตัวเลขและประเมินตนเอง</p>
      </header>
      {data.shpaColumns === "SOURCE_MISSING" ? (
        <p className="rounded bg-[#f6f1e4] px-3 py-2 text-sm">แบบฟอร์ม SHPA: SOURCE_MISSING — ยังไม่มีไฟล์ต้นฉบับ จึงไม่สร้างคอลัมน์บทความ</p>
      ) : null}
      {data.announcementUnits === "SOURCE_MISSING" ? (
        <p className="rounded bg-[#f6f1e4] px-3 py-2 text-sm">
          ฐานหน่วยที่ config ระบุคือ {data.totalUnits} ลำดับเกณฑ์ด้านล่างยึดโค้ดอ้างอิง ยังไม่นำไปคูณคะแนนรายคนจนกว่าผู้รู้จะยืนยัน รหัส 1.1 ของเล่มส่วนงานคือ Q1 คนละชุดกับ 1.1 Top1 ของประกาศคณะ
        </p>
      ) : null}
      {data.staffForms ? <p className="rounded bg-[#f6f1e4] px-3 py-2 text-sm">แบบ 05 ถึง 09: SOURCE_MISSING — หน้านี้คือโครงสร้างข้อตกลงตาม PMS ไม่ใช่แบบพิมพ์ที่ยังไม่มีไฟล์</p> : null}
      {workloads.map((workload) => {
        const named = (data.facultyGroups || []).find((group) => group.id === workload.groupId);
        const criteria = (data.facultyCriteria || []).filter((item) => item.groupId === workload.groupId);
        return (
        <section key={workload.groupId} className="grid gap-3 rounded border border-[#e4ded2] p-3">
          <h3 className="font-medium">{named ? `${named.title} · ${named.name}` : `${workload.groupNo}. ${workload.title}`}</h3>
          {workload.cap ? <p className="text-sm">เพดานกลุ่ม {workload.cap.pct}% ({workload.cap.cap} หน่วย) อ่านอย่างเดียว</p> : null}
          {criteria.length ? (
            <ol className="grid gap-1 text-sm">
              {criteria.map((item, itemIndex) => (
                <li key={item.id}>
                  {itemIndex + 1}. {item.label}
                  {itemIndex === 0 || criteria[itemIndex - 1].bucket !== item.bucket ? ` · ${item.bucket}` : ""}
                </li>
              ))}
            </ol>
          ) : null}
          <label className="grid max-w-xs gap-1 text-sm">
            น้ำหนักภาระงาน
            <input className="rounded border px-2 py-1" disabled={locked} value={workload.weight ?? ""} onChange={(event) => updateWorkload(workload.groupId, { weight: event.target.value })} />
          </label>
          {workload.agreements.map((agreement, index) => (
            <div key={agreement.id || index} className="grid gap-2 rounded bg-[#faf8f4] p-3">
              <p className="text-sm">สถานะข้อตกลง: {agreement.statusLabel}</p>
              <input className="rounded border px-2 py-1" disabled={locked || agreement.status === "wait" || agreement.status === "approved"} value={agreement.title || ""} onChange={(event) => {
                const agreements = workload.agreements.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item);
                updateWorkload(workload.groupId, { agreements });
              }} placeholder="ข้อตกลง" />
              {agreement.indicators.map((indicator, indicatorIndex) => (
                <div key={indicator.id || indicatorIndex} className="grid gap-2 md:grid-cols-2">
                  <input className="rounded border px-2 py-1" disabled={locked || agreement.status === "wait" || agreement.status === "approved"} placeholder="ตัวชี้วัด" value={indicator.title || ""} onChange={(event) => editIndicator(workload, index, indicatorIndex, { title: event.target.value })} />
                  <select className="rounded border px-2 py-1" disabled={locked || agreement.status === "wait" || agreement.status === "approved"} value={indicator.kind || ""} onChange={(event) => editIndicator(workload, index, indicatorIndex, { kind: event.target.value })}>
                    <option value="">ชนิดตัวชี้วัด</option>
                    {data.kinds.map((kind) => <option key={kind}>{kind}</option>)}
                  </select>
                  <input className="rounded border px-2 py-1" disabled={locked || agreement.status === "wait" || agreement.status === "approved"} placeholder="น้ำหนักตัวชี้วัด" value={indicator.weight ?? ""} onChange={(event) => editIndicator(workload, index, indicatorIndex, { weight: event.target.value })} />
                  <input className="rounded border px-2 py-1" disabled={locked || agreement.status === "wait" || agreement.status === "approved"} placeholder="เป้าหมาย" value={indicator.target || ""} onChange={(event) => editIndicator(workload, index, indicatorIndex, { target: event.target.value })} />
                  {criteria.length ? (
                    <select className="rounded border px-2 py-1 md:col-span-2" disabled={locked || agreement.status === "wait" || agreement.status === "approved"} value={criteria.some((item) => item.id === indicator.indicatorRef) ? indicator.indicatorRef : ""} onChange={(event) => editIndicator(workload, index, indicatorIndex, { indicatorRef: event.target.value })}>
                      <option value="">เกณฑ์ตามลำดับประกาศคณะ</option>
                      {criteria.map((item, itemIndex) => <option key={item.id} value={item.id}>{itemIndex + 1}. {item.label}</option>)}
                    </select>
                  ) : null}
                  {data.status === "approved" || indicator.selfLocked ? (
                    <label className="grid gap-1 text-sm">
                      คะแนนตนเอง 0–10
                      <input className="rounded border px-2 py-1" disabled={indicator.selfLocked} value={indicator.selfScore ?? ""} onChange={(event) => editIndicator(workload, index, indicatorIndex, { selfScore: event.target.value })} />
                      <span>{indicator.selfLabel || ""}</span>
                    </label>
                  ) : null}
                </div>
              ))}
              {agreement.status === "approved" && data.status === "approved" ? (
                <button className="w-fit text-sm underline" onClick={async () => {
                  if (!window.confirm("ยืนยันแก้ไขหลังเห็นชอบ")) return;
                  setData(await api("/api/pa/me/amend", { method: "POST", body: { agreementId: agreement.id, confirm: true } }));
                }}>แก้ไขหลังเห็นชอบ</button>
              ) : null}
            </div>
          ))}
          {!locked ? (
            <button className="w-fit text-sm underline" onClick={() => updateWorkload(workload.groupId, { agreements: [...workload.agreements, emptyAgreement()] })}>
              เพิ่มข้อตกลง
            </button>
          ) : null}
        </section>
        );
      })}
      {message ? <p className="text-sm">{message}</p> : null}
      {!locked && data.status !== "wait" ? (
        <div className="flex gap-2">
          <button className="rounded border px-4 py-2" onClick={() => save().then(() => setMessage("บันทึกฉบับร่างแล้ว")).catch((error) => setMessage(error.message))}>บันทึกฉบับร่าง</button>
          <button className="rounded bg-[#1f3d32] px-4 py-2 text-white" onClick={submit}>ส่งขออนุมัติ</button>
        </div>
      ) : null}
      {data.status === "approved" ? (
        <div className="flex gap-2">
          <button className="rounded border px-4 py-2" onClick={() => saveScores().then(() => setMessage("บันทึกคะแนนแล้ว")).catch((error) => setMessage(error.message))}>บันทึกคะแนน</button>
          <button className="rounded bg-[#1f3d32] px-4 py-2 text-white" onClick={async () => {
            try {
              await saveScores();
              setData(await api("/api/pa/me/self-score/submit", { method: "POST" }));
              setMessage("ส่งแล้วแก้ไม่ได้");
            } catch (error) {
              setMessage(error.message);
            }
          }}>ส่งผลการดำเนินงาน</button>
        </div>
      ) : null}
    </div>
  );

  function editIndicator(workload, agreementIndex, indicatorIndex, patch) {
    const agreements = workload.agreements.map((agreement, index) => {
      if (index !== agreementIndex) return agreement;
      return {
        ...agreement,
        indicators: agreement.indicators.map((indicator, itemIndex) => (itemIndex === indicatorIndex ? { ...indicator, ...patch } : indicator)),
      };
    });
    updateWorkload(workload.groupId, { agreements });
  }
}
