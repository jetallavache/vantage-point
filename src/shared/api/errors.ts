export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  validationErrors?: Array<{ field: string; message: string }>;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
    public validationErrors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "ApiException";
  }
}

export const createApiError = (
  response: Response,
  data?: any
): ApiException => {
  let message = `HTTP ${response.status}`;
  let errors: Record<string, string[]> | undefined;
  let validationErrors: Array<{ field: string; message: string }> | undefined;

  if (data) {
    // 400 Bad Request format
    if (data.message) {
      message = data.message;
    }

    // 422 Validation errors format
    if (Array.isArray(data)) {
      validationErrors = data;
      message = "Ошибка валидации данных";
    }

    // Legacy errors format
    if (data.errors) {
      errors = data.errors;
    }
  }

  return new ApiException(response.status, message, errors, validationErrors);
};
