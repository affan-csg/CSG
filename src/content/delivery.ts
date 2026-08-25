export const comparisonRows = [
  {
    label: "Cost vs. US baseline",
    us: "Baseline",
    latam: "30-70% less",
    pakistan: "50-70% less",
  },
  {
    label: "Time zone overlap",
    us: "Full",
    latam: "1-3 hours difference, near-full overlap",
    pakistan: "Limited, requires structured overlap hours",
  },
  {
    label: "Best for",
    us: "Leadership, client-facing, compliance-sensitive, culture-critical",
    latam: "Core product engineering, anything needing daily collaboration",
    pakistan: "Execution-heavy work, maintenance, overnight coverage, volume throughput",
  },
  {
    label: "Engagement models",
    us: "Direct hire, contract, contract-to-hire",
    latam: "Contract only",
    pakistan: "Contract only",
  },
  {
    label: "Speed to start",
    us: "Slowest for direct hire (4-6 months), fast for contract",
    latam: "Fast — days to weeks",
    pakistan: "Fast — days to weeks",
  },
  {
    label: "Seniority available",
    us: "Full range",
    latam: "Full range, strong mid-to-senior depth",
    pakistan: "Strong mid-level and specialized technical depth",
  },
] as const;

export const comparisonCaption =
  "Cost, time zone overlap, best fit, engagement models, speed to start and available seniority, compared across the United States, LATAM and Pakistan.";

export const prosCons = {
  us: {
    title: "US Staffing",
    pros: [
      "Full time zone alignment and same-day responsiveness",
      "Simplest compliance posture for regulated industries and government work",
      "Best fit for client-facing and leadership roles where presence matters",
      "Direct hire, contract, and contract-to-hire all available",
    ],
    cons: [
      "Highest cost by a wide margin — fully loaded employee cost runs roughly 1.25-1.4x base salary before recruiting and vacancy drag",
      "Slowest direct-hire cycles, commonly four to six months",
      "Senior bill rates are up roughly 15-30% year over year",
      "You're competing for the same scarce talent as every other US employer",
    ],
  },
  latam: {
    title: "LATAM Nearshore",
    pros: [
      "30-70% cost reduction, $35,000-$64,000 in annual savings per seat",
      "Near-full time zone overlap — real-time collaboration without anyone working nights",
      "Strong English proficiency and cultural alignment with US business norms",
      "Deep mid-to-senior bench: 84% of placements are mid-level or senior",
      "Fast ramp — days to weeks, not months",
    ],
    cons: [
      "Contract engagement only — not a path to a US-payroll permanent hire",
      "Costs more than pure offshore",
      "Requires real integration into team rhythms, not just work handoff",
      "Compliance and employment structure must be handled by a partner",
    ],
  },
  pakistan: {
    title: "Pakistan Offshore",
    pros: [
      "Deepest cost advantage — 50-70% below fully loaded US cost",
      "Large, English-speaking, technically deep talent pool, ranked second globally in digital labour supply",
      "Excellent for execution-heavy, high-volume, and after-hours work",
      "Fast ramp and strong specialized technical depth in cloud, DevOps, mobile, and QA",
    ],
    cons: [
      "Limited natural time zone overlap — must be designed in, not assumed",
      "Contract engagement only",
      "Wrong fit for work requiring constant real-time back-and-forth or live client contact",
      "Requires a partner with real vetting rigor",
    ],
  },
} as const;

export const globalDeliveryPage = {
  title: "US vs. LATAM vs. Pakistan: The Honest Comparison",
  intro:
    "Most staffing firms will tell you their one region is the answer to everything. We sell all three, which means we have no reason to lie to you about any of them.",
  pullQuote:
    "Nearshore for anything that needs live back-and-forth. Offshore for anything that doesn't. US for anything that has to be in the room.",
  pullQuoteFollow:
    "Most companies don't need to pick one. They need someone who can tell them which parts of the work go where. That's the job.",
  faqQuestions: [
    "What's the difference between nearshore (LATAM) and offshore (Pakistan) staffing?",
    "How do I know which region a role should go to?",
    "Do you work with candidates outside the US?",
  ],
};

export type RegionPage = {
  slug: "us" | "latam" | "pakistan";
  title: string;
  intro?: string[];
  highlights?: { heading: string; body: string }[];
  models?: { title: string; lead: string; when: string; get: string }[];
  sections?: { heading: string; body: string }[];
  pullQuote?: string;
  cta?: { label: string; to: string };
  prosConsKey: "us" | "latam" | "pakistan";
  faqQuestions: string[];
  meta: { title: string; description: string };
};

