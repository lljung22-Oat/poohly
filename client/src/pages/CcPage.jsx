import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function CcPage() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api("/api/cc/me").then(setData).catch((error) => setMessage(error.message));
  }, []);

  if (!data) return <p>{message || "กำลังโหลด"}</p>;

  async function save() {
    const saved = await api("/api/cc/me", {
      method: "PUT",
      body: { scores: data.items.map((item) => ({ code: item.code, score: item.selfScore })) },
    });
    setData(saved);
  }

  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-semibold">ประเมินสมรรถนะ</h2>
      <p className="text-sm">สถานะ {data.statusLabel} · {data.count} ข้อ · คะแนน 0–10</p>
      {data.items.map((item, index) => (
        <label key={item.code} className="grid max-w-sm gap-1 text-sm">
          {item.name}
          <input className="rounded border px-2 py-1" disabled={item.selfLocked} value={item.selfScore ?? ""} onChange={(event) => {
            const items = data.items.map((row, rowIndex) => rowIndex === index ? { ...row, selfScore: event.target.value } : row);
            setData({ ...data, items });
          }} />
        </label>
      ))}
      {message ? <p className="text-sm">{message}</p> : null}
      {!data.items.some((item) => item.selfLocked) ? (
        <div className="flex gap-2">
          <button className="rounded border px-4 py-2" onClick={() => save().catch((error) => setMessage(error.message))}>บันทึก</button>
          <button className="rounded bg-[#1f3d32] px-4 py-2 text-white" onClick={async () => {
            try {
              await save();
              setData(await api("/api/cc/me/submit", { method: "POST" }));
              setMessage("ส่งแล้ว ยกเลิกประเมินตนเองไม่ได้");
            } catch (error) {
              setMessage(error.message);
            }
          }}>ส่งสมรรถนะ</button>
        </div>
      ) : null}
    </div>
  );
}
