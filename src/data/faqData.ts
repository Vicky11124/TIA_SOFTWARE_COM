// FAQ data — kept in a separate file so FAQSection.tsx is a pure component export
// and Vite Fast Refresh works correctly.

export const faqs = [
  {
    category: "General",
    items: [
      {
        q: "What is TIA Software Solutions?",
        a: "TIA Software Solutions is a premium digital agency based in London, specialising in branding, digital marketing, UI/UX design, creative content, virtual assistance, and more. We help ambitious brands grow smarter and faster in the digital world.",
      },
      {
        q: "Where are you based and do you work with international clients?",
        a: "We are headquartered in London, UK, but we work with clients across the globe including the US, Europe, Asia, and beyond. Our fully remote team ensures seamless collaboration regardless of your timezone.",
      },
      {
        q: "How do I get started with TIA?",
        a: "Simply reach out via our Contact page or click the WhatsApp button. We'll schedule a free discovery call to understand your goals, then recommend the best plan or service for your needs.",
      },
    ],
  },
  {
    category: "Services",
    items: [
      {
        q: "What services does TIA offer?",
        a: "We offer a comprehensive suite of digital services: Virtual Assistance, Branding Essentials, Digital Marketing, Creative Design, UI/UX Design, Video & Motion Graphics, Stories & Reels Assets, Seasonal & Festive content, and Event & Launch Graphics.",
      },
      {
        q: "Can I request a custom service package?",
        a: "Absolutely. If our standard plans don't quite fit your needs, we can create a fully bespoke package tailored to your specific goals and budget. Contact us to discuss custom arrangements.",
      },
      {
        q: "Do you handle end-to-end projects or only specific deliverables?",
        a: "Both! We can take on full end-to-end projects — from strategy through to delivery — or step in at a specific stage (e.g., design only, marketing only). We're flexible to fit your workflow.",
      },
    ],
  },
  {
    category: "Web & Software Development",
    items: [
      {
        q: "What tech stack do you use for website and web app development?",
        a: "We build using modern, high-performance tech stacks. Our frontend development relies on React, TypeScript, Next.js, and Tailwind CSS. For backends and databases, we use robust solutions like Supabase, Node.js, and PostgreSQL to ensure speed, security, and scalability.",
      },
      {
        q: "Do you develop native mobile apps or cross-platform apps?",
        a: "We specialize in cross-platform mobile application development using React Native and Flutter. This approach delivers a native look and feel on both iOS and Android from a single codebase, significantly reducing your development costs and time-to-market.",
      },
      {
        q: "What is your approach to custom software development?",
        a: "Our process is fully agile: we begin with interactive wireframing and UI/UX design, followed by sprints of iterative development, automated testing, and secure deployment. We also offer continuous maintenance and updates post-launch to keep your software performing at its best.",
      },
      {
        q: "How do you ensure application security and speed?",
        a: "We implement industry-standard security protocols including OAuth 2.0 authentication, end-to-end encryption, and secure HTTPS connections. For speed, we write optimized, clean code, employ lazy-loading, leverage CDNs, and compress assets to achieve top-tier Lighthouse performance scores.",
      },
    ],
  },
  {
    category: "Pricing & Plans",
    items: [
      {
        q: "What are your pricing plans?",
        a: "We offer four main tiers — Basic (£149.99 / $199.99), Standard (£299.99 / $399.99), Pro (£499.99 / $649.99), and Premium (£699.99 / $899.99). Each plan includes progressively richer deliverables. View full details on our Plans page.",
      },
      {
        q: "Are there any hidden fees?",
        a: "No. The price you see is the price you pay. All deliverables included in your chosen plan are clearly listed. Any additional work beyond the scope is agreed upon transparently before we proceed.",
      },
      {
        q: "Do you offer monthly retainer options?",
        a: "Yes, we offer ongoing monthly retainer arrangements for clients who need consistent creative or marketing support. Reach out to discuss retainer pricing tailored to your workload.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept bank transfers, major credit/debit cards, and PayPal. For international clients, we can also accommodate wire transfers. Payment schedules (upfront, milestone-based, or monthly) are agreed at project kick-off.",
      },
    ],
  },
  {
    category: "Process & Delivery",
    items: [
      {
        q: "How long does a typical project take?",
        a: "Timelines vary by project scope. A logo design can be turned around in 5–7 business days, while a full branding package or website may take 3–6 weeks. We'll give you a precise timeline after the discovery call.",
      },
      {
        q: "How many revision rounds are included?",
        a: "Basic and Standard plans include 2 rounds of revisions. The Pro plan includes unlimited revisions. Premium clients receive unlimited revisions with a dedicated account manager to ensure perfection.",
      },
      {
        q: "How will we communicate during the project?",
        a: "We primarily communicate via WhatsApp, email, and video calls. You'll have a single point of contact throughout the project, ensuring clarity and fast response times.",
      },
      {
        q: "What files will I receive upon project completion?",
        a: "You'll receive all final source files in appropriate formats (e.g., AI, PSD, PDF for design; MP4/GIF for motion; PNG/WebP for web assets). We ensure you own everything we create for you.",
      },
    ],
  },
  {
    category: "Virtual Assistance",
    items: [
      {
        q: "What tasks can your Virtual Assistants handle?",
        a: "Our VAs are skilled in a wide range of tasks including customer support, email management, scheduling, data entry, social media management, digital marketing support, and basic accounting/bookkeeping.",
      },
      {
        q: "What are the working hours for Virtual Assistants?",
        a: "Our VAs typically work during UK business hours (9am–6pm GMT), but we can arrange flexible or overlapping hours to suit US or other time zones for clients who need it.",
      },
    ],
  },
];
