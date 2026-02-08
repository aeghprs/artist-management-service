import { z } from "zod";

export const userRegistrationSchema = z.object({
  first_name: z
    .string({
      required_error: "First name is required",
    })
    .trim()
    .min(2, "First name must be 2-100 characters")
    .max(100, "First name must be 2-100 characters"),

  last_name: z
    .string({
      required_error: "Last name is required",
    })
    .trim()
    .min(2, "Last name must be 2-100 characters")
    .max(100, "Last name must be 2-100 characters"),

  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .email("Invalid email format"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character",
    ),

  phone: z
    .string({
      required_error: "Phone is required",
    })
    .trim(),

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

  role: z.enum(["super_admin", "artist_manager", "artist"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role",
  }),
});

export const userLoginSchema = userRegistrationSchema.pick({
  email: true,
  password: true,
});

export type IRegisterUser = z.infer<typeof userRegistrationSchema>;
export type ILoginUser = z.infer<typeof userLoginSchema>;
