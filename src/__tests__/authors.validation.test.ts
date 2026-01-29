import { describe, it, expect } from "vitest";
import { authorSchema } from "../features/authors/validation/schemas";

describe("Author validation schemas", () => {
  describe("authorSchema", () => {
    it("should validate correct author data", () => {
      const validData = {
        name: "Иван",
        lastName: "Иванов",
        secondName: "Иванович",
        shortDescription: "Краткое описание",
        description: "Полное описание автора",
      };

      const result = authorSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate minimal author data", () => {
      const validData = {
        name: "Иван",
        lastName: "Иванов",
      };

      const result = authorSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty name", () => {
      const invalidData = {
        name: "",
        lastName: "Иванов",
      };

      const result = authorSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty lastName", () => {
      const invalidData = {
        name: "Иван",
        lastName: "",
      };

      const result = authorSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
