import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

import Container from "../common/Container";
import Logo from "../common/Logo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  const navLinks = [
    {
      name: "Our Company",
      dropdown: [
        { name: "About Us", path: "/about" },
        { name: "Mission & Vision", path: "/mission" },
        { name: "Our Team", path: "/team" },
        { name: "Testimonials", path: "/testimonials"},
      ],
    },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
    { name: "Contact Us", path: "/contact" },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDropdownActive = (dropdown) =>
    dropdown?.some(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`),
    );

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            onClick={closeMobileMenu}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.header
        initial={{
          y: -80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed left-0 top-0 z-50 w-full"
      >
        <Container className="max-w-[1800px] pt-4 sm:pt-5">
          <motion.div
            animate={{
              scale: scrolled ? 0.985 : 1,
            }}
            transition={{
              duration: 0.3,
            }}
            className={`mx-3 overflow-visible rounded-[28px] border backdrop-blur-2xl transition-all duration-500 sm:mx-4 xl:mx-10 ${
              scrolled
                ? "border-white/10 bg-[#07111f]/90 shadow-[0_12px_70px_rgba(0,0,0,0.5)]"
                : "border-white/10 bg-white/[0.045] shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-[80px]" />

            <div className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              {/* LOGO */}
              <Logo />

              {/* DESKTOP NAV */}
              <nav className="hidden items-center gap-2 md:flex">
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <div key={link.name} className="group relative py-4">
                      <button
                        className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 ${
                          isDropdownActive(link.dropdown)
                            ? "bg-cyan-500/10 text-cyan-400"
                            : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {link.name}

                        <ChevronDown
                          size={16}
                          className={`transition duration-300 ${
                            isDropdownActive(link.dropdown)
                              ? "rotate-180 text-cyan-400"
                              : "group-hover:rotate-180"
                          }`}
                        />
                      </button>

                      {/* DESKTOP DROPDOWN */}
                      <div className="invisible absolute left-0 top-14 w-[280px] translate-y-4 rounded-[28px] border border-white/10 bg-[#07111f]/95 p-3 opacity-0 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                        <div className="relative z-10 flex flex-col gap-2">
                          {link.dropdown.map((item) => (
                            <NavLink
                              key={item.name}
                              to={item.path}
                              className={({ isActive }) =>
                                `group/link flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 ${
                                  isActive
                                    ? "bg-cyan-500/10 text-cyan-400"
                                    : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                                }`
                              }
                            >
                              <span>{item.name}</span>

                              <ArrowRight
                                size={15}
                                className="opacity-0 transition duration-300 group-hover/link:translate-x-1 group-hover/link:opacity-100"
                              />
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) =>
                        `group relative rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 ${
                          isActive
                            ? "bg-cyan-500/10 text-cyan-400"
                            : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className="relative z-10">{link.name}</span>

                          <span
                            className={`absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${
                              isActive
                                ? "w-8 opacity-100"
                                : "w-0 opacity-0 group-hover:w-8 group-hover:opacity-100"
                            }`}
                          />
                        </>
                      )}
                    </NavLink>
                  ),
                )}
              </nav>

              {/* MOBILE BUTTON */}
              <motion.button
                whileTap={{
                  scale: 0.92,
                }}
                onClick={() => setMenuOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white backdrop-blur-xl transition duration-300 hover:border-cyan-400/30 hover:text-cyan-400 md:hidden"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </motion.button>
            </div>
          </motion.div>
        </Container>
      </motion.header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            initial={{
              x: "-100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "-100%",
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed left-0 top-0 z-50 h-screen w-[88%] max-w-[430px] overflow-hidden border-r border-white/10 bg-[#07111f]/95 shadow-[0_20px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl md:hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

            <div className="relative z-10 flex h-full flex-col">
              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <Logo />

                <motion.button
                  whileTap={{
                    scale: 0.92,
                  }}
                  onClick={closeMobileMenu}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition duration-300 hover:border-cyan-400/30 hover:text-cyan-400"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* DRAWER CONTENT */}
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-6">
                {navLinks.map((link, index) =>
                  link.dropdown ? (
                    <motion.div
                      key={link.name}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.06,
                      }}
                      className="flex flex-col"
                    >
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === link.name ? null : link.name,
                          )
                        }
                        className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-base font-semibold transition duration-300 ${
                          isDropdownActive(link.dropdown)
                            ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-400"
                            : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-400/20 hover:bg-cyan-500/[0.04] hover:text-white"
                        }`}
                      >
                        {link.name}

                        <ChevronDown
                          size={18}
                          className={`transition duration-300 ${
                            openDropdown === link.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {openDropdown === link.name && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.25,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="ml-3 mt-3 flex flex-col gap-2 border-l border-white/10 pl-3">
                              {link.dropdown.map((item) => (
                                <NavLink
                                  key={item.name}
                                  to={item.path}
                                  onClick={closeMobileMenu}
                                  className={({ isActive }) =>
                                    `rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 ${
                                      isActive
                                        ? "bg-cyan-500/10 text-cyan-400"
                                        : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                                    }`
                                  }
                                >
                                  {item.name}
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={link.name}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.06,
                      }}
                    >
                      <NavLink
                        to={link.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `group flex items-center justify-between rounded-2xl border px-5 py-4 text-base font-semibold transition duration-300 ${
                            isActive
                              ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-400"
                              : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-400/20 hover:bg-cyan-500/[0.04] hover:text-white"
                          }`
                        }
                      >
                        <span>{link.name}</span>

                        <ArrowRight
                          size={18}
                          className="transition duration-300 group-hover:translate-x-1"
                        />
                      </NavLink>
                    </motion.div>
                  ),
                )}

                {/* MOBILE CTA */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.35,
                  }}
                  className="mt-4"
                >
                  <NavLink
                    to="/contact"
                    onClick={closeMobileMenu}
                    className="group flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-bold text-white shadow-[0_10px_50px_rgba(34,211,238,0.3)]"
                  >
                    Start Project
                    <ArrowRight
                      size={18}
                      className="transition duration-300 group-hover:translate-x-1"
                    />
                  </NavLink>
                </motion.div>
              </div>

              {/* DRAWER FOOTER */}
              <div className="border-t border-white/10 p-6">
                <div className="flex items-center justify-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
                  <div className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    Systems Online
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
