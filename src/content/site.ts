export const company = {
  name: "Career Source Group",
  legalName: "Career Source Group, LLC",
  headquarters: "Alpharetta, Georgia",
  phone: "(443) 875-9677",
  phoneHref: "tel:+14438759677",
  email: "hello@careersourcegroup.com",
  tagline:
    "US staffing and talent delivery across the US, LATAM, and Pakistan — direct hire, contract, and contract-to-hire under one contract, one invoice, one point of contact.",
  hours: [
    ["Monday", "9 AM – 5 PM"],
    ["Tuesday", "9 AM – 5 PM"],
    ["Wednesday", "9 AM – 5 PM"],
    ["Thursday", "9 AM – 5 PM"],
    ["Friday", "9 AM – 5 PM"],
    ["Saturday", "Closed"],
    ["Sunday", "Closed"],
  ] as const,
  social: (() => {
    // import.meta.env (not process.env) — Vite bakes these in identically for
    // both the server and client bundles, avoiding an SSR/hydration mismatch.
    const env = import.meta.env as unknown as Record<string, string | undefined>;
    return {
      linkedin: env["NEXT_PUBLIC_LINKEDIN_URL"] || null,
      youtube: env["NEXT_PUBLIC_YOUTUBE_URL"] || null,
      facebook: env["NEXT_PUBLIC_FACEBOOK_URL"] || null,
      instagram: env["NEXT_PUBLIC_INSTAGRAM_URL"] || null,
    };
  })(),
};

export const navLinks = [
  { label: "Our Story", to: "/our-story" },
  { label: "Global Delivery", to: "/global-delivery" },
  { label: "Staffing", to: "/staffing" },
] as const;

export const specialties = [
  {
    slug: "ai-ml",
    title: "AI & ML Engineering",
    tagline: "The hardest hire in the world right now. We do it weekly.",
  },
  {
    slug: "mlops",
    title: "MLOps Engineering",
    tagline: "The role most companies hire six months too late.",
  },
  {
    slug: "data",
    title: "Data Engineering, Data Science & Analytics",
    tagline: "Every AI roadmap runs on a data team you haven't built yet.",
  },
  {
    slug: "devops",
    title: "DevOps Engineering",
    tagline: "Not a nice-to-have. A mission-critical operating model.",
  },
  {
    slug: "devsecops",
    title: "DevSecOps & Platform Engineering",
    tagline: "The 10-20% premium nobody warned you about.",
  },
  {
    slug: "cloud",
    title: "Cloud Engineering & Architecture",
    tagline: "Cloud and AI stopped being separate career paths.",
  },
  {
    slug: "software-dev",
    title: "Software Development",
    tagline: "The market split. Here's which side you're hiring on.",
  },
  {
    slug: "product",
    title: "Product & Project Management",
    tagline: "The fastest-growing salary line in tech, and almost nobody is watching it.",
  },
  {
    slug: "cybersecurity-grc",
    title: "Cybersecurity & GRC",
    tagline: "Security and compliance talent that translates controls into action.",
  },
] as const;

export const specialtyTags = ["Specialist", "Pod", "Contract", "Full-Time"] as const;

export const regionCards = [
  {
    to: "/global-delivery/us",
    title: "US Staffing",
    body: "Direct hire, contract, and contract-to-hire. Full time zone overlap. Best for leadership, client-facing, and compliance-sensitive roles.",
    cta: "See US Staffing",
  },
  {
    to: "/global-delivery/latam",
    title: "LATAM Nearshore",
    body: "Contract only. 30-70% less than US cost, near-full time zone overlap. Best for core product engineering and daily collaboration.",
    cta: "See LATAM Staffing",
  },
  {
    to: "/global-delivery/pakistan",
    title: "Pakistan Offshore",
    body: "Contract only. 50-70% less than US cost. Best for execution-heavy work, maintenance, and overnight coverage.",
    cta: "See Pakistan Staffing",
  },
] as const;

