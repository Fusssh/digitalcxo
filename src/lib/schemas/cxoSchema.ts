import { z } from "zod";

export const cxoMembershipSchema = z.object({
  title: z.enum(["Mr.", "Ms.", "Mrs.", "Dr."], {
    errorMap: () => ({ message: "Please select your title" })
  }),
  firstName: z.string().min(2, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  officialEmail: z.string().email("Please enter a valid official email address"),
  mobile: z.string().min(10, "Please enter a valid mobile / WhatsApp number"),
  organization: z.string().min(2, "Organization name is required"),
  designation: z.string().min(2, "Designation is required"),
  country: z.string().min(1, "Please choose a country"),
  state: z.string().min(1, "Please choose a state"),
  city: z.string().min(1, "Please choose a city"),
  linkedin: z.string().min(2, "Please enter your LinkedIn profile URL or 'NA'"),
  organizationWebsite: z.string().optional(),
  boardExperience: z.string().optional(),
  leadershipExperience: z.string().optional(),
  contributeVia: z.string().min(2, "Please specify how you would like to contribute"),
  strategicInterests: z.string().min(2, "Please enter your strategic areas of interest"),
  industry: z.string().min(2, "Please select or specify your industry"),
  preferredModeOfEngagement: z.string().min(1, "Please select preferred mode of engagement"),
  howDidYouHear: z.string().min(1, "Please tell us how you heard about us"),
  otherCxoNetworks: z.string().optional(),
  termsConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms and Conditions & Privacy Policy."
  }),
  accuracyConsent: z.boolean().refine((val) => val === true, {
    message: "You must confirm the information provided is accurate and consent to its use."
  })
});

export type CxoMembershipFormData = z.infer<typeof cxoMembershipSchema>;
