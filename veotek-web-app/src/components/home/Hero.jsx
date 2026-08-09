/*****************************************************************
 * Hero Section
 *
 * Introduces VeoTek Global, presents the company value proposition,
 * and links visitors to the company’s core software services.
 *****************************************************************/

import { motion, useReducedMotion } from "framer-motion";
import { Bot, Cloud, Code2, Layers3, Globe, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import Container from "../common/Container";

import developmentTeamImage from "../../assets/images/hero/development-team.webp";
import projectPlanningImage from "../../assets/images/hero/project-planning.webp";
import softwareDeveloperImage from "../../assets/images/hero/software-developer.webp";

/*****************************************************************
 * Content
 *****************************************************************/

const capabilities = [
  {
    id: "custom-software-development",
    icon: Code2,
    label: "Software Development",
    href: "/services/enterprise-software-development",
  },
  {
    id: "web-development",
    icon: Globe,
    label: "Web Site/App Development",
    href: "/services/website-web-application-development",
  },
  {
    id: "cloud-devops",
    icon: Cloud,
    label: "Deployment & Hosting",
    href: "/services/deployment-hosting-services",
  },
  {
    id: "ai-automation",
    icon: Bot,
    label: "Automation & AI",
    href: "/services/ai-automation-systems",
  },
];

const headingSource = [
  {
    id: "line-one",
    segments: [
      {
        text: "Building Secure, Scalable",
        highlighted: false,
      },
    ],
  },
  {
    id: "line-two",
    segments: [
      {
        text: "Software That Helps ",
        highlighted: false,
      },
      {
        text: "Businesses",
        highlighted: true,
      },
    ],
  },
  {
    id: "line-three",
    segments: [
      {
        text: "Operate Smarter",
        highlighted: false,
      },
    ],
  },
];

/**
 * Creates stable animation indexes once instead of recalculating
 * character delays during every component render.
 */
const headingLines = (() => {
  let animationIndex = 0;

  return headingSource.map((line) => ({
    ...line,
    segments: line.segments.map((segment) => ({
      ...segment,
      characters: Array.from(segment.text, (character) => ({
        character,
        animationIndex: animationIndex++,
      })),
    })),
  }));
})();

/*****************************************************************
 * Animation
 *****************************************************************/

const premiumEase = [0.22, 1, 0.36, 1];

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.975,
    y: 18,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
};

const headingLetterVariants = {
  hidden: {
    opacity: 1,
    y: 0,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.34,
      delay: 0.38 + index * 0.022,
      ease: premiumEase,
    },
  }),
};

/*****************************************************************
 * Hero Eyebrow
 *****************************************************************/

function HeroEyebrow({ prefersReducedMotion }) {
  const marqueeText = "Software Development Company";

  return (
    <motion.div
      variants={contentVariants}
      initial={false}
      animate="visible"
      transition={{ duration: 0.5, ease: premiumEase }}
      className="
        inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full
        border border-cyan-400/20 bg-[#030311]/75 px-2.5 py-1.5
        shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl
        min-[380px]:px-3 sm:gap-2.5 sm:px-3.5 sm:py-2
      "
    >
      <span
        className="
          flex h-6 w-6 shrink-0 items-center justify-center rounded-full
          border border-cyan-400/25 bg-cyan-400/10 text-cyan-300
          sm:h-7 sm:w-7
        "
      >
        <Sparkles size={13} strokeWidth={1.8} aria-hidden="true" />
      </span>

      <div
        className="
    relative
    w-[clamp(13rem,55vw,24rem)]
    overflow-hidden
  "
        aria-label={marqueeText}
      >
        <motion.div
          className="flex w-max items-center whitespace-nowrap"
          animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 10,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                }
          }
        >
          {[0, 1].map((copy) => (
            <span
              key={copy}
              aria-hidden="true"
              className="
          shrink-0
          pr-12
          text-[0.58rem]
          font-bold
          uppercase
          tracking-[0.12em]
          text-slate-200

          min-[380px]:text-[0.62rem]

          sm:pr-16
          sm:text-[0.68rem]
          sm:tracking-[0.16em]

          md:text-xs
        "
            >
              {marqueeText}
            </span>
          ))}
        </motion.div>
      </div>

      <span
        className="
          hidden h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400
          shadow-[0_0_12px_rgba(34,211,238,0.9)] sm:block
        "
        aria-hidden="true"
      />
    </motion.div>
  );
}

