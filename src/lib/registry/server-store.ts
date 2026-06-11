import { promises as fs } from "fs";
import path from "path";
import type { UserRegistry } from "./types";
import { emptyRegistry } from "./types";

const REGISTRY_KEY = "user-registry";
const LOCAL_PATH = path.join(process.cwd(), ".data", "user-registry.json");

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

async function readBlobRegistry(): Promise<UserRegistry | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name: "ai-fitness-registry", consistency: "strong" });
    const data = await store.get(REGISTRY_KEY, { type: "json" });
    return (data as UserRegistry | null) ?? null;
  } catch {
    return null;
  }
}

async function writeBlobRegistry(registry: UserRegistry): Promise<boolean> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name: "ai-fitness-registry", consistency: "strong" });
    await store.setJSON(REGISTRY_KEY, registry);
    return true;
  } catch {
    return false;
  }
}

export async function loadRegistry(): Promise<UserRegistry> {
  const blob = await readBlobRegistry();
  if (blob) return blob;
  return readLocalRegistry();
}

export async function saveRegistry(registry: UserRegistry): Promise<void> {
  registry.updatedAt = new Date().toISOString();
  const savedToBlob = await writeBlobRegistry(registry);
  if (!savedToBlob) {
    await writeLocalRegistry(registry);
  }
}

export async function upsertRegistryUser(entry: UserRegistry["users"][string]): Promise<UserRegistry> {
  const registry = await loadRegistry();
  registry.users[entry.id] = entry;
  await saveRegistry(registry);
  return registry;
}
