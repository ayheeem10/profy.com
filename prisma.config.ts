import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 : les commandes CLI (migrate, studio, db seed) lisent la
// connexion depuis ce fichier, pas depuis schema.prisma. On utilise la
// connexion DIRECTE (non "pooled") ici, comme recommandé par Supabase pour
// les migrations — l'app elle-même utilise la connexion "pooled" au
// runtime (voir src/lib/prisma.ts).
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
