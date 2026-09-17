import { z } from "zod";

export const partnerMembershipSchema = z.object({
  title: z.enum(["Mr.", "Ms.", "Mrs.", "Dr."], {
    errorMap: () => ({ message: "Please select your title" })
  }),
  firstName: z.string().min(2, "First Name is required"),
  lastName: z.string().min(2, "Last Name is required"),
  email: z.string().email("Please enter a valid business email"),
  mobile: z.string().min(10, "Please enter a valid phone number"),
  organization: z.string().min(2, "Organization name is required"),
  designation: z.string().min(2, "Designation is required"),
  country: z.string().min(1, "Please choose a country"),
  state: z.string().min(1, "Please choose a state"),
  city: z.string().min(1, "Please choose a city"),
  presenceInIndia: z.enum(["Yes", "No", "Others"], {
    errorMap: () => ({ message: "Please choose presence in India" })
  }),
  preferredEngagementTypes: z.array(z.string()).min(1, "Please select at least one engagement type"),
  professionalConductConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to engage professionally and uphold ethical conduct."
  }),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to the collection and use of your business information."
  })
});

export type PartnerMembershipFormData = z.infer<typeof partnerMembershipSchema>;