export const staffingSectionCards = [
  {
    to: "/staffing/roles",
    title: "Staffing Roles",
    body: "Individual specialists placed into a seat you've already defined — direct hire, contract, or contract-to-hire, priced across three regions.",
    cta: "See Staffing Roles",
  },
  {
    to: "/staffing/pods",
    title: "Pods",
    body: "A complete, purpose-built team — sized by experience, communication skill, technical skill, and cost — delivered under one contract, one invoice, one point of contact.",
    cta: "See How Pods Work",
  },
  {
    to: "/staffing/specialized-roles",
    title: "Specialized Roles",
    body: "The eight technical practices everyone else is struggling to fill: AI/ML, MLOps, data, DevOps, DevSecOps, cloud, software development, and product.",
    cta: "See Specialized Roles",
  },
] as const;

export type Faq = { q: string; a: string; audience: "clients" | "talent" };

export const faqs: Faq[] = [
  {
    audience: "clients",
    q: "Why do you charge 10% for direct hire when the industry charges 20-30%?",
    a: "We charge 10% of annual salary for direct hire. Standard US staffing fees run 15-30% of first-year salary, so on a $150,000 hire that's $30,000-$45,000 to a staffing firm versus our $15,000. Same vetting, same guarantee. On five hires a year, that's a quarter of a million dollars back in your budget.",
  },
  {
    audience: "clients",
    q: "What's the difference between a single specialist and a consulting pod?",
    a: "A specialist is one person placed into a seat you have already defined. A pod is a complete, purpose-built team delivered under one contract, one invoice, and one point of contact. We size every pod against four variables — experience, communication skills, technical skills, and cost — and geography is decided only after the first three are settled.",
  },
  {
    audience: "clients",
    q: "Do you place contract or full-time talent, or both?",
    a: "Both, and which is available depends on the region. In the US we place direct hire, contract, and contract-to-hire. LATAM nearshore and Pakistan offshore are contract only. Direct hire is 10% of first-year salary; contract workers sit on our payroll with compliance handled, so you get a bill rate instead of a headcount req.",
  },
  {
    audience: "clients",
    q: "What's the difference between nearshore (LATAM) and offshore (Pakistan) staffing?",
    a: "Time zone overlap is the real difference. LATAM nearshore runs one to three hours from US time, so your standup is their standup — it suits anything needing daily collaboration, at 30-70% less than US cost. Pakistan offshore is 50-70% less and needs structured overlap hours, so it fits execution-heavy, maintenance, and overnight work.",
  },
  {
    audience: "clients",
    q: "How do I know which region a role should go to?",
    a: "Nearshore for anything that needs live back-and-forth. Offshore for anything that doesn't. US for anything that has to be in the room. Most companies don't need to pick one — they need someone who can tell them which parts of the work go where. We sell all three regions, so we have no reason to push one over another.",
  },
  {
    audience: "clients",
    q: "What will my current offer actually buy in each region?",
    a: "Give us the offer — base, bonus, equity, remote flexibility, and how fast you need someone — and before we source a single candidate we'll tell you what it realistically buys in the US market and how long that search will take, what it buys in LATAM, and what it buys in Pakistan. Then you decide.",
  },
  {
    audience: "clients",
    q: "How fast can you deliver a shortlist?",
    a: "Send us one open req and we'll have profiles in front of you this week, before you commit to anything — no commitment, no retainer. Ramp then differs by region: LATAM and Pakistan starts run days to weeks, while US direct-hire cycles are the slow path across the market at four to six months.",
  },
  {
    audience: "clients",
    q: "How is a pod different from a staff-aug team?",
    a: "Staff augmentation hands you people; a pod hands you a team with an owner. Running it the traditional way means five separate searches, five separate rates, and three vendors — and six months later, four of the five seats filled and nobody accountable for how they work together. A pod is one SOW, one invoice, one person you call.",
  },
  {
    audience: "clients",
    q: "Can a pod include both contract and full-time hires?",
    a: "Engagement basis is set per seat, and what is available depends on where the seat sits. US seats can be direct hire, contract, or contract-to-hire; LATAM and Pakistan seats are contract only. Whatever the mix, the pod is still delivered as one SOW, one invoice, and one point of contact.",
  },
  {
    audience: "talent",
    q: "Do you place both contract and full-time roles?",
    a: "Both, depending on where you are. US-based roles come as direct hire, contract, and contract-to-hire. LATAM and Pakistan placements are contract, dedicated to one client team and embedded in that team's sprint cycle, tools, and rituals — with payroll, compliance, and employment infrastructure handled by us.",
  },
  {
    audience: "talent",
    q: "What specialties do you recruit for?",
    a: "Eight technical practices: AI/ML engineering, MLOps, data engineering and data science, DevOps, DevSecOps and platform engineering, cloud engineering and architecture, software development, and product and project management. We also place non-tech operations roles: customer success, revenue operations, finance and accounting ops, and back-office.",
  },
  {
    audience: "talent",
    q: "Do you work with candidates outside the US?",
    a: "Yes. We deliver dedicated nearshore talent from LATAM and offshore talent from Pakistan to US client teams, both on a contract basis. Those placements are embedded in the client's sprint cycle and tools rather than handed work over a wall, and we handle payroll, compliance, and employment infrastructure.",
  },
  {
    audience: "talent",
    q: "How does the pod model work if I'm the one being placed?",
    a: "You are placed into a defined seat on a purpose-built team, not dropped into an open req. Every seat is scored on communication first and on technical skill against the client's actual stack second. An engineering pod typically pairs a US technical lead who owns architecture and client communication with LATAM and Pakistan engineers.",
  },
  {
    audience: "talent",
    q: "What do you vet for?",
    a: "Communication before anything else — people in standups, client calls, and architecture debates are assessed differently than people executing against a well-defined ticket. Technical skill is vetted against the client's actual stack rather than a keyword match: real code review, stack-specific depth, and system design at their scale.",
  },
  // AEO-optimized questions (for AI search results)
  {
    audience: "clients",
    q: "How much does it cost to hire a software developer?",
    a: "US direct-hire software developers run $100,000-$200,000 annually depending on specialization. Our fee is 10% of first-year salary ($10,000-$20,000 total), far below the industry standard 20-30% ($20,000-$60,000). Nearshore LATAM developers run $30,000-$70,000 annually. Offshore Pakistan developers run $15,000-$40,000 annually. We provide market pricing before you commit.",
  },
  {
    audience: "clients",
    q: "What is the difference between staff augmentation and dedicated team?",
    a: "Staff augmentation provides individual specialists managed by you. A dedicated team (pod model) is a purpose-built unit delivered under one contract with one owner responsible for how they work together. Staff aug needs five separate searches and five vendors; a pod needs one SOW, one invoice, and one point of contact.",
  },
  {
    audience: "clients",
    q: "How long does it take to hire a developer?",
    a: "US direct-hire cycles typically run four to six months start-to-finish — the slowest path across the market. We provide shortlists within days to one week after you send a role description. LATAM nearshore and Pakistan offshore ramping starts within days to weeks. Our guarantee means no timeline delays if a placement doesn't work.",
  },
  {
    audience: "clients",
    q: "How do I choose between US, LATAM, and Pakistan staffing?",
    a: "Choose by collaboration need, not by label. US suits roles requiring in-room presence or deep client integration. LATAM nearshore (one to three hours time overlap) suits daily collaboration and 30-70% cost savings. Pakistan offshore (requires scheduled overlap hours) delivers 50-70% savings for execution-heavy, maintenance, or overnight work. We recommend the right split based on your role.",
  },
  {
    audience: "clients",
    q: "What is nearshore vs offshore staffing?",
    a: "Nearshore means neighboring countries with time zone overlap — LATAM for US companies, typically one to three hours different. Offshore means distant countries — Pakistan is 10-13 hours different from the US. Nearshore suits collaboration-heavy work; offshore suits structured project work. Nearshore saves 30-70% versus US; offshore saves 50-70%.",
  },
  {
    audience: "clients",
    q: "Can I hire contractors in another country legally?",
    a: "Yes, with the right structure. We handle employment, payroll, compliance, and benefits for all LATAM and Pakistan placements. You receive one bill rate and one invoice monthly; we manage all contractor infrastructure and legal requirements for their country. US direct-hire placements follow US employment law.",
  },
  {
    audience: "talent",
    q: "How much do remote jobs pay for developers outside the US?",
    a: "Rates depend on specialization, experience, and location. LATAM developers placed in US client teams earn $30,000-$70,000 annually on contract. Pakistan developers earn $15,000-$40,000 annually on contract. All placements pay significantly above local market rates while remaining cost-effective for US clients. Salary is paid in USD monthly.",
  },
  {
    audience: "talent",
    q: "How do I apply for a remote developer position?",
    a: "Visit our join-bench page and complete the candidate profile form with your specialty, experience level, work authorization status, and availability. We screen for communication before technical skill, and assess technical depth against real code review and your client's actual stack. You'll hear back within one to two weeks.",
  },
  {
    audience: "clients",
    q: "What happens if I'm not happy with a placement?",
    a: "All direct-hire placements carry a 90-day guarantee — if the fit isn't right, we replace the hire at no additional fee. Contract placements can be ramped down or swapped for different candidates without penalty. We own the outcome, not just the placement.",
  },
  {
    audience: "clients",
    q: "Do you hire for roles outside software development?",
    a: "Yes. Beyond our eight technical practices (AI/ML, MLOps, data, DevOps, DevSecOps, cloud, software dev, product), we place non-technical operations roles: customer success, revenue operations, finance and accounting operations, and back-office support. Full list available on our staffing specialties page.",
  },
];

