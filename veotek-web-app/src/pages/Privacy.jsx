import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";

import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "1. Information We Collect",
    desc: "We may collect basic contact and business information such as your name, email address, phone number, company name, and project requirements when you contact us, request a software development service, or submit a form on our website.",
  },
  {
    title: "2. How We Use Your Information",
    desc: "We use your information to respond to inquiries, deliver software development services, manage client communications and projects, improve our website and development workflows, and provide updates on ongoing software development work.",
  },
  {
    title: "3. Data Protection",
    desc: "VeoTek Global applies industry-standard technical and organizational security measures to safeguard your information against unauthorized access, loss, misuse, or disclosure.",
  },
  {
    title: "4. Sharing of Information",
    desc: "We do not sell or rent your personal information. We may only share information when required by law, necessary for service delivery, or with trusted partners supporting our operations.",
  },
  {
    title: "5. Cookies & Analytics",
    desc: "Our website may use cookies and analytics tools to understand visitor behavior, improve performance, and enhance user experience.",
  },
  {
    title: "6. Third-Party Links",
    desc: "Our website may contain links to third-party websites. VeoTek Global is not responsible for the privacy practices, content, or policies of external websites.",
  },
  {
    title: "7. Your Rights",
    desc: "You may request access, correction, or deletion of your personal information by contacting us directly.",
  },
  {
    title: "8. Policy Updates",
    desc: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.",
  },
];

export default function Privacy() {
  const [activeSection, setActiveSection] = useState("section-1");

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  useEffect(() => {
    const sectionElements = sections
      .map((item) =>
        document.getElementById(`section-${item.title.split(".")[0]}`),
      )
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      },
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleScrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <MainLayout>
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-[80] h-[3px] w-full origin-left bg-gradient-to-r from-cyan-400 to-blue-500"
      />

      <section className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%)]" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] sm:h-96 sm:w-96" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <Container className="relative z-10 max-w-[1500px]">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                  Privacy Policy
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[56px]">
                Protecting Your
                <span className="gradient-text"> Data & Trust</span>
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-sm leading-8 text-muted sm:text-base lg:text-lg">
                This Privacy Policy explains how VeoTek Global collects, uses,
                protects, and manages information shared through our website,
                software products, and digital services.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-500">
                <span>Effective Date: 2026</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                <span>8 Sections</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                <span>3 Min Read</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-16 rounded-[34px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl sm:p-6 lg:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                    Quick Navigation
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Select a section to review the policy details.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {sections.map((item) => {
                    const sectionNumber = item.title.split(".")[0];
                    const sectionId = `section-${sectionNumber}`;
                    const isActive = activeSection === sectionId;

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => handleScrollToSection(sectionId)}
                        aria-label={`Go to ${item.title}`}
                        className={`rounded-2xl border px-4 py-3 text-left text-xs font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#030311] ${
                          isActive
                            ? "border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-[0_0_35px_rgba(34,211,238,0.18)]"
                            : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                        }`}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl sm:p-8 lg:p-10">
            <Stagger className="grid gap-6">
              {sections.map((item) => {
                const sectionNumber = item.title.split(".")[0];

                return (
                  <StaggerItem key={item.title}>
                    <motion.article
                      id={`section-${sectionNumber}`}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.35 }}
                      className="group scroll-mt-32 rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-500 hover:border-cyan-400/30 hover:bg-cyan-500/[0.03] sm:p-8"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
                          <ShieldCheck size={24} />
                        </div>

                        <div>
                          <h2 className="text-xl font-bold text-white sm:text-2xl">
                            {item.title}
                          </h2>

                          <p className="mt-4 text-sm leading-7 text-muted sm:text-base sm:leading-8">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  </StaggerItem>
                );
              })}
            </Stagger>

            <Reveal delay={0.2}>
              <div className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
                        <Mail size={22} />
                      </div>

                      <h3 className="text-2xl font-bold text-white">
                        Contact Us About Privacy
                      </h3>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-muted">
                      For privacy questions, data requests, or policy concerns,
                      contact VeoTek Global at:
                    </p>

                    <a
                      href="mailto:veotekglobal@gmail.com"
                      className="mt-4 inline-flex text-sm font-semibold text-cyan-400 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#030311]"
                    >
                      veotekglobal@gmail.com
                    </a>
                  </div>

                  <Link to="/contact">
                    <Button className="h-12 rounded-2xl px-6 text-white">
                      <span className="flex items-center gap-2">
                        Contact Us
                        <ArrowRight size={16} />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
