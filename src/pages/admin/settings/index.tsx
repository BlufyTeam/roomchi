import React from "react";

import SettingsLayout from "~/pages/admin/settings/layout";

import TextField from "~/ui/forms/text-field";
import withLabel from "~/ui/forms/with-label";

const TextFieldWithLable = withLabel(TextField);
const menuList = [
  {
    value: "پروفایل",
    link: "profile",
  },
  {
    value: "شرکت",
    link: "company",
  },
];

export default function SettingsPage() {
  return <SettingsLayout>hi</SettingsLayout>;
}
