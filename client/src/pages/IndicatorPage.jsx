import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function IndicatorPage() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api("/api/indicators").then(setData).catch((error) => setMessage(error.message));
  }, []);

  if (!data) return <p>{message || "กำลังโหลด"}</p>;

  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-semibold">{data.sourceFile}</h2>
      <p className="text-sm">{data.title}</p>
      <p className="text-sm">ปกเล่ม: ข้อตกลงส่วนงาน · คำสั่งเจ้าของงาน: ใช้ฝั่งอาจารย์ · เก็บทั้งคู่</p>
      <p className="rounded bg-[#f6f1e4] px-3 py-2 text-sm">{data.note} · การเชื่อมหน่วยอาจารย์: {data.facultyUnitLink}</p>
      <p className="text-sm">ติดต่อ {data.contact.email} โทร {data.contact.phone}</p>
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr>
              {["รหัส", "ชื่อ", "ใน PA ส่วนงาน", "หน่วย", "สูตร"].map((head) => <th key={head} className="border px-2 py-1 text-left">{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.catalog.map((row) => (
              <tr key={row.id}>
                <td className="border px-2 py-1">{row.id}</td>
                <td className="border px-2 py-1">{row.title}</td>
                <td className="border px-2 py-1">{row.kind === "heading" ? "หัวข้อ" : row.inUnitPa === true ? "ใช่" : row.inUnitPa === false ? "ไม่" : "ไม่ระบุ"}</td>
                <td className="border px-2 py-1">{row.unit || ""}</td>
                <td className="border px-2 py-1">{row.formula || row.formulaDenominator || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
