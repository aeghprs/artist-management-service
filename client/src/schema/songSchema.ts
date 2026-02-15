import { z } from "zod";

export const songRegistrationSchema = z.object({
  title: z.string().trim().min(1, "Required"),

  album_name: z.string().trim().min(1, "Required"),
  genre: z.enum(["rnb", "classic", "country", "rock", "jazz"], {
    required_error: "Required",
    invalid_type_error: "Gender must be RNB, Classic, Country, Rock or Jazz",
  }),
});
