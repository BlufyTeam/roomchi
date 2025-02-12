import { createTransport } from "nodemailer";
import { prisma } from "~/server/db";

export async function getNodemailerTransport(adminConfig) {
  const smtpConfig = {
    host: adminConfig.smtpHost,
    port: adminConfig.smtpPort,
    secure: adminConfig.smtpSecure,
    auth: {
      user: adminConfig.smtpUser,
      pass: adminConfig.smtpPass,
    },
  };

  // console.log({ smtpConfig });

  return createTransport(smtpConfig);
}

type SendEmailInputType = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  companyId: string;
};
export async function sendEmail({
  to,
  subject,
  text,
  html,
  companyId,
}: SendEmailInputType) {
  try {
    const adminConfig = await getAdminConfig({ companyId });
    const transporter = await getNodemailerTransport(adminConfig);
    if (!adminConfig) return undefined;
    const info = await transporter.sendMail({
      from: adminConfig.emailFrom,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export interface AdminConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  emailFrom: string;
}
export async function getAdminConfig({ companyId }): Promise<AdminConfig> {
  const config = await prisma.mailConfig.findFirst({
    where: {
      company: {
        id: companyId,
      },
    },
  });

  return config;
}