export function faqsByQuestion(questions: string[]): Faq[] {
  return questions.map((q) => faqs.find((f) => f.q === q)).filter((f): f is Faq => Boolean(f));
}

export const ctaBand = {
  title: "Have a role open now?",
  body: "Send the title, must-have skills and target start date. We will respond within one business day with market feedback and a delivery recommendation.",
  primary: { label: "Send Us Your Role", to: "/get-started" },
  secondary: { label: "Contact Us", to: "/contact" },
} as const;

export const footerColumns = [
  {
    title: "Solutions",
    links: [
      { label: "Contract Staffing", to: "/staffing/roles" },
      { label: "Contract-to-Hire", to: "/staffing/roles" },
      { label: "Direct Hire", to: "/staffing/roles" },
      { label: "Dedicated Teams", to: "/staffing/pods" },
    ],
  },
  {
    title: "Expertise",
    links: [
      { label: "AI & ML", to: "/staffing/ai-ml" },
      { label: "Data", to: "/staffing/data" },
      { label: "Cloud & DevOps", to: "/staffing/cloud" },
      { label: "Cybersecurity & GRC", to: "/staffing/cybersecurity-grc" },
      { label: "All Practices", to: "/staffing/specialized-roles" },
    ],
  },
  {
    title: "Global Talent",
    links: [
      { label: "United States", to: "/global-delivery/us" },
      { label: "LATAM Nearshore", to: "/global-delivery/latam" },
      { label: "Pakistan Offshore", to: "/global-delivery/pakistan" },
      { label: "Compare Regions", to: "/global-delivery" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About CSG", to: "/our-story" },
      { label: "Case Studies", to: "/case-studies" },
      { label: "Insights", to: "/insights" },
      { label: "Contact", to: "/contact" },
      { label: "Terms", to: "/terms" },
    ],
  },
] as const;
