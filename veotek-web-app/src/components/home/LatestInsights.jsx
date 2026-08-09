import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

import Container from "../common/Container";
import { featuredPost, blogPosts } from "../../data/blogPosts";

export default function LatestInsights() {
  const prefersReducedMotion = useReducedMotion();

  const allPosts = [featuredPost, ...blogPosts].filter(Boolean);
  const latestPosts = allPosts.slice(0, 3);

  if (latestPosts.length === 0) {
    return null;
  }

  return (
    <section
      className="relative isolate overflow-hidden py-20 sm:py-24 lg:py-32"
      aria-labelledby="latest-insights-heading"
    >
      {/* BACKGROUND GLOWS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <div className="absolute -left-44 top-12 h-[32rem] w-[32rem] rounded-full bg-cyan-500/[0.07] blur-[170px]" />

        <div className="absolute -bottom-52 right-[-10rem] h-[36rem] w-[36rem] rounded-full bg-blue-500/[0.07] blur-[180px]" />

        <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.04] blur-[150px]" />
      </div>

      {/* GRID BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
      </div>

      <Container className="relative z-10 max-w-[1600px]">
        {/* SECTION HEADING */}
        <motion.div
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 28,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-[1600px] text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
              Latest Insights
            </span>
          </div>

          <h2
            id="latest-insights-heading"
            className="mt-7 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Insights On Technology & Innovation
          </h2>

          <p className="mx-auto mt-7 max-w-5xl text-base leading-8 text-muted sm:text-lg">
            Explore practical insights on software development, artificial
            intelligence, cloud systems, cybersecurity, automation, and digital
            transformation.
          </p>
        </motion.div>

        {/* ARTICLE CARDS */}
        <div className="mt-14 grid gap-7 md:grid-cols-2 lg:mt-20 xl:grid-cols-3">
          {latestPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 36,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.65,
                delay: prefersReducedMotion ? 0 : index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -10,
                    }
              }
              className="
                    group relative flex h-full flex-col overflow-hidden
                    rounded-[34px]
                    border border-white/10
                    bg-[#07111f]/75
                    shadow-[0_20px_80px_rgba(0,0,0,0.35)]
                    backdrop-blur-2xl
                    transition-[border-color,box-shadow]
                    duration-500
                    hover:border-cyan-400/30
                    hover:shadow-[0_30px_100px_rgba(34,211,238,0.1)]
                "
            >
              {/* CARD GRID */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"
              />

              {/* CARD GLOW */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-500/10 opacity-0 blur-[100px] transition-opacity duration-700 group-hover:opacity-100"
              />

              {/* IMAGE */}
              <Link
                to={`/blog/${post.slug}`}
                aria-label={`Read ${post.title}`}
                className="relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
              >
                <motion.img
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          scale: 1.06,
                        }
                  }
                  transition={{
                    duration: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="h-[245px] w-full object-cover sm:h-[265px]"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/10 to-transparent"
                />

                <div className="absolute left-5 top-5 inline-flex items-center rounded-full border border-cyan-400/20 bg-[#020617]/65 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400 backdrop-blur-xl">
                  {post.category}
                </div>

                {index === 0 && (
                  <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
                    Featured Insight
                  </div>
                )}
              </Link>

              {/* CONTENT */}
              <div className="relative z-10 flex flex-1 flex-col p-7 sm:p-8">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                  {post.date && (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={15} aria-hidden="true" />
                      {post.date}
                    </span>
                  )}

                  {post.readTime && (
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={15} aria-hidden="true" />
                      {post.readTime}
                    </span>
                  )}
                </div>

                <h3 className="mt-6 text-2xl font-black leading-tight text-white transition-colors duration-300 group-hover:text-cyan-400">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="focus-visible:outline-none focus-visible:text-cyan-400"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-5 line-clamp-3 text-sm leading-8 text-slate-400">
                  {post.desc}
                </p>

                <div className="mt-auto pt-9">
                  <div className="border-t border-white/10 pt-6">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group/button inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors duration-300 hover:text-cyan-400 focus-visible:outline-none focus-visible:text-cyan-400"
                    >
                      Read Article
                      <ArrowRight
                        size={17}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover/button:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* BOTTOM LINE */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 group-hover:w-full"
              />
            </motion.article>
          ))}
        </div>

        {/* VIEW ALL BUTTON */}
        <motion.div
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="mt-14 flex justify-center lg:mt-16"
        >
          <Link
            to="/blog"
            className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-8 text-sm font-semibold text-white shadow-[0_10px_50px_rgba(34,211,238,0.14)] backdrop-blur-xl transition duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/15 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            View All Insights
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
