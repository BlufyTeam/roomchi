import React from "react";
import { api } from "~/utils/api";

export default function RoomsList() {
  const getRooms = api.room.getRooms;
  return <div>rooms-list</div>;
}
