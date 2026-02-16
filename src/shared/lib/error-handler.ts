import { message } from "antd";
import { ApiException } from "../api/errors";

export const showApiError = (error: unknown) => {
  if (error instanceof ApiException) {
    message.error(error.message);

    if (error.validationErrors && error.validationErrors.length > 0) {
      error.validationErrors.forEach((validationError) => {
        message.error(`${validationError.field}: ${validationError.message}`);
      });
    }

    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((msg) => {
          message.error(`${field}: ${msg}`);
        });
      });
    }
  } else if (error instanceof Error) {
    message.error(error.message);
  } else {
    message.error("Произошла неизвестная ошибка");
  }
};
