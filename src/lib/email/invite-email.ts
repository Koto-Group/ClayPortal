import nodemailer from "nodemailer";
import type { CompanyRecord } from "@/lib/types";

const getTransport = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD
        ? {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
          }
        : undefined
  });

export const sendInviteEmail = async (input: {
  company: CompanyRecord;
  email: string;
  inviteUrl: string;
  invitedByEmail: string;
}) => {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP_HOST is not configured; invite email skipped.");
    return;
  }

  await getTransport().sendMail({
    from: process.env.SMTP_FROM || "ClayPortal <no-reply@clayportal.ai>",
    to: input.email,
    subject: `You have been invited to ${input.company.name}`,
    text: [
      `You have been invited to join ${input.company.name} in ClayPortal.`,
      ``,
      `Open your invite: ${input.inviteUrl}`,
      ``,
      `Sent by ${input.invitedByEmail}`
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
        <h1 style="font-size: 24px;">Join ${input.company.name}</h1>
        <p>You have been invited to access your ClayPortal workspace.</p>
        <p>
          <a href="${input.inviteUrl}" style="display: inline-block; padding: 12px 18px; background: #0f766e; color: #ffffff; text-decoration: none; border-radius: 999px;">
            Accept invite
          </a>
        </p>
        <p style="font-size: 14px; color: #475569;">Sent by ${input.invitedByEmail}</p>
      </div>
    `
  });
};
