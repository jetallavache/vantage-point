import { DomainError } from "./domain-error";

interface ValidationErrorItem {
  field: string;
  message: string;
}

export const normalizeError = (error: unknown): DomainError => {
  if (!error || typeof error !== "object") {
    return { kind: "unknown", message: "Unexpected error" };
  }

  const err = error as any;

  /* 422 Validation errors: array of {field, message} */
  if (Array.isArray(err.data)) {
    const fields: Record<string, string> = {};
    err.data.forEach((item: ValidationErrorItem) => {
      if (item.field && item.message) {
        fields[item.field] = item.message;
      }
    });
    return { kind: "validation", fields };
  }

  /* 400 Bad Request: {message, ...} */
  if (err.status === 400 && err.data?.message) {
    return { kind: "form", message: err.data.message };
  }

  /* Fallback */
  return { kind: "unknown", message: "Unexpected error" };
};
