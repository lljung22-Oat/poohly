import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";

export default function TeamPage() {
  const { userId } = useParams();
  if (!userId) return <TeamList />;
  return <Review userId={userId} />;
}

function TeamList() {
  const [people, setPeople] = useState([]);
  useEffect(() => {
    api("/api/people").then((data) => setPeople(data.people));
  }, []);
  return (
    <div className="grid gap-2">
      <h2 className="text-xl font-semibold">รายชื่อผู้รับการประเมิน</h2>
      {people.map((person) => (
        <Link key={person.id} className="rounded border px-3 py-2" to={`/team/${person.id}`}>
          {person.fullName} · {person.position} · {person.track === "faculty" ? "สายวิชาการ" : "สายสนับสนุน"}
        </Link>
      ))}
    </div>
  );
}

function Review({ userId }) {
  const [me, setMe] = useState(null);
  const [pa, setPa] = useState(null);
  const [cc, setCc] = useState(null);
  const [idp, setIdp] = useState(null);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState({ strengths: "", improvements: "", suggestions: "" });

  async function load() {
    const [session, paData, ccData, idpData] = await Promise.all([
      api("/api/me"),
      api(`/api/pa/${userId}`),
      api(`/api/cc/${userId}`),
      api(`/api/idp/${userId}`),
    ]);
    setMe(session);
    setPa(paData);
    setCc(ccData);
    setIdp(idpData);
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, [userId]);

  if (!pa || !cc || !idp || !me) return <p>{message || "กำลังโหลด"}</p>;
  const head = me.user.role === "head";
  const first = me.user.role === "firstHead";

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">ผู้รับการประเมิน</h2>
      <p className="text-sm">ข้อตกลง: {pa.statusLabel} · สมรรถนะ: {cc.statusLabel}</p>
      {pa.workloads.map((workload) => (
        <section key={workload.id} className="rounded border p-3">
          <h3 className="font-medium">{workload.title}</h3>
          <p className="text-sm">น้ำหนัก {workload.weight ?? "-"}</p>
          {workload.agreements.map((agreement) => (
            <div key={agreement.id} className="mt-2 grid gap-1 text-sm">
              <p>{agreement.title} · {agreement.statusLabel}</p>
              {agreement.reason ? <p>เหตุผล: {agreement.reason}</p> : null}
              {agreement.indicators.map((indicator) => (
                <p key={indicator.id}>{indicator.title} · ตนเอง {indicator.selfScore ?? "-"} {indicator.selfLabel || ""} · หัวหน้างาน {indicator.headScore ?? "-"}</p>
              ))}
              {head && agreement.status === "wait" ? (
                <div className="flex gap-2">
                  <button className="rounded border px-2 py-1" onClick={() => api(`/api/pa/${userId}/decide`, { method: "POST", body: { agreementId: agreement.id, decision: "approve" } }).then(setPa)}>อนุมัติ</button>
                  <button className="rounded border px-2 py-1" onClick={() => {
                    const reason = window.prompt("เหตุผลที่ไม่อนุมัติ");
                    if (!reason) return;
                    api(`/api/pa/${userId}/decide`, { method: "POST", body: { agreementId: agreement.id, decision: "reject", reason } }).then(setPa);
                  }}>ไม่อนุมัติ</button>
                </div>
              ) : null}
            </div>
          ))}
        </section>
      ))}
      {head ? <button className="w-fit rounded bg-[#1f3d32] px-3 py-2 text-white" onClick={() => api(`/api/pa/${userId}/decide`, { method: "POST", body: { all: true, decision: "approve" } }).then(setPa).catch((error) => setMessage(error.message))}>อนุมัติทั้งหมด</button> : null}
      <section className="grid gap-2">
        <h3 className="font-medium">สมรรถนะ</h3>
        {cc.items.map((item, index) => (
          <label key={item.code} className="grid max-w-sm gap-1 text-sm">
            {item.name}
            <input className="rounded border px-2 py-1" disabled={first ? item.firstLocked || cc.status !== "reported" : !head || (item.headLocked && cc.status !== "disagree")} value={first ? item.firstScore ?? "" : head ? item.headScore ?? "" : item.selfScore ?? ""} onChange={(event) => {
              const items = cc.items.map((row, rowIndex) => rowIndex === index ? { ...row, ...(first ? { firstScore: event.target.value } : { headScore: event.target.value }) } : row);
              setCc({ ...cc, items });
            }} />
          </label>
        ))}
        {first || head ? (
          <button className="w-fit rounded border px-3 py-2" onClick={async () => {
            const scores = cc.items.map((item) => ({ code: item.code, score: first ? item.firstScore : item.headScore }));
            setCc(await api(`/api/cc/${userId}`, { method: "PUT", body: { scores } }));
            if (first) setCc(await api(`/api/cc/${userId}/submit`, { method: "POST" }));
            setMessage(first ? "ส่งหัวหน้างานแล้ว" : "บันทึกคะแนนหัวหน้างานแล้ว");
          }}> {first ? "ให้คะแนนแล้วส่งหัวหน้างาน" : "บันทึกคะแนนสมรรถนะ"} </button>
        ) : null}
      </section>
      {head ? (
        <section className="grid gap-2">
          <h3 className="font-medium">คะแนน PA ของหัวหน้างาน</h3>
          {pa.workloads.flatMap((workload) => workload.agreements.flatMap((agreement) => agreement.indicators)).map((indicator) => (
            <label key={indicator.id} className="grid max-w-sm gap-1 text-sm">
              {indicator.title}
              <input className="rounded border px-2 py-1" value={indicator.headScore ?? ""} onChange={(event) => {
                const workloads = pa.workloads.map((workload) => ({
                  ...workload,
                  agreements: workload.agreements.map((agreement) => ({
                    ...agreement,
                    indicators: agreement.indicators.map((item) => item.id === indicator.id ? { ...item, headScore: event.target.value } : item),
                  })),
                }));
                setPa({ ...pa, workloads });
              }} />
            </label>
          ))}
          <label className="grid gap-1 text-sm">จุดเด่น ไม่บังคับ<textarea className="rounded border px-2 py-1" value={notes.strengths} onChange={(event) => setNotes({ ...notes, strengths: event.target.value })} /></label>
          <label className="grid gap-1 text-sm">ข้อควรพัฒนา ไม่บังคับ<textarea className="rounded border px-2 py-1" value={notes.improvements} onChange={(event) => setNotes({ ...notes, improvements: event.target.value })} /></label>
          <label className="grid gap-1 text-sm">ข้อเสนอแนะของผู้บังคับบัญชาขั้นต้น ไม่บังคับ<textarea className="rounded border px-2 py-1" value={notes.suggestions} onChange={(event) => setNotes({ ...notes, suggestions: event.target.value })} /></label>
          <div className="flex flex-wrap gap-2">
            <button className="rounded border px-3 py-2" onClick={async () => {
              const scores = pa.workloads.flatMap((workload) => workload.agreements.flatMap((agreement) => agreement.indicators.map((indicator) => ({ indicatorId: indicator.id, headScore: indicator.headScore }))));
              setPa(await api(`/api/pa/${userId}/head-score`, { method: "PUT", body: { scores } }));
            }}>บันทึกคะแนน PA</button>
            <button className="rounded bg-[#1f3d32] px-3 py-2 text-white" onClick={async () => {
              try {
                const scores = pa.workloads.flatMap((workload) => workload.agreements.flatMap((agreement) => agreement.indicators.map((indicator) => ({ indicatorId: indicator.id, headScore: indicator.headScore }))));
                await api(`/api/pa/${userId}/head-score`, { method: "PUT", body: { scores } });
                const checked = await api(`/api/review/${userId}/check`, { method: "POST", body: notes });
                setPa(checked.pa);
                setCc(checked.cc);
                setMessage("ตรวจคะแนนแล้ว");
              } catch (error) {
                setMessage(error.message);
              }
            }}>ตรวจสอบคะแนน</button>
            <button className="rounded border px-3 py-2" onClick={() => api(`/api/review/${userId}/sign`, { method: "POST" }).then(() => setMessage("คณะติดลงนาม")).catch((error) => setMessage(error.message))}>คณะติดลงนาม</button>
          </div>
        </section>
      ) : null}
      <section className="grid gap-2">
        <h3 className="font-medium">แผนพัฒนารายบุคคล (IDP)</h3>
        {idp.items.map((item) => (
          <div key={item.id} className="rounded border p-2 text-sm">
            <p>{item.title} · วิธี {item.method} · {item.statusLabel}</p>
            {item.report ? <p>รายงาน: {item.report}</p> : null}
            {head && item.status === "idpWait" ? (
              <button className="mt-1 rounded border px-2 py-1" onClick={() => api(`/api/idp/${userId}/decide`, { method: "POST", body: { all: true, decision: "approve" } }).then(setIdp)}>อนุมัติแผน</button>
            ) : null}
            {head && (item.status === "idpReported" || item.status === "disagree") ? (
              <div className="mt-1 flex gap-2">
                {idp.resultLabels.map((label) => (
                  <button key={label} className="rounded border px-2 py-1" onClick={() => api(`/api/idp/${userId}/evaluate`, { method: "POST", body: { itemId: item.id, result: label } }).then(setIdp)}>{label}</button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </section>
      {message ? <p className="text-sm">{message}</p> : null}
    </div>
  );
}
