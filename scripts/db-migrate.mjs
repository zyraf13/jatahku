// Vercel build step: map Neon's unpooled URL to DIRECT_URL and run prisma migrate deploy.
// Runtime stays on the pooled DATABASE_URL; migrations need the direct connection.
import { spawnSync } from "node:child_process";

const direct = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!direct) {
  console.error("db-migrate: DATABASE_URL tidak tersedia, lewati tautan DB");
  process.exit(1);
}
const bin = process.platform === "win32" ? "node_modules/.bin/prisma.cmd" : "node_modules/.bin/prisma";
const r = spawnSync(bin, ["migrate", "deploy"], {
  stdio: "inherit",
  env: { ...process.env, DIRECT_URL: direct },
});
process.exit(r.status ?? 1);
