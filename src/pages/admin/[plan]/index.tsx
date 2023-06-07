import moment from "jalali-moment";
import { useRouter } from "next/router";
import React from "react";
import PlanRooms from "~/features/plan-rooms";
import AdminMainLayout from "~/pages/admin/layout";

export default function PlanPage() {
  const router = useRouter();
  return (
    <AdminMainLayout>
      <PlanRooms date={moment(router.query.plan)} />
    </AdminMainLayout>
  );
}
