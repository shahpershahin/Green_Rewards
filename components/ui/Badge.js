// components/ui/Badge.js
// Reusable Badge Component
// Demonstrates: Props, Conditional Rendering, and visual status signaling

export default function Badge({
  children,           // Badge text or numeric amount
  variant = "info",   // 'success', 'warning', 'danger', 'info', 'coin'
  className = "",     // Optional extra styling
}) {
  // Styles for different application statuses
  const variants = {
    // Approved or active state
    success: "bg-emerald-100 text-emerald-800 border-emerald-300",
    // Pending review or cautionary state
    warning: "bg-amber-100 text-amber-800 border-amber-300",
    // Rejected or error state
    danger: "bg-rose-100 text-rose-800 border-rose-300",
    // General informational tag
    info: "bg-emerald-50 text-[#1b4332] border-[#d8f3dc]",
    // Green Coin reward display
    coin: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
  };

  const chosenStyle = variants[variant] || variants.info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${chosenStyle} ${className}`}
    >
      {children}
    </span>
  );
}
