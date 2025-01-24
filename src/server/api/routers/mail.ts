import Imap from "imap";
import ICAL from "ical.js";

import { simpleParser } from "mailparser";
import { z } from "zod";
import { getNodemailerTransport } from "~/lib/mail/nodemailer-config";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminAndSuperAdminProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {
  nodemailerConfigSchema,
  sendEmailSchema,
} from "~/server/validations/mail.validation";

export interface AdminConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  emailFrom: string;
}
const imapConfig: Imap.Config = {
  user: "sepehr.naderi@rouginedarou.com", // Your Gmail address
  password: "SeNa123", // Your Gmail App Password
  host: "mail.rouginedarou.com", // Gmail IMAP server
  port: 993, // IMAP port (usually 993 for SSL)
  tls: true, // Use TLS
};

// const DEFAULT_CONFIG: AdminConfig = {
//   smtpHost: "smtp.example.com",
//   smtpPort: 587,
//   smtpSecure: false,
//   smtpUser: "user@example.com",
//   smtpPass: "password",
//   emailFrom: "noreply@example.com",
// };
const emailSchema = z.object({
  id: z.string(),
  subject: z.string().nullable(),
  from: z.string().nullable(),
  date: z.string().nullable(),
  text: z.string().nullable(),
  html: z.string().nullable(),
});

// Define a Zod schema for the output of the query
const emailsOutputSchema = z.array(emailSchema);
export const mailRouter = createTRPCRouter({
  getAdminConfig: adminAndSuperAdminProcedure.query(async ({ input, ctx }) => {
    const config = await ctx.prisma.mailConfig.findFirst({
      orderBy: { created_at: "desc" },
    });
    return config;
  }),

  setAdminConfig: adminAndSuperAdminProcedure
    .input(nodemailerConfigSchema)
    .mutation(async ({ ctx, input }) => {
      const config = await ctx.prisma.mailConfig.findFirst({
        orderBy: { created_at: "desc" },
      });
      if (config) {
        return await ctx.prisma.mailConfig.update({
          where: {
            id: config.id,
          },
          data: {
            smtpHost: input.smtpHost,
            emailFrom: input.emailFrom,
            smtpPass: input.smtpPass,
            smtpPort: input.smtpPort,
            smtpSecure: input.smtpSecure,
            smtpUser: input.smtpUser,
          },
        });
      }
      return await ctx.prisma.mailConfig.create({
        data: {
          smtpHost: input.smtpHost,
          emailFrom: input.emailFrom,
          smtpPass: input.smtpPass,
          smtpPort: input.smtpPort,
          smtpSecure: input.smtpSecure,
          smtpUser: input.smtpUser,
        },
      });
    }),
  sendEmail: adminAndSuperAdminProcedure
    .input(sendEmailSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const transporter = await getNodemailerTransport();
        const adminConfig = await ctx.prisma.mailConfig.findFirst({
          orderBy: { created_at: "desc" },
        });
        const info = await transporter.sendMail({
          from: adminConfig.emailFrom,
          to: input.to,
          subject: input.subject,
          text: input.text,
          html: input.html,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    }),
  getLatestEmails: publicProcedure
    .input(z.object({ count: z.number().min(1).max(50).default(10) }))
    .query(async ({ input }) => {
      return fetchAppointmentEmails(input.count);
    }),
});

export async function getAdminConfig(): Promise<AdminConfig> {
  const config = await prisma.mailConfig.findFirst({
    orderBy: { created_at: "desc" },
  });

  return config;
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
type Email = {
  id: string;
  subject: string;
  from: string;
  date: string;
  text: string;
  html: string;
};
const fetchEmails = (count: number): Promise<Email[]> => {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once("ready", () => {
      imap.openBox("INBOX", true, (err, box) => {
        if (err) {
          reject(new Error("Failed to open inbox"));
          return;
        }

        const totalMessages = box.messages.total;
        const fetchCount = Math.min(totalMessages, count);

        // Fetch the last 'fetchCount' messages
        const f = imap.seq.fetch(
          `${totalMessages - fetchCount + 1}:${totalMessages}`,
          {
            bodies: "",
            markSeen: false,
          }
        );

        const emails: Email[] = [];
        let messagesProcessed = 0; // Track the number of processed messages

        f.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, (err, mail) => {
              if (err) {
                console.error("Error parsing email:", err);
                messagesProcessed++; // Increment even on error
                return;
              }

              emails.push({
                id: mail.messageId,
                subject: mail.subject,
                from: mail.from?.text,
                date: mail.date?.toISOString(), // Ensure date is in string format
                text: mail.text,
                html: typeof mail.html === "boolean" ? "" : mail.html,
              });
              messagesProcessed++; // Increment on successful parse
            });
          });
        });

        f.once("error", (err) => {
          reject(err);
        });

        f.once("end", () => {
          imap.end();
          // Wait until all messages are processed
          const checkInterval = setInterval(() => {
            if (messagesProcessed === fetchCount) {
              clearInterval(checkInterval);
              resolve(emails);
            }
          }, 100); // Check every 100ms
        });
      });
    });

    imap.once("error", (err) => {
      reject(err);
    });

    imap.connect();
  });
};
const fetchLastEmail = (): Promise<Email[]> => {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once("ready", () => {
      imap.openBox("INBOX", true, (err, box) => {
        if (err) {
          reject(new Error("Failed to open inbox"));
          return;
        }

        const totalMessages = box.messages.total;

        // If there are no messages, resolve with an empty array
        if (totalMessages === 0) {
          imap.end();
          resolve([]); // Return an empty array
          return;
        }

        // Fetch only the last message
        const f = imap.seq.fetch(`${totalMessages}`, {
          bodies: "",
          markSeen: false,
        });

        const lastEmail: Email[] = []; // Initialize as an array

        f.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, (err, mail) => {
              if (err) {
                console.error("Error parsing email:", err);
                return;
              }
              lastEmail.push({
                id: mail.messageId,
                subject: mail.subject,
                from: mail.from?.text,
                date: mail.date?.toISOString(), // Ensure date is in string format
                text: mail.text,
                html: typeof mail.html === "boolean" ? "" : mail.html,
              });
            });
          });
        });

        f.once("error", (err) => {
          reject(err);
        });

        f.once("end", () => {
          imap.end();
          resolve(lastEmail); // Resolve with the array containing the last email
        });
      });
    });

    imap.once("error", (err) => {
      reject(err);
    });

    imap.connect();
  });
};

