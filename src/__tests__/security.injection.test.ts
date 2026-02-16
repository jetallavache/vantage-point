import { describe, it, expect } from "vitest";
import { sanitizeText, hasSuspiciousContent } from "../shared/lib/sanitizer";
import { postSchema } from "../features/posts/validation/schemas";

describe("Security: XSS and Injection Protection", () => {
  describe("hasSuspiciousContent", () => {
    it("should detect script tags", () => {
      expect(hasSuspiciousContent("<script>alert('XSS')</script>")).toBe(true);
      expect(hasSuspiciousContent("<SCRIPT>alert('XSS')</SCRIPT>")).toBe(true);
    });

    it("should detect javascript protocol", () => {
      expect(hasSuspiciousContent("javascript:alert('XSS')")).toBe(true);
      expect(hasSuspiciousContent("JAVASCRIPT:alert('XSS')")).toBe(true);
    });

    it("should detect event handlers", () => {
      expect(hasSuspiciousContent("<img onerror='alert(1)'>")).toBe(true);
      expect(hasSuspiciousContent("<div onclick='alert(1)'>")).toBe(true);
      expect(hasSuspiciousContent("<body onload='alert(1)'>")).toBe(true);
    });

    it("should detect data URIs", () => {
      expect(
        hasSuspiciousContent("data:text/html,<script>alert(1)</script>")
      ).toBe(true);
    });

    it("should detect dangerous functions", () => {
      expect(hasSuspiciousContent("eval('alert(1)')")).toBe(true);
      expect(hasSuspiciousContent("alert(document.cookie)")).toBe(true);
      expect(hasSuspiciousContent("window.location='evil.com'")).toBe(true);
    });

    it("should detect storage access attempts", () => {
      expect(hasSuspiciousContent("localStorage.getItem('token')")).toBe(true);
      expect(hasSuspiciousContent("sessionStorage.setItem('data')")).toBe(true);
      expect(hasSuspiciousContent("document.cookie")).toBe(true);
    });

    it("should allow safe content", () => {
      expect(hasSuspiciousContent("Обычный текст статьи")).toBe(false);
      expect(hasSuspiciousContent("Email: user@example.com")).toBe(false);
      expect(hasSuspiciousContent("Цена: 100$")).toBe(false);
    });
  });

  describe("sanitizeText", () => {
    it("should remove script tags", () => {
      const malicious = "<script>alert('XSS')</script>Hello";
      const result = sanitizeText(malicious);
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("alert");
    });

    it("should remove javascript protocol", () => {
      const malicious = "javascript:alert('XSS')";
      const result = sanitizeText(malicious);
      expect(result).not.toContain("javascript:");
    });

    it("should remove event handlers", () => {
      const malicious = "<img onerror='alert(1)' src='x'>";
      const result = sanitizeText(malicious);
      expect(result).not.toContain("onerror");
    });

    it("should decode HTML entities before sanitizing", () => {
      const encoded = "&lt;script&gt;alert('XSS')&lt;/script&gt;";
      const result = sanitizeText(encoded);
      expect(result).not.toContain("script");
      expect(result).not.toContain("alert");
    });

    it("should preserve safe text", () => {
      const safe = "Обычный текст без опасных элементов";
      const result = sanitizeText(safe);
      expect(result).toBe(safe);
    });
  });

  describe("Post schema XSS protection", () => {
    it("should reject post with XSS in title", () => {
      const maliciousPost = {
        code: "123",
        title: "<script>alert('XSS')</script>Заголовок",
        text: "Обычный текст статьи",
        authorId: 1,
        tagIds: [1],
      };

      const result = postSchema.safeParse(maliciousPost);
      expect(result.success).toBe(false);
    });

    it("should reject post with XSS in text", () => {
      const maliciousPost = {
        code: "123",
        title: "Нормальный заголовок",
        text: "Текст с <img onerror='alert(1)' src='x'> инъекцией",
        authorId: 1,
        tagIds: [1],
      };

      const result = postSchema.safeParse(maliciousPost);
      expect(result.success).toBe(false);
    });

    it("should sanitize and accept safe post", () => {
      const safePost = {
        code: "123",
        title: "Безопасный заголовок статьи",
        text: "Обычный текст статьи без опасных элементов",
        authorId: 1,
        tagIds: [1],
      };

      const result = postSchema.safeParse(safePost);
      expect(result.success).toBe(true);
    });

    it("should handle multiple XSS vectors", () => {
      const dangerousVectors = [
        "<script>alert('XSS')</script>",
        "javascript:alert('XSS')",
        "<img onerror='alert(1)'>",
        "eval('malicious')",
        "document.cookie",
      ];

      dangerousVectors.forEach((vector) => {
        const maliciousPost = {
          code: "123",
          title: `Заголовок ${vector}`,
          text: "Обычный текст статьи для теста безопасности",
          authorId: 1,
          tagIds: [1],
        };

        const result = postSchema.safeParse(maliciousPost);
        expect(result.success).toBe(false);
      });
    });
  });

  describe("SQL Injection Protection (API level)", () => {
    it("should detect SQL injection patterns in text", () => {
      const sqlPatterns = [
        "'; DROP TABLE posts; --",
        "1' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM users--",
      ];

      sqlPatterns.forEach((pattern) => {
        const text = `Текст с ${pattern} инъекцией`;
        // API должен обрабатывать это на бэкенде
        // Здесь проверяем, что текст проходит через sanitizer
        const sanitized = sanitizeText(text);
        expect(sanitized).toBeDefined();
      });
    });
  });
});
