import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Headphones, ClipboardList, Phone, Megaphone, ShoppingCart, BarChart3, CalendarDays, Calculator, Star, Users, Zap, Shield, Clock, Target, Sparkles, Monitor, Smartphone, Laptop, Cpu, LucideIcon } from "lucide-react";
import serviceBranding from "@/assets/service-branding.webp";
import serviceMarketing from "@/assets/service-marketing.webp";
import serviceCreative from "@/assets/service-creative.webp";
import serviceUiux from "@/assets/service-uiux.webp";
import serviceVideo from "@/assets/service-video.webp";
import serviceStoriesReels from "@/assets/service-stories-reels.webp";
import serviceSeasonal from "@/assets/service-seasonal.webp";
import serviceEvents from "@/assets/service-events.webp";
import serviceVA from "@/assets/service-virtual-assistance.webp";
import vaHero from "@/assets/va-hero.webp";
import vaCustomerSupport from "@/assets/va-customer-support.webp";
import vaDigitalMarketing from "@/assets/va-digital-marketing.webp";
import vaAccounting from "@/assets/va-accounting.webp";
import aboutTeam from "@/assets/about-team.webp";
import showcaseWork from "@/assets/showcase-work.webp";
import banner2 from "@/assets/banner-2.webp";
import serviceWebDev from "@/assets/banner-1.webp";
import serviceAppDev from "@/assets/banner-3.webp";
import serviceSoftwareDev from "@/assets/banner-4.webp";


