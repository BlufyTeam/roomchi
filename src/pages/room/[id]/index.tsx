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

export default function SingleRoomPage() {
  const router = useRouter();
  const session = useSession();
  const getPlans = api.plan.getPlansByDateAndRoom.useQuery(
    {
      roomId: router.query.id as string,
      date: moment(moment(Date.now()).format("yyyy MMMM D")).toDate(),
    },
    {
      enabled: session.status === "authenticated",
      refetchInterval: 60 * 60,
    }
  );

  
  if (getPlans.isLoading)
    return (
      <RoomMainLayout>
        <div className="m-auto flex min-h-screen w-8/12 max-w-[1920px] flex-col items-center bg-secondary p-5">
          <Container className="flex w-full items-center justify-center ">
            <BlurBackground />
            
            <RoomsListSkeleton />
          </Container>
        </div>
      </RoomMainLayout>
    );
  return (
    <RoomMainLayout>
      <div className="m-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center bg-secondary p-5">
        <Container className="flex w-full items-center justify-center ">
          <BlurBackground />

          <br />
          {/* {session.status === "authenticated" && <List plans={plans.data} />} */}
          {getPlans.data.length == 0? <div style={{color:'black'}}>جلسه ای برای امروز وجود ندارد.</div>:
          <PlanListWithRoom plans={getPlans.data} />
          }
        
         
        </Container>
   
      </div>
    </RoomMainLayout>
  );
}
