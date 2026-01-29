import { z } from "zod";

export const authorSchema = z.object({
  name: z
    .string()
    .min(1, "Имя обязательно")
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя не должно превышать 50 символов"),
  lastName: z
    .string()
    .min(1, "Фамилия обязательна")
    .min(2, "Фамилия должна содержать минимум 2 символа")
    .max(50, "Фамилия не должна превышать 50 символов"),
  secondName: z
    .string()
    .max(50, "Отчество не должно превышать 50 символов")
    .optional(),
  shortDescription: z
    .string()
    .max(200, "Краткое описание не должно превышать 200 символов")
    .optional(),
  description: z
    .string()
    .max(1000, "Описание не должно превышать 1000 символов")
    .optional(),
});

export type AuthorFormData = z.infer<typeof authorSchema>;
