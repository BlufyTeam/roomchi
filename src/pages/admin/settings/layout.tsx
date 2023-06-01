import React from "react";
import Menu from "~/features/menu";
import AdminMainLayout from "~/pages/admin/layout";
import { Container, ContainerBottomBorder } from "~/ui/containers";
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

export default function SettingsLayout({ children }) {
  return (
    <AdminMainLayout>
      <div className="flex min-h-screen w-full flex-col items-center gap-10 bg-secondary">
        <ContainerBottomBorder className=" sticky top-0 z-50 flex pt-2 backdrop-blur-lg">
          <Container className=" max2xl:w-full">
            <Menu rootPath="settings" list={menuList} />
          </Container>
        </ContainerBottomBorder>
        {children}
      </div>
    </AdminMainLayout>
  );
}
