import { Room } from "@prisma/client";
import React from "react";
import { api } from "~/utils/api";

export default function RoomsList() {
  const getRooms = api.room.getRoomsByCompanyId.useQuery();
  if (getRooms.isLoading) return <RoomsListSkeleton />;
  if (getRooms.data.length <= 0)
    return (
      <div className="flex flex-wrap items-center justify-center  ">
        اتاقی ساخته نشده است
      </div>
    );
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 ">
      {getRooms.data.map((room) => {
        return (
          <>
            <RoomItem room={room} />
          </>
        );
      })}
    </div>
  );
}

function RoomItem({ room }: { room: Room }) {
  return (
    <>
      <div className="bg-accent">
        <span>{room.title}</span>
        <span>{room.description}</span>
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
