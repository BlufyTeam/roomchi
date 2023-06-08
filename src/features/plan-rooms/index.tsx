import { Moment } from "jalali-moment";
import React from "react";
import PlanListWithRoom from "~/features/plan-list-with-room";
import RoomsList from "~/features/rooms-list";
import { api } from "~/utils/api";
type Props = {
  date: Moment;
};
export default function PlanRooms({ date }: Props) {
  const getPlans = api.plan.getPlansByDate.useQuery({
    date: date.toDate(),
  });
  if (getPlans.isLoading) return <>loaidng</>;
  return (
    <div className="p-5">
      <PlanListWithRoom plans={getPlans.data} />
    </div>
  );
}
