import { User as PrismaUser } from "@prisma/client";

export type User = PrismaUser & { role: "ADMIN" | "USER" | "TABLET" };

export type RoomStatus = "AlreadyStarted" | "Reserved" | "Open" | "Done";
