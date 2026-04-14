/**
 * StatCard – displays a single KPI metric on the dashboard.
 */
export default function StatCard({ label, value, icon, trend, trendLabel, color = "primary" }) {
  const colorMap = {
    primary: "bg-primary bg-opacity-10 text-primary",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
  };

  const trendPositive = trend === "up";
  const trendNeutral = trend === undefined || trend === null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-neutral-800">{value ?? "—"}</p>
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${colorMap[color] ?? colorMap.primary}`}>
            {icon}
          </div>
        )}
      </div>
      {trendLabel && !trendNeutral && (
        <p className={`text-xs font-medium ${trendPositive ? "text-green-600" : "text-red-500"}`}>
          {trendPositive ? "▲" : "▼"} {trendLabel}
        </p>
      )}
    </div>
  );
}
