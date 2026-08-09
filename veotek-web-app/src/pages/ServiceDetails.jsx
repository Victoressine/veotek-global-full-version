import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock3,
  Info,
  Layers,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";
import { services } from "../data/servicesData";

const process = [
  {
    number: "01",
    title: "Discovery",
    desc: "We understand your goals, workflows, users, technical needs, and business requirements.",
  },
  {
    number: "02",
    title: "Planning",
    desc: "We define the system structure, features, user flow, technology stack, and delivery roadmap.",
  },
  {
    number: "03",
    title: "Development",
    desc: "We build the product using clean, scalable, secure, and modern software development practices.",
  },
  {
    number: "04",
    title: "Launch",
    desc: "We deploy, test, optimize, monitor, and prepare the system for real-world use.",
  },
];

const getServiceNotices = (service) =>
  [
    service?.hostingNote,
    service?.renewalNote,
    service?.infrastructureNote,
    service?.publishingNote,
    service?.aiNotice,
  ].filter(Boolean);

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <Reveal>
      <div className={centered ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400 sm:text-sm sm:tracking-[0.25em]">
          {eyebrow}
        </p>

        <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:mt-6 sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        {description && (
          <p
            className={`mt-5 text-sm leading-7 text-slate-400 sm:mt-6 sm:text-base sm:leading-8 ${
              centered ? "mx-auto max-w-3xl" : "max-w-3xl"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}

function PricingCard({ plan, service }) {
  const includedFeatures = plan.includes ?? [];

  return (
    <StaggerItem className="h-full">
      <motion.article
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className={`
          relative
          flex
          h-full
          min-h-[720px]
          flex-col
          overflow-hidden
          rounded-[30px]
          border
          p-6
          backdrop-blur-2xl
          sm:min-h-[780px]
          sm:rounded-[36px]
          sm:p-8
          lg:min-h-[840px]

          ${
            plan.popular
              ? "border-cyan-400/50 bg-cyan-500/[0.08] shadow-[0_24px_90px_rgba(34,211,238,0.14)]"
              : "border-white/10 bg-[#07111f]/75"
          }
        `}
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-52 w-52 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="relative z-20 flex h-full flex-col">
          {/* Package heading */}
          <div className="flex min-h-8 flex-wrap items-start justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              {plan.name}
            </span>

            {plan.badge && (
              <span
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  px-3
                  py-1
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.12em]

                  ${
                    plan.popular
                      ? "border-cyan-400/30 bg-cyan-500/15 text-cyan-300"
                      : "border-white/10 bg-white/5 text-slate-400"
                  }
                `}
              >
                {plan.popular && <BadgeCheck size={13} aria-hidden="true" />}

                {plan.badge}
              </span>
            )}
          </div>

          {/* Price and duration */}
          <div className="mt-7">
            <p className="break-words text-3xl font-black tracking-tight text-white sm:text-4xl xl:text-[2.65rem]">
              {plan.price}
            </p>

            {plan.duration && (
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-400">
                <Clock3
                  size={16}
                  className="flex-shrink-0 text-cyan-400"
                  aria-hidden="true"
                />

                <span>{plan.duration}</span>
              </div>
            )}
          </div>

          <div className="my-7 h-px flex-shrink-0 bg-white/10" />

          {/* Scrollable package features */}
          <div
            className="
              min-h-0
              flex-1
              space-y-4
              overflow-y-auto
              pr-2

              scrollbar-thin
              scrollbar-track-transparent
              scrollbar-thumb-white/10
              hover:scrollbar-thumb-cyan-400/30
            "
          >
            {includedFeatures.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                  <Check size={14} aria-hidden="true" />
                </span>

                <span className="relative z-20 text-sm leading-6 text-slate-200">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* CTA always remains visible */}
          <div className="relative z-20 mt-8 flex-shrink-0 border-t border-white/10 pt-6">
            <Link
              to="/contact"
              state={{
                service: service.title,
                package: plan.name,
                price: plan.price,
              }}
              aria-label={`Choose the ${plan.name} package for ${service.title}`}
              style={
                plan.popular
                  ? {
                      backgroundColor: "#22d3ee",
                      color: "#020617",
                      border: "1px solid #67e8f9",
                    }
                  : undefined
              }
              className={`
              group
              inline-flex
              min-h-14
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              px-5
              py-3
              text-center
              text-sm
              font-bold
              transition
              duration-300
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-cyan-300
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#07111f]

    ${
      plan.popular
        ? "shadow-[0_12px_35px_rgba(34,211,238,0.25)] hover:brightness-110"
        : "border border-white/10 bg-white/5 text-white hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
    }
  `}
            >
              <span style={{ color: plan.popular ? "#020617" : "inherit" }}>
                {plan.price === "Request Quote"
                  ? "Request Custom Quote"
                  : "Choose This Package"}
              </span>

              <ArrowRight
                size={17}
                style={{ color: plan.popular ? "#020617" : "inherit" }}
                className="transition duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </motion.article>
    </StaggerItem>
  );
}

