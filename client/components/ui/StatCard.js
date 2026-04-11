export default function StatCard({ title, value, icon, color = "primary" }) {
  const colorMap = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
      <div className={`${colorMap[color] || "bg-primary"} text-white rounded-lg p-3 text-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-neutral-700">{title}</p>
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}