/*****************************************************************
 * Hero Heading
 *****************************************************************/

function HeroHeading({ prefersReducedMotion }) {
  return (
    <h1
      id="hero-heading"
      aria-label="Building Secure, Scalable Software That Helps Businesses Operate Smarter"
      className="
        mx-auto mt-4 w-full max-w-[64rem] text-center font-black
        leading-[1.06] tracking-[-0.04em] text-white
        min-[380px]:mt-5 sm:mt-6 sm:leading-[1.03]
        md:tracking-[-0.045em] lg:leading-[1.01] lg:tracking-[-0.05em]
      "
    >
      {headingLines.map((line) => (
        <span
          key={line.id}
          aria-hidden="true"
          className="block whitespace-nowrap text-[clamp(0.9rem,4.35vw,4.1rem)]"
        >
          {line.segments.map((segment, segmentIndex) => (
            <span
              key={`${line.id}-${segmentIndex}`}
              className={segment.highlighted ? "text-cyan-400" : "text-white"}
            >
              {segment.characters.map(({ character, animationIndex }) => (
                <motion.span
                  key={`${line.id}-${segmentIndex}-${animationIndex}`}
                  custom={animationIndex}
                  variants={headingLetterVariants}
                  initial={false}
                  animate="visible"
                  className="inline-block"
                  style={{
                    whiteSpace: character === " " ? "pre" : "normal",
                  }}
                >
                  {character}
                </motion.span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

/*****************************************************************
 * Capability Link
 *****************************************************************/

function CapabilityLink({ capability, index, isActive }) {
  const CapabilityIcon = capability.icon;

  const responsiveBorders = [
    "",
    "border-t sm:border-l sm:border-t-0 lg:border-l",
    "border-t lg:border-l lg:border-t-0",
    "border-t sm:border-l lg:border-l lg:border-t-0",
  ][index];

  return (
    <Link
      to={capability.href}
      aria-current={isActive ? "page" : undefined}
      className={`
        group
        relative
        flex
        min-w-0
        items-center
        gap-3
        border-white/10
        px-4
        py-5
        transition-[background-color,color,border-color,box-shadow]
        duration-300

        focus-visible:z-10
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-inset
        focus-visible:ring-cyan-400

        lg:justify-center
        lg:px-3
        lg:py-6

        xl:px-4

        ${responsiveBorders}

        ${
          isActive
            ? "bg-cyan-400/[0.1] text-cyan-300 shadow-[inset_0_-2px_0_rgba(34,211,238,0.8)]"
            : "text-slate-300 hover:bg-white/[0.045] hover:text-cyan-300"
        }
      `}
    >
      <span
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          transition-[background-color,border-color,color,transform]
          duration-300

          group-hover:-translate-y-0.5

          sm:h-11
          sm:w-11

          ${
            isActive
              ? "border-cyan-400/40 bg-cyan-400/[0.16] text-cyan-300"
              : "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-300 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/[0.12]"
          }
        `}
      >
        <CapabilityIcon
          size={20}
          strokeWidth={1.8}
          aria-hidden="true"
          focusable="false"
        />
      </span>

      <span
        className="
          min-w-0
          text-sm
          font-bold
          leading-snug

          sm:text-base

          lg:text-sm

          xl:text-base
        "
      >
        {capability.label}
      </span>
    </Link>
  );
}

/*****************************************************************
 * Hero Component
 *****************************************************************/

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { pathname } = useLocation();

  return (
    <section
      aria-labelledby="hero-heading"
      className="
  relative
  isolate
  min-h-screen
  min-h-[100svh]
  overflow-hidden
  bg-[#030311]
  pt-24

        sm:pt-28

        md:pt-32

        lg:pt-28
      "
    >
      {/* Base background */}
      <div
  className="
    pointer-events-none
    absolute
    inset-0
    hidden
    bg-cyan-950/10
    mix-blend-color
    sm:block
  "
  aria-hidden="true"
/>

      {/* Background lighting */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          overflow-hidden
        "
        aria-hidden="true"
      >
        <div
          className="
    absolute
    -left-20
    top-[-5rem]
    h-[20rem]
    w-[20rem]
    rounded-full
    bg-cyan-500/[0.10]
    blur-[80px]

    sm:-left-40
    sm:top-[-10rem]
    sm:h-[35rem]
    sm:w-[35rem]
    sm:bg-cyan-500/[0.12]
    sm:blur-[160px]
  "
        />

        <div
          className="
    absolute
    right-[-6rem]
    top-[20%]
    h-[20rem]
    w-[20rem]
    rounded-full
    bg-indigo-500/[0.10]
    blur-[80px]

    sm:right-[-12rem]
    sm:h-[34rem]
    sm:w-[34rem]
    sm:bg-indigo-500/[0.12]
    sm:blur-[170px]
  "
        />

        <div
          className="
    absolute
    bottom-[-10rem]
    left-[30%]
    h-[18rem]
    w-[18rem]
    rounded-full
    bg-purple-500/[0.07]
    blur-[80px]

    sm:bottom-[-18rem]
    sm:left-[35%]
    sm:h-[32rem]
    sm:w-[32rem]
    sm:bg-purple-500/[0.08]
    sm:blur-[170px]
  "
        />
      </div>

      {/* Background grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          opacity-40
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
            bg-[size:80px_80px]
            [mask-image:linear-gradient(to_bottom,black_10%,transparent_95%)]
          "
        />
      </div>

      <Container className="relative z-10 w-full max-w-[1600px]">
        {/* Main photography area */}
        <motion.div
          variants={imageVariants}
          initial={false}
          animate="visible"
          transition={{
            duration: 0.85,
            delay: prefersReducedMotion ? 0 : 0.06,
            ease: premiumEase,
          }}
          className="relative w-full"
        >
          {/* Image glow */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-6
              bottom-0
              top-16
              rounded-[3rem]
              bg-cyan-500/10
              blur-[90px]

              sm:inset-x-12
              sm:blur-[120px]
            "
            aria-hidden="true"
          />

          {/* Main image */}
          <figure
            className="
              relative
              w-full
              overflow-hidden
              rounded-[1.6rem]
              border
              border-white/10
              bg-white/[0.04]
              shadow-[0_40px_140px_rgba(0,0,0,0.6)]

              sm:rounded-[2rem]

              lg:rounded-[2.5rem]
            "
          >
            <div
              className="
                relative
                h-[500px]
                overflow-hidden

                min-[380px]:h-[540px]

                sm:h-[620px]

                md:h-[680px]

                lg:h-[690px]

                xl:h-[730px]

                2xl:h-[780px]
              "
            >
              <img
                src={softwareDeveloperImage}
                alt="Software developer working with code across multiple computer screens"
                className="
                  h-full
                  w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-700

                  motion-safe:hover:scale-[1.02]

                  md:object-[center_42%]
                "
                width="1600"
                height="1000"
                fetchPriority="high"
                decoding="async"
                draggable="false"
              />

              {/* Image overlays */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#030311]
                  via-[#030311]/45
                  to-[#030311]/10
                "
                aria-hidden="true"
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#030311]/85
                  via-[#030311]/30
                  to-[#030311]/5
                "
                aria-hidden="true"
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-cyan-950/10
                  mix-blend-color
                "
                aria-hidden="true"
              />

              {/* Hero text overlay */}
              <div
                className="
                  absolute inset-0 z-20 flex items-center justify-center
                  px-4 py-16 min-[380px]:px-5 sm:px-8 md:px-10
                  lg:px-14 xl:px-16 2xl:px-20
                "
              >
                <div className="flex w-full max-w-[72rem] flex-col items-center text-center">
                  <HeroEyebrow prefersReducedMotion={prefersReducedMotion} />

                  <HeroHeading prefersReducedMotion={prefersReducedMotion} />
                </div>
              </div>
            </div>
          </figure>

          {/* Development team image */}
          <motion.figure
            initial={false}
            className="
  hidden
  sm:block
  absolute
  bottom-4
  left-4
  z-30
              w-[38%]
              max-w-[21rem]
              overflow-hidden
              rounded-[1.1rem]
              border-[4px]
              border-[#030311]
              bg-[#0a1020]
              shadow-[0_30px_90px_rgba(0,0,0,0.55)]

              min-[380px]:bottom-5
              min-[380px]:left-5

              sm:bottom-7
              sm:left-7
              sm:w-[34%]
              sm:rounded-[1.6rem]
              sm:border-[5px]

              md:bottom-8
              md:left-8
              md:w-[31%]
              md:rounded-[2rem]

              lg:bottom-10
              lg:left-10
              lg:w-[27%]
              lg:border-[6px]

              xl:left-12
            "
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={developmentTeamImage}
                alt="Software development team collaborating in a modern workspace"
                className="
                  h-full
                  w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-700

                  motion-safe:hover:scale-105
                "
                width="800"
                height="600"
                loading="lazy"
                decoding="async"
                draggable="false"
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#030311]/60
                  via-transparent
                  to-transparent
                "
                aria-hidden="true"
              />
            </div>
          </motion.figure>

          {/* Project planning image */}
          <motion.figure
            initial={false}
            className="
  hidden
  sm:block
  absolute
  right-4
  top-4
  z-30
              w-[38%]
              max-w-[21rem]
              overflow-hidden
              rounded-[1rem]
              border-[4px]
              border-[#030311]
              bg-[#0a1020]
              shadow-[0_24px_70px_rgba(0,0,0,0.55)]

              min-[380px]:right-5
              min-[380px]:top-5

              sm:right-7
              sm:top-7
              sm:w-[34%]
              sm:rounded-[1.5rem]
              sm:border-[5px]

              md:right-8
              md:top-8
              md:w-[31%]
              md:rounded-[1.8rem]

              lg:right-10
              lg:top-10
              lg:w-[27%]
              lg:border-[6px]

              xl:right-12
            "
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={projectPlanningImage}
                alt="Software project planning and development collaboration"
                className="
                  h-full
                  w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-700

                  motion-safe:hover:scale-105
                "
                width="720"
                height="540"
                loading="lazy"
                decoding="async"
                draggable="false"
              />

              <div
  className="
    pointer-events-none
    absolute
    inset-0
    hidden
    bg-cyan-950/10
    mix-blend-color
    sm:block
  "
  aria-hidden="true"
/>

            </div>
          </motion.figure>
        </motion.div>

        {/* Capability navigation */}
        <motion.nav
          aria-label="Software development capabilities"
          variants={contentVariants}
          initial={false}
          animate="visible"
          transition={{
            duration: 0.65,
            delay: prefersReducedMotion ? 0 : 0.35,
            ease: premiumEase,
          }}
          className="
            relative
            z-40
            mt-8
            grid
            grid-cols-1
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-[#070713]/85
            shadow-[0_24px_80px_rgba(0,0,0,0.35)]
            backdrop-blur-xl

            sm:grid-cols-2

            lg:-mt-8
            lg:grid-cols-4
            lg:rounded-3xl
          "
        >
          <div className="col-span-full flex items-center justify-center gap-3 px-6 py-4">
            <Layers3 size={20} className="text-cyan-300" aria-hidden="true" />

            <span className="text-sm font-bold uppercase tracking-wide text-cyan-300">
              Our Specialities
            </span>
          </div>

          {capabilities.map((capability, index) => {
            const isActive =
              pathname === capability.href ||
              pathname.startsWith(`${capability.href}/`);

            return (
              <CapabilityLink
                key={capability.id}
                capability={capability}
                index={index}
                isActive={isActive}
              />
            );
          })}
        </motion.nav>
      </Container>

      <div className="h-16 sm:h-20 lg:h-24" aria-hidden="true" />
    </section>
  );
}
