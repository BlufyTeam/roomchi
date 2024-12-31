import { createTransport } from "nodemailer";
import { getAdminConfig } from "~/server/api/routers/mail";

export async function getNodemailerTransport() {
  const adminConfig = await getAdminConfig();

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

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  try {
    const transporter = await getNodemailerTransport();
    const adminConfig = await getAdminConfig();
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
