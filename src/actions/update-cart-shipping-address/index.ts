"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { requireUserAuth } from "@/lib/user-auth";

import { UpdateCartShippingAddressSchema, updateCartShippingAddressSchema } from "./schema";

export const updateCartShippingAddress = async (data: UpdateCartShippingAddressSchema) => {
  updateCartShippingAddressSchema.parse(data);

  const user = await requireUserAuth();

  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (shippingAddress, { eq, and }) =>
      and(eq(shippingAddress.id, data.shippingAddressId), eq(shippingAddress.userId, user.id)),
  });
  if (!shippingAddress) throw new Error("Shipping address not found or unauthorized");

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, user.id),
  });
  if (!cart) throw new Error("Cart not found");

  await db
    .update(cartTable)
    .set({
      shippingAddressId: data.shippingAddressId,
    })
    .where(eq(cartTable.id, cart.id));

  return { success: true };
};
