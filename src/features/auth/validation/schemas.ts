import { z } from "zod";
import {
  sanitizeText,
  hasSuspiciousContent,
  ValidationErrorCodes,
  errorMsg,
} from "../../../shared/lib";

export const loginSchema = z.object({
  email: z
    .string()
    .email(errorMsg("Укажите корректный email адрес", ValidationErrorCodes.INVALID_EMAIL))
    .refine((val) => !hasSuspiciousContent(val), errorMsg("Обнаружено недопустимое содержимое", ValidationErrorCodes.SUSPICIOUS_CONTENT))
    .transform((email) => sanitizeText(email).toLowerCase().trim()),
  password: z
    .string()
    .min(8, errorMsg("Пароль должен содержать минимум 8 символов", ValidationErrorCodes.TOO_SHORT))
    .refine((val) => !hasSuspiciousContent(val), errorMsg("Обнаружено недопустимое содержимое", ValidationErrorCodes.SUSPICIOUS_CONTENT)),
});

export type LoginFormData = z.infer<typeof loginSchema>;
