import nodemailer from "nodemailer";
import {
  CONTACT_TO_EMAIL,
  topicLabel,
  type ContactFormData,
} from "./schema";

function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v || undefined;
}

function getSmtpConfig() {
  const host = cleanEnv(process.env.SMTP_HOST);
  const user = cleanEnv(process.env.SMTP_USER);
  const pass = cleanEnv(process.env.SMTP_PASS);
  const port = Number(cleanEnv(process.env.SMTP_PORT) ?? "465");
  if (!host || !user || !pass) return null;
  return {
    host,
    port: Number.isFinite(port) ? port : 465,
    secure: (cleanEnv(process.env.SMTP_SECURE) ?? "true") !== "false",
    user,
    pass,
    from: cleanEnv(process.env.SMTP_FROM) ?? user,
  };
}

function buildEmailBodies(data: ContactFormData) {
  const subject = `[AI Fitness Coach] ${topicLabel(data.topic)} — ${data.fullName}`;
  const text = [
    `New contact form message`,
    ``,
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Topic: ${topicLabel(data.topic)}`,
    ``,
    `Message:`,
    data.message,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 12px">New contact form message</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Topic:</strong> ${escapeHtml(topicLabel(data.topic))}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;border-left:3px solid #10b981;padding-left:12px">${escapeHtml(data.message)}</p>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendViaSmtp(data: ContactFormData): Promise<boolean> {
  const smtp = getSmtpConfig();
  if (!smtp) return false;

  const { subject, text, html } = buildEmailBodies(data);
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  await transporter.sendMail({
    from: `"AI Fitness Coach" <${smtp.from}>`,
    to: CONTACT_TO_EMAIL,
    replyTo: data.email,
    subject,
    text,
    html,
  });

  return true;
}

/** Zero-config fallback — first use asks you to confirm the inbox once. */
async function sendViaFormSubmit(data: ContactFormData): Promise<void> {
  const { subject } = buildEmailBodies(data);
  const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_TO_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      topic: topicLabel(data.topic),
      message: data.message,
      _subject: subject,
      _template: "table",
      _captcha: "false",
      _replyto: data.email,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Could not send message");
  }
}

export async function sendContactMessage(data: ContactFormData): Promise<void> {
  const sentSmtp = await sendViaSmtp(data);
  if (sentSmtp) return;
  await sendViaFormSubmit(data);
}
