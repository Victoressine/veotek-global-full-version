import { motion } from "framer-motion";

import { Mail, MapPin, Clock3, Send } from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Button from "../components/common/Button";

import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";

export default function Contact() {
  return (
    <MainLayout>
      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-36">
        {/* GLOWS */}
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

        <Container className="relative z-10 max-w-[1600px]">
          <Reveal>
            <div className="max-w-4xl">
              {/* BADGE */}
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                  Contact VeoTek Global
                </span>
              </div>

              {/* TITLE */}
              <h1 className="mt-8 text-4xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                Let’s Build
                <span className="gradient-text"> Something Powerful</span>
              </h1>

              {/* DESC */}
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                We help startups, enterprises, and organizations build scalable
                software solutions, web applications, and mobile apps that
                support business growth.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CONTACT SECTION */}
      <section className="pb-24">
        <Container className="max-w-[1600px]">
          <Stagger className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* LEFT SIDE */}
            <StaggerItem>
              <div className="space-y-6">
                {/* CONTACT CARD */}
                <motion.div
                  whileHover={{
                    y: -5,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-[#07111f]/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8"
                >
                  {/* GRID */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                  {/* GLOW */}
                  <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-[100px] opacity-0 transition duration-700 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white">
                      Contact Information
                    </h2>

                    <p className="mt-4 text-sm leading-8 text-slate-400">
                      Reach out for software projects, partnerships, or
                      development consultations.
                    </p>

                    {/* ITEMS */}
                    <div className="mt-10 space-y-8">
                      {[
                        {
                          icon: Mail,
                          title: "Email",
                          value: "veotekglobal@gmail.com",
                          href: "mailto:veotekglobal@gmail.com",
                        },

                        {
                          icon: FaWhatsapp,
                          title: "Whatsapp",
                          value: "+233 (0) 595 068 294",
                          href: "tel:+233595068294",
                        },

                        {
                          icon: MapPin,
                          title: "Location",
                          value: "USA • Ghana • Nigeria",
                        },

                        {
                          icon: Clock3,
                          title: "Working Hours",
                          value: "Monday - Friday / 8am - 5pm",
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-5">
                          {/* ICON */}
                          <motion.div
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              delay: index * 0.2,
                            }}
                            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-500/10 text-cyan-400"
                          >
                            <item.icon size={24} />
                          </motion.div>

                          {/* CONTENT */}
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {item.title}
                            </p>

                            {item.href ? (
                              <a
                                href={item.href}
                                className="mt-2 block text-sm text-slate-400 transition hover:text-cyan-400"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <p className="mt-2 text-sm text-slate-400">
                                {item.value}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* MAP */}
                <motion.div
                  whileHover={{
                    y: -5,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-[#07111f]/80 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                >
                  {/* GRID */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                  {/* GLOW */}
                  <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-[100px] opacity-0 transition duration-700 group-hover:opacity-100" />
                </motion.div>
              </div>
            </StaggerItem>

            {/* FORM SIDE */}
            <StaggerItem>
              <motion.div
                whileHover={{
                  y: -5,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-[#07111f]/80 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:p-10"
              >
                {/* GRID */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                {/* GLOW */}
                <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

                <div className="relative z-10">
                  {/* HEADER */}
                  <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                      Send Us a Message
                    </p>
                  </div>

                  {/* FORM */}
                  <form className="space-y-6">
                    {/* NAME */}
                    <div>
                      <label className="mb-3 block text-sm font-medium text-white">
                        Full Name
                      </label>

                      <input
                        type="text"
                        placeholder="Full Name"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-slate-500 focus:border-cyan-400 focus:bg-cyan-500/[0.03]"
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label className="mb-3 block text-sm font-medium text-white">
                        Email Address
                      </label>

                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-slate-500 focus:border-cyan-400 focus:bg-cyan-500/[0.03]"
                      />
                    </div>

                    {/* SUBJECT */}
                    <div>
                      <label className="mb-3 block text-sm font-medium text-white">
                        Subject
                      </label>

                      <input
                        type="text"
                        placeholder="Project Inquiry"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-slate-500 focus:border-cyan-400 focus:bg-cyan-500/[0.03]"
                      />
                    </div>

                    {/* MESSAGE */}
                    <div>
                      <label className="mb-3 block text-sm font-medium text-white">
                        Message
                      </label>

                      <textarea
                        rows="7"
                        placeholder="Tell us about your project..."
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-slate-500 focus:border-cyan-400 focus:bg-cyan-500/[0.03]"
                      />
                    </div>

                    {/* BUTTON */}
                    <motion.div
                      whileHover={{
                        scale: 1.02,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                    >
                      <Button
                        className="
                          h-14
                          w-full
                          rounded-2xl
                          bg-gradient-to-r
                          from-cyan-400
                          via-sky-400
                          to-blue-500
                          text-base
                          font-semibold
                          text-slate-950
                          shadow-[0_10px_40px_rgba(34,211,238,0.35)]
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:shadow-[0_14px_50px_rgba(34,211,238,0.45)]
                          active:scale-[0.98]
                        "
                      >
                        <span className="flex items-center justify-center gap-3 text-white">
                          Send Message
                          <Send
                            size={18}
                            className="transition duration-300 group-hover:translate-x-1"
                          />
                        </span>
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </StaggerItem>
          </Stagger>
        </Container>
      </section>

      {/* WHATSAPP */}
      <motion.a
        href="https://wa.me/233595068294"
        target="_blank"
        rel="noopener noreferrer"
        drag
        dragMomentum={false}
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.95,
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
          },
        }}
        className="
    fixed
    bottom-6
    right-6
    z-[120]
    flex
    h-16
    w-16
    cursor-grab
    items-center
    justify-center
    rounded-full
    bg-[#25D366]
    text-white
    shadow-[0_10px_40px_rgba(37,211,102,0.45)]
    transition
    duration-300
    active:cursor-grabbing
  "
      >
        {/* GLOW */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 blur-xl" />

        {/* ICON */}
        <FaWhatsapp size={30} className="relative z-10" />
      </motion.a>

      {/* TELEGRAM */}
      <motion.a
        href="https://t.me/iamvikimi"
        target="_blank"
        rel="noopener noreferrer"
        drag
        dragMomentum={false}
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.95,
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            delay: 0.3,
          },
        }}
        className="
    fixed
    bottom-24
    right-6
    z-[120]
    flex
    h-16
    w-16
    cursor-grab
    items-center
    justify-center
    rounded-full
    bg-[#229ED9]
    text-white
    shadow-[0_10px_40px_rgba(34,158,217,0.45)]
    transition
    duration-300
    active:cursor-grabbing
  "
      >
        {/* GLOW */}
        <div className="absolute inset-0 rounded-full bg-[#229ED9] opacity-40 blur-xl" />

        {/* ICON */}
        <FaTelegramPlane size={30} className="relative z-10" />
      </motion.a>
    </MainLayout>
  );
}
