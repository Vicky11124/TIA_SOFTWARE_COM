import { describe, it, expect } from "vitest";
import { MockProvider, LeadState, sanitizeLeadState, selectRelevantKnowledge, detectLocalIntent, getLocalResponse, buildReportData, recommendPackage, extractCountryFromText } from "../services/aiProvider";
import { tryDirectReactExtraction } from "../components/TiaChatbot/ChatWindow";

// Helper to simulate the extraction and dialogue pipeline
const runPipeline = async (
  provider: MockProvider,
  userMessage: string,
  currentState: LeadState,
  getNextRequiredField: (state: LeadState) => string | null
): Promise<{ mergedState: LeadState; reply: string }> => {
  const activeField = getNextRequiredField(currentState);

  // 1. Try React direct extraction
  const directUpdates = tryDirectReactExtraction(userMessage, activeField, currentState) || {};

  // 2. Fall back to LLM extraction for conversational input or missing fields
  let llmUpdates: Partial<LeadState> = {};
  if (userMessage.split(/\s+/).length > 6 || !directUpdates[activeField as keyof LeadState]) {
    llmUpdates = await provider.extractLeadState(userMessage, currentState, activeField);
  }

  const updates = { ...llmUpdates, ...directUpdates };

  // 3. Merge updates
  const mergedState: LeadState = {
    ...currentState,
    country: updates.country !== undefined && updates.country !== null ? updates.country : currentState.country,
    service: updates.service !== undefined && updates.service !== null ? updates.service : currentState.service,
    businessType: updates.businessType !== undefined && updates.businessType !== null ? updates.businessType : currentState.businessType,
    pages: updates.pages !== undefined && updates.pages !== null ? updates.pages : currentState.pages,
    budget: updates.budget !== undefined && updates.budget !== null ? updates.budget : currentState.budget,
    timeline: updates.timeline !== undefined && updates.timeline !== null ? updates.timeline : currentState.timeline,
    features: updates.features && Array.isArray(updates.features)
      ? Array.from(new Set([...currentState.features, ...updates.features]))
      : currentState.features,
  };

  // 4. Get next field
  const nextField = getNextRequiredField(mergedState);

  // 5. Stream chat
  let reply = "";
  await provider.streamChat([{ role: "user", content: userMessage }], mergedState, nextField, {
    onChunk: (chunk) => {
      reply += chunk;
    },
    onFinish: (text) => {
      reply = text;
    },
    onError: () => {},
  });

  return { mergedState, reply };
};

const getNextRequiredField = (state: LeadState): string | null => {
  if (!state.service) return "service";
  if (!state.businessType) return "businessType";
  if (!state.pages) return "pages";
  if (!state.budget) return "budget";
  if (!state.timeline) return "timeline";
  return null;
};

describe("tryDirectReactExtraction (The Secretary)", () => {
  const dummyState: LeadState = {
    service: "Website",
    businessType: "Restaurant",
    pages: "5 pages",
    features: [],
    budget: null,
    timeline: null,
  };

  it("should extract page counts directly from numeric replies", () => {
    const res = tryDirectReactExtraction("5", "pages", dummyState);
    expect(res).toEqual({ pages: "5 pages" });

    const resSentence = tryDirectReactExtraction("5 pages", "pages", dummyState);
    expect(resSentence).toEqual({ pages: "5 pages" });

    // Word number resolution
    const resWord = tryDirectReactExtraction("five pages", "pages", dummyState);
    expect(resWord).toEqual({ pages: "5 pages" });
  });

  it("should return null for long conversational replies to pages", () => {
    const res = tryDirectReactExtraction("I think we might need a total of five pages for the new website", "pages", dummyState);
    expect(res).toBeNull();
  });

  it("should extract budgets directly from short replies", () => {
    const resBasic = tryDirectReactExtraction("basic", "budget", dummyState);
    expect(resBasic).toEqual({ budget: "Basic Plan (£199.99/mo)" });

    const resNumber = tryDirectReactExtraction("400", "budget", dummyState);
    expect(resNumber).toEqual({ budget: "£400" });
  });

  it("should map budget agreement affirmatives correctly based on page count", () => {
    const resAffirmative = tryDirectReactExtraction("thats good", "budget", dummyState);
    expect(resAffirmative).toEqual({ budget: "Basic Plan (£199.99/mo)" });

    const standardDummyState = { ...dummyState, pages: "10 pages" };
    const resAffirmativeStandard = tryDirectReactExtraction("sounds perfect", "budget", standardDummyState);
    expect(resAffirmativeStandard).toEqual({ budget: "Standard Plan (£399.99/mo)" });
  });

  it("should extract timelines directly from short replies", () => {
    const resFlexible = tryDirectReactExtraction("flexible", "timeline", dummyState);
    expect(resFlexible).toEqual({ timeline: "flexible" });

    const resWeeks = tryDirectReactExtraction("3 weeks", "timeline", dummyState);
    expect(resWeeks).toEqual({ timeline: "3 weeks" });
  });

  it("should extract service directly from short replies", () => {
    const resWeb = tryDirectReactExtraction("website", "service", dummyState);
    expect(resWeb).toEqual({ service: "Website" });

    const resApp = tryDirectReactExtraction("mobile app", "service", dummyState);
    expect(resApp).toEqual({ service: "Mobile App" });
  });
});

