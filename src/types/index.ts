import { Company, User as PrismaUser } from "@prisma/client";

export type User = (PrismaUser & { role: "ADMIN" | "USER" }) & {
  company?: Company;
};

export type RoomStatus = "AlreadyStarted" | "Reserved" | "Open" | "Done";

export type Role = "USER" | "ROOM" | "ADMIN" | "SUPER_ADMIN";
