import { Link } from "react-router-dom";

export default function Home({ session }) {
  const cards = session.menus.filter((item) => item.id !== "home" && item.id !== "help");
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">หน้าหลัก</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.id} to={card.to} className="rounded-lg border border-[#e4ded2] px-4 py-5 hover:border-[#1f3d32]">
            <span className="font-medium">{card.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
