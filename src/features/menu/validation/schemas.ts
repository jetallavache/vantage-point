import { z } from "zod";
import {
  sanitizeText,
  hasSuspiciousContent,
  ValidationErrorCodes,
  errorMsg,
} from "../../../shared/lib";

export const menuTypeSchema = z.object({
  id: z
    .string()
    .min(1, errorMsg("Укажите ID типа меню", ValidationErrorCodes.REQUIRED))
    .refine(
      (val) => !hasSuspiciousContent(val),
      errorMsg(
        "Обнаружено недопустимое содержимое",
        ValidationErrorCodes.SUSPICIOUS_CONTENT
      )
    )
    .transform(sanitizeText),
  name: z
    .string()
    .min(
      1,
      errorMsg("Укажите название типа меню", ValidationErrorCodes.REQUIRED)
    )
    .refine(
      (val) => !hasSuspiciousContent(val),
      errorMsg(
        "Обнаружено недопустимое содержимое",
        ValidationErrorCodes.SUSPICIOUS_CONTENT
      )
    )
    .transform(sanitizeText),
});

export const menuItemSchema = z.object({
  typeId: z
    .string()
    .min(1, errorMsg("Укажите тип меню", ValidationErrorCodes.REQUIRED))
    .refine(
      (val) => !hasSuspiciousContent(val),
      errorMsg(
        "Обнаружено недопустимое содержимое",
        ValidationErrorCodes.SUSPICIOUS_CONTENT
      )
    )
    .transform(sanitizeText),
  parentId: z.string().nullable().optional(),
  name: z
    .string()
    .min(
      1,
      errorMsg("Укажите название пункта меню", ValidationErrorCodes.REQUIRED)
    )
    .refine(
      (val) => !hasSuspiciousContent(val),
      errorMsg(
        "Обнаружено недопустимое содержимое",
        ValidationErrorCodes.SUSPICIOUS_CONTENT
      )
    )
    .transform(sanitizeText),
  url: z.string().nullable().optional().or(z.literal("")),
  sort: z
    .number()
    .min(
      0,
      errorMsg(
        "Порядок сортировки не может быть отрицательным",
        ValidationErrorCodes.OUT_OF_RANGE
      )
    ),
});

export type MenuTypeFormData = z.infer<typeof menuTypeSchema>;
export type MenuItemFormData = z.infer<typeof menuItemSchema>;
