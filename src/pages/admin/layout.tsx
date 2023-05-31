import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "~/ui/buttons";
import Link from "next/link";

import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getPathName } from "~/utils/util";
import { Container, ContainerBottomBorder } from "~/ui/containers";
import NotificationIcon from "~/ui/icons/notification";
import ExitIcon from "~/ui/icons/exits";
import Image from "next/image";

const menuList = [
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
    value: "نظارت",
    link: "monitoring",
  },
  {
    value: "رنگ",
    link: "theme",
  },
];

export default function AdminMainLayout({ children }: any): any {
  const router = useRouter();
  const session = useSession();
  if (session.status === "loading") return "loading";

  const currentMenuItem = menuList.find(
    (a) => a.link == getPathName(router.asPath)
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-secondary ">
      <Container className="flex w-full items-center justify-center ">
        <div
          className="pointer-events-none absolute inset-x-0 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-400 to-accent opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <Container className="flex  flex-col ">
          <div
            className="flex flex-col items-center justify-between gap-5  py-8 md:flex-row"
            dir="rtl"
          >
            <div>
              <Link href={"/admin"} className="text-accent">
                {session.data.user.name}
              </Link>
              <span className="text-accent/80">
                {currentMenuItem && " / " + currentMenuItem.value}
              </span>
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
              <span className="text-primary">|</span>
              <div className="flex items-center justify-center gap-5 text-primary">
                <span className="text-sm">
                  {session.data.user.company.name}
                </span>
                <Image
                  src={session.data.user.company.logo_base64}
                  alt="logo"
                  className="rounded-full object-fill ring-2 ring-primary"
                  width={45}
                  height={45}
                />
              </div>
            </div>
          </div>
        </Container>
      </Container>
      <ContainerBottomBorder className=" sticky top-0 z-50 flex pt-2 backdrop-blur-lg">
        <Container className=" max2xl:w-full">
          <Menu list={menuList} />
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
function Menu({ list = [] }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const pathName = getPathName(router.asPath);

  return (
    <motion.div
      className="group  flex w-full cursor-pointer items-end  gap-3 overflow-hidden overflow-x-auto scrollbar-none md:w-fit"
      onHoverEnd={() => {
        setActiveIndex(-1);
      }}
    >
      {list.map((item, i) => {
        return (
          <motion.span
            className="flex min-w-fit"
            key={i}
            onHoverStart={() => {
              setActiveIndex(i);
            }}
          >
            <MenuItem
              text={item.value}
              link={item.link}
              isHovered={activeIndex === i}
              isActive={pathName === item.link}
            />
          </motion.span>
        );
      })}
    </motion.div>
  );
}

function MenuItem({
  text,
  link,
  isHovered = false,
  isActive = false,
  onHover = () => {},
}) {
  const activeClass = "text-primary";
  return (
    <Link href={`/admin/${link}`}>
      <div
        className={`relative z-0 rounded-sm px-5  pb-4 pt-2 text-sm ${
          isActive ? activeClass : "text-primary/50  hover:text-primary"
        } `}
      >
        {isHovered && (
          <motion.div
            transition={{
              duration: 0.15,
            }}
            layoutId="bg-follower"
            className="absolute inset-0 -z-10 h-[80%] rounded-md bg-primbuttn/30 opacity-0 transition-opacity duration-1000 group-hover:opacity-100 "
          />
        )}

        {isActive && (
          <motion.div
            layoutId="underline"
            className="absolute -bottom-[2px] left-0 -z-10 h-[3px]  w-full  rounded-full bg-primbuttn"
          />
        )}

        <span className=" duration-100 ">{text}</span>
      </div>
    </Link>
  );
}
