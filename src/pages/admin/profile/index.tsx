import { useSession } from "next-auth/react";
import React from "react";
import { UserProfileForm } from "~/pages/admin/profile/form";
import ProfileLayout from "~/pages/admin/profile/layout";

import { UserForm } from "~/pages/admin/users/form";
import { User } from "~/types";
import { Container } from "~/ui/containers";

export default function ProfilePage() {
  const session = useSession();
  const { data, status, update } = session;
  if (status !== "authenticated") return <>loading</>;

  const user = data.user as User;

  return (
    <ProfileLayout>
      <Container className="flex flex-col-reverse items-stretch gap-10 py-2  2xl:flex-row ">
        <div className="sticky top-5 h-fit rounded-lg border border-accent/30 bg-secondary p-5 2xl:w-3/12">
          <UserProfileForm
            sessionUser={user}
            onCreateSuccess={() => {
              update({
                ...session,
                token: {
                  ...user,
                },
              });
            }}
          />
        </div>
      </Container>
    </ProfileLayout>
  );
}
