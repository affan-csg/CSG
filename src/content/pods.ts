export const pods = {
  title: "Build a delivery team, not a collection of resumes.",
  problem: {
    heading: "The problem",
    body: "Here's the problem with traditional staffing when you're building a function instead of filling a chair: you run five separate searches, negotiate five separate rates, manage three separate vendors, and six months later you have four of the five people you needed and no one who owns how they work together.",
    answer:
      "A CSG Pod is a complete, purpose-built team delivered under one contract, one invoice, and one point of contact.",
  },
  variables: [
    {
      title: "Experience",
      body: "Seniority mix. Who needs to have seen this problem before, and who just needs to execute well?",
    },
    {
      title: "Communication skills",
      body: "The variable most firms quietly ignore, and the one that kills offshore engagements. Every seat is scored on communication before anything else. People in standups, client calls, and architecture debates are staffed differently than people executing against a well-defined ticket.",
    },
    {
      title: "Technical skills",
      body: "Vetted against your actual stack, not a keyword match.",
    },
    {
      title: "Cost",
      body: "Once the first three are set, geography becomes a design decision instead of a default. Seats needing real-time judgment and client contact go US or LATAM. Seats needing throughput and depth go Pakistan.",
    },
  ],
  example: {
    heading: "Example: Engineering Pod",
    seats: [
      {
        count: "1",
        role: "US-based technical lead",
        region: "US",
        body: "Owns architecture decisions, client-facing communication, and accountability.",
      },
      {
        count: "2-3",
        role: "LATAM senior engineers",
        region: "LATAM (Nearshore)",
        body: "Core product work, in your standups, full daily overlap.",
      },
      {
        count: "2-4",
        role: "Pakistan-based engineers",
        region: "Pakistan (Offshore)",
        body: "Execution, testing, maintenance, and overnight throughput.",
      },
    ],
    kicker: "One SOW. One invoice. One person you call.",
    body: "Blended cost lands dramatically below a US-only equivalent team, and unlike a pure offshore engagement, you still have a senior US-based owner accountable for the output.",
  },
  podTypes: [
    { title: "Engineering Pod", body: "Full-stack, mobile, platform." },
    {
      title: "Data and AI Pod",
      body: "Data engineering, ML engineering, analytics.",
    },
    {
      title: "Cloud and DevOps Pod",
      body: "Infrastructure, CI/CD, SRE, cloud cost optimization.",
    },
    { title: "Security and GRC Pod", body: "Cyber, compliance, risk." },
    { title: "Product and Delivery Pod", body: "PM, BA, QA, scrum." },
    {
      title: "Non-Tech Operations Pod",
      body: "Customer success, revenue operations, finance and accounting ops, back-office.",
    },
  ],
  specialized: [
    {
      title: "AI Production Pod",
      composition: "AI/ML engineer + MLOps engineer + data engineer",
      body: "For companies with models trained and nothing in production.",
    },
    {
      title: "Data Platform Pod",
      composition: "Data engineers + analytics engineer + BA",
      body: "For companies whose AI roadmap is bottlenecked on pipelines.",
    },
    {
      title: "Cloud and Platform Pod",
      composition: "Cloud architect + DevOps + DevSecOps + SRE",
      body: "For companies scaling infrastructure or fighting a cloud bill.",
    },
    {
      title: "Product Delivery Pod",
      composition: "Product manager + BA + QA + scrum",
      body: "For companies with engineering capacity and no delivery discipline.",
    },
    {
      title: "Full Engineering Pod",
      composition: "US technical lead + LATAM senior engineers + Pakistan execution capacity",
      body: "",
    },
  ],
  specializedFootnote:
    "Every pod above is sized against the same four variables: experience, communication skills, technical skills, and cost. Geography is a design decision made after the first three are settled, not a default.",
  whyNow: {
    heading: "Why now",
    body: "Buyers are cutting their vendor rosters hard: the average move from Q4 2025 into Q1 2026 was going from twelve staffing vendors down to three or four. When a client is consolidating, the firm that covers tech and non-tech, three geographies, and four engagement models under one contract doesn't get cut. The single-service niche vendor does.",
    kicker:
      "Tell us what the team needs to accomplish in the next two quarters. We'll come back with a pod design, a blended rate, and a start date.",
  },
  faqQuestions: [
    "What's the difference between a single specialist and a consulting pod?",
    "How is a pod different from a staff-aug team?",
    "Can a pod include both contract and full-time hires?",
    "How does the pod model work if I'm the one being placed?",
  ],
};