const fetchAppointmentEmails = (count: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once("ready", () => {
      imap.openBox("INBOX", true, (err, box) => {
        if (err) {
          reject(new Error("Failed to open inbox"));
          return;
        }

        const totalMessages = box.messages.total;
        const fetchCount = Math.min(totalMessages, count); // Limit the fetch count

        // Fetch the last 'fetchCount' messages
        const f = imap.seq.fetch(
          `${totalMessages - fetchCount + 1}:${totalMessages}`,
          {
            bodies: "",
            markSeen: false,
          }
        );

        const appointments: any[] = [];
        let messagesProcessed = 0; // Track the number of processed messages

        f.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, (err, mail) => {
              if (err) {
                console.error("Error parsing email:", err);
                messagesProcessed++; // Increment even on error
                return;
              }

              // Check if the email has a calendar attachment or content
              const calendarContent = mail.attachments.find(
                (attachment) =>
                  attachment.contentType === "text/calendar" ||
                  attachment.contentType === "application/ics"
              );

              if (calendarContent) {
                // Parse the iCalendar data
                const icalData = calendarContent.content.toString();
                const jcalData = ICAL.parse(icalData);
                const comp = new ICAL.Component(jcalData);

                const event = comp.getFirstSubcomponent("vevent");
                if (event) {
                  const eventObj = new ICAL.Event(event);

                  // Extract details
                  const attendee = event.getFirstProperty("attendee");
                  const description = eventObj.description; // Test Body
                  const dtstart = eventObj.startDate.toString(); // 2025-01-25T14:00:00
                  const dtend = eventObj.endDate.toString(); // 2025-01-25T15:00:00
                  const location = eventObj.location; // Homay

                  console.log({
                    //     attendee,
                    description,
                    location,
                  });
                }
              }

              messagesProcessed++; // Increment on successful parse
            });
          });
        });

        f.once("error", (err) => {
          reject(err);
        });

        f.once("end", () => {
          imap.end();
          // Wait until all messages are processed
          const checkInterval = setInterval(() => {
            if (messagesProcessed === fetchCount) {
              clearInterval(checkInterval);
              resolve(appointments);
            }
          }, 100); // Check every 100ms
        });
      });
    });

    imap.once("error", (err) => {
      reject(err);
    });

    imap.connect();
  });
};
