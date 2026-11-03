// components/StatCard.js
// Reusable Metric/Stat Card Component
// Demonstrates: Props, Visual hierarchy, and responsive metric display

export default function StatCard({ title, value, icon, subtitle, color = "emerald" }) {
  const colorStyles = {
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    purple: "bg-purple-50 text-purple-800 border-purple-200",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2ece9] shadow-xs flex items-center justify-between">
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {title}
        </div>
        <div className="text-3xl font-extrabold text-[#1b4332]">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500 mt-1">
            {subtitle}
          </div>
        )}
      </div>

      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl ${colorStyles[color] || colorStyles.emerald}`}>
        {icon}
      </div>
    </div>
  );
}
