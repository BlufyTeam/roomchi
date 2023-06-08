import { Room } from "@prisma/client";
import moment from "jalali-moment";

import {
  AppleIcon,
  BanIcon,
  PrinterIcon,
  BananaIcon,
  CalendarCheck,
  CalendarRangeIcon,
  CalendarSearchIcon,
  CherryIcon,
  CitrusIcon,
  CookieIcon,
  CroissantIcon,
  DoorOpenIcon,
  PersonStandingIcon,
  CastIcon,
  CalendarCheckIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { RoomStatus } from "~/types";
import ProjectorIcon from "~/ui/icons/projector";
import { RouterOutputs, api } from "~/utils/api";

export default function RoomsList() {
  const getRooms = api.room.getRoomsByCompanyId.useQuery();
  if (getRooms?.isLoading) return <RoomsListSkeleton />;
  if (getRooms?.data.length <= 0)
    return (
      <div className="flex flex-wrap items-center justify-center  ">
        اتاقی ساخته نشده است
      </div>
    );

  return (
    <div className=" grid gap-5 md:grid-cols-3 ">
      {getRooms.data.map((room) => {
        return (
          <>
            <RoomItem room={room} capicity={room.capacity} />
            {/* <RoomItem room={room} status="Open" capicity={15} filled={2} />
            <RoomItem room={room} status="Reserved" capicity={6} filled={2} />
            <RoomItem room={room} status="Reserved" capicity={15} filled={15} />
            <RoomItem room={room} status="Reserved" capicity={10} filled={9} />
            <RoomItem room={room} status="Reserved" capicity={7} filled={1} />
            <RoomItem room={room} status="Open" capicity={5} filled={0} />
            <RoomItem room={room} status="Open" capicity={10} filled={5} />
            <RoomItem room={room} status="Open" capicity={10} filled={5} />
            <RoomItem room={room} status="Ocupied" capicity={10} filled={5} />
            <RoomItem room={room} status="Ocupied" capicity={10} filled={5} />
            <RoomItem room={room} status="Reserved" capicity={10} filled={5} />
            <RoomItem room={room} status="Ocupied" capicity={10} filled={5} />
            <RoomItem room={room} status="Open" capicity={10} filled={5} /> */}
          </>
        );
      })}
    </div>
  );
}

function RoomItem({
  room,
  status,
  capicity = 10,
}: {
  room: Room;
  status?: RoomStatus;
  capicity?: number;
}) {
  return (
    <>
      <div className="flex  cursor-pointer  flex-col gap-5 rounded-xl border border-primary/30 bg-secondary p-5 text-primary backdrop-blur-md transition-colors hover:border-primary">
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-start justify-between gap-5">
            <div className="relative h-10 w-10">
              <Image
                className=" rounded-full p-[2px] ring-1 ring-primary"
                src={"/images/default-door.png"}
                alt=""
                fill
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold">{room.title}</h3>
              <span className="text-sm">{room.description}</span>
            </div>
          </div>
        </div>
        <div className=" flex  flex-row  items-start justify-between  gap-2">
          <div className=" flex w-40 flex-wrap  items-center justify-start  gap-2">
            {[...Array(capicity).keys()].map((i) => {
              return (
                <>
                  <PersonStandingIcon
                    key={i}
                    className={`stroke-gray-400`}
                    style={{
                      animationDelay: `${i * 5}`,
                      animationDuration: "1s",
                    }}
                  />
                </>
              );
            })}
          </div>
          <div className="grid grid-cols-3 items-center justify-end gap-2">
            <PrinterIcon />
            <CastIcon />
            <ProjectorIcon />
          </div>
        </div>
        <span>{room.price} تومان</span>
      </div>
    </>
  );
}

function RoomsListSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 ">
      {[...Array(32).keys()].map((i) => {
        return (
          <>
            <span
              key={i}
              className="inline-block h-28 w-28 animate-pulse   rounded-xl bg-accent opacity-30"
              style={{
                animationDelay: `${i * 5}`,
                animationDuration: "1s",
              }}
            />
          </>
        );
      })}
    </div>
  );
}
