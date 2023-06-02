import { Company } from "@prisma/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import { User } from "~/types";
import BlurBackground from "~/ui/blur-backgrounds";
import { api } from "~/utils/api";

export default function Company({ company }: { company: Company }) {
  const getCompany = api.company.getCompanyById.useQuery(
    { id: company.id },
    {
      refetchOnWindowFocus: false,
    }
  );
  if (getCompany.isLoading) return <>loading</>;
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={"/admin/profile/company"}>
          <Button
            variant="link"
            className="flex items-center justify-center gap-5 text-primary"
          >
            <span className="text-sm">{getCompany.data.name}</span>
            <Image
              src={getCompany.data.logo_base64}
              alt="logo"
              className="rounded-full object-fill ring-2 ring-primary"
              width={45}
              height={45}
            />
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="relative z-[60] w-60 rounded-lg border border-primary/20  p-5 backdrop-blur-2xl">
        <BlurBackground />
        <div className="flex justify-between space-x-4 text-accent">
          <div className="flex flex-col items-start justify-center gap-2">
            <h4 className="text-sm font-semibold">{getCompany.data.name}</h4>
            <p className="text-sm">{getCompany.data.description}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