export const regionPages: RegionPage[] = [
  {
    slug: "us",
    title:
      "US contract and direct-hire talent for roles where proximity, compliance and continuity matter.",
    models: [
      {
        title: "Direct Hire — 10% of first-year salary",
        lead: "For the roles that anchor your business. The seats you'll need in three years, not three months. Leadership hires, culture-critical roles, and functions that never stop.",
        when: "Long-horizon roles, leadership seats, positions where continuity matters more than flexibility.",
        get: "Full-cycle search, replacement guarantee, and a fee that's roughly a third of what the market charges.",
      },
      {
        title: "Contract Staffing — flexible, budgeted as OpEx, not headcount",
        lead: "Contract is no longer the exception in IT staffing. It's the majority — roughly 64% of all IT staffing in 2024 was contract or temporary, and that share is still climbing.",
        when: "Surge capacity, a defined project with an end date, a specialized skill you need for nine months and not five years, or budget that lives in a project line instead of a headcount line.",
        get: "Worker on our payroll, compliance handled, and a bill rate instead of a hiring req you have to fight for.",
      },
      {
        title: "Contract-to-Hire — the model the market moved to",
        lead: "Contract-to-hire has overtaken direct hire as the default for senior IT roles. That's not caution. That's the market recognizing that a resume and four interviews are a weak substitute for 90 days of actual work.",
        when: "Any role where a bad hire would set you back six months. Any role where the budget is real but the headcount approval is still moving through finance. Any time you've been burned before.",
        get: "90-180 days to see real output before it becomes permanent. Conversion at a prorated fee, or waived entirely depending on tenure.",
      },
    ],
    pullQuote:
      "Instead of betting a full-time offer on a gut feeling, put them on contract-to-hire. You get three to six months of real work before it's a permanent commitment. And if it's not working, you're not running a termination — you're just not converting.",
    cta: { label: "Request US Talent", to: "/get-started" },
    prosConsKey: "us",
    faqQuestions: ["Do you place contract or full-time talent, or both?"],
    meta: {
      title: "US Staffing — Direct Hire, Contract & C2H",
      description:
        "Direct hire at 10% of first-year salary, contract staffing, and contract-to-hire across the US — with full time zone overlap and the simplest compliance posture.",
    },
  },
  {
    slug: "latam",
    title: "Nearshore technical talent that works when your US team works.",
    intro: [
      "Nearshore hiring is not an experiment anymore. US remote hiring in Latin America grew 161% from 2023 through 2026, and the region's IT services market has crossed $71 billion.",
      "And it is not junior talent. 84% of LATAM placements in 2025 were mid-level or senior, with roughly a third at senior level including VPs and directors.",
    ],
    highlights: [
      {
        heading: "The economics",
        body: "US companies save $35,000-$64,000 annually per hire versus a comparable domestic position — a 30-70% reduction depending on role and seniority.",
      },
      {
        heading: "Why it works",
        body: "One to three hours of time zone difference. Your standup is their standup. No one is answering Slack at 2am to make the relationship function.",
      },
    ],
    sections: [
      {
        heading: "Roles we deliver from LATAM",
        body: "AI/ML engineers, full-stack developers, DevOps and cloud engineers, QA automation, data engineers, product and BA, plus non-tech: customer success, revenue operations, bilingual support, finance and accounting operations.",
      },
      {
        heading: "Engagement model",
        body: "Contract only. Dedicated to your team, embedded in your sprint cycle, your tools, your rituals. We handle payroll, compliance, and employment infrastructure. You handle priorities and direction.",
      },
    ],
    cta: { label: "Request LATAM Talent", to: "/get-started" },
    prosConsKey: "latam",
    faqQuestions: [
      "What's the difference between nearshore (LATAM) and offshore (Pakistan) staffing?",
    ],
    meta: {
      title: "LATAM Nearshore Staffing — Your Time Zone, 30-70% Less",
      description:
        "Dedicated LATAM nearshore contract talent with near-full US time zone overlap, strong mid-to-senior depth, and $35,000-$64,000 in annual savings per seat.",
    },
  },
  {
    slug: "pakistan",
    title:
      "Dedicated offshore engineering capacity for structured execution and extended coverage.",
    intro: [
      "Most US buyers still default to India or the Philippines when they think offshore. The data has moved and the market hasn't caught up.",
      "The International Labour Organisation ranks Pakistan as the world's second-largest supplier of digital labour services — ahead of both India and the Philippines. In December 2025, Pakistan recorded $437 million in IT and digital service exports in a single month, a milestone no forecast had projected arriving that soon.",
    ],
    highlights: [
      {
        heading: "The economics",
        body: "A dedicated AWS or Azure DevOps engineer runs roughly $1,100-$1,600 per month through an offshore delivery model, versus $13,000-$22,000 per month fully loaded in the US. That is a 50-70% reduction.",
      },
      {
        heading: "The honest framing",
        body: "This is where you put work that doesn't require live, all-day back-and-forth with your US team. Execution-heavy work. Overnight coverage. Maintenance and support cycles. Volume work where throughput matters more than real-time collaboration.",
      },
    ],
    sections: [
      {
        heading: "Roles we deliver from Pakistan",
        body: "AWS and Azure cloud engineering, DevOps, mobile development, QA automation, application development and maintenance, AI/ML support and data engineering, plus non-tech: back-office operations, data processing, and after-hours support.",
      },
      {
        heading: "Engagement model",
        body: "Contract only. We pre-empt the two objections you're already thinking about — data security (NDAs, secure infrastructure, formal data-protection practices) and time zone (we staff for guaranteed daily overlap hours with your team, not \u201cwe'll figure it out\u201d).",
      },
    ],
    cta: { label: "Request Pakistan Talent", to: "/get-started" },
    prosConsKey: "pakistan",
    faqQuestions: [
      "What's the difference between nearshore (LATAM) and offshore (Pakistan) staffing?",
    ],
    meta: {
      title: "Pakistan Offshore Staffing — 50-70% Below US Cost",
      description:
        "Contract offshore delivery from Pakistan: deep AWS, Azure, DevOps, mobile and QA benches, guaranteed daily overlap hours, and 50-70% below fully loaded US cost.",
    },
  },
];

