import moment from "jalali-moment";
import { useRouter } from "next/router";
import React from "react";
import PickTimeView from "~/features/pick-time-view";
import PlanRooms from "~/features/plan-rooms";
import AdminMainLayout from "~/pages/admin/layout";

export default function PlanPage() {
  const router = useRouter();
  return (
    <AdminMainLayout>
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="w=full flex items-center justify-center font-bold text-primary">
          {moment(router.query.plan).locale("fa").format("D MMMM yyyy")}
        </h1>
        <PlanRooms date={moment(router.query.plan)} />
      </div>
    </AdminMainLayout>
  );
}
