import { describe, it, expect } from "vitest";
import { normalizeError } from "../error-normalizer";

describe("normalizeError", () => {
  it("should normalize 422 validation errors", () => {
    const error = {
      status: 422,
      data: [
        { field: "email", message: "Email is required" },
        { field: "password", message: "Password is too short" },
      ],
    };

    const result = normalizeError(error);

    expect(result).toEqual({
      kind: "validation",
      fields: {
        email: "Email is required",
        password: "Password is too short",
      },
    });
  });

  it("should normalize 400 bad request errors", () => {
    const error = {
      status: 400,
      data: {
        message: "Invalid request data",
        code: "BAD_REQUEST",
      },
    };

    const result = normalizeError(error);

    expect(result).toEqual({
      kind: "form",
      message: "Invalid request data",
    });
  });

  it("should return unknown error for other status codes", () => {
    const error = {
      status: 500,
      data: { message: "Internal server error" },
    };

    const result = normalizeError(error);

    expect(result).toEqual({
      kind: "unknown",
      message: "Unexpected error",
    });
  });

  it("should handle null error", () => {
    const result = normalizeError(null);

    expect(result).toEqual({
      kind: "unknown",
      message: "Unexpected error",
    });
  });

  it("should handle undefined error", () => {
    const result = normalizeError(undefined);

    expect(result).toEqual({
      kind: "unknown",
      message: "Unexpected error",
    });
  });

  it("should handle non-object error", () => {
    const result = normalizeError("string error");

    expect(result).toEqual({
      kind: "unknown",
      message: "Unexpected error",
    });
  });

  it("should handle validation errors with missing fields", () => {
    const error = {
      status: 422,
      data: [
        { field: "email", message: "Email is required" },
        { field: "", message: "Empty field" },
        { message: "No field" },
      ],
    };

    const result = normalizeError(error);

    expect(result).toEqual({
      kind: "validation",
      fields: {
        email: "Email is required",
      },
    });
  });

  it("should handle 400 without message", () => {
    const error = {
      status: 400,
      data: {},
    };

    const result = normalizeError(error);

    expect(result).toEqual({
      kind: "unknown",
      message: "Unexpected error",
    });
  });
});
