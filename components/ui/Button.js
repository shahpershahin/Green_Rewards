// components/ui/Button.js
// Reusable Button Component
// Demonstrates: Props, Component Composition, Conditional Styling, and Default Parameters

export default function Button({
  children,           // Content inside the button (text, icons)
  onClick,            // Click handler function
  type = "button",    // Standard HTML button type (button, submit, reset)
  variant = "primary",// Style variant: 'primary', 'secondary', 'outline', 'accent'
  size = "md",        // Size variant: 'sm', 'md', 'lg'
  className = "",     // Any additional custom Tailwind classes passed from parent
  disabled = false,   // Disabled state
}) {
  // Base styling applied to every button
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  // Predefined color variants
  const variants = {
    primary: "bg-[#1b4332] text-white hover:bg-[#2d6a4f] shadow-sm",
    secondary: "bg-[#d8f3dc] text-[#1b4332] hover:bg-[#b7e4c7]",
    outline: "border-2 border-[#1b4332] text-[#1b4332] hover:bg-[#1b4332] hover:text-white",
    accent: "bg-[#f77f00] text-white hover:bg-[#e07200] shadow-sm",
  };

  // Predefined size padding and text scale
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  // Combine base styles with chosen variant and size
  const finalClassNames = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassNames}
    >
      {children}
    </button>
  );
}
