import React, { useState } from "react";
import AdminMainLayout from "~/pages/admin/layout";

import { Container, ContainerBottomBorder } from "~/ui/containers";

import { UserForm } from "~/pages/admin/users/form";
import UsersList from "~/pages/admin/users/users-list";
import { User } from "~/types";
import { UserProvider, useUser } from "~/context/user.context";

export default function RoomsPage() {
  return (
    <AdminMainLayout>
      <Container className="flex flex-col-reverse items-stretch gap-10 py-10  2xl:flex-row ">
        <UserProvider>
          <div className="sticky top-5 h-fit rounded-lg border border-accent/30 bg-secondary p-5 2xl:w-3/12">
            <UserForm />
          </div>
          <div className=" h-fit max-h-[42rem] overflow-hidden overflow-y-auto rounded-lg  border border-accent/30 bg-secondary p-5 2xl:w-9/12">
            <UsersList />
          </div>
        </UserProvider>
      </Container>
    </AdminMainLayout>
  );
}
