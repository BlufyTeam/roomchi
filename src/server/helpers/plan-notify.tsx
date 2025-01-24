import { Participant, Plan, Room, User } from "@prisma/client";
import { render } from "@react-email/components";
import moment from "moment";
import { z } from "zod";
import { sendEmail } from "~/lib/mail/nodemailer-config";
import PlanDetailsEmail from "~/templates/notify-users-email";
import { generateQRCode } from "~/utils/qr-code";

export const sendPlanNotificationEmail = async (
  ctx = undefined,
  plan: Plan & { room?: Room; participants: (Participant & { user: User })[] },
  subject: string,
  message: string,
  action: "CREATE" | "UPDATE" | "DELETE"
) => {
  // Fetch users for the specified company

  // const companiesUsers = await ctx.prisma.user.findMany({
  //   where: {
  //     companyId: ctx.session.user.companyId,
  //     OR: [{ email: { not: null } }, { email: { not: "" } }],
  //   },
  //   select: { email: true },
  // });

  // Filter out invalid emails
  const getValidEmails = plan.participants
    .map((a) => a.user)
    .filter((a) => z.string().email().safeParse(a.email).success)
    .map((a) => a.email);

  // Prepare time range for the message
  const timeStart = moment(plan.start_datetime)
    .locale("fa")
    .format("YYYY/MM/DD HH:mm");
  const timeEnd = moment(plan.end_datetime)
    .locale("fa")
    .format("YYYY/MM/DD HH:mm");

  // Construct the message text
  let text = `${message}\nاز ${timeStart} تا ${timeEnd}`;
  text += ` اتاق ${plan?.room?.title}`;
  text += "\n";
  text += plan.title;
  text += plan.is_confidential ? "محرمانه" : "";
  text += plan.title;
  text += "\n";
  text += plan.description;
  // const qrCodeDataUrl = await generateQRCode(plan.link);
  // console.log(plan.link);
  // console.log(qrCodeDataUrl);
  const emailHtml = await render(
    <PlanDetailsEmail
      planDescription={plan.description}
      planTitle={plan.title}
      planLink={plan.link}
      qrCodeDataUrl={""}
      roomTitle={plan.room?.title}
      startDateTime={timeStart}
      endDateTime={timeEnd}
      roomId={plan.roomId}
      withEnterButton={action === "DELETE" ? false : true}
    />
  );
  // Send email to valid users
  try {
    await sendEmail(getValidEmails.join(","), subject, "", emailHtml);
  } catch {}
};

// Usage Example:
