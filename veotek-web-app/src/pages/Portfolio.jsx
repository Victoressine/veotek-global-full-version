import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";

import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";

import { ArrowRight, Activity } from "lucide-react";

import { portfolioProjects } from "../data/portfolioProjects";

export default function Portfolio() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <Container className="relative z-10 max-w-[1600px]">
          {/* HERO */}
          <Reveal>
            <div className="mx-auto max-w-5xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                  Our Portfolio
                </span>
              </div>

              {/* Heading */}
              <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl">
                Engineering
                <span className="gradient-text">
                  {" "}
                  Scalable Software Solutions
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto mt-8 max-w-3xl text-sm leading-8 text-muted sm:text-base lg:text-lg">
                Explore custom software, web applications, mobile applications,
                APIs, and cloud-based systems built by VeoTek Global for
                performance, reliability, and scalability.
              </p>
            </div>
          </Reveal>

          {/* PROJECT GRID */}
          <Stagger className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {portfolioProjects.map((project, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{
                    y: -12,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="group relative overflow-hidden rounded-[38px] border border-white/10 bg-[#07111f]/75 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                >
                  {/* GRID */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                  {/* GLOW */}
                  <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-[100px] opacity-0 transition duration-700 group-hover:opacity-100" />

                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      whileHover={{
                        scale: 1.08,
                      }}
                      transition={{
                        duration: 0.7,
                      }}
                      src={project.image}
                      alt={project.title}
                      className="h-[300px] w-full object-cover"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/20 to-transparent" />

                    {/* CATEGORY */}
                    <div className="absolute left-6 top-6 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400 backdrop-blur-xl">
                      {project.category}
                    </div>

                    {/* FLOATING METRIC */}
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                      className="absolute bottom-6 right-6 rounded-2xl border border-white/10 bg-black/50 px-5 py-4 backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                          <Activity size={18} />
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                            System
                          </p>

                          <h4 className="mt-1 text-sm font-bold text-white">
                            Operational
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* CONTENT */}
                  <div className="relative z-10 p-7 sm:p-8">
                    <h3 className="text-3xl font-black leading-tight text-white">
                      {project.title}
                    </h3>

                    <p className="mt-5 text-sm leading-8 text-slate-400">
                      {project.desc}
                    </p>

                    {/* TECH STACK */}
                    <div className="mt-8 flex flex-wrap gap-3">
                      {project.tech.map((item, i) => (
                        <div
                          key={i}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300"
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* BOTTOM */}
                    <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                        Enterprise System
                      </span>

                      <Link
                        to={`/portfolio/${project.slug}`}
                        className="group/button flex items-center gap-2 text-sm font-semibold text-white transition duration-300 hover:text-cyan-400"
                      >
                        View Case Study
                        <ArrowRight
                          size={16}
                          className="transition duration-300 group-hover/button:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* BOTTOM LINE */}
                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 group-hover:w-full" />
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* PREMIUM STATS */}
          <div className="relative mt-28 overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
            {/* Background Glow */}
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

            {/* Grid */}
            <div className="relative z-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  number: "50+",
                  title: "Projects Delivered",
                  subtitle: "Enterprise & scalable systems",
                  icon: "ri-rocket-2-line",
                },

                {
                  number: "15+",
                  title: "Enterprise Clients",
                  subtitle: "Trusted technology partnerships",
                  icon: "ri-building-line",
                },

                {
                  number: "99%",
                  title: "System Reliability",
                  subtitle: "High availability infrastructure",
                  icon: "ri-shield-check-line",
                },

                {
                  number: "24/7",
                  title: "Monitoring",
                  subtitle: "Continuous support operations",
                  icon: "ri-customer-service-2-line",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -10,
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-[#07111f]/75 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                >
                  {/* GRID */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                  {/* GLOW */}
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[90px] opacity-0 transition duration-700 group-hover:opacity-100" />

                  {/* TOP */}
                  <div className="relative z-10 flex items-start justify-between">
                    {/* NUMBER */}
                    <div>
                      <h3 className="text-5xl font-black tracking-tight text-white">
                        {item.number}
                      </h3>
                    </div>

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
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-500/10 text-cyan-400 transition duration-500 group-hover:scale-110 group-hover:border-cyan-400/30 group-hover:bg-cyan-500/20"
                    >
                      <i className={`${item.icon} text-3xl`} />
                    </motion.div>
                  </div>

                  {/* CONTENT */}
                  <div className="relative z-10 mt-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                      {item.title}
                    </p>

                    <p className="mt-3 text-sm leading-7 text-muted">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* BOTTOM LINE */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
