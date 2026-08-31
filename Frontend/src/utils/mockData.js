export const initialBots = [
  {
    id: "bot-1",
    name: "HR Talent & Policy Guide",
    subtitle: "Enterprise employee handbook & benefits navigator",
    domain: "HR Assistant",
    status: "Active",
    model: "GPT-4o + Hybrid RAG",
    docsCount: 28,
    queries: 1842,
    avgLatency: "380ms",
    accuracy: "99.4%",
    themeColor: "#6366F1",
    avatar: "💼",
    temperature: 0.2,
    topK: 4,
    enforceCitations: true,
    persona: "Formal",
    greeting: "Hello! I am your HR and benefits concierge. How can I assist you with company policies, healthcare, or leave requests today?",
    lastActive: "2 mins ago",
    embedSnippet: '<script src="https://cdn.docpilot.ai/widget.js" data-bot-id="bot-1" async></script>'
  },
  {
    id: "bot-2",
    name: "DevOps Incident Sentinel",
    subtitle: "Kubernetes, AWS cloud infra & SRE runbook assistant",
    domain: "IT Support",
    status: "Active",
    model: "Claude 3.5 Sonnet + RAG",
    docsCount: 42,
    queries: 1240,
    avgLatency: "410ms",
    accuracy: "98.8%",
    themeColor: "#22D3EE",
    avatar: "⚡",
    temperature: 0.1,
    topK: 5,
    enforceCitations: true,
    persona: "Technical",
    greeting: "DevOps Sentinel active. Ready to debug production logs, check Kubernetes cluster alerts, or lookup infra runbooks.",
    lastActive: "14 mins ago",
    embedSnippet: '<script src="https://cdn.docpilot.ai/widget.js" data-bot-id="bot-2" async></script>'
  },
  {
    id: "bot-3",
    name: "SaaS Sales Closer",
    subtitle: "Product tier pricing, competitor battlecards & ROI calculator",
    domain: "Sales & CRM",
    status: "Active",
    model: "GPT-4o-mini",
    docsCount: 16,
    queries: 892,
    avgLatency: "290ms",
    accuracy: "97.6%",
    themeColor: "#10B981",
    avatar: "📈",
    temperature: 0.5,
    topK: 3,
    enforceCitations: false,
    persona: "Friendly",
    greeting: "Welcome to FiBot! Interested in seeing how our enterprise RAG suite can reduce support tickets by 60%?",
    lastActive: "40 mins ago",
    embedSnippet: '<script src="https://cdn.docpilot.ai/widget.js" data-bot-id="bot-3" async></script>'
  },
  {
    id: "bot-4",
    name: "Legal Compliance Auditor",
    subtitle: "SOC-2 Type II, GDPR data privacy & NDA terms analyzer",
    domain: "Policy & Legal",
    status: "Active",
    model: "GPT-4o + Vector Re-ranking",
    docsCount: 54,
    queries: 615,
    avgLatency: "520ms",
    accuracy: "99.9%",
    themeColor: "#8B5CF6",
    avatar: "⚖️",
    temperature: 0.0,
    topK: 6,
    enforceCitations: true,
    persona: "Formal",
    greeting: "Compliance engine initialized. Search audited security policies, vendor sub-processor agreements, or GDPR checklists.",
    lastActive: "1 hour ago",
    embedSnippet: '<script src="https://cdn.docpilot.ai/widget.js" data-bot-id="bot-4" async></script>'
  },
  {
    id: "bot-5",
    name: "Customer Onboarding Tutor",
    subtitle: "Interactive guided walkthrough for new enterprise tenants",
    domain: "SaaS FAQ",
    status: "Training",
    model: "Llama 3.3 70B",
    docsCount: 19,
    queries: 340,
    avgLatency: "350ms",
    accuracy: "96.5%",
    themeColor: "#F59E0B",
    avatar: "🎓",
    temperature: 0.4,
    topK: 4,
    enforceCitations: true,
    persona: "Socratic",
    greeting: "Great to have you here! Let's set up your team's first knowledge repository step-by-step.",
    lastActive: "Yesterday",
    embedSnippet: '<script src="https://cdn.docpilot.ai/widget.js" data-bot-id="bot-5" async></script>'
  },
  {
    id: "bot-6",
    name: "Medical Clinic Patient Guide",
    subtitle: "Appointment preparation, insurance pre-auth & clinic FAQ",
    domain: "Healthcare",
    status: "Draft",
    model: "Claude 3.5 Haiku",
    docsCount: 8,
    queries: 110,
    avgLatency: "310ms",
    accuracy: "98.1%",
    themeColor: "#EC4899",
    avatar: "🩺",
    temperature: 0.1,
    topK: 4,
    enforceCitations: true,
    persona: "Friendly",
    greeting: "Welcome to Apex Care. I can help answer common appointment questions and insurance requirements.",
    lastActive: "3 days ago",
    embedSnippet: '<script src="https://cdn.docpilot.ai/widget.js" data-bot-id="bot-6" async></script>'
  }
];

