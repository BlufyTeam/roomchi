import { ReactNode, createContext, useContext, useState } from "react";
import { Room } from "@prisma/client";

type TRoomContext = {
  room: Room;
  setRoom: (room: Room) => void;

  selectedRowRoom: Room | undefined;
  setSelectedRowRoom: (room: Room) => void;
};

type RoomProviderProps = {
  children: ReactNode;
};
const RoomContext = createContext({} as TRoomContext);

export function useRoom() {
  return useContext(RoomContext);
}

export function RoomProvider({ children }: RoomProviderProps) {
  const [room, setRoom] = useState<Room>();

  const [selectedRowRoom, setSelectedRowRoom] = useState<Room | undefined>(
    undefined
  );

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        selectedRowRoom,
        setSelectedRowRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}