export const offerCalibration = {
  title: "What Your Offer Actually Buys, by Region",
  intro: "Using US starting-salary benchmarks as the baseline.",
  caption:
    "US starting salary ranges by role, and what the same budget buys in LATAM and Pakistan.",
  rows: [
    {
      role: "AI/ML Engineer",
      note: "Headcount range pending confirmation by our delivery team",
      us: "$134,000 - $193,250",
      latam: "Senior engineer, or 2 mid-level",
      pakistan: "A small team",
    },
    {
      role: "MLOps Engineer",
      note: "Headcount range pending confirmation by our delivery team",
      us: "$170,000 - $325,000",
      latam: "Senior engineer + platform support",
      pakistan: "Full platform pod",
    },
    {
      role: "Data Engineer",
      us: "$127,000 - $180,750",
      latam: "Senior engineer, or 2 mid-level",
      pakistan: "3-4 engineers",
    },
    {
      role: "Data Scientist",
      note: "Headcount range pending confirmation by our delivery team",
      us: "$121,750 - $182,500",
      latam: "Senior, or 2 mid-level",
      pakistan: "A small analytics team",
    },
    {
      role: "DevOps Engineer",
      us: "$118,000 - $173,750",
      latam: "Senior engineer, or 2 mid-level",
      pakistan: "4-6 engineers",
    },
    {
      role: "DevSecOps / Platform",
      note: "Headcount range pending confirmation by our delivery team",
      us: "10-20% above DevOps",
      latam: "Senior specialist",
      pakistan: "Specialist + support",
    },
    {
      role: "Cloud Engineer",
      us: "$110,000 - $155,000",
      latam: "Senior engineer, or 2 mid-level",
      pakistan: "4-6 engineers",
    },
    {
      role: "Software Engineer",
      us: "$109,250 - $175,500",
      latam: "Senior, or 2-3 mid-level",
      pakistan: "4-6 engineers",
    },
    {
      role: "Product / Project Manager",
      us: "$103,500 - $175,296",
      latam: "Senior PM with full overlap",
      pakistan: "Delivery/BA support functions",
    },
  ],
  footnote:
    "Ranges reflect US starting salaries from published 2026 benchmarks. LATAM savings run 30-70% versus comparable US positions; Pakistan runs 50-70% below fully loaded US cost. Exact equivalents depend on seniority, stack, and engagement length — which is exactly why the conversation starts with your offer, not our rate card.",
  emphasis:
    "This is not an argument for offshoring everything. It's an argument for knowing what your money buys before you spend it.",
  note: {
    heading: "A note on how we think about this",
    body: "Calibrating cost across regions is about designing capacity intelligently, not replacing US roles indiscriminately. The seats that need to be in the room, stay in the room.",
  },
  faqQuestions: [
    "How do I know which region a role should go to?",
    "What will my current offer actually buy in each region?",
  ],
};
