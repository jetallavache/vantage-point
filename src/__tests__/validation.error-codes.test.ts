import { describe, it, expect } from "vitest";
import { postSchema } from "../features/posts/validation/schemas";
import { tagSchema } from "../features/tags/validation/schemas";
import { loginSchema } from "../features/auth/validation/schemas";

describe("Validation Error Messages with Codes", () => {
  it("should show error code for required field", () => {
    const result = postSchema.safeParse({
      code: "123",
      title: "",
      text: "Текст статьи для теста",
      authorId: 1,
      tagIds: [1],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("(001)");
      expect(result.error.issues[0].message).toContain("Укажите название статьи");
    }
  });

  it("should show error code for too long value", () => {
    const result = postSchema.safeParse({
      code: "123",
      title: "a".repeat(401),
      text: "Текст статьи для теста",
      authorId: 1,
      tagIds: [1],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("(101)");
      expect(result.error.issues[0].message).toContain("не должно превышать 400 символов");
    }
  });

  it("should show error code for suspicious content", () => {
    const result = postSchema.safeParse({
      code: "123",
      title: "Нормальный заголовок",
      text: "<script>alert('xss')</script>",
      authorId: 1,
      tagIds: [1],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("(002)");
      expect(result.error.issues[0].message).toContain("недопустимое содержимое");
    }
  });

  it("should show error code for digits only", () => {
    const result = tagSchema.safeParse({
      code: "abc",
      name: "Тег",
      sort: 1,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("(203)");
      expect(result.error.issues[0].message).toContain("только цифры");
    }
  });

  it("should show error code for invalid email", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("(200)");
      expect(result.error.issues[0].message).toContain("email");
    }
  });

  it("should show error code for no selection", () => {
    const result = postSchema.safeParse({
      code: "123",
      title: "Заголовок",
      text: "Текст статьи для теста",
      authorId: 0,
      tagIds: [1],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("(300)");
      expect(result.error.issues[0].message).toContain("Выберите автора");
    }
  });

  it("should show error code for min selection", () => {
    const result = postSchema.safeParse({
      code: "123",
      title: "Заголовок",
      text: "Текст статьи для теста",
      authorId: 1,
      tagIds: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("(302)");
      expect(result.error.issues[0].message).toContain("хотя бы один тег");
    }
  });
});
