"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Mail, Send } from "lucide-react";
import {
  CONTACT_TOPICS,
  contactFormSchema,
  type ContactFormData,
} from "@/lib/contact/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";

export function ContactFormSection() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      topic: "enquiries",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("idle");
    setServerError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not send your message");
      }
      setStatus("success");
      reset({
        fullName: "",
        email: "",
        phone: "",
        topic: "enquiries",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setServerError(
        error instanceof Error ? error.message : "Could not send your message"
      );
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
            <Mail className="h-6 w-6 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-4 text-foreground/60">
            Questions, support, or ideas to improve the site — send us a message
            and we&apos;ll get back to you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          <GlassCard className="!p-5 sm:!p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  placeholder="Your full name"
                  autoComplete="name"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="+27 82 000 0000"
                  autoComplete="tel"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Select
                  label="Topic"
                  options={CONTACT_TOPICS.map((topic) => ({
                    value: topic.value,
                    label: topic.label,
                  }))}
                  error={errors.topic?.message}
                  {...register("topic")}
                />
              </div>

              <Textarea
                label="Message"
                placeholder="How can we help?"
                rows={5}
                error={errors.message?.message}
                {...register("message")}
              />

              {status === "success" && (
                <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                  Message sent. We&apos;ll reply to your email soon.
                </p>
              )}
              {status === "error" && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full min-h-11 sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Sending…" : "Send message"}
              </Button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
