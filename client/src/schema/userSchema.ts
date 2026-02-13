import { z } from "zod";

const baseUserSchema = z.object({
  first_name: z.string().trim().min(1, "Required"),

  last_name: z.string().trim().min(1, "Required"),

  email: z.string().trim().email("Invalid email format").min(1, "Required"),

  password: z
    .string()
    .trim()
    .regex(/[@$!%*?&]/, "Must contain a special character")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .min(8, "Password must be at least 8 characters")
    .min(1, "Required"),
  phone: z.string().trim().min(1, "Required"),

  dob: z.string().trim().min(1, "Required"),

  gender: z.string().trim().min(1, "Required"),

  address: z.string().trim().min(1, "Required"),
  role: z.string().trim().min(1, "Required"),
});

export const userRegistrationSchema = baseUserSchema
  .extend({
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userLoginSchema = z.object({
  email: baseUserSchema.shape.email,
  password: baseUserSchema.shape.password,
});

export const userUpdateSchema = baseUserSchema.partial();

export type IRegisterUser = z.infer<typeof userRegistrationSchema>;
export type ILoginUser = z.infer<typeof userLoginSchema>;
export type IUpdateUser = z.infer<typeof userUpdateSchema>;