describe("MockProvider Modular Pipeline with Secretary Preprocessing", () => {
  const provider = new MockProvider();

  it("should extract initial service from message", async () => {
    const state: LeadState = {
      service: null,
      businessType: null,
      pages: null,
      features: [],
      budget: null,
      timeline: null,
    };

    const res = await runPipeline(provider, "I want a website", state, getNextRequiredField);
    expect(res.mergedState.service).toBe("Website");
  });

  it("should detect business type dynamically", async () => {
    const state: LeadState = {
      service: "Website",
      businessType: null,
      pages: null,
      features: [],
      budget: null,
      timeline: null,
    };

    const res = await runPipeline(provider, "for a second hand bike seller", state, getNextRequiredField);
    expect(res.mergedState.businessType).toBe("Second Hand Bike Seller");
  });

  it("should detect features without modifying other fields", async () => {
    const state: LeadState = {
      service: "Website",
      businessType: "Second Hand Bike Seller",
      pages: null,
      features: [],
      budget: null,
      timeline: null,
    };

    const res = await runPipeline(provider, "i want it seo ready", state, getNextRequiredField);
    expect(res.mergedState.service).toBe("Website");
    expect(res.mergedState.features).toContain("SEO Setup");
  });

  it("should directly answer direct questions (FAQs)", async () => {
    const state: LeadState = {
      service: "Website",
      businessType: "Second Hand Bike Seller",
      pages: null,
      features: ["SEO Setup"],
      budget: null,
      timeline: null,
    };

    const res = await runPipeline(provider, "no do you do seo stuff", state, getNextRequiredField);
    expect(res.reply).toContain("Search Engine Optimization");
    expect(res.mergedState.service).toBe("Website");
  });

  it("should handle page correction/updates via LLM correction statement", async () => {
    const state: LeadState = {
      service: "Website",
      businessType: "Second Hand Bike Seller",
      pages: "10 pages",
      features: ["SEO Setup"],
      budget: "Standard Plan (£399.99/mo)",
      timeline: null,
    };

    const res = await runPipeline(provider, "actually I changed my mind, I want 5 pages", state, getNextRequiredField);
    expect(res.mergedState.pages).toBe("5 pages");
  });

  it("should extract pages directly via React if pages is active field", async () => {
    const state: LeadState = {
      service: "Website",
      businessType: "Second Hand Bike Seller",
      pages: null,
      features: [],
      budget: null,
      timeline: null,
    };

    const res = await runPipeline(provider, "5", state, getNextRequiredField);
    expect(res.mergedState.pages).toBe("5 pages");
  });
});

