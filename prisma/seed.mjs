// Data contoh buat dev. Jalankan: npm run db:seed
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const SUB = 'mock-dev'; // sama dengan /masuk/mock?u=dev

const RUTIN = [
  { nama: 'Makan', anggaranPerHari: 25000, urutan: 0, hari: [0, 1, 2, 3, 4, 5, 6] },
  { nama: 'Transport', anggaranPerHari: 15000, urutan: 1, hari: [0, 1, 2, 3, 4] },
  { nama: 'Laundry', anggaranPerHari: 20000, urutan: 2, hari: [5] },
];

const user = await db.user.upsert({
  where: { googleSub: SUB },
  update: {},
  create: { googleSub: SUB, email: 'dev@contoh.test', nama: 'Pengguna Dev' },
});

for (const r of RUTIN) {
  const ada = await db.routineExpense.findFirst({ where: { userId: user.id, nama: r.nama } });
  if (ada) continue;
  await db.routineExpense.create({
    data: {
      userId: user.id,
      nama: r.nama,
      anggaranPerHari: r.anggaranPerHari,
      urutan: r.urutan,
      hari: { create: r.hari.map((hariKe) => ({ hariKe })) },
    },
  });
}

console.log(`Seed selesai — user ${user.id} (${user.email}). Login: /masuk/mock`);
await db.$disconnect();
