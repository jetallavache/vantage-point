import { describe, it, expect, vi } from "vitest";
import { message } from "antd";
import { showApiError } from "../shared/lib/error-handler";
import { ApiException } from "../shared/api/errors";

// Mock antd message
vi.mock("antd", () => ({
  message: {
    error: vi.fn(),
  },
}));

describe("Error Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show API error with message", () => {
    const error = new ApiException(400, "Bad request");

    showApiError(error);

    expect(message.error).toHaveBeenCalledWith("Bad request");
  });

  it("should show validation errors", () => {
    const error = new ApiException(422, "Validation failed", undefined, [
      { field: "name", message: "Name is required" },
      { field: "email", message: "Invalid email" },
    ]);

    showApiError(error);

    expect(message.error).toHaveBeenCalledWith("Validation failed");
    expect(message.error).toHaveBeenCalledWith("name: Name is required");
    expect(message.error).toHaveBeenCalledWith("email: Invalid email");
  });

  it("should show legacy errors", () => {
    const error = new ApiException(400, "Bad request", {
      name: ["Name is required"],
      email: ["Invalid email", "Email already exists"],
    });

    showApiError(error);

    expect(message.error).toHaveBeenCalledWith("Bad request");
    expect(message.error).toHaveBeenCalledWith("name: Name is required");
    expect(message.error).toHaveBeenCalledWith("email: Invalid email");
    expect(message.error).toHaveBeenCalledWith("email: Email already exists");
  });

  it("should handle regular Error", () => {
    const error = new Error("Something went wrong");

    showApiError(error);

    expect(message.error).toHaveBeenCalledWith("Something went wrong");
  });

  it("should handle unknown error", () => {
    const error = "Unknown error";

    showApiError(error);

    expect(message.error).toHaveBeenCalledWith("Произошла неизвестная ошибка");
  });
});