describe("sanitizeLeadState helper", () => {
  it("should sanitize and map non-standard service strings", () => {
    const dirtyState = {
      service: "I Need A Website",
      businessType: "Dental Clinic",
      pages: "5 pages",
      features: ["Contact Form", 123],
      budget: null,
      timeline: "2 weeks"
    };

    const sanitized = sanitizeLeadState(dirtyState);
    expect(sanitized.service).toBe("Website");
    expect(sanitized.features).toEqual(["Contact Form"]);
    expect(sanitized.timeline).toBe("2 weeks");
  });

  it("should map other services correctly", () => {
    expect(sanitizeLeadState({ service: "mobile app development" }).service).toBe("Mobile App");
    expect(sanitizeLeadState({ service: "marketing seo PPC" }).service).toBe("Digital Marketing");
    expect(sanitizeLeadState({ service: "brand kits & logo" }).service).toBe("Branding");
    expect(sanitizeLeadState({ service: "ui ux interactive design" }).service).toBe("UI/UX Design");
    expect(sanitizeLeadState({ service: "ai automation workflow" }).service).toBe("AI Automation");
    expect(sanitizeLeadState({ service: "invalid value" }).service).toBeNull();
  });
});

describe("Knowledge Engine Selector", () => {
  const emptyState: LeadState = {
    service: null,
    businessType: null,
    pages: null,
    features: [],
    budget: null,
    timeline: null,
  };


  it("should always inject conversation rules and company profile", () => {
    const kb = selectRelevantKnowledge("hello", emptyState);
    expect(kb).toContain("=== TRAINING/CONVERSATION-FLOW.MD ===");
    expect(kb).toContain("=== COMPANY/COMPANY.MD ===");
    // Should NOT contain specific details unless requested
    expect(kb).not.toContain("=== SALES/PRICING.MD ===");
    expect(kb).not.toContain("=== COMPANY/CONTACT.MD ===");
  });

  it("should inject pricing and objections when price is queried", () => {
    const kb = selectRelevantKnowledge("how much does a website cost?", emptyState);
    expect(kb).toContain("=== SALES/PRICING.MD ===");
    expect(kb).toContain("=== SALES/OBJECTIONS.MD ===");
  });

  it("should inject services when website is queried", () => {
    const kb = selectRelevantKnowledge("need a site built", emptyState);
    expect(kb).toContain("=== SERVICES/WEBSITES.MD ===");
  });

  it("should inject contact details when contact info is asked", () => {
    const kb = selectRelevantKnowledge("what is your phone number?", emptyState);
    expect(kb).toContain("=== COMPANY/CONTACT.MD ===");
  });

  it("should inject industries and suggestions if business type is in lead state", () => {
    const clinicState = { ...emptyState, businessType: "Dental Clinic" };
    const kb = selectRelevantKnowledge("hello", clinicState);
    expect(kb).toContain("=== INDUSTRIES/HEALTHCARE.MD ===");
  });

  it("should inject website playbook if website is queried or in the lead state", () => {
    const kbText = selectRelevantKnowledge("need a site", emptyState);
    expect(kbText).toContain("=== TRAINING/WEBSITES-PLAYBOOK.MD ===");

    const websiteState = { ...emptyState, service: "Website" };
    const kbState = selectRelevantKnowledge("hello", websiteState);
    expect(kbState).toContain("=== TRAINING/WEBSITES-PLAYBOOK.MD ===");
  });

  describe("Fast Local Intent Detector", () => {
    it("should detect local intents correctly", () => {
      expect(detectLocalIntent("hello")).toBe("Greeting");
      expect(detectLocalIntent("hi there")).toBe("Greeting");
      expect(detectLocalIntent("what is your email address?")).toBe("Contact");
      expect(detectLocalIntent("pricing plans")).toBe("Pricing");
      expect(detectLocalIntent("showcase your past projects")).toBe("Portfolio");
      expect(detectLocalIntent("thank you so much")).toBe("ThanksGoodbye");
      expect(detectLocalIntent("something is broken here")).toBe("Support");
      expect(detectLocalIntent("how much does a website cost?")).toBe("Pricing");
      expect(detectLocalIntent("complex question about dental apps")).toBeNull();
    });

    it("should generate correct local responses with dynamic knowledge content", () => {
      const response = getLocalResponse("Pricing", emptyState);
      expect(response).toContain("Basic Plan");
      expect(response).toContain("Standard Plan");
      expect(response).toContain("Whenever you're ready, we can continue planning your project.");
    });
  });
});

