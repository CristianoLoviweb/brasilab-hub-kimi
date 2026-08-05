import { hash, verify } from "@node-rs/argon2";

/**
 * Hash de senhas com argon2id (Sprint 03.2) — mesmo perfil do seed.
 * A senha em texto puro jamais é persistida ou registrada em log.
 */
const ARGON2_OPTIONS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 };

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, ARGON2_OPTIONS);
}

export async function verifyPassword(passwordHash: string, plain: string): Promise<boolean> {
  try {
    return await verify(passwordHash, plain);
  } catch {
    return false;
  }
}
