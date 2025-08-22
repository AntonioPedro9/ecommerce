"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { requireUserAuth } from "@/lib/user-auth";

import { increaseCartProductQuantitySchema } from "./schema";

export const increaseCartProductQuantity = async (data: z.infer<typeof increaseCartProductQuantitySchema>) => {
  increaseCartProductQuantitySchema.parse(data);

  const user = await requireUserAuth();

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });
  if (!cartItem) throw new Error("Cart item not found");

  const cartDoesNotBelongToUser = cartItem.cart.userId !== user.id;
  if (cartDoesNotBelongToUser) throw new Error("Unauthorized");

  await db
    .update(cartItemTable)
    .set({ quantity: cartItem.quantity + 1 })
    .where(eq(cartItemTable.id, cartItem.id));
};
