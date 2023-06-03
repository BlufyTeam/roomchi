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

const menuList = [
  {
    value: "پروفایل",
    link: "profile",
  },
  {
    value: "تنظیمات",
    link: "settings",
  },
  {
    value: "اتاق ها",
    link: "rooms",
  },
  {
    value: "کاربر ها",
    link: "users",
    description: `در این بخش می توانید کاربر های مد نظر خود را بسازید، ویرایش کنید و
    یا حذف کنید و تنظیمات مربوط به آن ها را تغییر دهید`,
  },

  {
    value: "رنگ",
    link: "theme",
  },
];

export default function AdminMainLayout({ children }: any): any {
  const router = useRouter();
  const session = useSession();
  const { isOnline, isDesktop } = useStatus();

  if (session.status === "loading") return "loading";

  const currentMenuItem = menuList.find(
    (a) => a.link == getPathName(router.asPath)
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-secondary ">
      <Container className="flex w-full items-center justify-center ">
        <BlurBackground />

        <Container className="flex  flex-col ">
          <div
            className="flex flex-col items-center justify-between gap-5  py-8 md:flex-row"
            dir="rtl"
          >
            <div className="flex flex-col  items-center justify-center gap-2 md:flex-row">
              <div>
                <Link href={"/admin"} className="text-accent">
                  {isDesktop ? "💻" : "📱"} {session.data.user.name}
                </Link>
                <span className="text-accent/80">
                  {currentMenuItem && " / " + currentMenuItem.value}
                </span>
              </div>
              <ThemeBox />
            </div>

            <div className="flex items-center justify-center gap-5 ">
              <Button className="cursor-pointer rounded-full stroke-accent p-1.5  ring-1 ring-accent hover:bg-accent/50 hover:stroke-primary hover:ring-accent/50">
                <NotificationIcon className="h-4 w-4  " />
              </Button>
              <Button
                onClick={() => signOut()}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full stroke-white p-1.5 text-primary  hover:bg-accent/50 hover:stroke-primary hover:ring-accent/50"
              >
                <ExitIcon className="h-4 w-4" />
                <span className="hidden text-sm text-primary md:flex">
                  خروج
                </span>
              </Button>

              {session.data.user.company && (
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
          <Menu rootPath={"/admin"} list={menuList} />
        </Container>
      </ContainerBottomBorder>
      {currentMenuItem && (
        <LayoutSubContainer currentMenuItem={currentMenuItem} />
      )}

      {children}
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
