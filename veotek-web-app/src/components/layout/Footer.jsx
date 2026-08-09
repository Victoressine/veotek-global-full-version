import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

import Container from "../common/Container";
import Logo from "../common/Logo";

const companyLinks = [
  {
    name: "About Us",
    path: "/about",
  },
  {
    name: "Mission",
    path: "/mission",
  },
  {
    name: "Our Team",
    path: "/team",
  },
  {
    name: "Services",
    path: "/services",
  },
  {
    name: "Portfolio",
    path: "/portfolio",
  },
  {
    name: "Testimonials",
    path: "/testimonials",
  },
];

const serviceLinks = [
  {
    name: "Custom Software Development",
    path: "/services/enterprise-software-development",
  },
  {
    name: "Web Site/App Development",
    path: "/services/website-web-application-development",
  },
  {
    name: "AI Automation",
    path: "/services/ai-automation-systems",
  },
  {
    name: "Hosting & Support",
    path: "/services/deployment-hosting-services",
  },
  {
    name: "Maintenance & Support",
    path: "/contact",
  },
];

const socials = [
  {
    name: "X",
    icon: FaXTwitter,
    href: "#",
    hoverClass: "hover:bg-white hover:text-black",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    href: "https://www.instagram.com/veotekglobal/",
    hoverClass: "hover:bg-pink-500/10 hover:text-pink-400",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/company/veotekglobal/?viewAsMember=true",
    hoverClass: "hover:bg-blue-500/10 hover:text-blue-400",
  },
  {
    name: "Facebook",
    icon: FaFacebookF,
    href: "#",
    hoverClass: "hover:bg-blue-600/10 hover:text-blue-400",
  },
  {
    name: "TikTok",
    icon: FaTiktok,
    href: "https://www.tiktok.com/@veotek_global",
    hoverClass: "hover:bg-white hover:text-black",
  },
];

