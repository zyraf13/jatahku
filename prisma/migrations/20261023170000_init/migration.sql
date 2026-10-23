-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "googleSub" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nama" TEXT,
    "fotoUrl" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jatah_period" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "jatah_awal" INTEGER NOT NULL,
    "tanggal_mulai" TEXT NOT NULL,
    "tanggal_akhir" TEXT NOT NULL,
    "tz_offset_menit" INTEGER NOT NULL DEFAULT 420,
    "jatah_awal_terkunci" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jatah_period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_expense" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "anggaran_per_hari" INTEGER NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routine_expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_expense_day" (
    "routine_expense_id" TEXT NOT NULL,
    "hari_ke" INTEGER NOT NULL,

    CONSTRAINT "routine_expense_day_pkey" PRIMARY KEY ("routine_expense_id","hari_ke")
);

-- CreateTable
CREATE TABLE "daily_target" (
    "id" TEXT NOT NULL,
    "jatah_period_id" TEXT NOT NULL,
    "routine_expense_id" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "nominal_rencana" INTEGER NOT NULL,
    "nominal_aktual" INTEGER,
    "dibayar" BOOLEAN NOT NULL DEFAULT false,
    "dibayar_pada" TIMESTAMP(3),
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extra_expense" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "jatah_period_id" TEXT,
    "nama" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "tanggal" TEXT NOT NULL,
    "catatan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extra_expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "user_agent" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kedaluwarsa_pada" TIMESTAMP(3),

    CONSTRAINT "push_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_token" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "cakupan" TEXT NOT NULL,
    "terakhir_dipakai" TIMESTAMP(3),
    "dicabut_pada" TIMESTAMP(3),
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_googleSub_key" ON "user"("googleSub");

-- CreateIndex
CREATE INDEX "jatah_period_user_id_tanggal_akhir_idx" ON "jatah_period"("user_id", "tanggal_akhir");

-- CreateIndex
CREATE INDEX "daily_target_jatah_period_id_tanggal_idx" ON "daily_target"("jatah_period_id", "tanggal");

-- CreateIndex
CREATE INDEX "daily_target_jatah_period_id_dibayar_idx" ON "daily_target"("jatah_period_id", "dibayar");

-- CreateIndex
CREATE INDEX "extra_expense_user_id_tanggal_idx" ON "extra_expense"("user_id", "tanggal");

-- AddForeignKey
ALTER TABLE "jatah_period" ADD CONSTRAINT "jatah_period_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_expense" ADD CONSTRAINT "routine_expense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_expense_day" ADD CONSTRAINT "routine_expense_day_routine_expense_id_fkey" FOREIGN KEY ("routine_expense_id") REFERENCES "routine_expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_target" ADD CONSTRAINT "daily_target_jatah_period_id_fkey" FOREIGN KEY ("jatah_period_id") REFERENCES "jatah_period"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_target" ADD CONSTRAINT "daily_target_routine_expense_id_fkey" FOREIGN KEY ("routine_expense_id") REFERENCES "routine_expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extra_expense" ADD CONSTRAINT "extra_expense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extra_expense" ADD CONSTRAINT "extra_expense_jatah_period_id_fkey" FOREIGN KEY ("jatah_period_id") REFERENCES "jatah_period"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscription" ADD CONSTRAINT "push_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_token" ADD CONSTRAINT "api_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

