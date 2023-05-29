import React, { useState } from "react";
import AdminMainLayout from "~/pages/admin/layout";

import { Container, ContainerBottomBorder } from "~/ui/containers";

import { UserForm } from "~/pages/admin/users/form";
import UsersList from "~/pages/admin/users/users-list";
import { User } from "~/types";

export default function RoomsPage() {
  const [selectedRowUser, setSelectedRowUser] = useState<User | undefined>(
    undefined
  );
  return (
    <AdminMainLayout>
      <ContainerBottomBorder className="h-screen items-start bg-accent/5">
        <Container className="flex h-full   flex-col-reverse items-stretch gap-10 py-10 md:flex-row ">
          <div className="sticky top-5 h-fit rounded-lg border border-accent/30 bg-secondary p-5 md:w-3/12">
            <UserForm
              user={selectedRowUser}
              onClearUser={() => setSelectedRowUser(undefined)}
            />
          </div>
          <div className="h-full max-h-[77%] overflow-hidden rounded-lg  border border-accent/30 bg-secondary p-5 md:w-9/12">
            <UsersList
              onRowClick={(user: User) => {
                setSelectedRowUser(user);
              }}
            />
          </div>
        </Container>
      </ContainerBottomBorder>
    </AdminMainLayout>
  );
}
