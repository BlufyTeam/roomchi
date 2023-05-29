import React from "react";
import AdminMainLayout from "~/pages/admin/layout";

import { Container, ContainerBottomBorder } from "~/ui/containers";

import { CreateUserForm } from "~/pages/admin/users/create-form";

export default function RoomsPage() {
  return (
    <AdminMainLayout>
      <ContainerBottomBorder className="h-full items-start bg-accent/5">
        <Container className="h-full py-10">
          <div className="h-full w-fit rounded-lg border border-accent/30 bg-secondary p-5">
            <CreateUserForm />
          </div>
        </Container>
      </ContainerBottomBorder>
    </AdminMainLayout>
  );
}
