import { LayoutGroup } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import { useLanguage } from "~/context/language.context";
import Menu from "~/features/menu";
import AdminMainLayout from "~/pages/admin/layout";
import { Container, ContainerBottomBorder } from "~/ui/containers";
import TextField from "~/ui/forms/text-field";
import withLabel from "~/ui/forms/with-label";
import { translations } from "~/utils/translations";

export default function SettingsLayout({
  children = <></>,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();

  const menuList = [
    {
      value: t.mail,
      link: "settings/mail",
      description: "",
    },
    {
      value: t.mail,
      link: "settings/income-mail",
      description: "",
    },
    {
      value: t.activeDirectory,
      link: "settings/active-directory",
      description: "",
    },
  ];

  const { data, status } = useSession();
  const router = useRouter();
  if (status === "loading") return <></>;
  if (status !== "authenticated") redirect("/login");
  if (!data?.user) router.replace("/login");

  if (data?.user?.role !== "ADMIN")
    menuList.filter((menu) => menu.link === "company");
  return (
    <AdminMainLayout>
      <div className="flex min-h-screen w-full flex-col items-center gap-10 bg-secondary">
        {menuList.length > 0 && data?.user?.role === "ADMIN" && (
          <ContainerBottomBorder className=" sticky top-0 z-50 flex pt-2 backdrop-blur-lg">
            <Container className=" max2xl:w-full">
              <LayoutGroup id="profile-menu">
                <Menu rootPath="/admin/" list={menuList} />
              </LayoutGroup>
            </Container>
          </ContainerBottomBorder>
        )}
        {children}
      </div>
    </AdminMainLayout>
  );
}
