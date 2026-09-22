import { promises as fs } from "fs";
import path from "path";
import type { UserAccount } from "@/lib/types/auth";
import {
  createDefaultProgress,
  createTrialSubscription,
} from "@/lib/types/auth";
import type { AccountSnapshot } from "./types";

export type { AccountSnapshot };

function getAccountsDir(): string {
  const custom = process.env.REGISTRY_DATA_PATH?.trim();
  if (custom) {
    const base = path.isAbsolute(custom) ? custom : path.join(process.cwd(), custom);
    return path.join(base, "accounts");
  }
  return path.join(process.cwd(), ".data", "accounts");
}

function accountPath(userId: string): string {
  const safeId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(getAccountsDir(), `${safeId}.json`);
}

export function toAccountSnapshot(user: UserAccount): AccountSnapshot {
  return {
    id: user.id,
    email: user.email.trim().toLowerCase(),
    name: user.name?.trim() || "Member",
    createdAt: user.createdAt,
    assessment: user.assessment ?? null,
    generatedPlan: user.generatedPlan ?? null,
    progress: user.progress ?? createDefaultProgress(),
    subscription: user.subscription ?? createTrialSubscription(),
    points: user.points ?? 0,
    exerciseSelections: user.exerciseSelections ?? {},
  };
}

export async function saveAccountSnapshot(user: UserAccount): Promise<void> {
  const snapshot = toAccountSnapshot(user);
  const filePath = accountPath(user.id);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(snapshot), "utf-8");
}

export async function loadAccountSnapshot(userId: string): Promise<AccountSnapshot | null> {
  try {
    const raw = await fs.readFile(accountPath(userId), "utf-8");
    const data = JSON.parse(raw) as AccountSnapshot;
    if (!data?.id || !data?.email) return null;
    return data;
  } catch {
    return null;
  }
}

export function snapshotToUserAccount(
  snapshot: AccountSnapshot,
  passwordHash = ""
): UserAccount {
  return {
    ...snapshot,
    passwordHash,
    progress: snapshot.progress ?? createDefaultProgress(),
    subscription: snapshot.subscription ?? createTrialSubscription(),
    points: snapshot.points ?? 0,
    exerciseSelections: snapshot.exerciseSelections ?? {},
    assessment: snapshot.assessment ?? null,
    generatedPlan: snapshot.generatedPlan ?? null,
  };
}
