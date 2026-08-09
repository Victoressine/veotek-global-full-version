import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Button from "../components/common/Button";

import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";
import { services } from "../data/servicesData";

import { ArrowRight, Check } from "lucide-react";

const process = [
  {
    number: "01",
    icon: "ri-search-eye-line",
    title: "Discovery",
    desc: "Understanding goals, workflows, business operations, and user needs.",
  },
  {
    number: "02",
    icon: "ri-lightbulb-flash-line",
    title: "Strategy",
    desc: "Designing scalable architecture, systems, and implementation planning.",
  },
  {
    number: "03",
    icon: "ri-code-s-slash-line",
    title: "Development",
    desc: "Building high-performance software using modern development practices.",
  },
  {
    number: "04",
    icon: "ri-rocket-2-line",
    title: "Launch",
    desc: "Deployment, optimization, monitoring, scaling, and long-term support.",
  },
];

export default function Services() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%)]" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] sm:h-96 sm:w-96" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <Container className="relative z-10 max-w-[1600px]">
          <Reveal>
            <div className="mx-auto max-w-5xl text-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                  Our Services
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[48px] xl:text-[56px]">
                Building
                <span className="gradient-text"> Digital Excellence</span>
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-sm leading-8 text-muted sm:text-base lg:text-lg">
                VeoTek Global delivers modern software development, web
                applications, mobile apps, cloud systems, and scalable digital
                products for businesses.
              </p>
            </div>
          </Reveal>

          <Stagger className="mt-24 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <StaggerItem key={service.id}>
                <motion.div
                  whileHover={{ y: -12, scale: 1.015 }}
                  transition={{ duration: 0.4 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[36px] border border-white/10 bg-[#07111f]/70 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition duration-500 hover:border-cyan-400/30"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
                  <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-[90px] opacity-0 transition duration-700 group-hover:opacity-100" />

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                    className="relative z-10 flex h-20 w-20 items-center justify-center rounded-[26px] border border-cyan-400/20 bg-cyan-500/10 text-cyan-400"
                  >
                    <i className={`${service.icon} text-4xl`} />
                  </motion.div>

                  <div className="relative z-10 mt-10">
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
                      {service.category}
                    </p>

                    <h3 className="text-3xl font-black leading-tight text-white transition duration-300 group-hover:text-cyan-400">
                      {service.title}
                    </h3>

                    <p className="mt-5 text-sm leading-8 text-slate-400">
                      {service.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-10 space-y-5">
                    {service.features.slice(0, 4).map((feature) => (
                      <div key={feature} className="flex items-center gap-4">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                          <Check size={15} />
                        </div>

                        <span className="text-sm font-medium text-slate-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 mt-auto flex items-center justify-between border-t border-white/10 pt-6">
                    <Link
                      to={`/services/${service.slug}`}
                      className="group/button flex items-center gap-2 text-sm font-semibold text-white transition duration-300 hover:text-cyan-400"
                    >
                      Get Started
                      <ArrowRight
                        size={16}
                        className="transition duration-300 group-hover/button:translate-x-1"
                      />
                    </Link>
                  </div>

                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 group-hover:w-full" />
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <div className="mt-32">
              <div className="max-w-4xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                  Our Process
                </p>

                <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  Building Scalable Digital Systems
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
                  Our process combines strategy, architecture, design, and
                  development to build scalable, high-quality software for
                  modern businesses.
                </p>
              </div>

              <Stagger className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
                {process.map((item) => (
                  <StaggerItem key={item.number}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="group relative h-full overflow-hidden rounded-[36px] border border-white/10 bg-[#07111f]/70 p-7 backdrop-blur-2xl"
                    >
                      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[90px] opacity-0 transition duration-700 group-hover:opacity-100" />

                      <div className="relative z-10 flex items-start justify-between">
                        <span className="text-6xl font-black tracking-tight text-cyan-400/10">
                          {item.number}
                        </span>

                        <div className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
                          <i className={`${item.icon} text-3xl`} />
                        </div>
                      </div>

                      <div className="relative z-10 mt-10">
                        <h3 className="text-2xl font-black text-white">
                          {item.title}
                        </h3>

                        <p className="mt-5 text-sm leading-8 text-slate-400">
                          {item.desc}
                        </p>
                      </div>

                      <div className="relative z-10 mt-10 h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-transparent transition-all duration-700 group-hover:w-28" />
                    </motion.div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mt-32 overflow-hidden rounded-[44px] border border-white/10 bg-[#07111f]/80 p-8 text-center shadow-[0_20px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-12 lg:p-20"
          >
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                Ready To Build Something Exceptional?
              </h2>

              <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-muted">
                Let’s create scalable, intelligent, and modern digital solutions
                tailored to your business goals.
              </p>

              <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4">
                <Link to="/contact">
                  <Button className="h-10 rounded-xl px-3 text-[10px] font-semibold text-white shadow-[0_10px_40px_rgba(34,211,238,0.25)] sm:h-14 sm:rounded-2xl sm:px-8 sm:text-base">
                    <span className="text-[10px] sm:text-base">
                      Start A Project
                    </span>
                  </Button>
                </Link>

                <Link
                  to="/portfolio"
                  className="group flex h-10 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 text-white backdrop-blur-2xl transition duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-400 sm:h-14 sm:gap-3 sm:rounded-2xl sm:px-8"
                >
                  <span className="text-[10px] font-semibold sm:text-sm">
                    View Portfolio
                  </span>

                  <ArrowRight
                    size={14}
                    className="transition duration-300 group-hover:translate-x-1 sm:size-[18px]"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </MainLayout>
  );
}
