import { z } from "zod";

export const contactSchema = z.object({
  title: z.string(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().optional(),
  subject: z.string(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),
  phone: z.string().optional(),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message cannot exceed 1000 characters"),
  honeypot: z.string().optional(),
  turnstileVerified: z.boolean().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
