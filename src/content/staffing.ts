export type StaffingRoleBlock = { heading: string; body: string };

export type StaffingRole = {
  slug: string;
  title: string;
  tagline: string;
  blocks: StaffingRoleBlock[];
  regions: { region: string; body: string }[];
  pullQuote?: string;
  faqQuestions: string[];
};

export const staffingRoles: StaffingRole[] = [
  {
    slug: "ai-ml",
    title: "AI & ML Engineering",
    tagline: "The hardest hire in the world right now. We do it weekly.",
    blocks: [
      {
        heading: "Market reality",
        body: "AI/ML engineers start at $134,000 and run to $193,250 in the US, and that's the starting range — engineers with demonstrated LLM, MLOps, or applied AI skills earn 15-25% above benchmark at the same level.",
      },
      {
        heading: "What we vet for",
        body: "Production LLM integration, not demo work. Model evaluation and guardrails. RAG architecture and vector databases. Fine-tuning and inference optimization. And critically — whether they've shipped something to real users or just to a notebook.",
      },
    ],
    regions: [
      {
        region: "US",
        body: "Direct hire, contract, or C2H. For the seat that owns model strategy and talks to your executives.",
      },
      {
        region: "LATAM",
        body: "Contract. AI/ML engineers are among the highest-demand LATAM roles right now, and the region has real depth here.",
      },
      {
        region: "Pakistan",
        body: "Contract. Strong for ML support engineering, data pipelines feeding models, and evaluation work.",
      },
    ],
    pullQuote:
      "There are roughly three and a half open AI roles for every qualified engineer in the market. You're not competing on job description. You're competing on speed and reach. We have both.",
    faqQuestions: [],
  },
  {
    slug: "mlops",
    title: "MLOps Engineering",
    tagline: "The role most companies hire six months too late.",
    blocks: [
      {
        heading: "Market reality",
        body: "Budget $170K-$230K mid-level and $235K-$325K senior. Clean, well-scoped searches close in four to seven weeks. Mis-scoped ones drag past ninety days.",
      },
      {
        heading: "The insight that wins this deal",
        body: "There is a significant gap between companies that can train a model and companies that can serve one reliably at scale. Most MLOps job descriptions are written by hiring managers who think MLOps is a senior data scientist who knows Kubernetes. It isn't. The closest analog is platform SRE for ML systems. The strongest MLOps engineers came up through SRE, DevOps, or data engineering and layered ML platform tooling on top — not through data science.",
      },
      {
        heading: "What we vet for",
        body: "Model registry and serving infrastructure. Feature pipelines. CI/CD from notebook to endpoint. Model quantization and inference optimization. MLflow, Kubeflow, Ray. And whether they've carried the pager when an inference pod died at 4am.",
      },
    ],
    regions: [
      { region: "US", body: "All three engagement models." },
      { region: "LATAM", body: "Contract." },
      {
        region: "Pakistan",
        body: "Contract. Strong depth in the underlying infrastructure skillset.",
      },
    ],
    pullQuote:
      "If you have data scientists on payroll and nothing in production, you don't need another data scientist. You need the role you haven't hired yet.",
    faqQuestions: [],
  },
  {
    slug: "data",
    title: "Data Engineering, Data Science & Analytics",
    tagline: "Every AI roadmap runs on a data team you haven't built yet.",
    blocks: [
      {
        heading: "Market reality",
        body: "Data engineers start at $127,000-$180,750. Data scientists at $121,750-$182,500. Data engineering has become a prerequisite for any serious AI deployment — which means every company chasing an AI initiative is now competing for the same data engineers.",
      },
      {
        heading: "What we vet for",
        body: "Pipeline architecture at real volume. dbt, Airflow, Spark. Warehouse and lakehouse design (Snowflake, Databricks, BigQuery). Data quality and observability. For data science: whether their models ever left the notebook.",
      },
    ],
    regions: [
      { region: "US", body: "All three engagement models." },
      { region: "LATAM", body: "Contract. Excellent depth." },
      {
        region: "Pakistan",
        body: "Contract. Strong for pipeline build and maintenance, ETL, and data operations at volume.",
      },
    ],
    pullQuote:
      "The bottleneck on your AI roadmap almost certainly isn't the model. It's the pipeline feeding it.",
    faqQuestions: [],
  },
  {
    slug: "devops",
    title: "DevOps Engineering",
    tagline: "Not a nice-to-have. A mission-critical operating model.",
    blocks: [
      {
        heading: "Market reality",
        body: "DevOps engineers start at $118,000-$173,750 in the US. The field hasn't declined — it specialized, splitting into cloud engineering, platform engineering, DevSecOps, and SRE, all rooted in the same foundation. DevOps engineers with MLOps experience are commanding premium rates as companies race to productionize AI.",
      },
      {
        heading: "What we vet for",
        body: "Kubernetes in production, not in a tutorial — Helm, service mesh, multi-cluster. Terraform and IaC. Pipeline ownership across GitHub Actions, GitLab CI, ArgoCD. Observability: Prometheus, Grafana, Datadog, OpenTelemetry.",
      },
    ],
    regions: [
      { region: "US", body: "All three engagement models." },
      { region: "LATAM", body: "Contract." },
      {
        region: "Pakistan",
        body: "Contract. This is one of our deepest benches. A dedicated AWS or Azure DevOps engineer through offshore delivery runs roughly $1,100-$1,600/month versus $13,000-$22,000/month fully loaded in the US.",
      },
    ],
    pullQuote:
      "If you need three or four DevOps engineers this quarter, running those searches in parallel without a dedicated partner is the whole reason your roadmap slips.",
    faqQuestions: [],
  },
  {
    slug: "devsecops",
    title: "DevSecOps & Platform Engineering",
    tagline: "The 10-20% premium nobody warned you about.",
    blocks: [
      {
        heading: "Market reality",
        body: "DevSecOps specialists and platform engineers pull 10-20% premiums over standard DevOps roles — a gap that has held steady for two years with no sign of closing. Platform engineer median salaries in North America run $178,000. 80% of large software organizations now rely on dedicated platform teams.",
      },
      {
        heading: "The sourcing insight we bring",
        body: "Platform engineering is new enough that searching for the literal title \"platform engineer\" will fail. The talent is sitting in adjacent roles — DevOps engineers who've built self-service tooling, SREs who automate reflexively, cloud architects with a product mindset. We source for the skill pattern, not the title. That's not a technique most firms use, and it's why these searches stall elsewhere.",
      },
      {
        heading: "What we vet for",
        body: "Kubernetes, Terraform, CI/CD, internal developer platforms and golden paths. For DevSecOps specifically: container scanning, secrets management (Vault), policy-as-code (OPA), supply chain security. Plus a genuine product mindset — platform engineers build for developers, and the ones who don't think that way build platforms nobody uses.",
      },
    ],
    regions: [
      {
        region: "US",
        body: "All three engagement models. Security-sensitive and compliance-heavy environments should stay US.",
      },
      { region: "LATAM", body: "Contract." },
      {
        region: "Pakistan",
        body: "Contract, with security posture designed in from day one.",
      },
    ],
    faqQuestions: [],
  },
  {
    slug: "cloud",
    title: "Cloud Engineering & Architecture",
    tagline: "Cloud and AI stopped being separate career paths.",
    blocks: [
      {
        heading: "Market reality",
        body: "Cloud engineers start at $110,000-$155,000; cloud architects run $140,000-$225,000. AWS certifications alone deliver a 25-30% pay increase. The highest-value talent now sits at the intersection of cloud architecture, data engineering, and AI deployment — and that combination is scarce.",
      },
      {
        heading: "What we vet for",
        body: "Multi-cloud and hybrid architecture. Cost optimization (this is the fastest-ROI skill we place — a good cloud engineer frequently pays for themselves out of your existing cloud bill). Migration experience. Security and governance at the infrastructure layer.",
      },
    ],
    regions: [
      { region: "US", body: "All three engagement models." },
      { region: "LATAM", body: "Contract." },
      {
        region: "Pakistan",
        body: "Contract. Deep AWS and Azure bench, and cloud cost optimization is the single highest-ROI offshore engagement we run.",
      },
    ],
    pullQuote:
      "Before you hire a cloud engineer, let us put one on your cloud bill for 30 days. The savings usually cover the engagement.",
    faqQuestions: [],
  },
  {
    slug: "software-dev",
    title: "Software Development",
    tagline: "The market split. Here's which side you're hiring on.",
    blocks: [
      {
        heading: "Market reality",
        body: "Software engineers start at $109,250-$175,500. But the market has polarized hard: entry-level generalist roles are down 25% from their 2023 peak, while engineers who've added LLM integration, MLOps, cloud infrastructure, or security engineering report 3-5x higher callback rates than generalist applicants.",
      },
      {
        heading: "What that means for you",
        body: "Generalist full-stack talent is more available and more affordable than it's been in years — especially nearshore and offshore. Specialized talent is harder and pricier than ever. Most companies are overpaying for the first category and under-resourcing the second. We'll tell you which one your req actually is.",
      },
      {
        heading: "What we vet for",
        body: "Real code review, not keyword matching. Stack-specific depth. System design at your scale, not textbook scale.",
      },
    ],
    regions: [
      { region: "US", body: "All three engagement models." },
      {
        region: "LATAM",
        body: "Contract. Core product engineering, the sweet spot for nearshore because it needs daily collaboration.",
      },
      {
        region: "Pakistan",
        body: "Contract. Execution-heavy development, maintenance, mobile, and throughput work.",
      },
    ],
    faqQuestions: [],
  },
  {
    slug: "product",
    title: "Product & Project Management",
    tagline: "The fastest-growing salary line in tech, and almost nobody is watching it.",
    blocks: [
      {
        heading: "Market reality",
        body: "IT product managers post the fastest salary growth of any IT role at 10.1%, with a median of $175,296. IT project managers start at $103,500-$147,000. Demand is concentrated on PMs with real AI, data, and cloud fluency — the ones who can run a technical roadmap, not just a Jira board.",
      },
      {
        heading: "A new category, forming fast",
        body: "AI Product Manager, AI governance lead, AI agent orchestration. These titles barely existed two years ago and are now on real org charts with real budgets.",
      },
      {
        heading: "What we vet for",
        body: "Technical fluency in the domain they'll own. Roadmap ownership versus ticket administration — a critical distinction most job descriptions blur. Stakeholder management under actual pressure. For BAs and delivery: requirements rigor and the ability to say no.",
      },
    ],
    regions: [
      {
        region: "US",
        body: "All three engagement models. The seat that faces your executives and customers should be US or senior LATAM.",
      },
      {
        region: "LATAM",
        body: "Contract. Excellent English proficiency and full time zone overlap make this a strong nearshore fit.",
      },
      {
        region: "Pakistan",
        body: "Contract. Best suited to delivery management, scrum, and BA support functions rather than executive-facing product ownership.",
      },
    ],
    faqQuestions: [],
  },
  {
    slug: "cybersecurity-grc",
    title: "Cybersecurity & GRC",
    tagline:
      "Security and compliance professionals who translate controls into operational action.",
    blocks: [
      {
        heading: "Market reality",
        body: "Cybersecurity and GRC roles are among the fastest-growing in tech. GRC specialists start at $95,000-$145,000; security architects run $130,000-$210,000. Enterprise compliance and regulatory requirements are driving demand faster than the market can supply talent.",
      },
      {
        heading: "What we vet for",
        body: "Hands-on compliance expertise (SOC2, ISO27001, GDPR, HIPAA). Third-party risk management and vendor assessment frameworks. Cloud security posture and IAM. Security automation and policy-as-code. Real incident response or audit experience, not just certification.",
      },
    ],
    regions: [
      {
        region: "US",
        body: "All three engagement models. Compliance-sensitive and regulated roles require US or senior LATAM talent.",
      },
      {
        region: "LATAM",
        body: "Contract. Strong for GRC support and compliance operations.",
      },
      {
        region: "Pakistan",
        body: "Contract. Best for security operations, compliance administration, and policy documentation support.",
      },
    ],
    faqQuestions: [],
  },
];

