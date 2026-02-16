import { z } from "zod";
import {
  sanitizeText,
  hasSuspiciousContent,
  ValidationErrorCodes,
  errorMsg,
} from "../../../shared/lib";

export const postSchema = z.object({
  code: z
    .string()
    .regex(/^\d+$/, errorMsg("Код должен содержать только цифры", ValidationErrorCodes.DIGITS_ONLY))
    .min(1, errorMsg("Укажите код статьи", ValidationErrorCodes.REQUIRED))
    .max(5, errorMsg("Код должен быть от 1 до 99999", ValidationErrorCodes.OUT_OF_RANGE)),
  title: z
    .string()
    .min(1, errorMsg("Укажите название статьи", ValidationErrorCodes.REQUIRED))
    .max(400, errorMsg("Название не должно превышать 400 символов", ValidationErrorCodes.TOO_LONG))
    .refine((val) => !hasSuspiciousContent(val), errorMsg("Обнаружено недопустимое содержимое", ValidationErrorCodes.SUSPICIOUS_CONTENT))
    .transform(sanitizeText),
  text: z
    .string()
    .min(10, errorMsg("Текст статьи должен содержать минимум 10 символов", ValidationErrorCodes.TOO_SHORT))
    .max(1500, errorMsg("Текст статьи не должен превышать 1500 символов", ValidationErrorCodes.TOO_LONG))
    .refine((val) => !hasSuspiciousContent(val), errorMsg("Обнаружено недопустимое содержимое", ValidationErrorCodes.SUSPICIOUS_CONTENT))
    .transform(sanitizeText),
  authorId: z.number().min(1, errorMsg("Выберите автора статьи", ValidationErrorCodes.NO_SELECTION)),
  tagIds: z.array(z.number()).min(1, errorMsg("Выберите хотя бы один тег", ValidationErrorCodes.MIN_SELECTION)),
  previewPicture: z.any().optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
