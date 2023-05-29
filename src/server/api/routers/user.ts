import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
  
  createUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        username: z.string().min(3, "یوزرنیم نمیتواند کمتر از 3 حرف باشد"),
        password: z.string().min(6, "پسورد نمیتواند کمتر از 6 حرف باشد."),
        description: z.string(),
        role: z.enum(["ADMIN", "USER"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          username: input.username,
          password: input.password,
          description: input.description,
          role: input.role,
        },
      });
    }),
    getUsers:publicProcedure.input( z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),

    })).query(
      async({ctx,input})=>{
        const limit=input.limit??50;
        const {cursor}=input;
        const items =
        (await ctx.prisma.user.findMany({
          take: limit + 1, // get an extra item at the end which we'll use as next cursor
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            created_at: "asc",
          },
        })) || [];
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
      }
    )
});
