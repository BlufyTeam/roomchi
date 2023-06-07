import { Moment } from "jalali-moment";
import React from "react";
import RoomsList from "~/features/rooms-list";
import { api } from "~/utils/api";
type Props = {
  date: Moment;
};
export default function PlanRooms({ date }: Props) {
  const getRooms = api.room.getReservedRoomsByDate.useQuery();
  if (getRooms.isLoading) return <>loaidng</>;
  return (
    <div className="p-5">
      <RoomsList />
    </div>
  );
}
