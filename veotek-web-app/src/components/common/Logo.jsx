import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.webp";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      {/* Logo */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 transition duration-500 group-hover:opacity-100" />

        <img
          src={logo}
          alt="VeoTek Global"
          className="relative h-11 w-11 object-contain transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12 md:h-14 md:w-14"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className="gradient-text text-lg font-black tracking-tight sm:text-xl md:text-2xl">
          VeoTek
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white sm:text-[11px]">
          GLOBAL
        </span>
      </div>
    </Link>
  );
}
