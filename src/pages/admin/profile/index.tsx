import { useSession } from "next-auth/react";
import React from "react";
import ProfileLayout from "~/pages/admin/profile/layout";

import { UserForm } from "~/pages/admin/users/form";
import { User } from "~/types";
import { Container } from "~/ui/containers";

export default function ProfilePage() {
  const session = useSession();
  if (session.status !== "authenticated") return <>loading</>;

  const user = session.data.user as User;

  return (
    <ProfileLayout>
      <Container className="flex flex-col-reverse items-stretch gap-10  2xl:flex-row ">
        <div className="sticky top-5 h-fit rounded-lg border border-accent/30 bg-secondary p-5 2xl:w-3/12">
          <UserForm sessionUser={user} />
        </div>
      </Container>
    </ProfileLayout>
  );
}
