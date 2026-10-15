import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";

export function LeavePage() {
  return (
    <div>
      <h2 className="text-xl font-semibold">วันลา</h2>
      <p className="mt-2 rounded bg-[#f6f1e4] px-3 py-2 text-sm">SOURCE_MISSING — ไม่มีแบบวันลาในไฟล์ต้นทาง จึงไม่สร้างประเภทลา</p>
    </div>
  );
}

export function TimePage() {
  return (
    <div>
      <h2 className="text-xl font-semibold">เวลาเข้าออก</h2>
      <p className="mt-2 rounded bg-[#f6f1e4] px-3 py-2 text-sm">SOURCE_MISSING — ไม่มีแบบเวลาในไฟล์ต้นทาง จึงไม่สร้างคอลัมน์</p>
    </div>
  );
}

export function StaffPage() {
  const { form } = useParams();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    api(`/api/staff-form/me/${form}`).then(setData).catch((error) => setMessage(error.message));
  }, [form]);
  return (
    <div>
      <h2 className="text-xl font-semibold">{form}</h2>
      {message ? <p className="mt-2 text-sm">{message}</p> : null}
      {data ? <p className="mt-2 rounded bg-[#f6f1e4] px-3 py-2 text-sm">ช่องแบบพิมพ์: {data.source} · rubrics: {data.rubrics}</p> : null}
    </div>
  );
}

export function HelpPage() {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    api("/api/help").then((data) => setLines(data.lines));
  }, []);
  return (
    <div>
      <h2 className="text-xl font-semibold">ช่วยเหลือ</h2>
      <ul className="mt-3 grid gap-2 text-sm">
        {lines.map((line) => <li key={line}>{line}</li>)}
      </ul>
    </div>
  );
}

export function CalendarPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api("/api/calendar").then(setData);
  }, []);
  if (!data) return <p>กำลังโหลด</p>;
  return (
    <div className="grid gap-2">
      <h2 className="text-xl font-semibold">รอบและปฏิทิน</h2>
      <p className="text-sm">{data.employmentRule}</p>
      <p className="text-sm">ประเภทบุคคลของบัญชีตัวอย่าง: {data.personType} จึงไม่เลือกจำนวนรอบให้</p>
      {data.rounds.map((round) => (
        <p key={round.id} className="rounded border px-3 py-2 text-sm">ปี {round.fiscal_year} · วันที่ {round.calendar_dates} · รูปแบบรอบ {round.round_pattern}</p>
      ))}
    </div>
  );
}

export function ReportPage() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    api("/api/report/me").then(setData).catch((error) => setMessage(error.message));
  }, []);
  if (!data) return <p>{message || "กำลังโหลด"}</p>;
  return (
    <div className="grid gap-2">
      <h2 className="text-xl font-semibold">{data.title}</h2>
      <p className="text-sm">{data.profile.fullName} · ปี {data.year}</p>
      <p className="text-sm">สัดส่วน PA {data.weights.pa} + CC {data.weights.cc}</p>
      <p className="text-sm">รวมถ่วงน้ำหนัก: {data.weightedTotal}</p>
      <p className="text-sm">ระดับ: {data.level} ({data.levelReason})</p>
      <p className="text-sm">รายงานยาว: {data.longNarrative ? "มี" : "ไม่มี"}</p>
      {data.pa?.facultySigned && data.pa.status === "head" ? (
        <div className="flex gap-2">
          <button className="rounded border px-3 py-2" onClick={() => api("/api/review/me/ack", { method: "POST" }).then(() => setMessage("รับทราบทั้ง PA และ CC"))}>รับทราบ</button>
          <button className="rounded border px-3 py-2" onClick={() => {
            const reason = window.prompt("เหตุผลที่ไม่เห็นด้วย");
            if (!reason) return;
            api("/api/review/me/disagree", { method: "POST", body: { reason } }).then(() => setMessage("ส่งกลับหัวหน้างานทั้ง PA และ CC"));
          }}>ไม่เห็นด้วย</button>
        </div>
      ) : null}
      {message ? <p className="text-sm">{message}</p> : null}
    </div>
  );
}

export function DispatchPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api("/api/dispatch").then(setData);
  }, []);
  if (!data) return <p>กำลังโหลด</p>;
  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-semibold">รายการส่งไฟล์ต่อซอง</h2>
      <p className="text-sm">หนึ่งแชทหนึ่งซอง วางชุดแกนก่อนทุกครั้ง ถ้าคำตอบไม่มีสัญญาคืนซองให้ทิ้ง</p>
      <p className="rounded bg-[#f6f1e4] px-3 py-2 text-sm">{data.prompt}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr>{["ซอง", "ให้ AI นี้ทำ", "ต้องส่งไฟล์", "เปิดซองได้ไหม"].map((head) => <th key={head} className="border px-2 py-1 text-left">{head}</th>)}</tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.id}>
                <td className="border px-2 py-1">{row.id}</td>
                <td className="border px-2 py-1">{row.owner}</td>
                <td className="border px-2 py-1">{row.send.join(" · ")}</td>
                <td className="border px-2 py-1">{row.open ? "ได้" : "ยังไม่ได้"} · {row.blocked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
