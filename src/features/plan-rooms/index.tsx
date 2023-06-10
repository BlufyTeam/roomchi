import moment, { Moment } from "jalali-moment";
import React from "react";
import PickTimeView from "~/features/pick-time-view";
import PlanListWithRoom from "~/features/plan-list-with-room";
import RoomsList from "~/features/rooms-list";
import { RoomsListSkeleton } from "~/features/rooms-list/loading";
import { api } from "~/utils/api";
type Props = {
  date: Moment;
};
export default function PlanRooms({ date }: Props) {
  const getPlans = api.plan.getPlansByDate.useQuery({
    date: date.toDate(),
  });
  if (getPlans.isLoading) return <RoomsListSkeleton />;

  const canPickTime = date.isSameOrAfter(moment(), "jDay");
  return (
    <div className="p-5">
      <PlanListWithRoom plans={getPlans.data} />
      {canPickTime && <PickTimeView date={date} />}
    </div>
  );
}
