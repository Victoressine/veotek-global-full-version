import { motion } from "framer-motion";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Button from "../components/common/Button";

import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";

import profileIcon from "../assets/images/profile-icon.webp";

import { ArrowRight, Activity } from "lucide-react";

import { FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";

export default function Team() {
  const teamMembers = [
    {
      name: "Victor E. Obioha",
      role: "Executive Director & Software Developer",
      image: profileIcon,
      status: "Software Developer",
      activity: "Active",
      desc: "Leads the development of scalable, production-ready software solutions.",
    },

    {
      name: "Coming Soon",
      role: "Open Position",
      image: profileIcon,
      status: "Coming Soon",
      activity: "Open Position",
      desc: "Building Team",
    },

    {
      name: "Coming Soon",
      role: "Open Position",
      image: profileIcon,
      status: "Coming Soon",
      activity: "Open Position",
      desc: "Building Team",
    },

    {
      name: "Coming Soon",
      role: "Open Position",
      image: profileIcon,
      status: "Coming Soon",
      activity: "Open Position",
      desc: "Building Team",
    },
  ];

  const socials = [
    {
      icon: FaLinkedinIn,
      hover: "hover:text-[#0A66C2]",
    },

    {
      icon: FaXTwitter,
      hover: "hover:text-white",
    },

    {
      icon: FaInstagram,
      hover: "hover:text-[#E1306C]",
    },
  ];

  return (
    <MainLayout>
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-36 lg:pt-40">
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
                  Our Team
                </span>
              </div>

              {/* Heading */}
              <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[48px] xl:text-[56px]">
                The People Building
                <span className="gradient-text"> VeoTek Global</span>
              </h1>

              {/* Description */}
              <p className="mx-auto mt-8 max-w-3xl text-sm leading-8 text-muted sm:text-base lg:text-lg">
                Our team of software developers, cloud engineers, product
                strategists, and UI/UX designers builds scalable and reliable
                digital solutions for businesses.
              </p>
            </div>
          </Reveal>

          {/* TEAM GRID */}
          <Stagger className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/30"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/[0.02] to-cyan-500/[0.08] opacity-0 transition duration-500 group-hover:opacity-100" />

                {/* Image */}
                <div className="relative overflow-hidden">
                  <motion.img
                    whileHover={{
                      scale: 1.08,
                    }}
                    transition={{
                      duration: 0.7,
                    }}
                    src={member.image}
                    alt={member.name}
                    className="h-[360px] w-full object-cover transition duration-700"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  {/* STATUS */}
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                    className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                        <Activity size={18} />
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          {member.status}
                        </p>

                        <h4 className="mt-1 text-sm font-bold text-white">
                          {member.activity}
                        </h4>
                      </div>
                    </div>
                  </motion.div>

                  {/* Socials */}
                  <div className="absolute right-5 top-5 flex flex-col gap-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {socials.map((social, i) => {
                      const Icon = social.icon;

                      return (
                        <button
                          key={i}
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-white backdrop-blur-xl transition duration-300 hover:scale-110 hover:border-white/20 hover:bg-white/10 ${social.hover}`}
                        >
                          <Icon size={18} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8">
                  <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Team Member
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-white">
                    {member.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-cyan-400">
                    {member.role}
                  </p>

                  <p className="mt-5 text-sm leading-7 text-muted">
                    {member.desc}
                  </p>

                  {/* Bottom */}
                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="text-xs uppercase tracking-[0.25em] text-muted">
                      VeoTek Global
                    </span>

                    <button className="group/button flex items-center gap-2 text-sm font-semibold text-white transition duration-300 hover:text-cyan-400">
                      View Profile
                      <ArrowRight
                        size={16}
                        className="transition duration-300 group-hover/button:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Stagger>

          {/* CULTURE SECTION */}
          <Reveal delay={0.2}>
            <motion.div
              whileHover={{
                y: -5,
              }}
              transition={{
                duration: 0.35,
              }}
              className="group relative mt-32 overflow-hidden rounded-[44px] border border-white/10 bg-[#07111f]/80 p-8 shadow-[0_20px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-12 lg:p-16"
            >
              {/* GRID */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

              {/* GLOW */}
              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] opacity-0 transition duration-700 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                  {/* LEFT */}
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                      Our Culture
                    </p>

                    <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-4xl">
                      Built Around Innovation, Collaboration & Impact
                    </h2>

                    <p className="mt-8 text-base leading-8 text-muted">
                      At VeoTek Global, we believe great software is built by
                      teams that combine creativity, technical skill, and
                      continuous improvement.
                    </p>

                    <p className="mt-6 text-base leading-8 text-muted">
                      Our culture promotes learning, ownership, and modern
                      problem-solving to build scalable digital products that
                      help businesses grow
                    </p>

                    {/* BUTTON */}
                    <div className="mt-10 flex flex-wrap gap-4">
                      <motion.div
                        whileHover={{
                          scale: 1.03,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                      >
                        <Button className="h-14 rounded-2xl px-8 text-base font-semibold text-white shadow-[0_10px_50px_rgba(34,211,238,0.35)]">
                          Join Our Team
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[
                      {
                        title: "Innovation",
                        icon: "ri-lightbulb-flash-line",
                        desc: "Building modern and future-ready digital products.",
                      },

                      {
                        title: "Scalability",
                        icon: "ri-stack-line",
                        desc: "Developing systems designed to grow with businesses.",
                      },

                      {
                        title: "Collaboration",
                        icon: "ri-team-line",
                        desc: "Working closely to deliver impactful digital products.",
                      },

                      {
                        title: "Excellence",
                        icon: "ri-award-line",
                        desc: "Delivering high-quality, production-ready software.",
                      },
                    ].map((item, index) => (
                      <StaggerItem key={index}>
                        <motion.div
                          whileHover={{
                            y: -8,
                            scale: 1.01,
                          }}
                          transition={{
                            duration: 0.35,
                          }}
                          className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl"
                        >
                          {/* GRID */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                          {/* GLOW */}
                          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-[70px] opacity-0 transition duration-700 group-hover:opacity-100" />

                          {/* CONTENT */}
                          <div className="relative z-10">
                            {/* ICON */}
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-400 transition duration-500 group-hover:border-cyan-400/30 group-hover:bg-cyan-500/10">
                              <i className={`${item.icon} text-2xl`} />
                            </div>

                            {/* TITLE */}
                            <h3 className="mt-6 text-xl font-bold text-white">
                              {item.title}
                            </h3>

                            {/* DESCRIPTION */}
                            <p className="mt-4 text-sm leading-7 text-muted">
                              {item.desc}
                            </p>
                          </div>

                          {/* BOTTOM LINE */}
                          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-full" />
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  );
}
