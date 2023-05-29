import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "~/ui/buttons";
import Link from "next/link";

import { LayoutGroup, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getPathName } from "~/utils/util";
import { Container, ContainerBottomBorder } from "~/ui/containers";

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
    <div className="flex h-full w-full flex-col items-center bg-secondary ">
      <ContainerBottomBorder>
        <Container className="flex flex-col gap-5 ">
          <div className="py-8" dir="rtl">
            <Link href={"/admin"} className="text-accent">
              {session.data.user.name}
            </Link>
            <span className="text-accent/80">
              {currentMenuItem && " / " + currentMenuItem.value}
            </span>
          </div>

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
      className="group relative flex w-fit cursor-pointer items-end justify-center gap-3"
      onHoverEnd={() => {
        setActiveIndex(-1);
      }}
    >
      {list.map((item, i) => {
        return (
          <motion.span
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
