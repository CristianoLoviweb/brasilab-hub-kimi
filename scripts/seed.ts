/**
 * Execução manual do seed estrutural: npm run db:seed
 * A lógica idempotente vive em src/server/db/seed.ts (fonte única).
 */
import { ensureSeed } from "../src/server/db/seed";

const result = await ensureSeed();
console.log(result.inserted ? "Seed aplicado." : "Seed já estava aplicado (nada alterado).");
process.exit(0);
