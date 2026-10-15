import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function PeoplePage({ mode }) {
  const [data, setData] = useState(null);
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ username: "", password: "", role: "faculty", fullName: "", position: "" });
  const [message, setMessage] = useState("");

  async function load() {
    const session = await api("/api/me");
    setMe(session);
    if (mode === "sets") setData(await api("/api/sets"));
    else setData(await api("/api/people"));
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, [mode]);

  if (!data || !me) return <p>{message || "กำลังโหลด"}</p>;

  if (mode === "sets") {
    return (
      <div className="grid gap-3">
        <h2 className="text-xl font-semibold">ชุดประเมิน</h2>
        <p className="text-sm">{data.note}</p>
        {data.sets.map((row) => (
          <div key={row.profile.id} className="rounded border p-3 text-sm">
            <p className="font-medium">{row.profile.fullName}</p>
            <p>{row.forms.map((formRow) => `${formRow.form_type} ${formRow.enabled ? "เปิด" : "ปิด"} ${formRow.status}`).join(" · ")}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-semibold">{me.user.role === "admin" ? "โครงสร้างและบัญชี" : "บุคลากรส่วนงาน"}</h2>
      {data.people.map((person) => (
        <p key={person.id} className="text-sm">{person.fullName} · {person.username} · {person.role} · {person.position || ""}</p>
      ))}
      {me.user.role === "admin" ? (
        <form className="grid max-w-md gap-2" onSubmit={async (event) => {
          event.preventDefault();
          try {
            await api("/api/admin/users", { method: "POST", body: form });
            setMessage("สร้างบัญชีแล้ว");
            load();
          } catch (error) {
            setMessage(error.message);
          }
        }}>
          <h3 className="font-medium">สร้างบัญชีกำหนดสิทธิ์</h3>
          {["username", "password", "fullName", "position"].map((key) => (
            <input key={key} className="rounded border px-2 py-1" placeholder={key} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
          ))}
          <select className="rounded border px-2 py-1" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="faculty">ผู้รับการประเมินสายวิชาการ</option>
            <option value="support">ผู้รับการประเมินสายสนับสนุน</option>
            <option value="firstHead">{me.labelMap.firstHead}</option>
            <option value="head">{me.labelMap.head}</option>
            <option value="hr">{me.labelMap.hr}</option>
            <option value="admin">{me.labelMap.admin}</option>
          </select>
          <button className="w-fit rounded bg-[#1f3d32] px-3 py-2 text-white">สร้างบัญชี</button>
        </form>
      ) : null}
      {message ? <p className="text-sm">{message}</p> : null}
    </div>
  );
}
