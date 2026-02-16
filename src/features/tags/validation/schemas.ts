import { z } from "zod";
import {
  sanitizeText,
  hasSuspiciousContent,
  ValidationErrorCodes,
  errorMsg,
} from "../../../shared/lib";

export const tagSchema = z.object({
  code: z
    .string()
    .regex(/^\d+$/, errorMsg("Код должен содержать только цифры", ValidationErrorCodes.DIGITS_ONLY))
    .min(1, errorMsg("Укажите код тега", ValidationErrorCodes.REQUIRED))
    .min(2, errorMsg("Код должен содержать минимум 2 символа", ValidationErrorCodes.TOO_SHORT))
    .max(5, errorMsg("Код должен быть от 1 до 99999", ValidationErrorCodes.OUT_OF_RANGE)),
  name: z
    .string()
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, errorMsg("Код должен содержать только буквы", ValidationErrorCodes.LETTERS_ONLY))
    .min(1, errorMsg("Укажите название тега", ValidationErrorCodes.REQUIRED))
    .min(2, errorMsg("Название должно содержать минимум 2 символа", ValidationErrorCodes.TOO_SHORT))
    .max(50, errorMsg("Название не должно превышать 50 символов", ValidationErrorCodes.TOO_LONG))
    .refine((val) => !hasSuspiciousContent(val), errorMsg("Обнаружено недопустимое содержимое", ValidationErrorCodes.SUSPICIOUS_CONTENT))
    .transform(sanitizeText),
  sort: z
    .number()
    .min(0, errorMsg("Порядок сортировки не может быть отрицательным", ValidationErrorCodes.OUT_OF_RANGE))
    .max(100000, errorMsg("Порядок сортировки не должен превышать 100000", ValidationErrorCodes.OUT_OF_RANGE)),
});

export type TagFormData = z.infer<typeof tagSchema>;
