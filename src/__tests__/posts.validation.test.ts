import { describe, it, expect } from "vitest";
import { postSchema } from "../features/posts/validation/schemas";

describe("Post Validation", () => {
  describe("postSchema", () => {
    it("should validate correct post data", () => {
      const validData = {
        code: "12345",
        title: "Test Post",
        text: "This is a test post with enough content",
        authorId: 1,
        tagIds: [1, 2],
      };
      expect(() => postSchema.parse(validData)).not.toThrow();
    });

    it("should reject non-numeric code", () => {
      const invalidData = {
        code: "abc",
        title: "Test",
        text: "Test content here",
        authorId: 1,
        tagIds: [1],
      };
      expect(() => postSchema.parse(invalidData)).toThrow();
    });

    it("should reject code longer than 5 digits", () => {
      const invalidData = {
        code: "123456",
        title: "Test",
        text: "Test content here",
        authorId: 1,
        tagIds: [1],
      };
      expect(() => postSchema.parse(invalidData)).toThrow();
    });

    it("should reject empty title", () => {
      const invalidData = {
        code: "123",
        title: "",
        text: "Test content here",
        authorId: 1,
        tagIds: [1],
      };
      expect(() => postSchema.parse(invalidData)).toThrow();
    });

    it("should reject text shorter than 10 characters", () => {
      const invalidData = {
        code: "123",
        title: "Test",
        text: "Short",
        authorId: 1,
        tagIds: [1],
      };
      expect(() => postSchema.parse(invalidData)).toThrow();
    });

    it("should reject invalid authorId", () => {
      const invalidData = {
        code: "123",
        title: "Test",
        text: "Test content here",
        authorId: 0,
        tagIds: [1],
      };
      expect(() => postSchema.parse(invalidData)).toThrow();
    });

    it("should reject empty tagIds", () => {
      const invalidData = {
        code: "123",
        title: "Test",
        text: "Test content here",
        authorId: 1,
        tagIds: [],
      };
      expect(() => postSchema.parse(invalidData)).toThrow();
    });
  });
});
