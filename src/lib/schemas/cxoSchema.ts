import { z } from "zod";

export const cxoMembershipSchema = z.object({
  title: z.enum(["Mr.", "Ms.", "Mrs.", "Dr."], {
    errorMap: () => ({ message: "Please select title" })
  }),
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  officialEmail: z.string().email("Please enter a valid corporate email address"),
  mobile: z.string().min(8, "Please enter a valid mobile / WhatsApp number"),
  organization: z.string().min(1, "Organization name is required"),
  designation: z.string().min(1, "Designation is required"),
  country: z.string().min(1, "Please choose country"),
  state: z.string().min(1, "Please choose state"),
  city: z.string().min(1, "Please choose city"),
  linkedin: z.string().min(1, "Please enter LinkedIn profile URL or 'NA'"),
  organizationWebsite: z.string().optional(),
  boardExperience: z.string().optional(),
  leadershipExperience: z.string().optional(),
  contributeVia: z.string().min(1, "Please select contribution preference"),
  strategicInterests: z.string().min(1, "Please select strategic area of interest"),
  industry: z.string().min(1, "Please select industry"),
  termsConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Conditions and Privacy Policy."
  }),
  accuracyConsent: z.boolean().optional()
});

export type CxoMembershipFormData = z.infer<typeof cxoMembershipSchema>;
