export default function Button({
  children,
  className = "",
  type = "button",
  disabled = false,
  ...buttonProps
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-2xl
        bg-gradient-to-r
        from-cyan-400
        to-blue-500
        px-7
        py-4
        text-sm
        font-semibold
        text-white
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-[0_10px_40px_rgba(34,211,238,0.35)]
        active:scale-[0.98]
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-400/70
        focus:ring-offset-2
        focus:ring-offset-[#030311]
        disabled:pointer-events-none
        disabled:scale-100
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
