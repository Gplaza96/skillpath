import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const skillRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.db.skill.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "asc" },
    }),
  ),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1).max(80),
        progress: z.number().int().min(0).max(100),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.skill.create({
        data: { ...input, userId: ctx.session.user.id },
      }),
    ),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        progress: z.number().int().min(0).max(100),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.skill.updateMany({
        where: { id: input.id, userId: ctx.session.user.id },
        data: { progress: input.progress },
      }),
    ),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.skill.deleteMany({
        where: { id: input.id, userId: ctx.session.user.id },
      }),
    ),
});