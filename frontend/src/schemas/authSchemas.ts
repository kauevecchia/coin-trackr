import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const registerFormSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(3, { message: "name must be at least 3 characters" }).max(24, { message: "name must be less than 24 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormInputs = z.infer<typeof loginFormSchema>;
export type RegisterFormInputs = z.infer<typeof registerFormSchema>;
