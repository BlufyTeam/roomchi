import { useRouter } from "next/router";
import React from "react";
import BlurBackground from "~/ui/blur-backgrounds";
import { Container } from "~/ui/containers";
import { api } from "~/utils/api";

export default function RoomStatusPage() {
  const router = useRouter();
  if (typeof router.query.id !== "string") return "error";
  const room = api.room.getRoomById.useQuery(
    { id: router.query.id },
    {
      enabled: !!router.query.id,
    }
  );
  if (room.isLoading) return <>loading</>;
  return (
    <div className="m-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center bg-secondary">
      <Container className="flex w-full items-center justify-center ">
        <BlurBackground />

        {room.status}
      </Container>
    </div>
  );
}
