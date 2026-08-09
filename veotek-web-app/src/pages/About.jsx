import { motion } from "framer-motion";

import {
  ArrowRight,
  CheckCircle2,
  Code2,
  ShieldCheck,
  Sparkles,
  Users,
  Activity,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Button from "../components/common/Button";

import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";

function TechCard({ icon, color, name }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] sm:gap-3 sm:px-4 sm:py-3">
      <i className={`${icon} ${color} text-base sm:text-xl lg:text-2xl`} />

      <span className="hidden text-[11px] font-semibold text-white sm:block sm:text-xs lg:text-sm">
        {name}
      </span>
    </div>
  );
}

export default function About() {
  const values = [
    {
      icon: Code2,
      title: "Software Excellence",
      description:
        "We build scalable, maintainable, and high-performance software systems using modern development practices.",
    },

    {
      icon: ShieldCheck,
      title: "Reliable & Secure Systems",
      description:
        "Security, stability, and production-ready architecture are built into every solution we deliver.",
    },

    {
      icon: Sparkles,
      title: "Innovation-Driven Solutions",
      description:
        "We use modern technologies to develop practical, scalable, and future-ready digital solutions for businesses.",
    },

    {
      icon: Users,
      title: "Client-Focused Development",
      description:
        "We work closely with businesses to build software solutions aligned with real goals and outcomes.",
    },
  ];

  return (
    <MainLayout>
      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <Container className="relative z-10 max-w-[1600px]">
          <Reveal>
            <div className="grid items-center gap-14 lg:gap-16 xl:grid-cols-[1fr_1fr]">
              {/* LEFT CONTENT */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="relative z-20 w-full max-w-[680px]"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                  <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                    About VeoTek Global
                  </span>
                </div>

                {/* Heading */}
                <h1 className="mt-4 max-w-4xl text-3xl font-black leading-[1.02] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[68px]">
                  Building Innovative <br />
                  <span className="gradient-text text-[20px] sm:text-[36px] md:text-[44px] lg:text-[40px] xl:text-[46px]">
                    {" "}
                    Software Solutions for Modern Businesses
                  </span>
                </h1>

                {/* Description */}
                <p className="mt-6 max-w-xl text-lg leading-7 text-muted sm:text-base sm:leading-8 lg:text-lg">
                  VeoTek Global is a software development company building
                  modern websites, web applications, and mobile apps. We deliver
                  scalable, user-focused digital solutions that help businesses
                  grow and operate more efficiently.
                </p>

                {/* Buttons */}
                <div className="mt-8 flex items-center gap-2 sm:gap-4">
                  <Button className="h-10 rounded-xl px-4 text-xs font-semibold text-white shadow-[0_10px_40px_rgba(34,211,238,0.25)] sm:h-14 sm:rounded-2xl sm:px-8 sm:text-base">
                    Start A Project
                  </Button>

                  <button className="group flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-white backdrop-blur-2xl transition duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-400 sm:h-14 sm:rounded-2xl sm:px-8 sm:text-sm">
                    Explore Services
                    <ArrowRight
                      size={16}
                      className="transition duration-300 group-hover:translate-x-1 sm:size-[18px]"
                    />
                  </button>
                </div>
              </motion.div>

              {/* RIGHT SIDE */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative flex justify-center xl:justify-end"
              >
                {/* Glow */}
                <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[140px]" />

                {/* Main Card */}
                <div className="relative w-full max-w-[620px] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-2xl sm:p-4 lg:p-5">
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                  {/* Orbit Section */}
                  <div className="relative flex items-center justify-center overflow-hidden py-2 sm:py-4 lg:py-8">
                    {/* Background Glow */}
                    <div className="absolute h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-[100px] sm:h-[480px] sm:w-[480px] lg:h-[620px] lg:w-[620px]" />

                    {/* Main Orbital Container */}
                    <div className="relative flex h-[220px] w-[260px] items-center justify-center sm:h-[340px] sm:w-[420px] lg:h-[500px] lg:w-[620px]">
                      {/* OUTER RING */}
                      <div className="absolute h-[220px] w-[220px] rounded-full border border-cyan-400/10 sm:h-[360px] sm:w-[360px] lg:h-[460px] lg:w-[460px]" />

                      {/* INNER RING */}
                      <div className="absolute h-[160px] w-[160px] rounded-full border border-white/10 sm:h-[270px] sm:w-[270px] lg:h-[360px] lg:w-[360px]" />

                      {/* CENTER CORE */}
                      <motion.div
                        animate={{
                          scale: [1, 1.04, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                        }}
                        className="relative z-20 flex h-16 w-16 flex-col items-center justify-center rounded-full border border-cyan-400/20 bg-white/[0.04] backdrop-blur-2xl shadow-[0_0_60px_rgba(34,211,238,0.18)] sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-36 lg:w-36 xl:h-40 xl:w-40"
                      >
                        {/* Pulse Glow */}
                        <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/10" />

                        {/* Text */}
                        <p className="relative text-[7px] font-semibold uppercase tracking-[0.18em] text-cyan-400 sm:text-[10px] md:text-xs lg:text-sm">
                          Tech Stack
                        </p>
                      </motion.div>

                      {/* OUTER ORBIT */}
                      <div className="absolute h-[220px] w-[220px] animate-spin-slow sm:h-[360px] sm:w-[360px] lg:h-[460px] lg:w-[460px]">
                        {/* React */}
                        <div className="absolute left-1/2 top-[8px] -translate-x-1/2 sm:top-[12px] lg:top-[18px]">
                          <TechCard
                            icon="ri-reactjs-line"
                            color="text-cyan-400"
                            name="React"
                          />
                        </div>

                        {/* Node.js */}
                        <div className="absolute right-[8px] top-1/2 -translate-y-1/2 sm:right-[12px] lg:right-[18px]">
                          <TechCard
                            icon="ri-nodejs-line"
                            color="text-green-400"
                            name="Node.js"
                          />
                        </div>

                        {/* Firebase */}
                        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 sm:bottom-[12px] lg:bottom-[18px]">
                          <TechCard
                            icon="ri-fire-line"
                            color="text-orange-400"
                            name="Firebase"
                          />
                        </div>

                        {/* Tailwind */}
                        <div className="absolute left-[8px] top-1/2 -translate-y-1/2 sm:left-[12px] lg:left-[18px]">
                          <TechCard
                            icon="ri-tailwind-css-line"
                            color="text-sky-400"
                            name="Tailwind"
                          />
                        </div>

                        {/* Next.js */}
                        <div className="absolute right-[12%] top-[12%]">
                          <TechCard
                            icon="ri-terminal-box-line"
                            color="text-white"
                            name="Next.js"
                          />
                        </div>

                        {/* MongoDB */}
                        <div className="absolute bottom-[12%] left-[12%]">
                          <TechCard
                            icon="ri-database-2-line"
                            color="text-green-500"
                            name="MongoDB"
                          />
                        </div>
                      </div>

                      {/* INNER ORBIT */}
                      <div className="absolute h-[160px] w-[160px] animate-spin-reverse sm:h-[270px] sm:w-[270px] lg:h-[360px] lg:w-[360px]">
                        {/* AI */}
                        <div className="absolute left-1/2 top-[6px] -translate-x-1/2 sm:top-[10px] lg:top-[14px]">
                          <TechCard
                            icon="ri-cpu-line"
                            color="text-purple-400"
                            name="AI"
                          />
                        </div>

                        {/* Cloud */}
                        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 sm:bottom-[10px] lg:bottom-[14px]">
                          <TechCard
                            icon="ri-cloud-line"
                            color="text-cyan-400"
                            name="Cloud"
                          />
                        </div>

                        {/* Python */}
                        <div className="absolute left-[6px] top-1/2 -translate-y-1/2 sm:left-[10px] lg:left-[14px]">
                          <TechCard
                            icon="ri-code-s-slash-line"
                            color="text-yellow-400"
                            name="Python"
                          />
                        </div>

                        {/* Docker */}
                        <div className="absolute right-[6px] top-1/2 -translate-y-1/2 sm:right-[10px] lg:right-[14px]">
                          <TechCard
                            icon="ri-ship-line"
                            color="text-blue-400"
                            name="Docker"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <Stagger className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 sm:gap-3 sm:pt-6">
                    {[
                      {
                        value: "20+",
                        label: "Projects",
                        icon: Activity,
                      },

                      {
                        value: "99%",
                        label: "Success",
                        icon: ShieldCheck,
                      },

                      {
                        value: "24/7",
                        label: "Support",
                        icon: Sparkles,
                      },
                    ].map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <StaggerItem key={index}>
                          <motion.div
                            whileHover={{
                              y: -6,
                              scale: 1.02,
                            }}
                            transition={{
                              duration: 0.35,
                            }}
                            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center backdrop-blur-xl"
                          >
                            {/* GLOW */}
                            <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-cyan-500/10 blur-[50px] opacity-0 transition duration-700 group-hover:opacity-100" />

                            {/* ICON */}
                            <motion.div
                              animate={{
                                y: [0, -4, 0],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: index * 0.2,
                              }}
                              className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400"
                            >
                              <Icon size={18} />
                            </motion.div>

                            {/* VALUE */}
                            <h3 className="mt-3 text-lg font-black tracking-tight text-white sm:text-2xl">
                              {item.value}
                            </h3>

                            {/* LABEL */}
                            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">
                              {item.label}
                            </p>

                            {/* BOTTOM LINE */}
                            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-full" />
                          </motion.div>
                        </StaggerItem>
                      );
                    })}
                  </Stagger>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Values */}
      <section className="pb-24">
        <Container className="max-w-[1600px]">
          <div className="mb-16 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Our Core Values
            </p>

            <h2 className="mt-5 text-4xl font-bold text-white sm:text-5xl">
              Built Around Innovation & Trust
            </h2>
          </div>

          <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{
                      y: -10,
                      scale: 1.01,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-[#07111f]/75 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                  >
                    {/* GRID */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                    {/* GLOW */}
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[90px] opacity-0 transition duration-700 group-hover:opacity-100" />

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 transition duration-300 group-hover:scale-110">
                      <Icon size={30} />
                    </div>

                    <h3 className="mt-8 text-xl font-bold text-white">
                      {value.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-muted">
                      {value.description}
                    </p>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="pb-24">
        <Container className="max-w-[1600px]">
          <Reveal delay={0.2}>
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* LEFT */}
              <motion.div
                whileHover={{
                  y: -6,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-[#07111f]/80 p-8 shadow-[0_20px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-10"
              >
                {/* GRID */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                {/* GLOW */}
                <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-[100px] opacity-0 transition duration-700 group-hover:opacity-100" />

                <div className="relative z-10">
                  {/* HEADER */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                      <CheckCircle2 size={30} />
                    </div>

                    <div>
                      <p className="text-sm text-muted">
                        Why Businesses Choose VeoTek Global
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-white">
                        Modern Software Development Expertise
                      </h3>
                    </div>
                  </div>

                  {/* FEATURES */}
                  <div className="mt-10 space-y-6">
                    {[
                      "Production-ready software architecture",
                      "Scalable cloud solutions",
                      "Custom web & mobile application development",
                      "Modern responsive UI/UX design",
                      "Secure and reliable software systems",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="mt-1 text-cyan-400">
                          <CheckCircle2 size={20} />
                        </div>

                        <p className="text-sm leading-7 text-slate-300">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* RIGHT */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">
                  Who We Are
                </p>

                <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-3xl xl:text-4xl">
                  Building Innovative Software Solutions for Modern Businesses
                </h2>

                <p className="mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  VeoTek Global is a software development company focused on
                  building scalable, secure, and future-ready digital solutions
                  for startups, enterprises, and organizations across multiple
                  industries.
                </p>

                {/* FEATURES */}
                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  <motion.div
                    whileHover={{
                      y: -5,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                        <i className="ri-code-s-slash-line text-xl" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Scalable Systems
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-muted">
                          Built using modern software development standards and
                          cloud-based technologies.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{
                      y: -5,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                        <i className="ri-cpu-line text-xl" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Smart Digital Solutions
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-muted">
                          Web, mobile, and software applications designed to
                          improve efficiency and business operations.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  );
}
