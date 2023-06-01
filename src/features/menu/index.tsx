import React, { useState } from "react";
import Link from "next/link";

import { motion } from "framer-motion";

import { useRouter } from "next/router";
import { getPathName } from "~/utils/util";

export default function Menu({ rootPath = "", list = [] }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const pathName = getPathName(router.asPath);

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
