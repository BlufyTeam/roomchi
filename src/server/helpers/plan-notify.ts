import { Plan, Room } from "@prisma/client";
import moment from "moment";
import { z } from "zod";
import { sendEmail } from "~/lib/mail/nodemailer-config";

export const sendPlanNotificationEmail = async (
  ctx,
  plan: Plan & { room?: Room },
  subject: string,
  message: string
) => {
  // Fetch users for the specified company
  const companiesUsers = await ctx.prisma.user.findMany({
    where: {
      companyId: ctx.session.user.companyId,
      OR: [{ email: { not: null } }, { email: { not: "" } }],
    },
    select: { email: true },
  });

  // Filter out invalid emails
  const getValidEmails = companiesUsers.filter(
    (a) => z.string().email().safeParse(a.email).success
  );

  // Prepare time range for the message
  const timeStart = moment(plan.start_datetime, "YYYY/MM/DD HH:mm");
  const timeEnd = moment(plan.end_datetime, "YYYY/MM/DD HH:mm");

  // Construct the message text
  let text = `${message}\nاز ${timeStart} تا ${timeEnd}`;
  text += ` اتاق ${plan?.room?.title}`;

  // Send email to valid users
  await sendEmail(getValidEmails.join(","), subject, text);
};

// Usage Example:
