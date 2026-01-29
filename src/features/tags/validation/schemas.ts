import { z } from "zod";

export const tagSchema = z.object({
  code: z
    .string()
    .min(1, "Код обязателен")
    .min(2, "Код должен содержать минимум 2 символа")
    .max(20, "Код не должен превышать 20 символов"),
  name: z
    .string()
    .min(1, "Название обязательно")
    .min(2, "Название должно содержать минимум 2 символа")
    .max(50, "Название не должно превышать 50 символов"),
  sort: z.number().min(0, "Сортировка должна быть положительным числом"),
});

export type TagFormData = z.infer<typeof tagSchema>;
