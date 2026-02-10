import z from "zod";

export const musicRegistrationSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .trim()
    .min(2, "Title must be 4-100 characters")
    .max(100, "Title must be 4-100 characters"),

  album_name: z
    .string({
      required_error: "Album Name is required",
    })
    .trim()
    .min(2, "Album Name must be 4-100 characters")
    .max(100, "Album Name must be 4-100 characters"),

  genre: z.enum(["rnb", "country", "classic", "rock", "jazz"], {
    required_error: "Genre is required",
    invalid_type_error: "Genre must be rnb, country, classic, rock, jazz",
  }),
});

export const musicUpdateSchema = musicRegistrationSchema.partial();

export type IRegisterMusic = z.infer<typeof musicRegistrationSchema>;
export type IUpdateMusic = z.infer<typeof musicUpdateSchema>;
