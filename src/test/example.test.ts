import { describe, it, expect } from "vitest";
import BlogDetailDefault, { BlogDetail } from "../pages/BlogDetail";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });

  it("exports the blog detail component as the default and named component", () => {
    expect(BlogDetailDefault).toBe(BlogDetail);
  });
});
