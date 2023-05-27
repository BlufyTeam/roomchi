import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "~/ui/buttons";
import Link from "next/link";

import { LayoutGroup, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getPathName } from "~/utils/util";

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

  return (
    <div className="flex h-screen w-full flex-col items-center gap-10 bg-secondary ">
      <div className="flex w-full items-center justify-center border-b border-b-primary/20 ">
        <Container className="flex flex-col gap-5 ">
          <div className="py-8" dir="rtl">
            <span className="text-accent">
              {session.data.user.name} /{" "}
              {menuList.find((a) => a.link == getPathName(router.asPath)).value}
            </span>
          </div>

          <Menu list={menuList} />
        </Container>
      </div>

      {children}
    </div>
  );
}
function Container({ children, className = "", rtl = false }) {
  return (
    <div className={twMerge("w-11/12", className)} dir={rtl ? "rtl" : ""}>
      {children}
    </div>
  );
}

function Menu({ list = [] }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const pathName = getPathName(router.asPath);

  return (
    <LayoutGroup id="a">
      <motion.div
        className="relative flex w-fit cursor-pointer items-end justify-center gap-3 "
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
    </LayoutGroup>
  );
}

function MenuItem({
  text,
  link,
  isHovered = false,
  isActive = false,
  inital = false,
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
            transition={{ duration: 0.15 }}
            layoutId="bg-follower"
            initial={false}
            className="absolute inset-0 -z-10 h-[80%] rounded-md bg-primbuttn/30 "
          ></motion.div>
        )}

        {isActive && (
          <div className="absolute bottom-0 left-0 -z-10 h-[2px]  w-full  rounded-full bg-primbuttn " />
        )}

        <motion.span className=" duration-100 ">{text}</motion.span>
      </div>
    </Link>
  );
}
