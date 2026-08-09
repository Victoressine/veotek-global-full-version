import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Layers,
  BarChart3,
  Code2,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";

import { portfolioProjects } from "../data/portfolioProjects";

export default function CaseStudy() {
  const { slug } = useParams();

  const project = portfolioProjects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <MainLayout>
        <section className="flex min-h-screen items-center justify-center px-6 text-center">
          <div>
            <h1 className="text-5xl font-black text-white">
              Project Not Found
            </h1>

            <p className="mt-6 text-lg text-slate-400">
              The project you are looking for does not exist.
            </p>

            <Link to="/portfolio">
              <Button className="mt-10 h-14 rounded-2xl px-8 text-white">
                Back To Portfolio
              </Button>
            </Link>
          </div>
        </section>
      </MainLayout>
    );
  }

  const relatedProjects = portfolioProjects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 2);

  const metrics = project.metrics || [
    { value: "99%", label: "System Reliability" },
    { value: "3x", label: "Workflow Speed" },
    { value: "24/7", label: "Availability" },
  ];

  const features = project.features || [
    "Responsive premium interface",
    "Scalable frontend architecture",
    "Optimized user experience",
    "Production-ready component system",
    "Secure and maintainable structure",
    "Performance-focused design",
  ];

  const challenge =
    project.challenge ||
    "The project required a scalable, modern, and premium digital experience that could support business growth, improve usability, and present a strong technology brand.";

  const solution =
    project.solution ||
    "We built a production-ready digital platform with a premium interface, reusable components, responsive layouts, smooth interactions, and scalable frontend architecture.";

  return (
    <MainLayout>
      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-36">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />

        <Container className="relative z-10 max-w-[1500px]">
          <Reveal>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-400"
            >
              <ArrowLeft size={16} />
              Back To Portfolio
            </Link>

            <div className="mt-10 max-w-5xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                <Layers size={15} className="text-cyan-400" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                  {project.category}
                </span>
              </div>

              <h1 className="mt-8 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>

              <p className="mt-8 max-w-3xl text-base leading-8 text-muted sm:text-lg">
                {project.summary || project.desc}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button className="group h-14 rounded-2xl px-8 text-white">
                  <span className="flex items-center gap-2">
                    View Live
                    <ExternalLink
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* IMAGE */}
      <section className="pb-24">
        <Container className="max-w-[1500px]">
          <Reveal>
            <div className="relative overflow-hidden rounded-[44px] border border-white/10 bg-[#07111f]/80 shadow-[0_20px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <img
                src={project.image}
                alt={project.title}
                className="h-[360px] w-full object-cover sm:h-[500px] lg:h-[640px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#030311] via-transparent to-transparent" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* METRICS */}
      <section className="pb-24">
        <Container className="max-w-[1500px]">
          <Stagger className="grid gap-6 md:grid-cols-3">
            {metrics.map((metric) => (
              <StaggerItem key={metric.label}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl"
                >
                  <h3 className="text-5xl font-black text-white">
                    {metric.value}
                  </h3>

                  <p className="mt-4 text-sm uppercase tracking-[0.2em] text-slate-500">
                    {metric.label}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* CHALLENGE / SOLUTION */}
      <section className="pb-24">
        <Container className="max-w-[1400px]">
          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                icon: BarChart3,
                title: "The Challenge",
                text: challenge,
              },
              {
                icon: Code2,
                title: "The Solution",
                text: solution,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Reveal key={item.title}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#07111f]/80 p-8 shadow-[0_20px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-10"
                  >
                    <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-cyan-500/10 blur-[120px]" />

                    <div className="relative z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
                        <Icon size={24} />
                      </div>

                      <h2 className="mt-8 text-3xl font-black text-white">
                        {item.title}
                      </h2>

                      <p className="mt-6 text-base leading-8 text-muted">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* TECH STACK */}
      <section className="pb-24">
        <Container className="max-w-[1500px]">
          <Reveal>
            <div className="mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Technology Stack
              </p>

              <h2 className="mt-4 text-4xl font-black text-white">
                Tools Used To Build This Platform
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-wrap gap-4">
            {project.tech?.map((item) => (
              <span
                key={item}
                className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-400"
              >
                {item}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="pb-24">
        <Container className="max-w-[1500px]">
          <Reveal>
            <div className="mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Core Features
              </p>

              <h2 className="mt-4 text-4xl font-black text-white">
                Premium System Capabilities
              </h2>
            </div>
          </Reveal>

          <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <StaggerItem key={feature}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-start gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl"
                >
                  <CheckCircle2
                    size={22}
                    className="mt-1 flex-shrink-0 text-cyan-400"
                  />

                  <p className="text-base font-semibold text-white">
                    {feature}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* RELATED */}
      {relatedProjects.length > 0 && (
        <section className="pb-24">
          <Container className="max-w-[1500px]">
            <Reveal>
              <h2 className="text-4xl font-black text-white">
                Related Projects
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {relatedProjects.map((item) => (
                <Link key={item.slug} to={`/portfolio/${item.slug}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="group overflow-hidden rounded-[34px] border border-white/10 bg-[#07111f]/80 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-[280px] w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="p-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        {item.category}
                      </p>

                      <h3 className="mt-4 text-2xl font-black text-white">
                        {item.title}
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-muted">
                        {item.summary || item.desc}
                      </p>

                      <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-white transition group-hover:text-cyan-400">
                        View Case Study
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="pb-28">
        <Container className="max-w-[1300px]">
          <Reveal>
            <div className="relative overflow-hidden rounded-[44px] border border-white/10 bg-[#07111f]/80 p-8 text-center shadow-[0_20px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-12 lg:p-16">
              <h2 className="text-4xl font-black text-white sm:text-5xl">
                Ready To Build Your Next Platform?
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted">
                Let VeoTek Global help you build a scalable, premium,
                production-ready digital system.
              </p>

              <Link to="/contact">
                <Button className="mt-10 h-14 rounded-2xl px-8 text-white">
                  Start A Project
                </Button>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  );
}
