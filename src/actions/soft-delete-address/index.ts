"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { softDeleteAddressSchema } from "./schema";

export const softDeleteAddress = async (data: z.infer<typeof softDeleteAddressSchema>) => {
  softDeleteAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (shippingAddress, { eq }) => eq(shippingAddress.id, data.shippingAddressId),
  });
  if (!shippingAddress) throw new Error("Shipping address not found");

  const shippingAddressDoesNotBelongToUser = shippingAddress.userId !== session.user.id;
  if (shippingAddressDoesNotBelongToUser) throw new Error("Unauthorized");

  await db
    .update(shippingAddressTable)
    .set({ isDeleted: true, deletedAt: new Date() })
    .where(eq(shippingAddressTable.id, shippingAddress.id));
};
