import React from "react";
import AdminMainLayout from "~/pages/admin/layout";

import { Container } from "~/ui/containers";

import SettingsLayout from "~/pages/admin/settings/layout";
import { useLanguage } from "~/context/language.context";
import AdminIncomeMailForm from "~/pages/admin/settings/income-mail/form";

export default function MailPage() {
  const { t } = useLanguage();
  return (
    <SettingsLayout>
      <h2 className="text-2xl text-primary">{t.IncomingMail}</h2>
      <Container className="flex max-w-3xl flex-col items-stretch gap-10 py-10 ">
        <AdminIncomeMailForm />
      </Container>
    </SettingsLayout>
  );
}
