import { motion } from "framer-motion";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";

export default function Mission() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%)]" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] sm:h-96 sm:w-96" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <Container className="relative z-10 max-w-[1600px]">
          {/* HERO */}
          <Reveal>
            <div className="mx-auto max-w-5xl text-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                  Mission & Vision
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-4xl lg:text-5xl">
                Building Software
                <span className="gradient-text">
                  {" "}
                  That Drive Business Growth
                </span>
              </h1>
            </div>
          </Reveal>

          {/* MISSION & VISION */}
          <Stagger className="mt-24 grid gap-8 lg:grid-cols-2">
            {[
              {
                icon: "ri-rocket-2-line",
                title: "Our Mission",
                paragraphs: [
                  "To empower startups, enterprises, and organizations with reliable and scalable software solutions that improve efficiency, support growth, and drive digital transformation.",
                  "We focus on building modern web applications, mobile apps, and digital systems using best practices in software development and cloud technologies.",
                ],
              },
              {
                icon: "ri-eye-line",
                title: "Our Vision",
                paragraphs: [
                  "To become a trusted global software development company known for building innovative and high-quality digital products that solve real business problems.",
                  "We envision a future where businesses of all sizes scale faster and operate more efficiently through well-built software solutions.",
                ],
              },
            ].map((item, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{
                    y: -10,
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-[#07111f]/80 p-8 shadow-[0_20px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-10"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                  <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-[100px] opacity-0 transition duration-700 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400"
                    >
                      <i className={`${item.icon} text-3xl`} />
                    </motion.div>

                    <h2 className="mt-8 text-3xl font-black text-white">
                      {item.title}
                    </h2>

                    {item.paragraphs.map((paragraph, i) => (
                      <p
                        key={i}
                        className="mt-6 text-base leading-8 text-muted"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 group-hover:w-full" />
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </MainLayout>
  );
}
