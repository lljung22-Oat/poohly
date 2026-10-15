import { useState } from "react";

const doors = [
  { id: "ratee", title: "ผู้รับการประเมิน", text: "อาจารย์และเจ้าหน้าที่สายสนับสนุน" },
  { id: "evaluator", title: "ผู้ประเมิน", text: "หัวหน้างานขั้นต้น และหัวหน้างาน" },
  { id: "admin", title: "ผู้ดูแล", text: "ฝ่ายบุคคลากร และ Admin มหาวิทยาลัย" },
];

export default function Login({ onDone }) {
  const [portal, setPortal] = useState("ratee");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("2570");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portal, username, password, year }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "เข้าสู่ระบบไม่ได้");
      return;
    }
    await onDone(data);
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-3xl content-center gap-6 px-4 py-10">
      <div>
        <p className="text-sm text-[#5c564c]">คณะสังคมศาสตร์และมนุษยศาสตร์</p>
        <h1 className="text-2xl font-semibold">เข้าสู่ระบบประเมินผลการปฏิบัติงาน</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {doors.map((door) => (
          <button
            key={door.id}
            className={`rounded-lg border px-3 py-4 text-left ${portal === door.id ? "border-[#1f3d32] bg-white" : "bg-[#ebe6db]"}`}
            onClick={() => setPortal(door.id)}
          >
            <span className="block font-medium">{door.title}</span>
            <span className="text-sm text-[#5c564c]">{door.text}</span>
          </button>
        ))}
      </div>
      <form className="grid gap-3 rounded-lg bg-white p-4" onSubmit={submit}>
        <label className="grid gap-1 text-sm">
          ปีงบประมาณ
          <select className="rounded border px-2 py-1" value={year} onChange={(event) => setYear(event.target.value)}>
            <option>2570</option>
            <option>2569</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          ชื่อผู้ใช้
          <input className="rounded border px-2 py-1" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        </label>
        <label className="grid gap-1 text-sm">
          รหัสผ่าน
          <input className="rounded border px-2 py-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button className="w-fit rounded bg-[#1f3d32] px-4 py-2 text-white">เข้าสู่ระบบ</button>
      </form>
    </main>
  );
}