export default function Footer() {
  const prefersReducedMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setNewsletterStatus("Please enter your email address.");
      return;
    }

    setNewsletterStatus(
      "Newsletter subscription will be connected to the backend shortly.",
    );
  };

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-[#030311]">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"
      />

      {/* Background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[140px]"
      />

      <Container className="relative z-10 max-w-[1800px]">
        {/* Newsletter section */}
        <motion.section
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 24,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-7"
          aria-labelledby="footer-newsletter-heading"
        >
          {/* Newsletter grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"
          />

          {/* Newsletter glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[100px]"
          />

          <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              {/* Animated Newsletter label */}
              <div className="inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/20 bg-emerald-500/10 px-4 py-2 backdrop-blur-xl sm:px-5">
                <div className="relative w-[7rem] overflow-hidden">
                  {prefersReducedMotion ? (
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-white sm:text-xs">
                      Newsletter
                    </span>
                  ) : (
                    <motion.div
                      className="flex w-max"
                      animate={{
                        x: ["0%", "-50%"],
                      }}
                      transition={{
                        duration: 5,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    >
                      <span className="shrink-0 pr-10 text-[10px] font-semibold uppercase tracking-[0.25em] text-white sm:text-xs">
                        Newsletter
                      </span>

                      <span
                        aria-hidden="true"
                        className="shrink-0 pr-10 text-[10px] font-semibold uppercase tracking-[0.25em] text-white sm:text-xs"
                      >
                        Newsletter
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>

              <h2
                id="footer-newsletter-heading"
                className="mt-5 text-2xl font-black text-white sm:text-3xl"
              >
                Stay Ahead in Tech
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-muted sm:text-base">
                Get insights on software development, web and mobile
                applications, and modern digital solutions.
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full lg:w-[55%]"
              noValidate
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Email address
                  </label>

                  <input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setNewsletterStatus("");
                    }}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    inputMode="email"
                    required
                    aria-describedby="footer-newsletter-status"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-sm text-white outline-none backdrop-blur-xl transition duration-300 placeholder:text-muted hover:border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          scale: 1.02,
                        }
                  }
                  whileTap={
                    prefersReducedMotion
                      ? undefined
                      : {
                          scale: 0.98,
                        }
                  }
                  className="group flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-7 text-sm font-bold text-white shadow-[0_10px_50px_rgba(34,211,238,0.3)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030311]"
                >
                  Subscribe
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </motion.button>
              </div>

              <p
                id="footer-newsletter-status"
                role="status"
                aria-live="polite"
                className="mt-3 min-h-5 text-sm text-slate-400"
              >
                {newsletterStatus}
              </p>
            </form>
          </div>
        </motion.section>

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-14 py-16 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1.2fr] xl:gap-20">
          {/* Brand */}
          <div className="max-w-md">
            <Logo />

            <p className="mt-6 text-base leading-8 text-muted">
              Building innovative software solutions for modern businesses.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                const isPlaceholder = social.href === "#";

                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    aria-label={`Visit VeoTek Global on ${social.name}`}
                    title={social.name}
                    target={isPlaceholder ? undefined : "_blank"}
                    rel={isPlaceholder ? undefined : "noreferrer"}
                    onClick={
                      isPlaceholder
                        ? (event) => event.preventDefault()
                        : undefined
                    }
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            y: -5,
                            scale: 1.05,
                          }
                    }
                    whileTap={
                      prefersReducedMotion
                        ? undefined
                        : {
                            scale: 0.95,
                          }
                    }
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white backdrop-blur-xl transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${social.hoverClass}`}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Company links */}
          <nav aria-labelledby="footer-company-heading">
            <h2
              id="footer-company-heading"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-white"
            >
              Company
            </h2>

            <ul className="mt-7 flex flex-col gap-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex w-fit items-center gap-2 text-sm text-muted transition duration-300 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    {link.name}

                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Service links */}
          <nav aria-labelledby="footer-services-heading">
            <h2
              id="footer-services-heading"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-white"
            >
              Services
            </h2>

            <ul className="mt-7 flex flex-col gap-4">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex w-fit items-center gap-2 text-sm text-muted transition duration-300 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    {link.name}

                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <section aria-labelledby="footer-contact-heading">
            <h2
              id="footer-contact-heading"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-white"
            >
              Contact
            </h2>

            <address className="mt-7 space-y-6 not-italic">
              <ContactItem
                icon={Mail}
                href="mailto:veotekglobal@gmail.com"
                primary="Veotekglobal@gmail.com"
                secondary="Send us an email anytime"
              />

              <ContactItem
                icon={MapPin}
                primary="USA • Ghana • Nigeria"
                secondary="Available for global projects"
              />

              <ContactItem
                icon={FaWhatsapp}
                href="tel:+233595068294"
                primary="+233 (0) 595 068 294"
                secondary="Mon–Fri, 8:00 AM–5:00 PM"
              />
            </address>
          </section>
        </div>

        {/* Bottom bar */}
        <div className="relative flex flex-col items-center justify-between gap-5 border-t border-white/10 py-6 text-center md:flex-row md:text-left">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
          />

          <p className="text-sm text-muted">
            © {new Date().getFullYear()} VeoTek Global. All rights reserved.
          </p>

          <nav
            aria-label="Legal links"
            className="flex flex-wrap items-center justify-center gap-6 md:justify-end"
          >
            <Link
              to="/privacy"
              className="text-sm text-muted transition duration-300 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-sm text-muted transition duration-300 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

function ContactItem({ icon: Icon, href, primary, secondary }) {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition duration-300 group-hover:border-cyan-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
        <Icon size={20} aria-hidden="true" />
      </span>

      <span className="min-w-0">
        <span className="block break-words text-sm text-slate-300 transition duration-300 group-hover:text-cyan-400 sm:text-base">
          {primary}
        </span>

        <span className="mt-1 block text-xs text-muted">{secondary}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={
          prefersReducedMotion
            ? undefined
            : {
                y: -4,
              }
        }
        className="group flex items-start gap-4 rounded-xl py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -4,
            }
      }
      className="group flex items-start gap-4 py-2"
    >
      {content}
    </motion.div>
  );
}
