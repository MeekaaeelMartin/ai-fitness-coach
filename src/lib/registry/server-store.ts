import { promises as fs } from "fs";
import path from "path";
import type { RegistryUser, UserRegistry } from "./types";
import { emptyRegistry } from "./types";
import { preserveServerBilling } from "@/lib/paystack/billing";

const REGISTRY_KEY = "user-registry.json";
const LOCAL_PATH = path.join(process.cwd(), ".data", REGISTRY_KEY);

async function readLocalRegistry(): Promise<UserRegistry> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf-8");
    return JSON.parse(raw) as UserRegistry;
  } catch {
    return emptyRegistry();
  }
}

async function writeLocalRegistry(registry: UserRegistry): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(registry, null, 2), "utf-8");
}

export async function loadRegistry(): Promise<UserRegistry> {
  return readLocalRegistry();
}

export async function saveRegistry(registry: UserRegistry): Promise<void> {
  registry.updatedAt = new Date().toISOString();
  await writeLocalRegistry(registry);
}

export async function upsertRegistryUser(entry: RegistryUser): Promise<UserRegistry> {
  const registry = await loadRegistry();
  const existing = registry.users[entry.id];
  registry.users[entry.id] = preserveServerBilling(entry, existing);
  await saveRegistry(registry);
  return registry;
}

export async function findRegistryUser(
  userId?: string,
  email?: string
): Promise<RegistryUser | null> {
  const registry = await loadRegistry();
  if (userId && registry.users[userId]) {
    return registry.users[userId];
  }
  if (email) {
    const normalized = email.trim().toLowerCase();
    return Object.values(registry.users).find((user) => user.email === normalized) ?? null;
  }
  return null;
}

export async function updateUserBilling(
  userId: string,
  billing: Partial<
    Pick<
      RegistryUser,
      | "subscriptionStatus"
      | "subscribedAt"
      | "currentPeriodEnd"
      | "trialEndsAt"
      | "paystackCustomerCode"
      | "paystackSubscriptionCode"
    >
  >
): Promise<RegistryUser | null> {
  const registry = await loadRegistry();
  const user = registry.users[userId];
  if (!user) return null;

  registry.users[userId] = {
    ...user,
    ...billing,
    lastSeenAt: new Date().toISOString(),
  };
  await saveRegistry(registry);
  return registry.users[userId];
}
