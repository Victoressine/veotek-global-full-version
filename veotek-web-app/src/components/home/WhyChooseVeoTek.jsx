import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Cpu,
  GitBranch,
  Handshake,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import Container from "../common/Container";

const reasons = [
  {
    id: "tailored-solutions",
    number: "01",
    icon: Target,
    title: "Tailored Solutions",
    description:
      "Every solution is designed around your business goals, workflows, and long-term vision rather than relying on one-size-fits-all software.",
  },
  {
    id: "experienced-team",
    number: "02",
    icon: Users,
    title: "Experienced Development Team",
    description:
      "Our multidisciplinary team delivers high-quality software using modern technologies, thoughtful design, and proven development practices.",
  },
  {
    id: "security-reliability",
    number: "03",
    icon: ShieldCheck,
    title: "Security & Reliability",
    description:
      "We build secure, resilient, and scalable applications with performance, stability, and data protection considered from the beginning.",
  },
  {
    id: "agile-delivery",
    number: "04",
    icon: GitBranch,
    title: "Agile Delivery",
    description:
      "Transparent collaboration, continuous feedback, and iterative development help us deliver faster while maintaining quality and predictable outcomes.",
  },
  {
    id: "future-ready",
    number: "05",
    icon: Cpu,
    title: "Future-Ready Technology",
    description:
      "We use modern cloud platforms, automation, artificial intelligence, and scalable architectures to create solutions that evolve with your business.",
  },
  {
    id: "long-term-partnership",
    number: "06",
    icon: Handshake,
    title: "Long-Term Partnership",
    description:
      "From planning and deployment to maintenance and continuous improvement, we remain committed to your success beyond the initial launch.",
  },
];

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function WhyChooseVeoTek() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden bg-[#030311] py-20 sm:py-24 lg:py-32"
      aria-labelledby="why-choose-heading"
    >
      {/* Background lighting */}

      <div
        className="pointer-events-none absolute inset-0 -z-20"
        aria-hidden="true"
      >
        <div className="absolute left-[-12rem] top-[10%] h-[32rem] w-[32rem] rounded-full bg-cyan-500/[0.08] blur-[160px]" />

        <div className="absolute bottom-[-14rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-indigo-500/[0.09] blur-[170px]" />
      </div>

      {/* Background grid */}

      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
      </div>

      <Container className="relative z-10 max-w-[1300px]">
        {/* Section introduction */}

        <motion.div
          variants={sectionVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="mx-auto text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cyan-300 backdrop-blur-xl sm:text-xs">
            <span
              className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]"
              aria-hidden="true"
            />
            Why Choose VeoTek
          </div>

          <h2
            id="why-choose-heading"
            className="mx-auto max-w-6xl text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Helping Businesses Build Reliable Digital Solutions That Scale
          </h2>

          <p className="mx-auto mt-6 max-w-5xl text-base leading-8 text-slate-400 sm:text-lg">
            We combine strategy, design, and modern software development to
            create secure, high-performing digital solutions that help
            businesses innovate, grow, and remain competitive.
          </p>
        </motion.div>

        {/* Reason cards */}

        <motion.div
          variants={cardsContainerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {reasons.map((reason) => {
            const ReasonIcon = reason.icon;

            return (
              <motion.article
                key={reason.id}
                variants={cardVariants}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: -8,
                      }
                }
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-500 hover:border-cyan-400/25 hover:bg-white/[0.055] hover:shadow-[0_30px_100px_rgba(8,145,178,0.12)] sm:p-7 lg:min-h-[330px] lg:p-8"
              >
                {/* Hover lighting */}

                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.08] blur-3xl transition-opacity duration-500 group-hover:opacity-100 lg:opacity-0"
                  aria-hidden="true"
                />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.08)] transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105 sm:h-14 sm:w-14">
                      <ReasonIcon
                        size={24}
                        strokeWidth={1.8}
                        aria-hidden="true"
                        focusable="false"
                      />
                    </span>

                    <span
                      className="text-sm font-bold tracking-[0.16em] text-white/20 transition-colors duration-500 group-hover:text-cyan-300/60"
                      aria-hidden="true"
                    >
                      {reason.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-bold leading-snug text-white sm:text-2xl">
                    {reason.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                    {reason.description}
                  </p>

                  <div className="mt-auto pt-7" aria-hidden="true">
                    <div className="h-px w-full overflow-hidden bg-white/10">
                      <div className="h-full w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 transition-all duration-700 group-hover:w-full" />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* About page link */}

        <motion.div
          variants={sectionVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.4,
          }}
          className="mt-12 flex justify-center sm:mt-14"
        >
          <Link
            to="/about"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-6 py-3.5 text-sm font-bold text-white shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.08] hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030311]"
          >
            Learn More About VeoTek
            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
