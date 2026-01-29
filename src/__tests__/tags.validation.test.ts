import { describe, it, expect } from "vitest";
import { tagSchema } from "../features/tags/validation/schemas";

describe("Tag validation schemas", () => {
  describe("tagSchema", () => {
    it("should validate correct tag data", () => {
      const validData = {
        code: "react",
        name: "React",
        sort: 1,
      };

      const result = tagSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty code", () => {
      const invalidData = {
        code: "",
        name: "JavaScript",
        sort: 1,
      };

      const result = tagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty name", () => {
      const invalidData = {
        code: "js",
        name: "",
        sort: 1,
      };

      const result = tagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject negative sort", () => {
      const invalidData = {
        code: "js",
        name: "JavaScript",
        sort: -1,
      };

      const result = tagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