export const initialDocuments = [
  {
    id: "doc-1",
    name: "Employee_Benefits_Handbook_2026.pdf",
    size: "4.8 MB",
    type: "PDF",
    chunks: 142,
    tokens: "48,210",
    status: "Indexed",
    updatedAt: "Today, 14:32",
    embeddingModel: "text-embedding-3-small",
    dimensions: 1536,
    sampleChunks: [
      {
        id: "chunk-101",
        page: 4,
        score: "0.984",
        text: "Comprehensive Healthcare Coverage: Full-time employees are eligible for PPO and HDHP health insurance options starting on their first calendar day of employment. Wellness stipends of $1,200 annually cover gym memberships, mental wellness apps, and preventative screenings."
      },
      {
        id: "chunk-102",
        page: 12,
        score: "0.942",
        text: "Parental Leave Policy: Primary caregivers receive 16 weeks of 100% paid parental leave, stackable with state disability programs. Secondary caregivers are entitled to 8 weeks paid leave."
      }
    ]
  },
  {
    id: "doc-2",
    name: "SOC2_Type2_Security_Audit_Report.pdf",
    size: "8.1 MB",
    type: "PDF",
    chunks: 284,
    tokens: "102,400",
    status: "Indexed",
    updatedAt: "Yesterday, 18:10",
    embeddingModel: "text-embedding-3-small",
    dimensions: 1536,
    sampleChunks: [
      {
        id: "chunk-201",
        page: 8,
        score: "0.976",
        text: "Data Encryption Standard: All customer data in transit is protected using TLS 1.3 with AES-256-GCM cipher suites. Data at rest in AWS RDS and S3 vector stores is encrypted using customer-managed KMS keys with annual rotation."
      }
    ]
  },
  {
    id: "doc-3",
    name: "Enterprise_API_Integration_Spec.docx",
    size: "2.3 MB",
    type: "DOCX",
    chunks: 88,
    tokens: "31,900",
    status: "Indexed",
    updatedAt: "Aug 24, 2026",
    embeddingModel: "text-embedding-3-small",
    dimensions: 1536,
    sampleChunks: [
      {
        id: "chunk-301",
        page: 2,
        score: "0.963",
        text: "Webhooks & Event Stream: The POST /api/v1/webhooks endpoint broadcasts real-time ingestion completions, vector updates, and query latency events with HMAC-SHA256 signatures."
      }
    ]
  },
  {
    id: "doc-4",
    name: "Customer_Returns_And_Warranty_Policy.pdf",
    size: "1.2 MB",
    type: "PDF",
    chunks: 46,
    tokens: "14,500",
    status: "Indexed",
    updatedAt: "Aug 22, 2026",
    embeddingModel: "text-embedding-3-small",
    dimensions: 1536,
    sampleChunks: [
      {
        id: "chunk-401",
        page: 1,
        score: "0.951",
        text: "30-Day Money Back Guarantee: Customers can initiate hardware return authorizations within 30 days of shipment receipt with zero restocking fees."
      }
    ]
  },
  {
    id: "doc-5",
    name: "Kubernetes_Disaster_Recovery_Runbook.md",
    size: "640 KB",
    type: "MD",
    chunks: 32,
    tokens: "9,800",
    status: "Processing",
    updatedAt: "Just now",
    embeddingModel: "text-embedding-3-small",
    dimensions: 1536,
    sampleChunks: []
  }
];

