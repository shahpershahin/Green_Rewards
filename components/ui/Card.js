// components/ui/Card.js
// Reusable Card Container Component
// Demonstrates: Component Composition using the React 'children' prop

export default function Card({
  children,        // Inner card content
  className = "",  // Additional classes from parent
  onClick,         // Optional click handler if clickable
  hover = false,   // Optional hover lift effect
}) {
  const hoverStyle = hover
    ? "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
    : "";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 border border-[#e2ece9] shadow-sm ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
}
