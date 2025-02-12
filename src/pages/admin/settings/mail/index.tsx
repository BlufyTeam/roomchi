import React from "react";
import AdminMainLayout from "~/pages/admin/layout";

import { Container } from "~/ui/containers";

import AdminNodemailerForm from "~/pages/admin/settings/mail/form";
import TestEmailForm from "~/pages/admin/settings/mail/test-send-email.form";
import SettingsLayout from "~/pages/admin/settings/layout";
import { useLanguage } from "~/context/language.context";

export default function MailPage() {
  const { t } = useLanguage();

  return (
    <SettingsLayout>
      <h2 className="text-2xl text-primary">{t.mail}</h2>
      <Container className="flex max-w-3xl flex-col items-stretch gap-10 py-10 ">
        <AdminNodemailerForm />
        <TestEmailForm />
      </Container>
    </SettingsLayout>
  );
}

// export async function getServerSideProps() {
//   const nodemailer = require("nodemailer");

//   const transporter = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 587,
//     secure: false, // true for port 465, false for other ports
//     auth: {
//       user: "980d751e0e24e6",
//       pass: "6bd07916a8f336",
//     },
//   });

//   const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//     to: "ali.hassanzadeh78@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);

//   return {
//     props: {},
//   };
// }
