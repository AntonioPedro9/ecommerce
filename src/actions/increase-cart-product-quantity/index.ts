"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { increaseCartProductQuantitySchema } from "./schema";

export const increaseCartProductQuantity = async (data: z.infer<typeof increaseCartProductQuantitySchema>) => {
  increaseCartProductQuantitySchema.parse(data);

  console.log(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });
  if (!cartItem) throw new Error("Cart item not found");

  const cartDoesNotBelongToUser = cartItem.cart.userId !== session.user.id;
  if (cartDoesNotBelongToUser) throw new Error("Unauthorized");

  await db
    .update(cartItemTable)
    .set({ quantity: cartItem.quantity + 1 })
    .where(eq(cartItemTable.id, cartItem.id));
};
