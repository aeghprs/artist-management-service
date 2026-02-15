import { z } from "zod";

export const artistRegistrationSchema = z.object({
  name: z.string().trim().min(1, "Required"),

  dob: z.string().trim().min(1, "Required"),
  gender: z.enum(["m", "f", "o"], {
    required_error: "Required",
    invalid_type_error: "Gender must be m, f, or o",
  }),

  address: z.string().trim().min(1, "Required"),

  first_release_year: z.coerce.number({
    required_error: "Required",
  }),

  no_of_albums_released: z.coerce.number({
    required_error: "Required",
  }),
});
