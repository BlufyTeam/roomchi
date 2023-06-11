import { Company, User as PrismaUser } from "@prisma/client";

export type User = (PrismaUser & { role: "ADMIN" | "USER" }) & Company;

export type RoomStatus = "AlreadyStarted" | "Reserved" | "Open" | "Done";
