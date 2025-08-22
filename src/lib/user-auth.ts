import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function getUserAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function getUserAuthOrNull() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session;
  } catch {
    return null;
  }
}

export async function requireUserAuth() {
  const session = await getUserAuth();
  return session.user;
}
