import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  RadioTower,
  ShoppingBag,
  Truck,
} from "lucide-react";

import Container from "../common/Container";

const industries = [
  {
    id: "financial-services",
    icon: Landmark,
    title: "Banking & Financial Services",
    description:
      "Secure digital banking platforms, payment systems, fintech applications, and financial management solutions.",
  },
  {
    id: "healthcare",
    icon: HeartPulse,
    title: "Healthcare",
    description:
      "Healthcare management systems, patient portals, telemedicine platforms, and reliable digital health solutions.",
  },
  {
    id: "education",
    icon: GraduationCap,
    title: "Education",
    description:
      "Learning management systems, student portals, online learning platforms, and modern education technology.",
  },
  {
    id: "government",
    icon: Building2,
    title: "Government",
    description:
      "Citizen portals, workflow automation, digital transformation platforms, and accessible public service solutions.",
  },
  {
    id: "telecommunications",
    icon: RadioTower,
    title: "Telecommunications",
    description:
      "Customer management systems, self-service portals, telecom integrations, and intelligent process automation.",
  },
  {
    id: "logistics",
    icon: Truck,
    title: "Logistics",
    description:
      "Fleet management, delivery tracking, warehouse software, and connected logistics automation solutions.",
  },
  {
    id: "retail-ecommerce",
    icon: ShoppingBag,
    title: "Retail & E-Commerce",
    description:
      "E-commerce platforms, inventory systems, point-of-sale solutions, and customer engagement tools.",
  },
  {
    id: "manufacturing",
    icon: Factory,
    title: "Manufacturing",
    description:
      "Production monitoring, ERP integrations, workflow automation, and real-time operational dashboards.",
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

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.97,
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

export default function IndustriesWeServe() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden bg-[#030311] py-20 sm:py-24 lg:py-32"
      aria-labelledby="industries-heading"
    >
      {/* Background lighting */}

      <div
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute right-[-14rem] top-[5%] h-[34rem] w-[34rem] rounded-full bg-cyan-500/[0.08] blur-[170px]" />

        <div className="absolute bottom-[-16rem] left-[-12rem] h-[36rem] w-[36rem] rounded-full bg-indigo-500/[0.09] blur-[180px]" />

        <div className="absolute left-[40%] top-[40%] h-[24rem] w-[24rem] rounded-full bg-purple-500/[0.05] blur-[150px]" />
      </div>

      {/* Background grid */}

      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
      </div>

      <Container className="relative z-10 max-w-[1600px]">
        {/* Section heading */}
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
            Industries We Serve
          </div>

          <h2
            id="industries-heading"
            className="mx-auto max-w-7xl text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Technology Solutions Built for Every Industry
          </h2>

          <p className="mx-auto mt-6 max-w-5xl text-base leading-8 text-slate-400 sm:text-lg">
            From growing startups to established enterprises and public
            institutions, we build scalable software solutions tailored to the
            unique challenges of different industries.
          </p>
        </motion.div>

        {/* Industry cards */}
        <motion.div
          variants={gridVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {industries.map((industry, index) => {
            const IndustryIcon = industry.icon;

            return (
              <motion.article
                key={industry.id}
                variants={cardVariants}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: -8,
                      }
                }
                className="group relative min-h-[285px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-500 hover:border-cyan-400/30 hover:bg-white/[0.055] hover:shadow-[0_30px_100px_rgba(8,145,178,0.14)] sm:p-7"
              >
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.1] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />

                <span
                  className="absolute right-5 top-5 text-xs font-bold tracking-[0.18em] text-white/20 transition-colors duration-500 group-hover:text-cyan-300/60"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative flex h-full flex-col">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.08)] transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110">
                    <IndustryIcon
                      size={25}
                      strokeWidth={1.8}
                      aria-hidden="true"
                      focusable="false"
                    />
                  </span>

                  <h3 className="mt-8 text-xl font-bold leading-snug text-white">
                    {industry.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {industry.description}
                  </p>

                  <div className="mt-auto pt-7" aria-hidden="true">
                    <div className="h-px overflow-hidden bg-white/10">
                      <div className="h-full w-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 transition-all duration-700 group-hover:w-full" />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
