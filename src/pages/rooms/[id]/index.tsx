import moment from "jalali-moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import PlanListWithRoom from "~/features/plan-list-with-room";

import BlurBackground from "~/ui/blur-backgrounds";
import { Container } from "~/ui/containers";
import { api } from "~/utils/api";

export default function RoomStatusPage() {
  const router = useRouter();
  const plans = api.plan.getPlansByDateAndRoom.useQuery({
    roomId: router.query.id as string,
    date: moment(moment(Date.now()).format("yyyy MMMM D")).toDate(),
  });
  if (plans.isLoading) return <>loading</>;
  return (
    <div className="m-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center bg-secondary p-5">
      <Container className="flex w-full items-center justify-center ">
        <BlurBackground />
        {plans.data.length > 0 ? "" : ""}
        <br />
        {/* {session.status === "authenticated" && <List plans={plans.data} />} */}
        {<PlanListWithRoom plans={plans.data} />}
      </Container>
    </div>
  );
}

export function List({ plans }) {
  return (
    <>
      {plans.data.map((plan) => (
        <>
          {plan.title}
          <br />
        </>
      ))}
    </>
  );
}
