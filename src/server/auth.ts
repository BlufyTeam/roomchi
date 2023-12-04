import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import CredentialsProvider from "next-auth/providers/credentials";

import type { Company, User } from "@prisma/client";
import { createHash } from "crypto";
import { PassThrough } from "stream";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & {
      company: Company;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      //@ts-ignore
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        const user = await prisma.user.findFirst({
          where: {
            username: credentials.username,
          },
        });

        if (user)
          if (user?.password === credentials.password) {
            return user;
          } else {
            return { message: "user not found" };
          }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }: { session: any; token: any }) => {
      const user = await prisma.user.findUnique({
        where: { username: token.user.username },
        include: {
          company: true,
        },
      });
      session.user = user;
      return session;
    },
    jwt: async ({ token, user }: any) => {
      user && (token.user = user);

      delete token.user.password;
      return token;
    },
  },
  pages: {
    signIn: "/login", // this will allow us to use our own login page
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function compareHashPassword(password: string, hashedPassword: string) {
  if (hashPassword(password) === hashedPassword) {
    return { success: true, message: "Password matched" };
  }
  return { success: false, message: "Password not matched" };
}
