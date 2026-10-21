import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./api.js";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import PaPage from "./pages/PaPage.jsx";
import CcPage from "./pages/CcPage.jsx";
import IdpPage from "./pages/IdpPage.jsx";
import ResearchPage from "./pages/ResearchPage.jsx";
import IndicatorPage from "./pages/IndicatorPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import PeoplePage from "./pages/PeoplePage.jsx";
import { CalendarPage, DispatchPage, HelpPage, LeavePage, ReportPage, StaffPage, TimePage } from "./pages/SimplePages.jsx";

export default function App() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function refresh() {
    if (!sessionStorage.getItem("token")) {
      setSession(null);
      return;
    }
    const me = await api("/api/me");
    setSession(me);
  }

  useEffect(() => {
    refresh().catch(() => setSession(null));
  }, []);

  function logout() {
    sessionStorage.clear();
    setSession(null);
    navigate("/");
  }

  if (!session) {
    return (
      <Login
        onDone={async (payload) => {
          sessionStorage.setItem("token", payload.token);
          sessionStorage.setItem("year", payload.year);
          const me = await api("/api/me");
          setSession(me);
          navigate("/");
        }}
      />
    );
  }

  const allowed = new Set(session.menus.map((item) => item.to));

  return (
    <div className="min-h-screen">
      <header className="bg-[#1f3d32] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs tracking-wide text-[#d5e4dc]">{session.facultyName}</p>
            <h1 className="text-lg font-semibold">ประเมินผลการปฏิบัติงาน</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span>{session.user.fullName}</span>
            <span className="rounded bg-white/10 px-2 py-1">{session.roleLabel}</span>
            {session.user.track ? <span className="rounded bg-white/10 px-2 py-1">{session.user.track === "faculty" ? "สายวิชาการ" : "สายสนับสนุน"}</span> : null}
            <label className="flex items-center gap-2">
              ปีงบประมาณ
              <select
                className="rounded bg-white px-2 py-1 text-[#1c1915]"
                value={session.year}
                onChange={(event) => {
                  sessionStorage.setItem("year", event.target.value);
                  refresh();
                }}
              >
                {session.years.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
            </label>
            <button className="rounded border border-white/40 px-3 py-1" onClick={logout}>
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 md:grid-cols-[220px_1fr]">
        <nav className="flex flex-col gap-1">
          {session.menus.map((item) => (
            <Link key={item.id} to={item.to} className="rounded px-3 py-2 text-sm hover:bg-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 rounded-lg bg-white p-4 shadow-sm">
          {error ? <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
          <Routes>
            <Route path="/" element={<Home session={session} />} />
            <Route path="/profile" element={allowed.has("/profile") ? <Profile /> : <Navigate to="/" />} />
            <Route path="/leave" element={allowed.has("/leave") ? <LeavePage /> : <Navigate to="/" />} />
            <Route path="/time" element={allowed.has("/time") ? <TimePage /> : <Navigate to="/" />} />
            <Route path="/pa" element={allowed.has("/pa") ? <PaPage session={session} /> : <Navigate to="/" />} />
            <Route path="/cc" element={allowed.has("/cc") ? <CcPage /> : <Navigate to="/" />} />
            <Route path="/idp" element={allowed.has("/idp") ? <IdpPage /> : <Navigate to="/" />} />
            <Route path="/research" element={allowed.has("/research") ? <ResearchPage /> : <Navigate to="/" />} />
            <Route path="/indicators" element={allowed.has("/indicators") ? <IndicatorPage /> : <Navigate to="/" />} />
            <Route path="/report" element={allowed.has("/report") ? <ReportPage /> : <Navigate to="/" />} />
            <Route path="/staff/:form" element={<StaffPage />} />
            <Route path="/team" element={allowed.has("/team") ? <TeamPage /> : <Navigate to="/" />} />
            <Route path="/team/:userId" element={allowed.has("/team") ? <TeamPage /> : <Navigate to="/" />} />
            <Route path="/calendar" element={allowed.has("/calendar") ? <CalendarPage /> : <Navigate to="/" />} />
            <Route path="/sets" element={allowed.has("/sets") ? <PeoplePage mode="sets" /> : <Navigate to="/" />} />
            <Route path="/people" element={allowed.has("/people") ? <PeoplePage mode="people" /> : <Navigate to="/" />} />
            <Route path="/dispatch" element={allowed.has("/dispatch") ? <DispatchPage /> : <Navigate to="/" />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api("/api/profile/me").then((data) => setProfile(data.profile));
  }, []);

  if (!profile) return <p>กำลังโหลด</p>;

  async function save(event) {
    event.preventDefault();
    const data = await api("/api/profile/me", { method: "PATCH", body: profile });
    setProfile(data.profile);
    setMessage("บันทึกแล้ว");
  }

  return (
    <form className="grid gap-3" onSubmit={save}>
      <h2 className="text-xl font-semibold">ข้อมูลบุคลากร</h2>
      <Field label="ชื่อ" value={profile.fullName} onChange={(fullName) => setProfile({ ...profile, fullName })} />
      <Field label="รหัสบุคลากร" value={profile.staffId || ""} onChange={(staffId) => setProfile({ ...profile, staffId })} />
      <Field label="ตำแหน่ง" value={profile.position || ""} onChange={(position) => setProfile({ ...profile, position })} />
      <Field label="ประเภท" value={profile.personType || ""} onChange={(personType) => setProfile({ ...profile, personType })} />
      <Field label="ภาควิชา/งาน" value={profile.department || ""} onChange={(department) => setProfile({ ...profile, department })} />
      <p className="text-sm">ส่วนงาน: {profile.facultyName}</p>
      <Field label="อีเมล" value={profile.email || ""} onChange={(email) => setProfile({ ...profile, email })} />
      <label className="grid gap-1 text-sm">
        วันที่เริ่มงาน
        <input className="rounded border px-2 py-1" type="date" value={profile.startDate ? String(profile.startDate).slice(0, 10) : ""} onChange={(event) => setProfile({ ...profile, startDate: event.target.value })} />
      </label>
      <button className="w-fit rounded bg-[#1f3d32] px-4 py-2 text-white">บันทึก</button>
      {message ? <p className="text-sm">{message}</p> : null}
    </form>
  );
}

export function Field({ label, value, onChange }) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <input className="rounded border px-2 py-1" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