const vaSubServices = [
  {
    icon: ClipboardList,
    title: "Administrative Support",
    desc: "Manage your day-to-day operations effortlessly.",
    image: serviceVA,
    items: ["Data entry and database management", "Email and calendar management", "Document preparation and formatting", "Scheduling and coordination"],
  },
  {
    icon: Phone,
    title: "Customer Support Services",
    desc: "Deliver exceptional customer experience.",
    image: vaCustomerSupport,
    items: ["Email, chat, and call support", "CRM management", "Customer follow-ups", "Complaint handling"],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing Support",
    desc: "Boost your online presence and reach.",
    image: vaDigitalMarketing,
    items: ["Social media management", "Content posting and scheduling", "Lead generation support", "Email marketing campaigns"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Assistance",
    desc: "Efficiently manage your online store.",
    image: serviceVA,
    items: ["Product listing and updates", "Order processing and tracking", "Inventory management", "Customer support"],
  },
  {
    icon: BarChart3,
    title: "Business Support Services",
    desc: "Make smarter business decisions.",
    image: vaDigitalMarketing,
    items: ["Market research and analysis", "Report generation", "Data analysis and insights", "Presentation preparation"],
  },
  {
    icon: CalendarDays,
    title: "Personal Assistance",
    desc: "Stay organized and productive.",
    image: vaHero,
    items: ["Appointment scheduling", "Travel planning", "Task reminders", "Online research"],
  },
  {
    icon: Calculator,
    title: "Accounting & Bookkeeping",
    desc: "Keep your finances organized and accurate.",
    image: vaAccounting,
    items: ["Daily bookkeeping", "Accounts payable & receivable", "Invoice management", "Bank reconciliation", "GST / tax data preparation", "Financial reports (P&L, Balance Sheet)"],
  },
];

const whyChooseUs = [
  { icon: Star, title: "Skilled & Experienced", desc: "Our virtual assistants are trained professionals with years of experience." },
  { icon: Zap, title: "Cost-Effective", desc: "Scalable solutions that save you up to 60% compared to full-time hiring." },
  { icon: Clock, title: "Flexible Hours", desc: "Round-the-clock availability to match your business schedule." },
  { icon: Shield, title: "Data Security", desc: "High accuracy with enterprise-grade data security protocols." },
  { icon: Users, title: "Dedicated Team", desc: "A committed support team that grows with your business." },
  { icon: Target, title: "Result-Oriented", desc: "Focused on delivering measurable outcomes for your business." },
];

const whoCanBenefit = [
  "Startups and entrepreneurs",
  "Small & medium businesses",
  "E-commerce businesses",
  "Consultants and professionals",
  "Corporate teams",
  "Digital agencies",
];

const serviceData: Record<string, {
  title: string;
  subtitle: string;
  image: string;
  description: string;
  features: string[];
  process: { step: string; desc: string }[];
  deliverables: string[];
  detailedContent?: string[];
  subServices?: {
    icon: LucideIcon;
    title: string;
    desc: string;
    image: string;
    items: string[];
  }[];
}> = {
  "branding-essentials": {
    title: "Branding Essentials",
    subtitle: "Build a memorable identity",
    image: serviceBranding,
    description:
      "Your brand is the first impression people have of your business. We create comprehensive brand identities that tell your story, establish credibility, and make you unforgettable.",
    features: [
      "Logo Design — 2-3 unique concepts with unlimited refinements",
      "Brand Identity Kit — colors, typography, visual language",
      "Business Card Design — premium print-ready files",
      "Brand Guidelines Document — rules for consistent usage",
      "Letterhead & Envelope Design",
      "Social Media Brand Kit — profile & cover images",
    ],
    process: [
      { step: "Discovery", desc: "We learn about your business, audience, and competition." },
      { step: "Concept", desc: "Our designers create 2-3 unique concepts." },
      { step: "Refinement", desc: "We refine the chosen direction until perfect." },
      { step: "Delivery", desc: "All files in multiple formats, ready for use." },
    ],
    deliverables: ["Logo files (SVG, PNG, PDF)", "Brand style guide", "Business card templates", "Social media kit", "Stationery designs"],
    detailedContent: [
      "Branding is far more than a simple combination of logos, color palettes, and fonts; it is the living soul of your business and the primary medium through which you build trust with your audience. In today’s hyper-competitive and saturated digital environment, having a clear, unified, and compelling brand presence is the difference between standing out and fading into the background. At TIA Software Solutions, we understand that a successful brand must tell a cohesive story. We begin our branding process by diving deep into your target audience, your core values, and your business goals to establish a solid foundation for your unique market positioning.",
      "Our branding essentials package covers every critical asset required to construct a memorable and impactful brand identity. We craft bespoke, modern logos that serve as the visual anchor of your company, offering multiple distinct concepts and refining them based on your feedback. We also design professional business cards, letterheads, envelopes, and social media brand kits that present a unified front to clients across all touchpoints. By establishing a professional, premium visual standard from the outset, we help your business build immediate credibility, making a powerful and lasting first impression on potential clients and partners.",
      "A crucial, often overlooked component of branding is consistency. A disjointed visual presentation—where your website looks entirely different from your social media profiles or print materials—erodes trust and confuses customers. To prevent this, we provide a comprehensive Brand Guidelines document. This acts as a stylesheet and rulebook for your brand, outlining exact color codes (HEX, RGB, CMYK), typography hierarchies, and spacing rules. This guide ensures that anyone who creates content for your business in the future, from internal staff to external agencies, can maintain the visual integrity and voice of your brand.",
      "We believe that branding is an ongoing relationship between your business and your community. Our design philosophy is grounded in creating identities that are not only beautiful today but also scalable for tomorrow as your service list and business footprint expand. Whether you are a brand new startup looking to make your mark or an established corporation seeking a modern refresh, TIA Software Solutions provides the strategic thinking and creative execution needed to elevate your brand. Let us help you craft a timeless, professional identity that resonates with your customers and drives business loyalty.",
      "Ultimately, investing in a professional brand identity yields long-term financial dividends. A polished brand commands premium pricing, reduces customer acquisition costs, and inspires confidence in investors and top-tier talent. By choosing TIA Software Solutions as your creative partner, you receive a collaborative, client-focused experience where your vision is translated into stunning, developer-ready assets. We combine artistic innovation with commercial strategy to deliver branding that does not just look spectacular, but actively converts browsers into lifelong advocates."
    ]
  },
  "digital-marketing": {
    title: "Digital Marketing",
    subtitle: "Grow your reach & revenue",
    image: serviceMarketing,
    description:
      "Our data-driven marketing strategies help you reach the right audience at the right time with campaigns that drive real, measurable results.",
    features: [
      "Social Media Advertising — Facebook, Instagram, LinkedIn",
      "SEO Optimization — on-page, technical, and content SEO",
      "Campaign Management — end-to-end strategy and execution",
      "Content Strategy — engaging posts, blogs, and newsletters",
      "Analytics & Reporting — monthly performance insights",
      "Google Ads Management — search, display, and remarketing",
    ],
    process: [
      { step: "Audit", desc: "We analyze your current digital presence." },
      { step: "Strategy", desc: "Custom marketing plan tailored to your goals." },
      { step: "Execute", desc: "Launch campaigns with A/B testing." },
      { step: "Optimize", desc: "Continuous monitoring and optimization." },
    ],
    deliverables: ["Monthly analytics reports", "Ad creatives & copy", "SEO audit document", "Content calendar", "Campaign dashboard"],
    subServices: [
      {
        icon: BarChart3,
        title: "Search Engine Optimization (SEO)",
        desc: "Boost your organic visibility and rank higher on Google to capture high-intent search traffic.",
        image: serviceMarketing,
        items: [
          "On-page optimization & meta tags structuring",
          "Technical SEO auditing & speed optimization",
          "Keyword research & competitor analysis",
          "Local SEO & Google Business Profile tuning"
        ]
      },
      {
        icon: Megaphone,
        title: "Paid Advertising & PPC Campaigns",
        desc: "Targeted advertising campaigns that deliver immediate leads, traffic, and high conversion rates.",
        image: banner2,
        items: [
          "Meta Ads (Facebook & Instagram) strategy",
          "Google Search & Display Ads management",
          "A/B testing of ad copy & creative variants",
          "Retargeting funnels to capture warm leads"
        ]
      },
      {
        icon: ClipboardList,
        title: "Content Strategy & Copywriting",
        desc: "Compelling messaging that engages, educates, and converts your audience across channels.",
        image: showcaseWork,
        items: [
          "Social media content calendars & scheduling",
          "Engaging blog writing & newsletter campaigns",
          "High-converting landing page copywriting",
          "Brand voice definition & guidelines"
        ]
      },
      {
        icon: Zap,
        title: "Analytics & Performance Tracking",
        desc: "Data-driven tracking and transparent reports so you always know your exact return on investment.",
        image: aboutTeam,
        items: [
          "Google Analytics 4 (GA4) configuration",
          "Conversion tracking & Meta Pixel installation",
          "Monthly performance dashboard reports",
          "ROAS (Return on Ad Spend) optimization"
        ]
      }
    ]
  },
  "creative-design": {
    title: "Creative Design",
    subtitle: "Visuals that captivate",
    image: serviceCreative,
    description:
      "Our creative team produces stunning visual content that stops the scroll and drives engagement across all platforms.",
    features: [
      "Social Media Post Design — feed, stories, and carousel",
      "Event Graphics — banners, invitations, and promotional materials",
      "Festive & Seasonal Designs — holiday campaigns and themes",
      "Infographics & Data Visualization",
      "Email Newsletter Design",
      "Print Materials — flyers, brochures, and posters",
    ],
    process: [
      { step: "Brief", desc: "We understand your vision and message." },
      { step: "Design", desc: "Eye-catching designs aligned with your brand." },
      { step: "Review", desc: "You provide feedback for revisions." },
      { step: "Deliver", desc: "Final files in all required formats." },
    ],
    deliverables: ["Social media graphics", "Print-ready files", "Editable templates", "Brand-consistent designs", "Source files"],
    detailedContent: [
      "Human beings are visual creatures; we process images significantly faster than we read text. In the fast-paced digital ecosystem, where users swipe through hundreds of posts daily, the first fraction of a second is all you have to capture their attention. Creative design is the art of turning that momentary glance into deep interest and engagement. At TIA Software Solutions, we produce striking, high-fidelity graphics that stand out in crowded feeds. We blend creative artistry with strategic marketing principles to ensure that every visual asset we design is not only beautiful, but also aligned with your business objectives.",
      "Our creative design services cater to all your digital and physical marketing needs. Whether you need thumb-stopping social media graphics for your daily feed, promotional materials for an upcoming corporate event, or holiday-themed seasonal templates, we deliver customized layouts that speak your brand’s language. Our team has extensive experience designing complex infographics, structured layout designs, brochures, and flyers that translate complicated data into clean, digestible visual assets. We ensure that your message is communicated clearly and effectively, matching your established brand style guides perfectly.",
      "A major challenge for modern brands is maintaining a professional and consistent visual standard across different marketing channels. If your Instagram graphics look completely different from your website banners or printed flyers, your brand can feel disjointed and untrustworthy. Our team solves this by working with a unified design system. We establish guidelines for color, layout hierarchy, and typography before we begin, ensuring that every asset we deliver is instantly recognizable as yours. This deliberate approach reinforces your brand memory and builds long-term customer trust.",
      "Collaborating with TIA Software Solutions means having an entire creative department at your fingertips. Our design process is highly iterative and collaborative: we start by understanding your campaign goals, draft multiple initial concepts, and refine them based on your direct feedback. We deliver clean, developer-ready, and print-ready files in all required formats, along with source files for future edits. Let us elevate your marketing materials with custom, high-end graphic design that grabs attention, communicates value, and drives conversions.",
      "In addition to digital graphics, we specialize in offline promotional collateral, ensuring a seamless offline-to-online experience. From exhibition backdrops and pop-up banners to product packaging and corporate stationery, we ensure your physical branding matches the premium quality of your online presence. Our meticulous attention to detail, typography selection, and color consistency guarantees that your print materials look flawless when they come off the press. Experience the power of professional design that strengthens your brand authority and leaves a premium impression."
    ]
  },
  "ui-ux-design": {
    title: "UI/UX Design",
    subtitle: "Interfaces users love",
    image: serviceUiux,
    description:
      "We design digital experiences that are both beautiful and functional with a user-centered approach.",
    features: [
      "Website UI Design — responsive, modern layouts",
      "Mobile App Design — iOS & Android interfaces",
      "Interactive Prototypes — clickable, testable mockups",
      "User Research & Persona Development",
      "Information Architecture & Wireframing",
      "Design System Creation — reusable component libraries",
    ],
    process: [
      { step: "Research", desc: "Study users, competitors, and market." },
      { step: "Wireframe", desc: "Low-fidelity layouts for structure." },
      { step: "Design", desc: "High-fidelity, pixel-perfect designs." },
      { step: "Handoff", desc: "Developer-ready specs and assets." },
    ],
    deliverables: ["Figma design files", "Interactive prototype", "UI component library", "Style guide", "Developer documentation"],
    detailedContent: [
      "In today’s digital-first economy, your website or mobile application is often the primary touchpoint for your clients. A beautiful interface might attract users initially, but if the navigation is confusing, slow, or frustrating, they will leave within seconds. UI/UX design is the science and art of ensuring your digital products are both visually stunning and incredibly easy to navigate. At TIA Software Solutions, we employ a user-centered design approach. We research user behaviors, define intuitive pathways, and build interfaces that minimize friction, maximize user satisfaction, and boost conversion rates.",
      "Our design workflow begins with comprehensive discovery and wireframing. Before we design high-fidelity graphics, we map out the information architecture and create low-fidelity wireframes. This step allows us to test the structural layout and user flow, ensuring that information is organized logically and that users can accomplish tasks—such as signing up, buying a product, or finding contact info—with the fewest possible clicks. By solving usability issues early in the wireframing phase, we save valuable time and reduce development costs later in the project lifecycle.",
      "Once the structural framework is locked in, our UI designers step in to create pixel-perfect, high-fidelity mockups. We design clean, responsive layouts that adapt beautifully to desktops, tablets, and smartphones. We place a massive emphasis on modern typography, balanced white space, smooth micro-interactions, and accessible color contrast. Using tools like Figma, we compile these components into a dedicated Design System. This reusable library of buttons, cards, headers, and form elements ensures visual consistency across your application and serves as a single source of truth for developers.",
      "At TIA Software Solutions, we don't just hand over static image files; we provide fully interactive, clickable prototypes. These prototypes simulate the final application, allowing you and your team to experience the user journey firsthand before writing a single line of code. We also write comprehensive handoff documentation for developers, ensuring a smooth transition and reducing misunderstandings. Partner with us to build digital products that delight your users, represent your brand with premium aesthetics, and drive long-term business success.",
      "We also prioritize accessibility and inclusivity in all our user experience designs. We ensure that our interfaces comply with Web Content Accessibility Guidelines (WCAG), making your product usable for individuals of all abilities. From screen reader compatibility to keyboard navigation, we design with empathy and technical precision. By partnering with TIA Software Solutions, you are not just getting a web design; you are getting a highly polished, inclusive digital experience that commands respect, builds trust, and drives customer loyalty."
    ]
  },
  "video-motion-graphics": {
    title: "Video & Motion Graphics",
    subtitle: "Content that moves",
    image: serviceVideo,
    description:
      "We create dynamic motion graphics and short-form videos that capture attention and drive engagement.",
    features: [
      "Instagram Reels & Short-Form Video",
      "Animated Logo & Brand Intros",
      "Explainer Videos & Product Demos",
      "Social Media Video Ads",
      "Motion Graphics & Kinetic Typography",
      "Video Editing & Post-Production",
    ],
    process: [
      { step: "Concept", desc: "Creative concept and storyboard." },
      { step: "Production", desc: "Design and animation of elements." },
      { step: "Sound", desc: "Music, sound effects, and voiceover." },
      { step: "Delivery", desc: "Optimized for each platform." },
    ],
    deliverables: ["Video files (MP4, MOV)", "Platform-optimized versions", "Thumbnail designs", "Storyboard", "Source files"],
    detailedContent: [
      "The digital audience's attention span is shorter than ever, making dynamic video content the most powerful medium for engagement online. A static post can easily be scrolled past, but a well-timed animation or a compelling video intro instantly hooks the viewer's eye and keeps them engaged. Motion graphics and video production tell complex stories in seconds, conveying emotions and detail that static images simply cannot match. At TIA Software Solutions, we create premium video assets and animations designed to captivate your audience and elevate your brand's digital presence.",
      "Our video and motion graphics team offers a wide spectrum of creative services. We design animated logos, custom brand intros, explainer videos, product demonstrations, and highly engaging social media ads. Whether you need a short-form video for Instagram Reels, a product tutorial for YouTube, or a corporate video for your website, we tailor our visuals, pacing, and sound to suit your platform and target demographic. We ensure that the visual style and tone are perfectly aligned with your parent brand identity.",
      "Every video project we undertake follows a rigorous, professional production process. We begin with scriptwriting and storyboarding, mapping out the visual flow and narration before we start animating or editing. This careful pre-production step ensures that our creative team and our clients are completely aligned on the vision. Once approved, we move to high-fidelity design, fluid animation, professional video editing, and color grading. We finish the project by integrating premium background music, sound effects, and voiceovers to create a polished final product.",
      "We optimize all our video deliverables for their specific platforms, providing vertical, square, and widescreen formats to ensure compatibility with various social media channels and devices. We also provide source files, storyboard layouts, and custom thumbnails to help you get the most value out of your video assets. Partner with TIA Software Solutions to transform your message into captivating motion content that stops the scroll, drives brand awareness, and converts viewers into loyal customers.",
      "Additionally, video content is highly favored by modern search engine and social media algorithms, making it a crucial component of any modern marketing strategy. A high-quality explainer video on your landing page can increase conversion rates by up to 80%, while social videos generate 1200% more shares than text and images combined. By leveraging TIA Software Solutions’ expertise in video and motion graphics, you are investing in a high-yield marketing asset that boosts SEO rankings, increases session duration, and builds a modern, forward-thinking image for your business."
    ]
  },
  "stories-reels-assets": {
    title: "Stories & Reels Assets",
    subtitle: "Short-form content that converts",
    image: serviceStoriesReels,
    description:
      "Scroll-stopping templates and assets optimized for Instagram, Facebook, and TikTok.",
    features: [
      "Instagram Story Templates — branded, editable designs",
      "Reel Cover & Thumbnail Design",
      "Story Highlight Icons — custom icon sets",
      "Interactive Story Elements — polls, quizzes, countdowns",
      "Reel Graphics & Overlays",
      "Story Sequence Design — multi-slide narratives",
    ],
    process: [
      { step: "Analyze", desc: "Study your audience and content strategy." },
      { step: "Design", desc: "Custom templates in your brand style." },
      { step: "Adapt", desc: "Optimized for each platform." },
      { step: "Deliver", desc: "Ready-to-use files with editables." },
    ],
    deliverables: ["Story template pack", "Reel cover designs", "Highlight icon set", "Editable files", "Brand usage guide"],
    detailedContent: [
      "Short-form video has completely revolutionized the way brands interact with their audiences. Platforms like Instagram, TikTok, and YouTube Shorts have made vertical video the fastest-growing content medium, driving unparalleled organic reach and customer engagement. To stay relevant in this fast-paced environment, businesses must publish high-quality, scroll-stopping vertical content consistently. At TIA Software Solutions, we design premium Stories and Reels assets that help your brand stand out in busy feeds, build a dedicated following, and turn casual viewers into paying customers.",
      "We specialize in creating cohesive, branded templates and design assets tailored specifically for vertical screens. Our services include designing custom Instagram Story templates, high-impact Reel covers, aesthetic Story Highlight icons, and custom interactive assets like branded stickers, polls, and quiz backgrounds. By providing eye-catching visual frames and typography overlays, we help you maintain a polished, professional brand appearance even when you are publishing spontaneous, behind-the-scenes content on the go.",
      "A common mistake brands make is treating short-form video as an afterthought, leading to messy, unbranded feeds that look unprofessional. Our team ensures that your Reels and Stories look cohesive and fit perfectly within your brand identity. We design custom templates using your exact brand colors, logos, and fonts, giving you a distinct visual signature. This consistency makes your content instantly recognizable as your users swipe through their stories, increasing brand recall and establishing a premium digital presence.",
      "We provide our Stories and Reels assets in highly flexible, user-friendly formats, including fully editable Figma or Canva templates. This allows your team to easily swap text, images, and videos in seconds, ensuring you can react to trending topics and publish content rapidly without waiting on design departments. Partner with TIA Software Solutions to equip your social media team with premium, high-converting assets that drive engagement, expand your reach, and grow your brand community.",
      "Furthermore, we understand the psychology of short-form video. The first three seconds of a Reel or TikTok are critical; if you don't capture the viewer's attention immediately, they will swipe away. That’s why we focus heavily on creating high-contrast, text-on-screen layouts and eye-catching animated headers that hook the user instantly. Our template kits are designed to structure information logically, guiding viewers toward a clear call-to-action (CTA) such as 'Link in Bio' or 'Comment below.' Boost your social media conversion rates with assets built specifically for performance."
    ]
  },
  "seasonal-festive": {
    title: "Seasonal & Festive Designs",
    subtitle: "Celebrate every occasion",
    image: serviceSeasonal,
    description:
      "Beautiful, culturally relevant festive designs that keep your brand top-of-mind during the moments that matter.",
    features: [
      "Festival Greeting Cards — Diwali, Christmas, Eid, and more",
      "Holiday Campaign Graphics — social media & email",
      "Seasonal Banner Designs — website & storefront",
      "Themed Social Media Posts",
      "Gift Card & Coupon Designs",
      "Event-Specific Branding — limited-edition looks",
    ],
    process: [
      { step: "Plan", desc: "Map out seasonal calendar and key dates." },
      { step: "Create", desc: "Beautifully crafted designs for each occasion." },
      { step: "Schedule", desc: "Assets delivered ahead of time." },
      { step: "Optimize", desc: "Post-campaign analysis for improvement." },
    ],
    deliverables: ["Festive greeting designs", "Social media campaign kit", "Email templates", "Print-ready materials", "Seasonal brand assets"],
    detailedContent: [
      "The holidays and major cultural festivals represent the busiest shopping and engagement periods of the year. During these high-intent seasons, consumers are actively looking for deals, gifts, and connections, making it a critical time for brands to stay top-of-mind. However, generic stock images or standard holiday greetings can feel lazy and fail to resonate with your audience. At TIA Software Solutions, we craft custom, high-end seasonal and festive designs that celebrate these key moments with your audience, creating deep emotional connections and driving seasonal sales.",
      "Our seasonal design services cover a wide array of holidays and cultural celebrations, including Diwali, Christmas, New Year, Eid, Thanksgiving, and more. We design custom greeting cards, festive social media templates, seasonal website banners, email newsletters, and promotional gift cards. Whether you want to send a heartfelt message to your clients, run a holiday discount campaign, or temporarily dress up your website and social media profiles with festive styling, we create stunning visual assets that capture the joy and spirit of the occasion.",
      "We believe that seasonal designs should be culturally authentic and highly professional. We combine festive symbolism and traditional color palettes with your existing brand guidelines, ensuring that the holiday designs still look distinctly like your brand. This careful balance prevents your marketing from looking generic and reinforces your brand authority. By showcasing your company's personality and values during important holidays, you humanize your brand and build stronger, more personal relationships with your customer base.",
      "Because holiday marketing campaigns require careful timing, we work ahead of the curve. We collaborate with you to create a seasonal design calendar, ensuring all greeting cards, promotional banners, and social assets are designed, approved, and delivered well before the holidays arrive. This structured planning allows you to run stress-free campaigns and capture maximum consumer attention during peak seasons. Let TIA Software Solutions help you celebrate every occasion with premium, customized festive graphics.",
      "Ultimately, seasonal campaigns are a powerful driver of brand loyalty. Sending a beautiful, custom digital greeting card to your active clients during key holidays shows that you value their business beyond transaction metrics. Additionally, customized holiday banners on your website create a sense of urgency and excitement for seasonal promotions, directly boosting conversion rates. Partner with TIA Software Solutions to deliver authentic, professional, and visually stunning festive campaigns that delight your customers and grow your business."
    ]
  },
  "event-launch-graphics": {
    title: "Event & Launch Graphics",
    subtitle: "Make every launch unforgettable",
    image: serviceEvents,
    description:
      "Compelling event graphics that build anticipation, drive registrations, and create buzz.",
    features: [
      "Event Announcement Designs — social & email",
      "Launch Poster & Banner Design",
      "Digital Invitation & RSVP Cards",
      "Event Countdown Graphics",
      "Venue Signage & Backdrop Design",
      "Post-Event Thank You & Recap Graphics",
    ],
    process: [
      { step: "Brief", desc: "Understand the event theme and messaging." },
      { step: "Design", desc: "Eye-catching graphics for excitement." },
      { step: "Produce", desc: "Digital and print-ready formats." },
      { step: "Support", desc: "Day-of support and post-event content." },
    ],
    deliverables: ["Event poster & banner designs", "Digital invitations", "Social media kit", "Venue signage files", "Post-event graphics"],
    detailedContent: [
      "Launching a new product, opening a new office, or hosting a corporate event is a major milestone for any business. However, the success of these events depends entirely on your ability to build anticipation, create buzz, and drive attendance or sales. High-quality visual communication is key to making your launch feel like a must-attend event. At TIA Software Solutions, we create premium event and launch graphics designed to generate excitement, capture leads, and ensure that your brand looks professional and polished from the initial announcement to the post-event recap.",
      "We design a comprehensive suite of launch assets, including digital invitations, RSVP cards, event announcement posts, countdown teasers, and promotional banners. If you are hosting a physical event, we also design matching print collateral, such as venue signage, roll-up banners, badges, backdrops, and presentation slides. We ensure that every piece of material—whether viewed on a smartphone screen or printed on a large-scale backdrop—maintains a cohesive visual theme, creating an immersive brand experience for your attendees.",
      "A successful launch requires a clear timeline and a structured narrative. We design graphics that correspond to each phase of your launch funnel, starting with mysterious teaser designs to spark curiosity, followed by detailed announcement graphics to drive registrations, and concluding with live-event assets and post-event thank you messages. This narrative consistency keeps your audience engaged over a longer period, building momentum and increasing the overall return on investment for your event.",
      "Collaborating with TIA Software Solutions means you get a dedicated team that understands the high-stakes, fast-paced nature of launches. We deliver all digital files optimized for various screen resolutions and provide print-ready, high-resolution vector files with proper crop marks for local printers. Let us handle the design heavy lifting for your next big announcement, so you can focus on delivering a successful event. Contact us today to start planning your custom launch graphic assets.",
      "Additionally, a polished launch presentation is critical when speaking to investors, media, or prospective clients. We design bespoke slide decks and digital brochures that present your value proposition clearly and powerfully. By integrating premium typography, custom icons, and high-impact data visualization, we ensure your message is memorable. Partnering with TIA Software Solutions guarantees that your business makes a world-class statement during its most critical moments, positioning your brand as a market leader from day one."
    ]
  },
  "website-development": {
    title: "Website Development",
    subtitle: "High-performance websites that convert",
    image: serviceWebDev,
    description: "We design and develop fast, secure, and SEO-optimized websites tailored to your business needs, helping you turn visitors into loyal customers.",
    features: [
      "Custom responsive design for desktop, tablet, and mobile",
      "Search Engine Optimization (SEO) foundation & fast page loads",
      "Interactive features, booking calendars, and contact forms",
      "Secure hosting, custom domain setup, and SSL integration",
      "Admin panel to easily manage and update your content",
      "Ongoing maintenance and technical support"
    ],
    process: [
      { step: "Planning & Strategy", desc: "We map out your site architecture, pages, and key objectives." },
      { step: "UI/UX Design", desc: "We design pixel-perfect layouts matching your brand identity." },
      { step: "Development & Testing", desc: "We build and rigorously test your site for speed and compatibility." },
      { step: "Launch & Support", desc: "We deploy your website and provide ongoing maintenance." }
    ],
    deliverables: ["Full responsive source code", "Figma design files", "Content management admin panel", "Technical documentation", "SEO and speed optimization reports"],
    subServices: [
      {
        icon: Monitor,
        title: "Front-End & Creative Web Design",
        desc: "Interactive and visual experiences that capture attention and represent your brand.",
        image: serviceWebDev,
        items: [
          "Custom React and Tailwind CSS development",
          "Fully responsive mobile-first layouts",
          "Scroll animations and interactive components",
          "Optimized asset and image loading"
        ]
      },
      {
        icon: ShoppingCart,
        title: "E-Commerce & Shop Solutions",
        desc: "Fully-featured online storefronts designed to streamline shopping and maximize transactions.",
        image: banner2,
        items: [
          "Secure shopping carts and checkout funnels",
          "Stripe, PayPal, and local payment integration",
          "Inventory and product catalog management",
          "Order tracking and email automation"
        ]
      },
      {
        icon: ClipboardList,
        title: "Content Management & Blogs",
        desc: "Powerful administration tools to easily update text, news, and services without code.",
        image: showcaseWork,
        items: [
          "Headless CMS integration (Sanity, Strapi, Decap)",
          "Rich text editor and media library",
          "SEO meta tag controls and sitemap auto-generation",
          "Multi-user role and permission levels"
        ]
      },
      {
        icon: Zap,
        title: "Performance & SEO Hardening",
        desc: "Speed optimization and search visibility enhancements to drive organic growth.",
        image: aboutTeam,
        items: [
          "Next-gen WebP image delivery and CDN caching",
          "Clean semantic HTML5 structure for accessibility",
          "Google Schema markup and Structured Data injection",
          "Web Vitals score optimization (Lighthouse 90+)"
        ]
      }
    ]
  },
  "app-development": {
    title: "App Development",
    subtitle: "Custom mobile & web applications",
    image: serviceAppDev,
    description: "We build custom mobile apps (iOS & Android) and web applications with rich user interfaces, secure databases, and smooth integrations.",
    features: [
      "Native iOS & Android mobile applications (hybrid or native)",
      "Custom web applications and user dashboard portals",
      "Secure user authentication and database integrations",
      "Real-time push notifications and updates",
      "Smooth API integrations (payment processors, CRMs, etc.)",
      "App store submission and compliance support"
    ],
    process: [
      { step: "Requirements Analysis", desc: "Define target platforms, databases, APIs, and project scope." },
      { step: "Wireframing & Prototyping", desc: "Create interactive user journeys and mockups." },
      { step: "App Development", desc: "Build backend servers and native frontend apps." },
      { step: "App Store Launch", desc: "Submit your apps and assist with publication approval." }
    ],
    deliverables: ["iOS/Android app packages", "Backend API and database schemas", "Admin dashboard source code", "Interactive Figma prototypes", "Developer handoff documentation"],
    subServices: [
      {
        icon: Smartphone,
        title: "iOS & Android Mobile Apps",
        desc: "Native-quality mobile applications published on the Apple App Store and Google Play.",
        image: serviceAppDev,
        items: [
          "React Native and Flutter cross-platform coding",
          "Local database storage and offline capabilities",
          "Push notification delivery configurations",
          "Biometric login (FaceID / Fingerprint) integration"
        ]
      },
      {
        icon: Laptop,
        title: "Custom Web Applications",
        desc: "Interactive dashboard portals and SaaS products operating in modern web browsers.",
        image: banner2,
        items: [
          "Interactive charts, analytics, and data grids",
          "Dynamic state management and real-time updates",
          "Secure client portals and client workspaces",
          "Export options (PDF, Excel, CSV formats)"
        ]
      },
      {
        icon: Cpu,
        title: "Database & API Backend",
        desc: "Robust, high-concurrency servers to handle application business logic and data storage.",
        image: vaAccounting,
        items: [
          "Secure RESTful and GraphQL API servers",
          "PostgreSQL, MongoDB, or Firebase databases",
          "JWT-based session authentication",
          "Automated server backups and SSL encryption"
        ]
      }
    ]
  },
  "software-development": {
    title: "Software Development",
    subtitle: "Bespoke enterprise software & integrations",
    image: serviceSoftwareDev,
    description: "Tailored enterprise software, custom dashboards, API integrations, and database automation to optimize your business workflows.",
    features: [
      "Custom enterprise software and database architectures",
      "Automated business workflows, CRMs, and ERP integrations",
      "Secure RESTful API development and webhook connections",
      "Legacy system upgrades and migration services",
      "Cloud architecture setup, hosting, and backup automation",
      "Dedicated long-term support and system maintenance"
    ],
    process: [
      { step: "Discovery & Blueprinting", desc: "Understand your workflow bottlenecks and design the system blueprint." },
      { step: "System Architecture", desc: "Model databases, server scaling, security, and integration points." },
      { step: "Agile Development", desc: "Develop the software iteratively with frequent testing updates." },
      { step: "Deployment & Training", desc: "Launch the system in your cloud environment and train your team." }
    ],
    deliverables: ["Bespoke enterprise software source code", "RESTful API and webhook documentation", "Cloud infrastructure setup scripts", "Database structure diagrams", "User training manuals"],
    subServices: [
      {
        icon: Cpu,
        title: "Enterprise Workflow Automation",
        desc: "Custom software that eliminates repetitive manual tasks and synchronizes your databases.",
        image: serviceSoftwareDev,
        items: [
          "Automated spreadsheet parsing and sync pipelines",
          "Third-party webhook routing and processing",
          "CRM and ERP platform data syncing",
          "Automated invoice and PDF report generators"
        ]
      },
      {
        icon: Users,
        title: "Custom CRM & Client Management",
        desc: "Manage your client relationships, interactions, and operations in a private dedicated software tool.",
        image: showcaseWork,
        items: [
          "Pipeline progress and sales funnel trackers",
          "Lead history profiles and interaction logging",
          "Internal task assignments and reminder systems",
          "Role-based page access controls"
        ]
      },
      {
        icon: Shield,
        title: "Cloud Infrastructure & Security",
        desc: "Scalable hosting architectures designed for high reliability, security, and performance.",
        image: banner2,
        items: [
          "AWS, Google Cloud, and DigitalOcean hosting setup",
          "Docker containerization and deployment configuration",
          "DDoS protection and robust firewalls",
          "24/7 server monitoring and health alerts"
        ]
      }
    ]
  }
};

const VirtualAssistancePage = () => {
  const { whatsappLink } = useSiteSettings();
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Virtual Assistance Services",
    "description": "Professional Virtual Assistance Services designed to help businesses streamline operations, reduce workload, and improve productivity. Serving clients throughout the UK.",
    "provider": {
      "@type": "Organization",
      "name": "TIA Software Solutions",
      "url": "https://www.tiasoftwaresolutions.com"
    },
    "serviceType": "Virtual Assistance",
    "areaServed": "GB"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.tiasoftwaresolutions.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://www.tiasoftwaresolutions.com/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Virtual Assistance Services",
        "item": "https://www.tiasoftwaresolutions.com/services/virtual-assistance"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Virtual Assistance Services UK | TIA Software Solutions</title>
        <meta name="description" content="Professional Virtual Assistance Services designed to help businesses streamline operations, reduce workload, and improve productivity. Serving clients throughout the UK." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.tiasoftwaresolutions.com/services/virtual-assistance" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Virtual Assistance Services UK | TIA Software Solutions" />
        <meta property="og:description" content="Professional Virtual Assistance Services designed to help businesses streamline operations, reduce workload, and improve productivity. Serving clients throughout the UK." />
        <meta property="og:url" content="https://www.tiasoftwaresolutions.com/services/virtual-assistance" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Assistance Services UK | TIA Software Solutions" />
        <meta name="twitter:description" content="Professional Virtual Assistance Services designed to help businesses streamline operations, reduce workload, and improve productivity. Serving clients throughout the UK." />
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <img
          src={vaHero}
          alt="Virtual Assistance Services"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        <div className="container relative z-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Headphones size={16} /> Our Flagship Service
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              <span className="gradient-text">Virtual Assistance</span> Services
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-foreground/80 mb-4">
              Simplify Your Work. Maximize Your Growth.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Professional Virtual Assistance Services designed to help businesses streamline operations, reduce workload, and improve productivity. Our dedicated virtual assistants handle your daily tasks efficiently so you can focus on growing your business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" className="px-8" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Get Started Today <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-8" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sub-services */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              What We Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Our Virtual <span className="gradient-text">Assistance Services</span>
            </h2>
          </motion.div>

          <div className="space-y-16">
            {vaSubServices.map((sub, i) => (
              <motion.div
                key={sub.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="glass-card overflow-hidden"
              >
                <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img
                      src={sub.image}
                      alt={sub.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      width={1200}
                      height={800}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
                  </div>
                  <div className={`p-8 lg:p-12 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                    <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-5">
                      <sub.icon size={28} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{sub.title}</h3>
                    <p className="text-muted-foreground mb-6">{sub.desc}</p>
                    <ul className="space-y-3">
                      {sub.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Check size={14} className="text-primary" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose <span className="gradient-text">TIA Software Solutions</span>?
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 text-center hover-lift"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits + Who Can Benefit */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
                Benefits
              </span>
              <h2 className="text-3xl font-bold mb-8">
                Benefits of Hiring a <span className="gradient-text">Virtual Assistant</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Save time and focus on core business activities",
                  "Reduce operational costs by up to 60%",
                  "Improve efficiency and productivity",
                  "Access skilled professionals without full-time hiring",
                  "Scale your team flexibly based on demand",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Check size={16} className="text-primary" />
                    </div>
                    <p className="text-muted-foreground">{b}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
                Who Can Benefit
              </span>
              <h2 className="text-3xl font-bold mb-8">
                Perfect For <span className="gradient-text">Your Business</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {whoCanBenefit.map((item) => (
                  <div key={item} className="bg-card border border-border/40 p-4 flex items-center gap-3 select-none">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary/5">
        <div className="container text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Get Started</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let TIA Software Solutions take care of your tasks while you focus on scaling your business. Contact us today for reliable Virtual Assistance Services!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" className="px-10" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Contact Us on WhatsApp <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-10" asChild>
                <Link to="/plans">View Our Plans</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const GenericServiceDetail = ({ service }: { service: typeof serviceData[string] }) => {
  const { whatsappLink } = useSiteSettings();
  const { slug } = useParams<{ slug: string }>();
  const serviceUrl = `https://www.tiasoftwaresolutions.com/services/${slug}`;

  const getUKTitle = (currentSlug: string | undefined, originalTitle: string) => {
    switch (currentSlug) {
      case "website-development":
        return "Web Development Services UK | TIA Software Solutions";
      case "app-development":
        return "App Development Company UK | TIA Software Solutions";
      case "software-development":
        return "Software Development Services UK | TIA Software Solutions";
      case "digital-marketing":
        return "Digital Marketing & SEO Services UK | TIA Software Solutions";
      case "ui-ux-design":
        return "UI/UX Design Agency UK | TIA Software Solutions";
      case "branding-essentials":
        return "Branding & Logo Design UK | TIA Software Solutions";
      default:
        return `${originalTitle} | TIA Software Solutions`;
    }
  };

  const serviceTitle = getUKTitle(slug, service.title);
  const seoDescription = `${service.description} Serving clients throughout the UK.`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": seoDescription,
    "provider": {
      "@type": "Organization",
      "name": "TIA Software Solutions",
      "url": "https://www.tiasoftwaresolutions.com"
    },
    "serviceType": service.title,
    "areaServed": "GB"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.tiasoftwaresolutions.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://www.tiasoftwaresolutions.com/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": service.title,
        "item": serviceUrl
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{serviceTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={serviceUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={serviceTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={service.image} />
        <meta property="og:url" content={serviceUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={serviceTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={service.image} />
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        <div className="container relative z-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Sparkles size={16} /> Premium Agency Service
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              <span className="gradient-text">{service.title}</span> Services
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-foreground/80 mb-4">
              {service.subtitle}
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              {service.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" className="px-8" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Get Started Today <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-8" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sub-services / In-Depth alternate cards */}
      {service.subServices && (
        <section className="section-padding">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
                What We Offer
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Our Custom <span className="gradient-text">{service.title} Solutions</span>
              </h2>
            </motion.div>

            <div className="space-y-16">
              {service.subServices.map((sub, i) => (
                <motion.div
                  key={sub.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="glass-card overflow-hidden"
                >
                  <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                    <div className="relative h-64 lg:h-auto overflow-hidden">
                      <img
                        src={sub.image}
                        alt={sub.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        width={1200}
                        height={800}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
                    </div>
                    <div className={`p-8 lg:p-12 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                      <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-5">
                        <sub.icon size={28} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{sub.title}</h3>
                      <p className="text-muted-foreground mb-6">{sub.desc}</p>
                      <ul className="space-y-3">
                        {sub.items.map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Check size={14} className="text-primary" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fallback to detailedContent paragraphs if subServices doesn't exist */}
      {!service.subServices && service.detailedContent && (
        <section className="section-padding">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
                Deep Dive
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Our <span className="gradient-text">{service.title} Solutions</span>
              </h2>
            </motion.div>

            <div className="space-y-16">
              {service.detailedContent.map((sub, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="glass-card overflow-hidden"
                >
                  <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                    <div className="relative h-64 lg:h-auto overflow-hidden">
                      <img
                        src={
                          i === 0 ? service.image :
                          i === 1 ? banner2 :
                          i === 2 ? showcaseWork :
                          i === 3 ? aboutTeam : vaAccounting
                        }
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        width={1200}
                        height={800}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
                    </div>
                    <div className={`p-8 lg:p-12 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                      <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-5">
                        <Sparkles size={28} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">
                        {i === 0 ? "Strategic Overview" :
                         i === 1 ? "Custom Implementation" :
                         i === 2 ? "Cohesive Consistency" :
                         i === 3 ? "Collaborative Philosophy" : "Commercial Value & Outcomes"}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{sub}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section-padding bg-secondary/20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              What's Included
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Service <span className="gradient-text">Features</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {service.features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/40 p-6 rounded-2xl flex items-start gap-4 select-none"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={16} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{f}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose <span className="gradient-text">TIA Software Solutions</span>?
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 text-center hover-lift"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              How We Work
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Our <span className="gradient-text">Process</span>
            </h2>
          </motion.div>
          <div className="space-y-8">
            {service.process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 flex items-start gap-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-lg">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{p.step}</h3>
                  <p className="text-muted-foreground">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits + Who Can Benefit */}
      <section className="section-padding bg-secondary/20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
                Benefits
              </span>
              <h2 className="text-3xl font-bold mb-8">
                Benefits of Our <span className="gradient-text">{service.title}</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Maximize your brand's digital visibility and reach",
                  "Save time and operational costs with expert outsourcing",
                  "Ensure premium design and execution quality standards",
                  "Gain scalable, tailored solutions for your business size",
                  "Translate clicks and impressions into measurable revenue",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Check size={16} className="text-primary" />
                    </div>
                    <p className="text-muted-foreground">{b}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
                Who Can Benefit
              </span>
              <h2 className="text-3xl font-bold mb-8">
                Perfect For <span className="gradient-text">Your Business</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {whoCanBenefit.map((item) => (
                  <div key={item} className="bg-card border border-border/40 p-4 flex items-center gap-3 select-none">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="section-padding bg-primary/5">
        <div className="container text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Get Started</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let TIA Software Solutions take care of your tasks while you focus on scaling your business. Contact us today for reliable {service.title}!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" className="px-10" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Contact Us on WhatsApp <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-10" asChild>
                <Link to="/plans">View Our Plans</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  if (slug === "virtual-assistance") {
    return <VirtualAssistancePage />;
  }

  const service = slug ? serviceData[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Button variant="hero" asChild>
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <GenericServiceDetail service={service} />;
};

export default ServiceDetail;
