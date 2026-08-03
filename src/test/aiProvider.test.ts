import { describe, it, expect } from "vitest";
import { MockProvider, LeadState, ChatJSONResponse } from "../services/aiProvider";

// Helper to simulate a chat message stream
const runChat = (
  provider: MockProvider,
  history: { role: "user" | "model"; content: string }[],
  currentState: LeadState
): Promise<ChatJSONResponse> => {
  return new Promise((resolve, reject) => {
    provider.streamChat(
      history,
      currentState,
      {
        onChunk: () => {},
        onFinish: (res) => resolve(res),
        onError: (err) => reject(err),
      }
    );
  });
};

describe("MockProvider Conversational Flow", () => {
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

    const res = await runChat(provider, [{ role: "user", content: "I want a website" }], state);
    expect(res.lead_state.service).toBe("Website");
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

    const res = await runChat(provider, [{ role: "user", content: "for a second hand bike seller" }], state);
    expect(res.lead_state.businessType).toBe("Second Hand Bike Seller");
  });

  it("should avoid service collision when user mentions SEO ready website", async () => {
    const state: LeadState = {
      service: "Website",
      businessType: "Second Hand Bike Seller",
      pages: null,
      features: [],
      budget: null,
      timeline: null,
    };

    const res = await runChat(provider, [{ role: "user", content: "i want it seo ready" }], state);
    expect(res.lead_state.service).toBe("Website");
    expect(res.lead_state.features).toContain("SEO Setup");
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

    const res = await runChat(provider, [{ role: "user", content: "no do you do seo stuff" }], state);
    expect(res.assistant_response).toContain("Search Engine Optimization");
    expect(res.lead_state.service).toBe("Website");
  });

  it("should handle page correction and recalculate plan recommendation", async () => {
    const state: LeadState = {
      service: "Website",
      businessType: "Second Hand Bike Seller",
      pages: "10 pages",
      features: ["SEO Setup"],
      budget: "Recommended: Standard Plan (£399.99/mo)",
      timeline: null,
    };

    const res = await runChat(provider, [{ role: "user", content: "actually I changed my mind, I want 5 pages" }], state);
    expect(res.lead_state.pages).toBe("5 pages");
    expect(res.lead_state.budget).toBe("Recommended: Basic Plan (£199.99/mo)");
  });
});
