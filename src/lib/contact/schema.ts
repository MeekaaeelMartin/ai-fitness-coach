import { z } from "zod";

export const CONTACT_TOPICS = [
  { value: "enquiries", label: "Enquiries" },
  { value: "support", label: "Support" },
  { value: "website-feedback", label: "Make our website better / advice" },
  { value: "billing", label: "Billing & subscriptions" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const;

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid phone number")
    .max(30, "Phone number is too long"),
  topic: z.enum(
    [
      "enquiries",
      "support",
      "website-feedback",
      "billing",
      "partnership",
      "other",
    ],
    { message: "Select a topic" }
  ),
  message: z
    .string()
    .trim()
    .min(10, "Please write a short message (at least 10 characters)")
    .max(5000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const CONTACT_TO_EMAIL = "meekaaeelm2@gmail.com";

export function topicLabel(topic: ContactFormData["topic"]): string {
  return CONTACT_TOPICS.find((t) => t.value === topic)?.label ?? topic;
}
