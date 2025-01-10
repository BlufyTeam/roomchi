import { Room } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import { RoomProvider, useRoom } from "~/context/room.context";
import RoomsList from "~/features/rooms-list";
import AdminMainLayout from "~/pages/admin/layout";
import RoomForm from "~/pages/admin/rooms/form";

import { Container, ContainerBottomBorder } from "~/ui/containers";

export default function RoomsPage() {
  return (
    <AdminMainLayout>
      <Container className="flex flex-col-reverse items-stretch gap-10  py-10 2xl:flex-row ">
        <RoomProvider>
          <div className="sticky top-5 h-fit rounded-lg border border-accent/30 bg-secondary p-5 2xl:w-3/12">
            <RoomForm />
          </div>
          <RoomListWithContext />
        </RoomProvider>
      </Container>
    </AdminMainLayout>
  );
}

export function RoomListWithContext() {
  const session = useSession();
  const { setSelectedRowRoom } = useRoom();
  return (
    <div className=" h-fit max-h-[42rem] w-full overflow-hidden overflow-y-auto rounded-lg 2xl:w-9/12 2xl:p-5 ">
      <RoomsList
        companyId={session.data.user.companyId}
        onClick={(room) => {
          setSelectedRowRoom(room);
        }}
      />
    </div>
  );
}
