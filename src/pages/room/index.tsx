import moment from "jalali-moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import PlanListWithRoom from "~/features/plan-list-with-room";
import RoomsList from "~/features/rooms-list";
import { RoomsListSkeleton } from "~/features/rooms-list/loading";
import RoomMainLayout from "~/pages/room/layout";

import BlurBackground from "~/ui/blur-backgrounds";
import { Container } from "~/ui/containers";
import { api } from "~/utils/api";

export default function RoomPage() {
  const session = useSession();
  if (session.status !== "authenticated") return;
  if (!session.data?.user?.companyId) return "شرکتی ندارد";
  return (
    <RoomMainLayout>
      <BlurBackground />
      <div className=" flex  h-screen w-full items-center justify-center overflow-hidden overflow-y-auto rounded-lg   ">
     
        <RoomsList companyId={session.data.user.companyId} rootLink="room" />
      </div>
    </RoomMainLayout>
  );
}
