import React from "react";
import AdminMainLayout from "~/pages/admin/layout";
import RoomForm from "~/pages/admin/rooms/form";
import RoomsList from "~/pages/admin/rooms/rooms-list";
import { Container, ContainerBottomBorder } from "~/ui/containers";

export default function RoomsPage() {
  return (
    <AdminMainLayout>
      <Container className="flex flex-col-reverse items-stretch gap-10  py-10 2xl:flex-row ">
        <div className="sticky top-5 h-fit rounded-lg border border-accent/30 bg-secondary p-5 2xl:w-3/12">
          <RoomForm />
        </div>
        <div className=" h-fit max-h-[42rem] overflow-hidden overflow-y-auto rounded-lg p-5 2xl:w-9/12">
          <RoomsList />
        </div>
      </Container>
    </AdminMainLayout>
  );
}