export function getStaffingRole(slug: string) {
  return staffingRoles.find((s) => s.slug === slug);
}

export function otherStaffingRoles(slug: string) {
  return staffingRoles.filter((s) => s.slug !== slug).slice(0, 3);
}

export const staffingHubPage = {
  title: "One Team to Call. Three Ways to Build It.",
  intro:
    "Every engagement we run falls into one of three shapes: an individual specialist placed into a specific staffing role, a purpose-built pod standing up a whole function at once, or a deep technical specialty where the hire itself is the hard part. Same contract, same invoice, same point of contact, whichever shape fits.",
};

export const engagementModels = [
  {
    title: "Contract Staffing",
    body: "Flexible talent without long-term commitment. Perfect for sprint work, temporary capacity, or evaluating talent before permanent hire. Full flexibility to ramp up or down.",
    cta: "Learn More",
    to: "/get-started",
  },
  {
    title: "Contract-to-Hire",
    body: "Try before you commit. Hire on a 90-day contract, then convert to permanent. You get real work performance data before making a permanent offer.",
    cta: "Learn More",
    to: "/get-started",
  },
  {
    title: "Direct Hire",
    body: "Permanent technical talent. We charge 10% of first-year salary—half the market rate. Same vetting, same 90-day guarantee.",
    cta: "Learn More",
    to: "/get-started",
  },
];