export const analyticsTimeseries = [
  { time: "00:00", queries: 140, latency: 310, accuracy: 99.1, tokens: 42000 },
  { time: "04:00", queries: 80, latency: 290, accuracy: 99.4, tokens: 25000 },
  { time: "08:00", queries: 420, latency: 340, accuracy: 98.7, tokens: 128000 },
  { time: "12:00", queries: 890, latency: 420, accuracy: 98.2, tokens: 290000 },
  { time: "16:00", queries: 1120, latency: 390, accuracy: 98.9, tokens: 360000 },
  { time: "20:00", queries: 630, latency: 320, accuracy: 99.2, tokens: 190000 },
  { time: "23:59", queries: 240, latency: 300, accuracy: 99.5, tokens: 78000 }
];

export const analytics7Days = [
  { day: "Mon", queries: 4120, latency: 340, accuracy: 98.6 },
  { day: "Tue", queries: 5340, latency: 360, accuracy: 99.1 },
  { day: "Wed", queries: 6180, latency: 385, accuracy: 98.9 },
  { day: "Thu", queries: 5890, latency: 370, accuracy: 99.2 },
  { day: "Fri", queries: 6420, latency: 395, accuracy: 98.7 },
  { day: "Sat", queries: 2840, latency: 310, accuracy: 99.5 },
  { day: "Sun", queries: 2190, latency: 295, accuracy: 99.6 }
];

export const domainPresets = [
  {
    id: "hr",
    title: "HR Assistant",
    icon: "Users",
    color: "#6366F1",
    desc: "Answers employee queries on leave, benefits, internal policies, and payroll.",
    defaultGreeting: "Hi! I am your company HR and benefits navigator. What can I clarify for you today?",
    samplePrompt: "How many days of paid parental leave do full-time employees receive?"
  },
  {
    id: "support",
    title: "IT & SRE Support",
    icon: "Headphones",
    color: "#22D3EE",
    desc: "Diagnoses infrastructure incidents, password resets, VPN setups, and ticketing.",
    defaultGreeting: "IT Operations Assistant ready. How can I help resolve your technical issue?",
    samplePrompt: "What are the standard procedures for initiating a cluster disaster failover?"
  },
  {
    id: "faq",
    title: "SaaS & Product FAQ",
    icon: "HelpCircle",
    color: "#10B981",
    desc: "Helps prospective customers understand pricing tiers, feature specs, and integrations.",
    defaultGreeting: "Welcome! Feel free to ask about our platform features, plans, and integrations.",
    samplePrompt: "Can I connect my self-hosted Pinecone vector database with FiBot?"
  },
  {
    id: "policy",
    title: "Policy & Compliance",
    icon: "ShieldCheck",
    color: "#8B5CF6",
    desc: "Rigorous compliance query engine enforcing strict citations on SOC-2 and HIPAA docs.",
    defaultGreeting: "Compliance verification agent online. Search audited frameworks and security specs.",
    samplePrompt: "What encryption standards are enforced for customer data at rest?"
  },
  {
    id: "custom",
    title: "Custom RAG Agent",
    icon: "Sparkles",
    color: "#F43F5E",
    desc: "Blank canvas with fully customizable prompt templates, embeddings, and vector stores.",
    defaultGreeting: "FiBot AI ready. Ask me anything about your uploaded repository.",
    samplePrompt: "Summarize the key takeaways from the Q3 architecture audit."
  }
];

export const promptSuggestions = [
  "How many weeks of parental leave are covered?",
  "What encryption standard is enforced at rest?",
  "What is our policy on remote work equipment stipends?",
  "How do I configure webhook HMAC verification?"
];
