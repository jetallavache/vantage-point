import { z } from "zod";
import {
  sanitizeText,
  hasSuspiciousContent,
  ValidationErrorCodes,
  errorMsg,
} from "../../../shared/lib";

export const authorSchema = z.object({
  name: z
    .string()
    .min(1, errorMsg("Укажите имя автора", ValidationErrorCodes.REQUIRED))
    .min(
      2,
      errorMsg(
        "Имя должно содержать минимум 2 символа",
        ValidationErrorCodes.TOO_SHORT
      )
    )
    .max(
      50,
      errorMsg(
        "Имя не должно превышать 50 символов",
        ValidationErrorCodes.TOO_LONG
      )
    )
    .refine(
      (val) => !hasSuspiciousContent(val),
      errorMsg(
        "Обнаружено недопустимое содержимое",
        ValidationErrorCodes.SUSPICIOUS_CONTENT
      )
    )
    .transform(sanitizeText),
  lastName: z
    .string()
    .min(1, errorMsg("Укажите фамилию автора", ValidationErrorCodes.REQUIRED))
    .min(
      2,
      errorMsg(
        "Фамилия должна содержать минимум 2 символа",
        ValidationErrorCodes.TOO_SHORT
      )
    )
    .max(
      50,
      errorMsg(
        "Фамилия не должна превышать 50 символов",
        ValidationErrorCodes.TOO_LONG
      )
    )
    .refine(
      (val) => !hasSuspiciousContent(val),
      errorMsg(
        "Обнаружено недопустимое содержимое",
        ValidationErrorCodes.SUSPICIOUS_CONTENT
      )
    )
    .transform(sanitizeText),
  secondName: z
    .string()
    .max(
      50,
      errorMsg(
        "Отчество не должно превышать 50 символов",
        ValidationErrorCodes.TOO_LONG
      )
    )
    .refine(
      (val) => !hasSuspiciousContent(val),
      errorMsg(
        "Обнаружено недопустимое содержимое",
        ValidationErrorCodes.SUSPICIOUS_CONTENT
      )
    )
    .transform(sanitizeText)
    .optional()
    .transform((val) => (val ? sanitizeText(val) : val)),
  shortDescription: z
    .string()
    .max(
      200,
      errorMsg(
        "Краткое описание не должно превышать 200 символов",
        ValidationErrorCodes.TOO_LONG
      )
    )
    .refine(
      (val) => !hasSuspiciousContent(val),
      errorMsg(
        "Обнаружено недопустимое содержимое",
        ValidationErrorCodes.SUSPICIOUS_CONTENT
      )
    )
    .transform(sanitizeText)
    .optional()
    .transform((val) => (val ? sanitizeText(val) : val)),
  description: z
    .string()
    .max(
      1000,
      errorMsg(
        "Описание не должно превышать 1000 символов",
        ValidationErrorCodes.TOO_LONG
      )
    )
    .refine(
      (val) => !hasSuspiciousContent(val),
      errorMsg(
        "Обнаружено недопустимое содержимое",
        ValidationErrorCodes.SUSPICIOUS_CONTENT
      )
    )
    .transform(sanitizeText)
    .optional()
    .transform((val) => (val ? sanitizeText(val) : val)),
  removeAvatar: z.boolean().optional(),
});

export type AuthorFormData = z.infer<typeof authorSchema>;
