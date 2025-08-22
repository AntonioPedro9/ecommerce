"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { requireUserAuth } from "@/lib/user-auth";

export async function getUserAddresses() {
  const user = await requireUserAuth();

  try {
    const addresses = await db
      .select()
      .from(shippingAddressTable)
      .where(eq(shippingAddressTable.userId, user.id) && eq(shippingAddressTable.isDeleted, false))
      .orderBy(shippingAddressTable.createdAt);

    return addresses;
  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    throw new Error("Erro ao buscar endereços");
  }
}
