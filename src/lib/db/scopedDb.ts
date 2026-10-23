import 'server-only';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/client';

// Isolasi data §13.5. Jangan pernah query model milik-user lewat `prisma` mentah
// di kode fitur — pakai scopedDb(userId). Setiap where otomatis ter-scope userId.

type PeriodCreate = Omit<Prisma.JatahPeriodUncheckedCreateInput, 'userId'>;
type RoutineCreate = Omit<Prisma.RoutineExpenseUncheckedCreateInput, 'userId'>;
type ExtraCreate = Omit<Prisma.ExtraExpenseUncheckedCreateInput, 'userId'>;

export function scopedDb(userId: string) {
  return {
    period: {
      many: (args: Parameters<typeof prisma.jatahPeriod.findMany>[0] = {}) =>
        prisma.jatahPeriod.findMany({ ...args, where: { ...args.where, userId } }),
      first: (args: Parameters<typeof prisma.jatahPeriod.findFirst>[0] = {}) =>
        prisma.jatahPeriod.findFirst({ ...args, where: { ...args.where, userId } }),
      create: (args: { data: PeriodCreate }) =>
        prisma.jatahPeriod.create({ data: { ...args.data, userId } }),
      // update/delete lewat id WAJIB verifikasi kepemilikan dulu
      updateOwned: async (
        id: string,
        data: Parameters<typeof prisma.jatahPeriod.update>[0]['data'],
      ) => {
        const owned = await prisma.jatahPeriod.findFirst({ where: { id, userId } });
        if (!owned) throw new Error('Tidak ditemukan');
        return prisma.jatahPeriod.update({ where: { id }, data });
      },
    },
    routine: {
      many: (args: Parameters<typeof prisma.routineExpense.findMany>[0] = {}) =>
        prisma.routineExpense.findMany({ ...args, where: { ...args.where, userId } }),
      create: (args: { data: RoutineCreate }) =>
        prisma.routineExpense.create({ data: { ...args.data, userId } }),
      updateOwned: async (
        id: string,
        data: Parameters<typeof prisma.routineExpense.update>[0]['data'],
      ) => {
        const owned = await prisma.routineExpense.findFirst({ where: { id, userId } });
        if (!owned) throw new Error('Tidak ditemukan');
        return prisma.routineExpense.update({ where: { id }, data });
      },
      deleteOwned: async (id: string) => {
        const owned = await prisma.routineExpense.findFirst({ where: { id, userId } });
        if (!owned) throw new Error('Tidak ditemukan');
        return prisma.routineExpense.delete({ where: { id } });
      },
    },
    extra: {
      many: (args: Parameters<typeof prisma.extraExpense.findMany>[0] = {}) =>
        prisma.extraExpense.findMany({ ...args, where: { ...args.where, userId } }),
      create: (args: { data: ExtraCreate }) =>
        prisma.extraExpense.create({ data: { ...args.data, userId } }),
      deleteOwned: async (id: string) => {
        const owned = await prisma.extraExpense.findFirst({ where: { id, userId } });
        if (!owned) throw new Error('Tidak ditemukan');
        return prisma.extraExpense.delete({ where: { id } });
      },
    },
    // daily_target tidak punya user_id langsung; scope lewat jatah_period.
    targetManyOwned: async (
      args: Parameters<typeof prisma.dailyTarget.findMany>[0] = {},
    ) => {
      const periods = await prisma.jatahPeriod.findMany({
        where: { userId },
        select: { id: true },
      });
      const ids = periods.map((p) => p.id);
      return prisma.dailyTarget.findMany({
        ...args,
        where: { ...args.where, jatahPeriodId: { in: ids } },
      });
    },
    targetUpdateOwned: async (
      id: string,
      data: Parameters<typeof prisma.dailyTarget.update>[0]['data'],
    ) => {
      const owned = await prisma.dailyTarget.findFirst({
        where: { id, period: { userId } },
      });
      if (!owned) throw new Error('Tidak ditemukan');
      return prisma.dailyTarget.update({ where: { id }, data });
    },
  };
}

export type ScopedDb = ReturnType<typeof scopedDb>;