describe("Project Consultation Report Engine", () => {
  const completeState: LeadState = {
    service: "Website",
    businessType: "Restaurant",
    pages: "5 pages",
    features: ["Online Booking", "SEO Setup"],
    budget: "Basic Plan (£199.99/mo)",
    timeline: "2 weeks"
  };

  it("should build valid ReportData when all 5 fields exist", () => {
    const reportData = buildReportData(completeState, 100);

    expect(reportData).not.toBeNull();
    expect(reportData?.service).toBe("Website");
    expect(reportData?.businessType).toBe("Restaurant");
    expect(reportData?.readinessPercentage).toBe(100);
    expect(reportData?.confidenceLevel).toBe("High Confidence");
    expect(reportData?.status).toBe("Ready for Quotation");
    expect(reportData?.recommendedPackage.name).toBe("Basic Plan");
  });

  it("should return null if any of the 5 key fields are missing", () => {
    const incompleteState: LeadState = {
      ...completeState,
      timeline: null
    };

    const reportData = buildReportData(incompleteState, 85);
    expect(reportData).toBeNull();
  });

  it("should recommend Pro or Premium plans for larger scope or app projects", () => {
    const appState: LeadState = {
      ...completeState,
      service: "Mobile App",
      pages: "15 pages"
    };
    expect(recommendPackage(appState).name).toBe("Premium Plan");

    const proState: LeadState = {
      ...completeState,
      service: "AI Automation",
      pages: "12 pages"
    };
    expect(recommendPackage(proState).name).toBe("Pro Plan");
  });

  it("should generate complete explanations from MockProvider fallback", async () => {
    const provider = new MockProvider();
    const data = buildReportData(completeState, 100);

    const explanations = await provider.generateReportExplanations(data!);
    expect(explanations.executiveSummary).toContain("Restaurant");
    expect(explanations.whyThisPackage).toContain("Basic Plan");
    expect(explanations.immediateBenefits.length).toBeGreaterThanOrEqual(4);
    expect(explanations.longTermBenefits.length).toBeGreaterThanOrEqual(4);
    expect(explanations.nextSteps.length).toBeGreaterThanOrEqual(4);
  });

  it("should complete the exact 5-step consultation sequence with response variations and proposal generation", async () => {
    const provider = new MockProvider();
    let state: LeadState = {
      service: null,
      businessType: null,
      pages: null,
      features: [],
      budget: null,
      timeline: null,
    };

    // Step 1: Website
    let res = await runPipeline(provider, "Website", state, getNextRequiredField);
    state = res.mergedState;
    expect(state.service).toBe("Website");

    // Step 2: Restaurant
    res = await runPipeline(provider, "Restaurant", state, getNextRequiredField);
    state = res.mergedState;
    expect(state.businessType).toBe("Restaurant");

    // Step 3: 5 Pages
    res = await runPipeline(provider, "5 Pages", state, getNextRequiredField);
    state = res.mergedState;
    expect(state.pages).toBe("5 pages");
    // Ensure no premature package recommendation during scope question turn!
    expect(res.reply).not.toContain("Basic Plan");
    expect(res.reply).not.toContain("Standard Plan");

    // Step 4: Standard Budget
    res = await runPipeline(provider, "Standard Plan (£399.99/mo)", state, getNextRequiredField);
    state = res.mergedState;
    expect(state.budget).toBe("Standard Plan (£399.99/mo)");

    // Step 5: 2 Weeks
    res = await runPipeline(provider, "2 weeks", state, getNextRequiredField);
    state = res.mergedState;
    expect(state.timeline).toBe("2 weeks");

    // Step 6: UK
    res = await runPipeline(provider, "UK", state, getNextRequiredField);
    state = res.mergedState;
    expect(state.country).toBe("UK");

    // Proposal readiness guarantee check
    const reportData = buildReportData(state, 100);
    expect(reportData).not.toBeNull();
    expect(reportData?.readinessPercentage).toBe(100);
    expect(reportData?.service).toBe("Website");
    expect(reportData?.businessType).toBe("Restaurant");
    expect(reportData?.scope).toBe("5 pages");
    expect(reportData?.recommendedPackage.price).toBe("£399.99/mo");
  });
});

