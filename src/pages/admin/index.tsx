import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CalendarView from "~/pages/admin/calendar-view";
import AdminMainLayout from "~/pages/admin/layout";
import AdminSkeleton from "~/pages/admin/loading";

export default function AdminPage() {
  const session = useSession();
  const router = useRouter();
  if (session.status === "unauthenticated") router.replace("/login");
  if (session.status === "loading") return <AdminSkeleton />;
  return (
    <AdminMainLayout>
      <CalendarView />
    </AdminMainLayout>
  );
}
