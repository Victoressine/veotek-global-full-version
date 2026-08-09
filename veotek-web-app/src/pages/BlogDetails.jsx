import { Link, useParams } from "react-router-dom";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  CalendarDays,
  Share2,
  Activity,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Button from "../components/common/Button";

import Reveal from "../components/common/Reveal";
import Stagger from "../components/common/Stagger";
import StaggerItem from "../components/common/StaggerItem";

import { featuredPost, blogPosts } from "../data/blogPosts";

export default function BlogDetails() {
  const { slug } = useParams();

  const allPosts = [featuredPost, ...blogPosts];

  const post = allPosts.find((item) => item.slug === slug);

  const relatedPosts = blogPosts
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  if (!post) {
    return (
      <MainLayout>
        <section className="flex min-h-screen items-center justify-center px-6 text-center">
          <div>
            <h1 className="text-5xl font-black text-white">
              Article Not Found
            </h1>

            <p className="mt-6 text-lg text-slate-400">
              The article you are looking for does not exist.
            </p>

            <Link to="/blog">
              <Button className="mt-10 h-14 rounded-2xl px-8 text-white">
                Back To Blog
              </Button>
            </Link>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pb-24 lg:pt-36">
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px] sm:h-96 sm:w-96" />

        <Container className="relative z-10 max-w-[1600px]">
          {/* BACK BUTTON */}
          <Reveal>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-400"
            >
              <ArrowLeft size={16} />
              Back To Insights
            </Link>
          </Reveal>

          {/* HERO CONTENT */}
          <Reveal delay={0.1}>
            <div className="mt-10 max-w-5xl">
              {/* CATEGORY */}
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                  {post.category}
                </span>
              </div>

              {/* TITLE */}
              <h1 className="mt-8 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-8 max-w-3xl text-base leading-8 text-muted sm:text-lg">
                {post.desc}
              </p>

              {/* META */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {post.date}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={16} />
                  {post.readTime}
                </div>

                <button className="flex items-center gap-2 transition hover:text-cyan-400">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* FEATURED IMAGE */}
      <section className="pb-20">
        <Container className="max-w-[1600px]">
          <Reveal>
            <motion.div
              whileHover={{
                y: -5,
              }}
              transition={{
                duration: 0.35,
              }}
              className="group relative overflow-hidden rounded-[42px] border border-white/10 bg-[#07111f]/80 shadow-[0_20px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            >
              {/* GRID */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <motion.img
                  whileHover={{
                    scale: 1.03,
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                  src={post.image}
                  alt={post.title}
                  className="h-[320px] w-full object-cover sm:h-[450px] lg:h-[650px]"
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
                        VeoTek Insight
                      </p>

                      <h4 className="mt-1 text-sm font-bold text-white">
                        Enterprise Article
                      </h4>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </Reveal>
        </Container>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="pb-24">
        <Container className="max-w-[1500px]">
          <Reveal>
            <motion.article
              whileHover={{
                y: -4,
              }}
              transition={{
                duration: 0.35,
              }}
              className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[#07111f]/80 p-8 shadow-[0_20px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10 lg:p-14"
            >
              {/* GRID */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

              {/* GLOW */}
              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

              {/* CONTENT */}
              <div className="relative z-10 space-y-8">
                {post.content
                  .split("\n")
                  .filter((item) => item.trim() !== "")
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base leading-9 text-slate-300 sm:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </motion.article>
          </Reveal>
        </Container>
      </section>

      {/* RELATED POSTS */}
      <section className="pb-24">
        <Container className="max-w-[1600px]">
          <Reveal>
            <div className="mb-14">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                  Continue Reading
                </span>
              </div>

              <h2 className="mt-6 text-4xl font-black text-white">
                Related Articles
              </h2>
            </div>
          </Reveal>

          <Stagger className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((item, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{
                    y: -10,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-[#07111f]/75 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                >
                  {/* GRID */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      whileHover={{
                        scale: 1.06,
                      }}
                      transition={{
                        duration: 0.7,
                      }}
                      src={item.image}
                      alt={item.title}
                      className="h-[250px] w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/10 to-transparent" />

                    {/* CATEGORY */}
                    <div className="absolute left-5 top-5 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400 backdrop-blur-xl">
                      {item.category}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="relative z-10 p-7">
                    <h3 className="text-2xl font-black leading-tight text-white">
                      {item.title}
                    </h3>

                    <p className="mt-5 text-sm leading-8 text-slate-400">
                      {item.desc}
                    </p>

                    {/* BOTTOM */}
                    <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock3 size={16} />
                        {item.readTime}
                      </div>

                      <Link
                        to={`/blog/${item.slug}`}
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
          </Stagger>
        </Container>
      </section>

      {/* NEWSLETTER */}
      <section className="pb-28">
        <Container className="max-w-[1500px]">
          <Reveal>
            <motion.div
              whileHover={{
                y: -5,
              }}
              transition={{
                duration: 0.35,
              }}
              className="relative overflow-hidden rounded-[44px] border border-white/10 bg-[#07111f]/80 p-8 text-center shadow-[0_20px_120px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-12 lg:p-16"
            >
              {/* GRID */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

              <div className="relative z-10">
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
