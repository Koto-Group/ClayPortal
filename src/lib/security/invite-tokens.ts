import crypto from "node:crypto";

export const createInviteToken = () => crypto.randomBytes(24).toString("hex");

export const hashInviteToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const inviteExpiresAt = (hours = 72) => {
  const expires = new Date();
  expires.setHours(expires.getHours() + hours);
  return expires.toISOString();
};