describe("Multi-Region Pricing Engine", () => {
  it("should accurately resolve cities, states, and regional terms to correct countries", () => {
    const ukInputs = ["UK", "United Kingdom", "GB", "England", "London", "London UK", "Great Britain", "Manchester", "🇬🇧 United Kingdom"];
    ukInputs.forEach(input => {
      expect(extractCountryFromText(input)).toBe("UK");
    });
    
    const usInputs = ["US", "USA", "United States", "America", "Texas", "California", "Florida", "New York", "Chicago", "Los Angeles", "Miami", "Dallas", "Seattle", "Houston", "🇺🇸 United States"];
    usInputs.forEach(input => {
      expect(extractCountryFromText(input)).toBe("US");
    });

    const auInputs = ["AU", "Australia", "Aussie", "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "🇦🇺 Australia"];
    auInputs.forEach(input => {
      expect(extractCountryFromText(input)).toBe("AU");
    });

    expect(extractCountryFromText("Just a website")).toBeNull();
  });

  it("should deliver localized package recommendations per region", () => {
    const baseState: LeadState = {
      country: "UK",
      service: "Website",
      businessType: "Restaurant",
      pages: "5 pages",
      features: [],
      budget: "Basic",
      timeline: "1 month",
    };

    expect(recommendPackage({ ...baseState, country: "UK" }).price).toBe("£199.99/mo");
    expect(recommendPackage({ ...baseState, country: "US" }).price).toBe("$249.99/mo");
    expect(recommendPackage({ ...baseState, country: "AU" }).price).toBe("A$349.99/mo");

    expect(recommendPackage({ ...baseState, country: "UK", pages: "10 pages" }).price).toBe("£399.99/mo");
    expect(recommendPackage({ ...baseState, country: "US", pages: "10 pages" }).price).toBe("$499.99/mo");
    expect(recommendPackage({ ...baseState, country: "AU", pages: "10 pages" }).price).toBe("A$699.99/mo");
  });

  it("should extract country automatically if user mentions city early and skip country question", async () => {
    const provider = new MockProvider();
    const state: LeadState = {
      country: null,
      service: null,
      businessType: null,
      pages: null,
      features: [],
      budget: null,
      timeline: null,
    };

    const getNextRequiredField = (s: LeadState) => {
      if (!s.service) return "service";
      if (!s.businessType) return "businessType";
      if (!s.pages) return "pages";
      if (!s.budget) return "budget";
      if (!s.timeline) return "timeline";
      if (!s.country) return "country";
      return null;
    };

    // User mentions Sydney upfront in business description
    const res = await runPipeline(provider, "I need a website for my cafe in Sydney", state, getNextRequiredField);
    expect(res.mergedState.country).toBe("AU");
    expect(res.mergedState.service).toBe("Website");
    expect(res.mergedState.businessType).toBe("Restaurant");

    // Next field should be pages, skipping country since AU was auto-detected!
    const nextField = getNextRequiredField(res.mergedState);
    expect(nextField).toBe("pages");
  });

  it("should advance immediately after country selection and not repeat country prompt", async () => {
    const provider = new MockProvider();
    const state: LeadState = {
      country: null,
      service: "Website",
      businessType: "Restaurant",
      pages: "5 pages",
      features: [],
      budget: "Basic Plan (£199.99/mo)",
      timeline: "2 weeks",
    };

    const getNextRequiredField = (s: LeadState) => {
      if (!s.service) return "service";
      if (!s.businessType) return "businessType";
      if (!s.pages) return "pages";
      if (!s.budget) return "budget";
      if (!s.timeline) return "timeline";
      if (!s.country) return "country";
      return null;
    };

    expect(getNextRequiredField(state)).toBe("country");

    // User selects UK
    const res = await runPipeline(provider, "UK", state, getNextRequiredField);
    expect(res.mergedState.country).toBe("UK");

    // Next field must be null (consultation complete!)
    const nextField = getNextRequiredField(res.mergedState);
    expect(nextField).toBeNull();

    // Report data must build successfully
    const report = buildReportData(res.mergedState);
    expect(report).not.toBeNull();
    expect(report?.recommendedPackage.price).toBe("£199.99/mo");
  });
});

