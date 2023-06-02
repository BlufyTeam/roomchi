import { useSession } from "next-auth/react";
import React from "react";
import UploadImage from "~/features/uplaod-image-base64";
import CompanyForm from "~/pages/admin/profile/company/form";
import ProfileLayout from "~/pages/admin/profile/layout";
import { Container } from "~/ui/containers";

export default function CompanyPage() {
  const session = useSession();
  if (session.status !== "authenticated") return <></>;
  return (
    <ProfileLayout>
      <Container className="flex flex-col-reverse items-stretch gap-10  2xl:flex-row ">
        <div className="sticky top-5 h-fit rounded-lg border border-accent/30 bg-secondary p-5 2xl:w-3/12">
          <CompanyForm company={session.data.user.company} />
        </div>
      </Container>
    </ProfileLayout>
  );
}
