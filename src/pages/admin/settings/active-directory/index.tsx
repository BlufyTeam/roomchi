import React from "react";
import AdminMainLayout from "~/pages/admin/layout";

import { Container } from "~/ui/containers";

import AdminNodemailerForm from "~/pages/admin/settings/mail/form";
import TestEmailForm from "~/pages/admin/settings/mail/test-send-email.form";
import ActiveDirectoryForm from "~/pages/admin/settings/active-directory/form";

export default function MailPage() {
  return (
    <AdminMainLayout>
      <Container className="flex max-w-3xl flex-col items-stretch gap-10 py-10 ">
        <ActiveDirectoryForm />
      </Container>
    </AdminMainLayout>
  );
}
