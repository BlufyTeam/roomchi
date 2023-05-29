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
  createUser: protectedProcedure.input(z.object({
     name: z.string() ,
     email:z.string(),
     username:z.string().min(3,'یوزرنیم نمیتواند کمتر از 3 حرف باشد'),
     password:z.string().min(6,'پسورد نمیتواند کمتر از 6 حرف باشد.'),
     description:z.string(),
     role:z.enum(['ADMIN',"USER"]),
    })).mutation(async({input, ctx }) => {
      
    return await ctx.prisma.user.create( {
        name: input.name,
        email: input.email,
        username:input.username,
        password:input.password,
        description:input.description,
        role:input.role

      },
    )
  }),
  
});
