import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatPublishDate } from "../shared/lib/date-utils";

describe("formatPublishDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-26T14:32:03.639+07:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("возвращает 'сегодня' для поста созданного сегодня", () => {
    const result = formatPublishDate("2026-02-26T10:00:00.000Z");
    expect(result).toBe("сегодня");
  });

  it("возвращает 'вчера' для поста созданного вчера", () => {
    const result = formatPublishDate("2026-02-25T10:00:00.000Z");
    expect(result).toBe("вчера");
  });

  it("возвращает '2 дня назад' для поста созданного 2 дня назад", () => {
    const result = formatPublishDate("2026-02-24T10:00:00.000Z");
    expect(result).toBe("2 дня назад");
  });

  it("возвращает '3 дня назад' для поста созданного 3 дня назад", () => {
    const result = formatPublishDate("2026-02-23T10:00:00.000Z");
    expect(result).toBe("3 дня назад");
  });

  it("возвращает '4 дня назад' для поста созданного 4 дня назад", () => {
    const result = formatPublishDate("2026-02-22T10:00:00.000Z");
    expect(result).toBe("4 дня назад");
  });

  it("возвращает '5 дней назад' для поста созданного 5 дней назад", () => {
    const result = formatPublishDate("2026-02-21T10:00:00.000Z");
    expect(result).toBe("5 дней назад");
  });

  it("возвращает '7 дней назад' для поста созданного 7 дней назад", () => {
    const result = formatPublishDate("2026-02-19T10:00:00.000Z");
    expect(result).toBe("7 дней назад");
  });

  it("возвращает дату без года для поста созданного 8 дней назад в текущем году", () => {
    const result = formatPublishDate("2026-02-18T10:00:00.000Z");
    expect(result).toBe("18 февраля");
  });

  it("возвращает дату с годом для поста созданного в прошлом году", () => {
    const result = formatPublishDate("2025-12-12T10:00:00.000Z");
    expect(result).toBe("12 декабря 2025 г.");
  });
});
