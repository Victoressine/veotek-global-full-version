import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Container from "../common/Container";

const faqItems = [
  {
    id: "services",
    question: "What software development services does VeoTek Global offer?",
    answer:
      "VeoTek Global provides custom web application development, mobile application development, enterprise software, cloud solutions, API integrations, artificial intelligence solutions, automation, software modernization, and ongoing technical support.",
  },
  {
    id: "industries",
    question: "Which industries does VeoTek Global work with?",
    answer:
      "We work with organizations across financial services, healthcare, logistics, education, retail, telecommunications, government, real estate, and other industries that require secure and scalable digital solutions.",
  },
  {
    id: "timeline",
    question: "How long does a typical software project take?",
    answer:
      "Project timelines depend on the scope, complexity, integrations, and required features. A focused product may take several weeks, while a larger enterprise platform can take several months. We provide a clear delivery roadmap before development begins.",
  },
  {
    id: "modernization",
    question: "Can you modernize our existing software?",
    answer:
      "Yes. We can assess your current system, improve its architecture, redesign outdated interfaces, migrate applications to modern cloud infrastructure, strengthen security, and add new functionality without unnecessarily disrupting existing operations.",
  },
  {
    id: "support",
    question: "Do you provide support after deployment?",
    answer:
      "Yes. We provide ongoing maintenance, monitoring, performance improvements, security updates, bug fixes, technical support, and feature development to help your software remain reliable as your organization grows.",
  },
  {
    id: "getting-started",
    question: "How do we get started with a project?",
    answer:
      "Start by contacting our team and sharing your business goals, current challenges, and expected outcomes. We will review your requirements, recommend an appropriate solution, define the project scope, and provide the next steps.",
  },
];

export default function HomeFAQ() {
  const [activeItem, setActiveItem] = useState(faqItems[0].id);
  const prefersReducedMotion = useReducedMotion();

  const toggleItem = (id) => {
    setActiveItem((currentItem) => (currentItem === id ? null : id));
  };

  return (
    <section
      className="relative isolate overflow-hidden py-20 sm:py-24 lg:py-32"
      aria-labelledby="home-faq-heading"
    >
      {/* BACKGROUND GLOWS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <div className="absolute -left-52 top-1/4 h-[34rem] w-[34rem] rounded-full bg-blue-500/[0.07] blur-[170px]" />

        <div className="absolute -right-52 bottom-0 h-[36rem] w-[36rem] rounded-full bg-cyan-500/[0.07] blur-[180px]" />
      </div>

      {/* GRID BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]" />
      </div>

      <Container className="relative z-10 max-w-[1500px]">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 xl:gap-24">
          {/* LEFT CONTENT */}
          <motion.div
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    x: -32,
                  }
            }
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                Frequently Asked Questions
              </span>
            </div>

            <h2
              id="home-faq-heading"
              className="mt-7 text-3xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Questions About Working With VeoTek
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-muted sm:text-lg">
              Find answers to common questions about our software development
              services, delivery process, support, and how we help businesses
              build reliable digital products.
            </p>

            <div className="relative mt-10 overflow-hidden rounded-[30px] border border-white/10 bg-[#07111f]/75 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"
              />

              <div className="relative z-10 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
                  <HelpCircle size={22} aria-hidden="true" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    Still have questions?
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Our team is ready to answer your questions, discuss your
                    project, and recommend the best technical solution for your
                    business.
                  </p>

                  <Link
                    to="/contact"
                    className="group mt-6 inline-flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/20 hover:text-cyan-300"
                  >
                    Contact Our Team
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ ACCORDION */}
          <motion.div
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    x: 32,
                  }
            }
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-5"
          >
            {faqItems.map((item, index) => {
              const isOpen = activeItem === item.id;
              const answerId = `faq-answer-${item.id}`;
              const buttonId = `faq-button-${item.id}`;

              return (
                <motion.article
                  key={item.id}
                  initial={
                    prefersReducedMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 24,
                        }
                  }
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: prefersReducedMotion ? 0 : index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`group relative overflow-hidden rounded-[28px] border backdrop-blur-2xl transition duration-500 ${
                    isOpen
                      ? "border-cyan-400/30 bg-[#07111f]/90 shadow-[0_20px_80px_rgba(34,211,238,0.08)]"
                      : "border-white/10 bg-[#07111f]/70 hover:border-cyan-400/20"
                  }`}
                >
                  {/* CARD GRID */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-25"
                  />

                  {/* CARD GLOW */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[90px] transition-opacity duration-500 ${
                      isOpen
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-60"
                    }`}
                  />

                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="relative z-10 flex w-full items-center justify-between gap-5 px-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400 sm:px-8 sm:py-7"
                  >
                    <span className="flex items-start gap-4">
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition duration-300 ${
                          isOpen
                            ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-400"
                            : "border-white/10 bg-white/[0.04] text-slate-500"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={`text-base font-bold leading-7 transition-colors duration-300 sm:text-lg ${
                          isOpen
                            ? "text-cyan-400"
                            : "text-white group-hover:text-cyan-300"
                        }`}
                      >
                        {item.question}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition duration-300 ${
                        isOpen
                          ? "rotate-180 border-cyan-400/30 bg-cyan-500/10 text-cyan-400"
                          : "border-white/10 bg-white/[0.04] text-slate-400"
                      }`}
                    >
                      <ChevronDown size={19} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={answerId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={
                          prefersReducedMotion
                            ? false
                            : {
                                height: 0,
                                opacity: 0,
                              }
                        }
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={
                          prefersReducedMotion
                            ? undefined
                            : {
                                height: 0,
                                opacity: 0,
                              }
                        }
                        transition={{
                          height: {
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                          },
                          opacity: {
                            duration: 0.25,
                          },
                        }}
                        className="relative z-10 overflow-hidden"
                      >
                        <div className="mx-6 border-t border-white/10 pb-7 pt-5 sm:mx-8 sm:pb-8">
                          <p className="pl-0 text-sm leading-8 text-slate-400 sm:pl-[52px] sm:text-base">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ${
                      isOpen ? "w-full" : "w-0"
                    }`}
                  />
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
