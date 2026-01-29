import { z } from "zod";

export const postSchema = z.object({
  code: z.string().min(1, "Код обязателен"),
  title: z.string().min(1, "Заголовок обязателен"),
  text: z.string().min(1, "Текст обязателен"),
  authorId: z.number().min(1, "Выберите автора"),
  tagIds: z.array(z.number()).min(1, "Выберите хотя бы один тег"),
  previewPicture: z.any().optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
