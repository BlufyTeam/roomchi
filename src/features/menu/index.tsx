import React, { useEffect, useState } from "react";
import Link from "next/link";

import { motion } from "framer-motion";

import { usePathname } from "next/navigation";
import { getPathName } from "~/utils/util";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "~/context/language.context";

export default function Menu({ rootPath = "", list = [] }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const pathName = getPathName(usePathname());
  return (
    <motion.div
      className="group flex w-full cursor-pointer items-end  gap-3 overflow-hidden overflow-x-auto scrollbar-none md:w-fit"
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
              rootPath={rootPath}
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
  rootPath,
  onHover = () => {},
}) {
  const activeClass = "text-primary";
  return (
    <Link href={`${rootPath}/${link}`}>
      <div
        className={`relative z-0 rounded-sm px-5  pb-4 pt-2 text-sm ${
          isActive ? activeClass : "text-primary/50  hover:text-primary "
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

export function InPageMenu({
  className = "",
  value = -1,
  list = [],
  onChange = (value) => {},
}) {
  const [activeIndex, setActiveIndex] = useState(value);
  const { language } = useLanguage();
  const [items, setItems] = useState(
    list.map((item, i) => {
      if (value == i) return { name: item, isActive: true };
      return { name: item, isActive: false };
    })
  );
  useEffect(() => {
    setItems(
      list.map((item, i) => {
        if (value == i) return { name: item, isActive: true };
        return { name: item, isActive: false };
      })
    );
  }, [list]);
  const activeMonth = items.find((a) => a.isActive == true)?.name;

  return (
    <motion.div
      dir={language === "fa" ? "rtl" : "ltr"}
      className={twMerge(
        "group flex w-full cursor-pointer items-end  gap-3 overflow-hidden overflow-x-auto scrollbar-none md:w-fit",
        className
      )}
      onHoverEnd={() => {
        setActiveIndex(-1);
      }}
    >
      {items.map((item, i) => {
        return (
          <motion.span
            className="flex min-w-fit"
            key={i}
            onHoverStart={() => {
              setActiveIndex(i);
            }}
            onClick={() => {
              setItems((prev: any) => {
                return prev.map((a) => {
                  if (a.name === item.name) a.isActive = true;
                  else a.isActive = false;
                  return a;
                });
              });
              onChange(i);
            }}
          >
            <InPageMenuItem
              text={item.name}
              isHovered={activeIndex === i}
              isActive={item.name === activeMonth}
            />
          </motion.span>
        );
      })}
    </motion.div>
  );
}

function InPageMenuItem({ text, isHovered = false, isActive = false }) {
  const activeClass = "text-primary";
  return (
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
          layoutId="bg-follower-inpage"
          className="absolute inset-0 -z-10 h-[80%] rounded-md bg-primbuttn/30 opacity-0 transition-opacity duration-1000 group-hover:opacity-100 "
        />
      )}

      {isActive && (
        <>
          <motion.div
            layoutId="underline-inpage"
            className="absolute -bottom-[2px] left-0 -z-10 h-[3px]  w-full  rounded-full bg-primbuttn"
          />
          <motion.div
            transition={{
              duration: 0.15,
            }}
            layoutId="bg-follower-inpage"
            className="absolute inset-0 -z-10 h-[80%] rounded-md bg-primbuttn/30  transition-opacity duration-1000  "
          />
        </>
      )}

      <span className=" duration-100 ">{text}</span>
    </div>
  );
}
