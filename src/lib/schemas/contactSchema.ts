import { z } from "zod";

export const contactSchema = z.object({
  title: z.enum(["Mr.", "Ms.", "Mrs.", "Dr."], {
    errorMap: () => ({ message: "Please select title" })
  }),
  name: z.string().min(2, "Full Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message cannot exceed 500 characters"),
  honeypot: z.string().max(0, "Bot detected"),
  turnstileVerified: z.boolean().refine((val) => val === true, {
    message: "Please complete the security check"
  })
});

export type ContactFormData = z.infer<typeof contactSchema>;
