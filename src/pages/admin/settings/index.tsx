import React from "react";
import AdminMainLayout from "~/pages/admin/layout";
import TextField from "~/ui/forms/text-field";
import withLabel from "~/ui/forms/with-label";

const TextFieldWithLable = withLabel(TextField);

export default function SettingsPage() {
  return (
    <AdminMainLayout>
      <span className="text-primary">Settings</span>
      <div className="relative">{/* <TextFieldWithLable label="نام" /> */}</div>
    </AdminMainLayout>
  );
}
