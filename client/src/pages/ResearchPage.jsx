import { useEffect, useState } from "react";
import { api } from "../api.js";

const sheets = ["iNT", "แจ้งทำวิจัย"];

export default function ResearchPage() {
  const [sheet, setSheet] = useState("iNT");
  const [data, setData] = useState(null);
  const [draft, setDraft] = useState({});
  const [message, setMessage] = useState("");

  async function load(next = sheet) {
    const payload = await api(`/api/research/me/${encodeURIComponent(next)}`);
    setData(payload);
    setDraft({});
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, []);

  if (!data) return <p>{message || "กำลังโหลด"}</p>;

  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-semibold">แบบติดตามข้อมูลโครงการวิจัย ปี 2570</h2>
      <p className="text-sm">คนละแบบกับแบบ 06 ของสายสนับสนุน · ไม่คิดหน่วยจากจำนวนเงิน · แถวตัวอย่างในไฟล์ต้นทางไม่ถูกนำมาแสดง</p>
      <div className="flex gap-2">
        {sheets.map((name) => (
          <button key={name} className={`rounded px-3 py-1 ${sheet === name ? "bg-[#1f3d32] text-white" : "border"}`} onClick={() => { setSheet(name); load(name); }}>{name}</button>
        ))}
      </div>
      <p className="text-sm">{sheet === "iNT" ? `สถานะที่พบในไฟล์: ${(data.knownStatus || []).join(", ")} · สถานะอื่น ${data.otherStatuses}` : `หมายเหตุที่พบในไฟล์: ${(data.knownRemark || []).join(", ")} · หมายเหตุอื่น ${data.otherRemarks}`}</p>
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr>{data.columns.map((column) => <th key={column} className="border px-2 py-1 text-left">{column}</th>)}<th className="border px-2 py-1" /></tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.id}>
                {data.columns.map((column) => <td key={column} className="border px-2 py-1">{row[column] || ""}</td>)}
                <td className="border px-2 py-1">
                  <button className="text-sm underline" onClick={() => api(`/api/research/me/${encodeURIComponent(sheet)}/${row.id}`, { method: "DELETE" }).then(setData)}>ลบ</button>
                </td>
              </tr>
            ))}
            <tr>
              {data.columns.map((column) => (
                <td key={column} className="border px-1 py-1">
                  <input className="w-36 rounded border px-1 py-1" value={draft[column] || ""} onChange={(event) => setDraft({ ...draft, [column]: event.target.value })} />
                </td>
              ))}
              <td className="border px-2 py-1">
                <button className="rounded bg-[#1f3d32] px-2 py-1 text-white" onClick={async () => {
                  try {
                    setData(await api(`/api/research/me/${encodeURIComponent(sheet)}`, { method: "POST", body: draft }));
                    setDraft({});
                  } catch (error) {
                    setMessage(error.message);
                  }
                }}>เพิ่ม</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {message ? <p className="text-sm">{message}</p> : null}
    </div>
  );
}