function NoticeCard({ notice }) {
  return (
    <Reveal>
      <div className="flex items-start gap-4 rounded-[26px] border border-cyan-400/15 bg-cyan-500/[0.05] p-5 backdrop-blur-xl sm:rounded-[28px] sm:p-7">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
          <Info size={21} aria-hidden="true" />
        </div>

        <p className="text-sm leading-7 text-slate-300 sm:text-base">
          {notice}
        </p>
      </div>
    </Reveal>
  );
}

export default function ServiceDetails() {
  const { slug } = useParams();
  const prefersReducedMotion = useReducedMotion();

  const service = services.find((item) => item.slug === slug);

  const relatedServices = services
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  if (!service) {
    return (
      <MainLayout>
        <main>
          <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%)]" />

            <div className="relative z-10 mx-auto max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                404 Error
              </p>

              <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl">
                Service Not Found
              </h1>

              <p className="mt-6 text-base leading-8 text-slate-400 sm:text-lg">
                The service you are looking for does not exist or may have been
                moved.
              </p>

              <Link to="/services">
                <Button className="mt-10 h-14 rounded-2xl px-8 text-white">
                  Back To Services
                </Button>
              </Link>
            </div>
          </section>
        </main>
      </MainLayout>
    );
  }

  const notices = getServiceNotices(service);
  const packages = service.packages ?? [];
  const includedItems = service.included ?? [];
  const features = service.features ?? [];

  return (
    <MainLayout>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%)]" />
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] sm:h-96 sm:w-96" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px] sm:h-96 sm:w-96" />

          <Container className="relative z-10 max-w-[1600px]">
            <Reveal>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-400 transition duration-300 hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Back To Services
              </Link>

              <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
                <div className="min-w-0">
                  <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 backdrop-blur-xl sm:px-5">
                    <Layers
                      size={16}
                      className="flex-shrink-0 text-cyan-400"
                      aria-hidden="true"
                    />

                    <span className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-xs sm:tracking-[0.25em]">
                      {service.category}
                    </span>
                  </div>

                  <h1 className="mt-6 max-w-4xl break-words text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[56px]">
                    {service.title}
                  </h1>

                  <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-400 sm:mt-8 sm:text-base sm:leading-8 lg:text-lg">
                    {service.desc}
                  </p>

                  {service.overview && (
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
                      {service.overview}
                    </p>
                  )}

                  <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap sm:mt-10 sm:gap-4">
                    <Link to="/contact" state={{ service: service.title }}>
                      <Button className="group h-14 w-full rounded-2xl px-7 text-white shadow-[0_10px_40px_rgba(34,211,238,0.25)] min-[420px]:w-auto sm:px-8">
                        <span className="flex items-center justify-center gap-2">
                          Start A Project
                          <ArrowRight
                            size={17}
                            className="transition duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </span>
                      </Button>
                    </Link>

                    <Link
                      to="/portfolio"
                      className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-2xl transition duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 min-[420px]:w-auto sm:px-8"
                    >
                      View Portfolio
                      <ArrowRight
                        size={17}
                        className="transition duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>

                <motion.aside
                  aria-label={`${service.title} highlights`}
                  animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : {
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#07111f]/75 p-6 shadow-[0_20px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:rounded-[40px] sm:p-8"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
                  <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-[90px]" />

                  <div className="relative z-10">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 text-cyan-400 sm:h-24 sm:w-24 sm:rounded-[30px]">
                      <i
                        className={`${service.icon} text-4xl sm:text-5xl`}
                        aria-hidden="true"
                      />
                    </div>

                    <h2 className="mt-8 text-2xl font-black text-white sm:mt-10 sm:text-3xl">
                      What You Get
                    </h2>

                    <div className="mt-7 space-y-4 sm:mt-8 sm:space-y-5">
                      {features.slice(0, 4).map((feature) => (
                        <div key={feature} className="flex items-start gap-4">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                            <Check size={16} aria-hidden="true" />
                          </div>

                          <span className="pt-1 text-sm font-medium leading-6 text-slate-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.aside>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Core capabilities */}
        {features.length > 0 && (
          <section className="pb-20 sm:pb-24">
            <Container className="max-w-[1600px]">
              <Stagger className="grid gap-5 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
                {features.map((feature) => (
                  <StaggerItem key={feature}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#07111f]/70 p-6 backdrop-blur-2xl sm:rounded-[32px] sm:p-7"
                    >
                      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[90px] opacity-0 transition duration-700 group-hover:opacity-100" />

                      <div className="relative z-10 flex items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                          <CheckCircle2 size={20} aria-hidden="true" />
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-white sm:text-xl">
                            {feature}
                          </h3>

                          <p className="mt-3 text-sm leading-7 text-slate-400">
                            Built with performance, usability, security, and
                            sustainable business growth in mind.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Container>
          </section>
        )}

        {/* Pricing */}
        {packages.length > 0 && (
          <section className="pb-20 sm:pb-24">
            <Container className="max-w-[1600px]">
              <SectionHeading
                eyebrow="Pricing Packages"
                title={service.pricingTitle || `${service.title} Packages`}
                description={
                  service.pricingDescription ||
                  "Choose a package that matches your current requirements. Final pricing is confirmed after discovery and scope approval."
                }
                centered
              />

              <Stagger className="mt-12 grid items-stretch gap-6 lg:mt-14 lg:grid-cols-3 lg:gap-7 [&>*]:h-full">
                {packages.map((plan) => (
                  <PricingCard
                    key={plan.id ?? plan.name}
                    plan={plan}
                    service={service}
                  />
                ))}
              </Stagger>
            </Container>
          </section>
        )}

        {/* Included */}
        {includedItems.length > 0 && (
          <section className="pb-20 sm:pb-24">
            <Container className="max-w-[1600px]">
              <SectionHeading
                eyebrow="Included With Every Project"
                title="Everything You Need To Launch Confidently"
                description="Every engagement includes the essential planning, implementation, testing, deployment, and handover activities needed for a successful launch."
                centered
              />

              <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:grid-cols-4">
                {includedItems.map((item) => (
                  <StaggerItem key={item}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.25 }}
                      className="flex h-full items-start gap-4 rounded-[24px] border border-white/10 bg-[#07111f]/70 p-5 backdrop-blur-xl sm:rounded-[26px]"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                        <CheckCircle2 size={18} aria-hidden="true" />
                      </div>

                      <p className="pt-1 text-sm font-semibold leading-6 text-slate-300">
                        {item}
                      </p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Container>
          </section>
        )}

        {/* Service notices */}
        {notices.length > 0 && (
          <section className="pb-20 sm:pb-24">
            <Container className="max-w-[1200px]">
              <div className="space-y-5">
                {notices.map((notice) => (
                  <NoticeCard key={notice} notice={notice} />
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Additional charges */}
        {service.extras && (
          <section className="pb-20 sm:pb-24">
            <Container className="max-w-[1400px]">
              <Reveal>
                <div className="relative overflow-hidden rounded-[32px] border border-amber-400/20 bg-amber-400/[0.05] p-6 backdrop-blur-2xl sm:rounded-[40px] sm:p-10 lg:p-12">
                  <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-400/5 blur-[100px]" />

                  <div className="relative z-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
                    <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
                        <Info size={25} aria-hidden="true" />
                      </div>

                      <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-amber-300 sm:text-sm">
                        Scope Information
                      </p>

                      <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                        {service.extrasTitle ||
                          "Additional Functionality & Charges"}
                      </h2>
                    </div>

                    <div>
                      <p className="text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                        {service.extras}
                      </p>

                      <div className="mt-8 rounded-2xl border border-white/10 bg-black/10 p-5">
                        <p className="text-sm font-bold text-white">
                          Important
                        </p>

                        <p className="mt-2 text-sm leading-7 text-slate-400">
                          Any extra functionality, revisions, integrations,
                          services, pages, modules, infrastructure work, or
                          development outside the approved package and project
                          scope will attract additional payment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </Container>
          </section>
        )}

        {/* Process */}
        <section className="pb-20 sm:pb-24">
          <Container className="max-w-[1600px]">
            <SectionHeading
              eyebrow="Development Process"
              title="From Idea To Launch"
              description="A clear, structured process that helps your project move from concept to production with confidence."
            />

            <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 xl:grid-cols-4">
              {process.map((item) => (
                <StaggerItem key={item.number}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative h-full overflow-hidden rounded-[30px] border border-white/10 bg-[#07111f]/70 p-6 backdrop-blur-2xl sm:rounded-[36px] sm:p-7"
                  >
                    <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[90px] opacity-0 transition duration-700 group-hover:opacity-100" />

                    <span className="relative z-10 text-5xl font-black tracking-tight text-cyan-400/10 sm:text-6xl">
                      {item.number}
                    </span>

                    <div className="relative z-10 mt-8 sm:mt-10">
                      <h3 className="text-xl font-black text-white sm:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-slate-400 sm:mt-5 sm:leading-8">
                        {item.desc}
                      </p>
                    </div>

                    <div className="relative z-10 mt-8 h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-transparent transition-all duration-700 group-hover:w-28 sm:mt-10" />
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>

        {/* Related services */}
        {relatedServices.length > 0 && (
          <section className="pb-20 sm:pb-24">
            <Container className="max-w-[1600px]">
              <SectionHeading
                eyebrow="Related Services"
                title="Explore More Solutions"
              />

              <Stagger className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16">
                {relatedServices.map((item) => (
                  <StaggerItem key={item.id}>
                    <Link
                      to={`/services/${item.slug}`}
                      className="block h-full rounded-[30px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:rounded-[36px]"
                    >
                      <motion.article
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="group relative h-full overflow-hidden rounded-[30px] border border-white/10 bg-[#07111f]/70 p-6 backdrop-blur-2xl sm:rounded-[36px] sm:p-7"
                      >
                        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[90px] opacity-0 transition duration-700 group-hover:opacity-100" />

                        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 text-cyan-400 sm:rounded-[26px]">
                          <i
                            className={`${item.icon} text-4xl`}
                            aria-hidden="true"
                          />
                        </div>

                        <h3 className="relative z-10 mt-7 text-xl font-black text-white transition duration-300 group-hover:text-cyan-400 sm:mt-8 sm:text-2xl">
                          {item.title}
                        </h3>

                        <p className="relative z-10 mt-4 text-sm leading-7 text-slate-400 sm:mt-5 sm:leading-8">
                          {item.desc}
                        </p>
                      </motion.article>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </Container>
          </section>
        )}

        {/* Final CTA */}
        <section className="pb-24 sm:pb-28">
          <Container className="max-w-[1300px]">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
              whileInView={
                prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#07111f]/80 p-6 text-center shadow-[0_20px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:rounded-[44px] sm:p-12 lg:p-20"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_45%)]" />

              <div className="relative z-10">
                <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                  Ready To Build Something Exceptional?
                </h2>

                <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:mt-8 sm:text-base sm:leading-8">
                  Let&apos;s create a scalable, intelligent, and modern digital
                  solution tailored to your business goals.
                </p>

                <div className="mt-8 flex flex-col items-stretch justify-center gap-3 min-[420px]:flex-row min-[420px]:items-center sm:gap-4">
                  <Link
                    to="/contact"
                    state={{ service: service.title }}
                    className="min-[420px]:inline-flex"
                  >
                    <Button className="h-12 w-full rounded-xl px-5 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(34,211,238,0.25)] min-[420px]:w-auto sm:h-14 sm:rounded-2xl sm:px-8 sm:text-base">
                      Start A Project
                    </Button>
                  </Link>

                  <Link
                    to="/portfolio"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white backdrop-blur-2xl transition duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:h-14 sm:gap-3 sm:rounded-2xl sm:px-8"
                  >
                    View Portfolio
                    <ArrowRight
                      size={18}
                      className="transition duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
    </MainLayout>
  );
}
