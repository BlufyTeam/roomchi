import React from "react";
import AdminMainLayout from "~/pages/admin/layout";

import { Container } from "~/ui/containers";

import SettingsLayout from "~/pages/admin/settings/layout";
import { useLanguage } from "~/context/language.context";
import ActiveDirectoryForm from "~/pages/admin/settings/active-directory/form";
import ActiveDirectoryUsersList from "~/pages/admin/settings/active-directory/list";

export default function ActiveDirectoryPage() {
  const { t } = useLanguage();
  return (
    <SettingsLayout>
      <h2 className="text-2xl text-primary">{t.activeDirectory}</h2>
      <Container className="flex max-w-3xl flex-col items-stretch gap-10 py-10 ">
        <ActiveDirectoryForm />
      </Container>
      <ActiveDirectoryUsersList />
    </SettingsLayout>
  );
}
