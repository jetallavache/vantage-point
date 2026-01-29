export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiException";
  }
}

export const createApiError = (
  response: Response,
  data?: any
): ApiException => {
  const message = data?.message || `HTTP ${response.status}`;
  const errors = data?.errors;

  return new ApiException(response.status, message, errors);
};
