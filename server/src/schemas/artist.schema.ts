import { z } from "zod";

export const artistRegistrationSchema = z.object({
  user_id: z.number({
    required_error: "User Id is required",
  }),
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(2, "Name must be 4-100 characters")
    .max(100, "Name must be 4-100 characters"),

  dob: z
    .string({
      required_error: "Date of Birth is required",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, must be YYYY-MM-DD"),

  gender: z.enum(["m", "f", "o"], {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be m, f, or o",
  }),

  address: z
    .string({
      required_error: "Address is required",
    })
    .trim()
    .max(500, "Address must not exceed 500 characters"),

  first_release_year: z.number({
    required_error: "First Release is required",
  }),

  no_of_albums_released: z.number({
    required_error: "No of albums released is required",
  }),
});

export const artistUpdateSchema = artistRegistrationSchema.partial();

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type IRegisterArtist = z.infer<typeof artistRegistrationSchema>;
export type IUpdateArtist = z.infer<typeof artistUpdateSchema>;
