import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { useState } from "react";

import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";

import { ArrowRight, Clock3, Activity } from "lucide-react";

import { featuredPost, blogPosts } from "../data/blogPosts";

export default function Blog() {
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");
  const categories = [
    "All",
    ...new Set(blogPosts.map((post) => post.category)),
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = category === "All" || post.category === category;

    return matchesSearch && matchesCategory;
  });
  return (
    <MainLayout>
      <section className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <Container className="relative z-10 max-w-[1600px]">
          {/* HERO */}
          <Reveal>
            <div className="mx-auto max-w-5xl text-center">
              {/* BADGE */}
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                  VeoTek Insights
                </span>
              </div>

              {/* TITLE */}
              <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[56px]">
                Insights On
                <span className="gradient-text"> Technology & Innovation</span>
              </h1>

              {/* DESCRIPTION */}
              <p className="mx-auto mt-8 max-w-3xl text-sm leading-8 text-muted sm:text-base lg:text-lg">
                Explore expert insights on software engineering, AI automation,
                cloud infrastructure, enterprise systems, cybersecurity, and
                digital transformation.
              </p>
            </div>
          </Reveal>

          {/* FEATURED POST */}
          <Reveal delay={0.2}>
            <motion.div
              whileHover={{
                y: -8,
              }}
              transition={{
                duration: 0.4,
              }}
              className="group relative mt-24 overflow-hidden rounded-[42px] border border-white/10 bg-[#07111f]/80 shadow-[0_20px_120px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
            >
              {/* GRID */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

              {/* GLOW */}
              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

              <div className="grid lg:grid-cols-2">
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <motion.img
                    whileHover={{
                      scale: 1.06,
                    }}
                    transition={{
                      duration: 0.8,
                    }}
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="h-full min-h-[340px] w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/20 to-transparent" />

                  {/* FLOATING BADGE */}
                  <motion.div
                    animate={{
                      y: [0, -6, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                    className="absolute bottom-6 left-6 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                        <Activity size={18} />
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          Featured
                        </p>

                        <h4 className="mt-1 text-sm font-bold text-white">
                          Enterprise Insight
                        </h4>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* CONTENT */}
                <div className="relative flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                  {/* CATEGORY */}
                  <div className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400 backdrop-blur-xl">
                    {featuredPost.category}
                  </div>

                  {/* TITLE */}
                  <h2 className="mt-8 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                    {featuredPost.title}
                  </h2>

                  {/* DESC */}
                  <p className="mt-6 text-base leading-8 text-slate-400">
                    {featuredPost.desc}
                  </p>

                  {/* META */}
                  <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                    <span>{featuredPost.author}</span>

                    <span>{featuredPost.date}</span>

                    <div className="flex items-center gap-2">
                      <Clock3 size={16} />
                      {featuredPost.readTime}
                    </div>
                  </div>

                  {/* BUTTON */}
                  <div className="mt-10">
                    <motion.div
                      whileHover={{
                        scale: 1.03,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                    >
                      <Link to={`/blog/${featuredPost.slug}`}>
                        <Button className="h-14 rounded-2xl px-8 text-sm font-semibold text-white shadow-[0_10px_50px_rgba(34,211,238,0.25)]">
                          Read Article
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* BOTTOM LINE */}
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 group-hover:w-full" />
            </motion.div>
          </Reveal>

          {/* SEARCH + FILTER */}
          <Reveal delay={0.15}>
            <div className="mt-20 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* SEARCH */}
              <div className="group relative w-full lg:max-w-xl">
                {/* GLOW */}
                <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 opacity-0 blur-xl transition duration-500 group-focus-within:opacity-100" />

                {/* INPUT */}
                <input
                  type="text"
                  placeholder="Search insights..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="relative h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-sm text-white backdrop-blur-2xl outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:bg-white/[0.06]"
                />

                {/* ACCENT LINE */}
                <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-focus-within:w-[90%]" />
              </div>

              {/* FILTERS */}
              <div className="flex flex-wrap gap-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition duration-300 ${
                      category === item
                        ? "border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-cyan-400/30 hover:text-cyan-400"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* BLOG GRID */}
          <Stagger
            key={`${category}-${search}`}
            className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredPosts.map((post) => (
              <StaggerItem key={`${post.id}-${category}-${search}`}>
                <motion.div
                  layout
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    scale: 0.96,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-[#07111f]/75 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                >
                  {/* GRID */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                  {/* GLOW */}
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[90px] opacity-0 transition duration-700 group-hover:opacity-100" />

                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      whileHover={{
                        scale: 1.06,
                      }}
                      transition={{
                        duration: 0.7,
                      }}
                      src={post.image}
                      alt={post.title}
                      className="h-[250px] w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/10 to-transparent" />

                    {/* CATEGORY */}
                    <div className="absolute left-5 top-5 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400 backdrop-blur-xl">
                      {post.category}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="relative z-10 p-7">
                    <h3 className="text-2xl font-black leading-tight text-white transition duration-300 group-hover:text-cyan-400">
                      {post.title}
                    </h3>

                    <p className="mt-5 text-sm leading-8 text-slate-400">
                      {post.desc}
                    </p>

                    {/* BOTTOM */}
                    <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock3 size={16} />
                        {post.readTime}
                      </div>

                      <Link
                        to={`/blog/${post.slug}`}
                        className="group/button flex items-center gap-2 text-sm font-semibold text-white transition duration-300 hover:text-cyan-400"
                      >
                        Read More
                        <ArrowRight
                          size={16}
                          className="transition duration-300 group-hover/button:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* BOTTOM LINE */}
                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 group-hover:w-full" />
                </motion.div>
              </StaggerItem>
            ))}

            {/* EMPTY STATE */}
            {filteredPosts.length === 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="col-span-full flex min-h-[320px] items-center justify-center rounded-[34px] border border-white/10 bg-[#07111f]/70 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
              >
                <div>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
                    <Activity size={34} />
                  </div>

                  <h3 className="mt-8 text-3xl font-black text-white">
                    No Articles Found
                  </h3>

                  <p className="mt-4 text-base text-slate-400">
                    Try adjusting your search or category filter.
                  </p>
                </div>
              </motion.div>
            )}
          </Stagger>

          {/* NEWSLETTER CTA */}
          <Reveal delay={0.2}>
            <motion.div
              whileHover={{
                y: -5,
              }}
              transition={{
                duration: 0.35,
              }}
              className="relative mt-32 overflow-hidden rounded-[44px] border border-white/10 bg-[#07111f]/80 p-8 text-center shadow-[0_20px_120px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-12 lg:p-16"
            >
              {/* GRID */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

              <div className="mx-auto max-w-4xl">
                <h2 className="text-4xl font-black leading-tight text-white sm:text-5xl">
                  Stay Updated With VeoTek Insights
                </h2>

                <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-muted">
                  Get the latest insights on software engineering, AI
                  innovation, cloud systems, cybersecurity, and digital
                  transformation.
                </p>

                {/* INPUT */}
                <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row">
                  <div className="group relative flex-1">
                    <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 opacity-0 blur-xl transition duration-500 group-focus-within:opacity-100" />

                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="relative h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-sm text-white backdrop-blur-2xl outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:bg-white/[0.06]"
                    />

                    <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-focus-within:w-[90%]" />
                  </div>

                  <Button className="h-14 rounded-2xl px-8 text-sm font-semibold text-white shadow-[0_10px_50px_rgba(34,211,238,0.25)]">
                    Subscribe
                  </Button>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  );
}
