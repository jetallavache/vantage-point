import { describe, it, expect } from "vitest";
import {
  menuTypeSchema,
  menuItemSchema,
} from "../features/menu/validation/schemas";

describe("Menu Validation", () => {
  describe("menuTypeSchema", () => {
    it("should validate correct menu type data", () => {
      const validData = { id: "main-menu", name: "Main Menu" };
      expect(() => menuTypeSchema.parse(validData)).not.toThrow();
    });

    it("should reject empty name", () => {
      const invalidData = { id: "test", name: "" };
      expect(() => menuTypeSchema.parse(invalidData)).toThrow();
    });

    it("should reject empty id", () => {
      const invalidData = { id: "", name: "Test Menu" };
      expect(() => menuTypeSchema.parse(invalidData)).toThrow();
    });
  });

  describe("menuItemSchema", () => {
    it("should validate correct menu item data", () => {
      const validData = {
        typeId: "main-menu",
        name: "Home",
        parentId: null,
        url: "https://example.com",
        sort: 0,
      };
      expect(() => menuItemSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid URL", () => {
      const invalidData = {
        typeId: "main-menu",
        name: "External",
        url: "not-a-url",
        sort: 0,
      };
      expect(() => menuItemSchema.parse(invalidData)).toThrow();
    });

    it("should accept empty customUrl", () => {
      const validData = {
        typeId: "main-menu",
        name: "Home",
        url: "",
        sort: 0,
      };
      expect(() => menuItemSchema.parse(validData)).not.toThrow();
    });
  });
});
