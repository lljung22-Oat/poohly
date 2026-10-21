import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function IdpPage() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    setData(await api("/api/idp/me"));
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, []);

  if (!data) return <p>{message || "กำลังโหลด"}</p>;

  async function save(items = data.items) {
    const saved = await api("/api/idp/me", {
      method: "PUT",
      body: { items: items.map((item) => ({ id: item.id, title: item.title, method: item.method, budget: item.budget })) },
    });
    setData(saved);
    setMessage(saved.hint || "บันทึกแล้ว");
  }

  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-semibold">จัดทำแผนพัฒนารายบุคคล (IDP)</h2>
      <p className="text-sm">วิธี 70 / 20 / 10 · ไม่ควรเกิน {data.maxItemsHint} รายการต่อปี · ผลเป็นข้อความ ไม่ใช่คะแนน 0–10</p>
      {data.items.map((item, index) => (
        <div key={item.id || index} className="grid gap-2 rounded border p-3">
          <p className="text-sm">{item.statusLabel}</p>
          <input className="rounded border px-2 py-1" disabled={item.status !== "draft" && item.status !== "back"} value={item.title || ""} placeholder="รายการพัฒนา" onChange={(event) => {
            const items = data.items.map((row, rowIndex) => rowIndex === index ? { ...row, title: event.target.value } : row);
            setData({ ...data, items });
          }} />
          <select className="rounded border px-2 py-1" disabled={item.status !== "draft" && item.status !== "back"} value={item.method || ""} onChange={(event) => {
            const items = data.items.map((row, rowIndex) => rowIndex === index ? { ...row, method: event.target.value } : row);
            setData({ ...data, items });
          }}>
            <option value="">วิธีพัฒนา</option>
            {data.methods.map((method) => <option key={method} value={method}>{method}</option>)}
          </select>
          <input className="rounded border px-2 py-1" disabled={item.status !== "draft" && item.status !== "back"} value={item.budget ?? 0} placeholder="งบประมาณ ไม่มีใส่ 0" onChange={(event) => {
            const items = data.items.map((row, rowIndex) => rowIndex === index ? { ...row, budget: event.target.value } : row);
            setData({ ...data, items });
          }} />
          {item.status === "idpApproved" ? (
            <button className="w-fit rounded border px-3 py-1" onClick={async () => {
              const report = window.prompt("รายงานผลการพัฒนา") || "";
              setData(await api("/api/idp/me/report", { method: "POST", body: { itemId: item.id, report } }));
            }}>รายงานผลการพัฒนา</button>
          ) : null}
          {item.report ? <p className="text-sm">รายงาน: {item.report}</p> : null}
          {item.result ? <p className="text-sm">ผล: {item.result}</p> : null}
          {item.status === "idpEval" ? (
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1" onClick={() => api("/api/idp/me/ack", { method: "POST", body: { itemId: item.id } }).then(setData)}>รับทราบ</button>
              <button className="rounded border px-3 py-1" onClick={() => {
                const reason = window.prompt("เหตุผลที่ไม่เห็นด้วย");
                if (!reason) return;
                api("/api/idp/me/disagree", { method: "POST", body: { itemId: item.id, reason } }).then(setData);
              }}>ไม่เห็นด้วย</button>
            </div>
          ) : null}
        </div>
      ))}
      <button className="w-fit text-sm underline" onClick={() => setData({ ...data, items: [...data.items, { title: "", method: "70", budget: 0, status: "draft", statusLabel: "ฉบับร่าง" }] })}>เพิ่มรายการ</button>
      {message ? <p className="text-sm">{message}</p> : null}
      <div className="flex gap-2">
        <button className="rounded border px-4 py-2" onClick={() => save().catch((error) => setMessage(error.message))}>บันทึก</button>
        <button className="rounded bg-[#1f3d32] px-4 py-2 text-white" onClick={async () => {
          try {
            await save();
            setData(await api("/api/idp/me/submit", { method: "POST" }));
            setMessage("ส่งแผนแล้ว");
          } catch (error) {
            setMessage(error.message);
          }
        }}>ส่งขออนุมัติ</button>
      </div>
    </div>
  );
}
