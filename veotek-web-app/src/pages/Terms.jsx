import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";

import { ArrowRight, FileText, Mail } from "lucide-react";

const terms = [
  {
    title: "1. Acceptance of Terms",
    desc: "By accessing or using VeoTek Global’s website, software services, or digital platforms, you agree to comply with and be bound by these Terms of Service.",
  },
  {
    title: "2. Services",
    desc: "VeoTek Global provides software development and technology services, including but not limited to custom software development, web and mobile application development, website development, API design and integration, cloud infrastructure solutions, AI-powered automation and system integration, and technology consulting for digital transformation.",
  },
  {
    title: "3. User Responsibilities",
    desc: "Users agree to provide accurate and complete information, use our services and systems responsibly, refrain from any activity that may disrupt, damage, or compromise our software, infrastructure, or platforms, and comply with all applicable laws and regulations when using our services.",
  },
  {
    title: "4. Intellectual Property",
    desc: "All content, branding, software, source code, designs, documentation, and digital assets on this website or delivered through our services remain the intellectual property of VeoTek Global unless otherwise stated in a written agreement.",
  },
  {
    title: "5. Project Agreements",
    desc: "Specific project deliverables, timelines, pricing, and ownership rights are governed by separate agreements or contracts between VeoTek Global and the client.",
  },
  {
    title: "6. Limitation of Liability",
    desc: "VeoTek Global is not responsible for any indirect or unexpected damages that may result from using our website, software services, or digital platforms. All services are provided “as is” and “as available,” unless we agree otherwise in a written contract.",
  },
  {
    title: "7. Confidentiality",
    desc: "We respect client confidentiality and apply appropriate technical and organizational measures to protect sensitive business data, project information, and proprietary materials shared with us during service delivery.",
  },
  {
    title: "8. Third-Party Services",
    desc: "Our software solutions may integrate with third-party tools, APIs, hosting providers, or platforms. VeoTek Global is not responsible for the availability, performance, or policies of third-party services.",
  },
  {
    title: "9. Service Availability",
    desc: "We aim to maintain reliable access to our services; however, we do not guarantee uninterrupted availability due to maintenance, updates, technical issues, or external dependencies.",
  },
  {
    title: "10. Changes to Terms",
    desc: "VeoTek Global reserves the right to update these Terms of Service at any time. Continued use of our services after changes are posted constitutes acceptance of the revised terms.",
  },
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState("section-1");

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  useEffect(() => {
    const sectionElements = terms
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
                  Terms of Service
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[56px]">
                Terms &<span className="gradient-text"> Conditions</span>
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-sm leading-8 text-muted sm:text-base lg:text-lg">
                These Terms of Service outline the rules, responsibilities, and
                legal agreement governing the use of VeoTek Global’s website,
                software services, development solutions, and digital platforms.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-500">
                <span>Effective Date: 2026</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                <span>10 Sections</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                <span>4 Min Read</span>
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
                    Select a section to review the terms details.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {terms.map((item) => {
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
              {terms.map((item) => {
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
                          <FileText size={24} />
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
                        Questions About These Terms?
                      </h3>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-muted">
                      If you have questions regarding these Terms of Service,
                      project agreements, or legal policies, contact VeoTek
                      Global directly.
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