export const staffingRolesPage = {
  title: "The right specialist, matched to the work and the way your team operates.",
  paragraphs: [
    "Share the role, must-have skills, work arrangement, target start date and budget. CSG will calibrate the requirement, recommend the best delivery market and return a search plan before recruiting begins.",
    "Requirement calibration. Market feedback. Screening. Availability confirmation. Interview and offer support. Onboarding follow-up.",
  ],
  cta: { label: "Calibrate a Role", to: "/get-started" },
};

export const specializedRolesPage = {
  title: "Specialized Roles: The Ones Everyone Else Is Struggling to Fill",
  whyNow: {
    heading: "Why this matters right now",
    paragraphs: [
      "The market has split into two completely different games, and most hiring managers are still playing the old one. AI and ML roles face a 63% talent shortage with 500,000+ open roles globally — roughly 3.4 open AI roles for every qualified candidate. ManpowerGroup's 2026 survey of 39,000+ employers across 41 countries found AI skills are now the hardest to hire for globally, for the first time ever. AI, ML, and data science postings hit 49,200 in 2025, up 163% from 2024. Security roles reached 66,800 postings, up 124% year over year. Meanwhile, entry-level generalist software engineering positions declined 25% from their 2023 peak, and median time-to-hire stretched to 67 days in Q1 2026.",
      "Translation: for the roles below, the old playbook — post a req, wait, interview, offer — is not going to work. The talent is employed, passive, and getting three calls a week. That is exactly the problem we're built to solve.",
    ],
    stats: [
      { value: "63%", label: "AI/ML talent shortage" },
      { value: "3.4x", label: "Open AI roles per qualified candidate" },
      { value: "163%", label: "Growth in AI/ML/data postings" },
      { value: "67 days", label: "Median time-to-hire, Q1 2026" },
    ],
  },
  closing:
    "Send us the hardest req on your board — the one that's been open longest. We'll come back with what your current offer realistically buys in each region, and profiles to back it up. No commitment, no retainer.",
};
