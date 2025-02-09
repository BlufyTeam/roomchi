import React, { useState } from "react";
import Button from "~/ui/buttons";
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getPathName } from "~/utils/util";
import { Container, ContainerBottomBorder } from "~/ui/containers";
import NotificationIcon from "~/ui/icons/notification";
import ExitIcon from "~/ui/icons/exits";
import Image from "next/image";
import Menu from "~/features/menu";
import BlurBackground from "~/ui/blur-backgrounds";
import ThemeBox from "~/features/theme-box";
import Company from "~/features/company";
import { api } from "~/utils/api";
import useStatus from "~/hooks/useStatus";
import { LayoutGroup } from "framer-motion";
import AdminSkeleton from "~/pages/admin/loading";
import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";

export default function AdminMainLayout({ children }: any): any {
  const router = useRouter();
  const session = useSession();
  const { language } = useLanguage();
  const t = translations[language];
  const { isOnline, isDesktop } = useStatus();
  const menuList = [
    {
      value: t.calendar,
      link: "",
    },
    {
      value: t.profile,
      link: "profile",
    },

    {
      value: t.rooms,
      link: "rooms",
    },
    {
      value: t.users,
      link: "users",
      description: t.userDescriptions,
    },
    {
      value: t.mail,
      link: "settings/mail",
      description: "",
    },
    {
      value: t.activeDirectory,
      link: "settings/active-directory",
      description: "",
    },
  ];

  if (session.status === "loading") return <AdminSkeleton />;

  const currentMenuItem = menuList.find(
    (a) => a.link == getPathName(router.asPath)
  );

  return (
    <div className="m-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center bg-secondary">
      <Container className="flex w-full items-center justify-center ">
        <BlurBackground />

        <Container className="flex  flex-col bg-secondary">
          <div
            className="flex flex-col items-center justify-between gap-5  py-8 md:flex-row"
            dir="rtl"
          >
            <div className="flex flex-col  items-center justify-center gap-2 md:flex-row">
              <div>
                <Link href={"/admin"} className="text-accent">
                  {isDesktop ? "💻" : "📱"} {session?.data?.user?.name}
                </Link>
                <span className="text-accent/80">
                  {currentMenuItem && " / " + currentMenuItem.value}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 ">
              <Button className="cursor-pointer rounded-full stroke-accent p-1.5  ring-1 ring-accent hover:bg-accent/50 hover:stroke-primary hover:ring-accent/50">
                <NotificationIcon className="h-4 w-4  " />
              </Button>
              <Button
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full stroke-white p-1.5 text-primary  hover:bg-accent/50 hover:stroke-primary hover:ring-accent/50"
              >
                <ExitIcon className="h-4 w-4" />
                <span className="hidden w-auto text-sm text-primary md:flex">
                  {t.exit}
                </span>
              </Button>

              {session?.data?.user?.company && (
                <>
                  <span className="text-primary">|</span>
                  <Company company={session.data.user.company} />
                </>
              )}
            </div>
          </div>
        </Container>
      </Container>
      <ContainerBottomBorder className=" sticky top-0 z-50 flex pt-2 backdrop-blur-lg">
        <Container className=" max2xl:w-full">
          <LayoutGroup id="main-menu">
            <Menu rootPath={"/admin"} list={menuList} />
          </LayoutGroup>
        </Container>
      </ContainerBottomBorder>
      {currentMenuItem && (
        <LayoutSubContainer currentMenuItem={currentMenuItem} />
      )}
      <ContainerBottomBorder className="h-full items-start bg-accent/5 ">
        {children}
      </ContainerBottomBorder>
    </div>
  );
}
function LayoutSubContainer({ currentMenuItem }) {
  return (
    <ContainerBottomBorder>
      <Container className="flex flex-col gap-5 px-5 py-10 ">
        <h1 className=" text-primary">{currentMenuItem.value}</h1>
        {currentMenuItem.description && (
          <p className="text-sm text-primbuttn">
            {currentMenuItem.description}
          </p>
        )}
      </Container>
    </ContainerBottomBorder>
  );
}
