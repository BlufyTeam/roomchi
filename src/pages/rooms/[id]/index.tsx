import moment from "jalali-moment";
import { useRouter } from "next/router";
import React from "react";
import PlanListWithRoom from "~/features/plan-list-with-room";
import BlurBackground from "~/ui/blur-backgrounds";
import { Container } from "~/ui/containers";
import { api } from "~/utils/api";

export default function RoomStatusPage() {
  //   const router = useRouter();
  //   if (typeof router.query.id !== "string") return "error";
  //   const plans = api.plan.getPlansByDateAndRoom.useQuery({
  //     roomId: router.query.id,
  //     date: moment().toDate(),
  //   });
  //   if (plans.isLoading) return <>loading</>;
  return (
    <div className="m-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center bg-secondary">
      <Container className="flex w-full items-center justify-center ">
        <BlurBackground />

        {/* <PlanListWithRoom plans={plans.data} /> */}
      </Container>
    </div>
  );
}
