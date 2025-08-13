"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  addProductToCartSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const productStock = await db.query.productStockTable.findFirst({
    where: (stock, { eq }) => eq(stock.id, data.productStockId),
  });

  const productNotAvailable = !productStock || productStock.quantity <= 0;
  if (productNotAvailable) throw new Error("Product not available");

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  let cartId = cart?.id;

  if (!cartId) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
      })
      .returning();
    cartId = newCart.id;
  }

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.cartId, cartId) && eq(cartItem.productStockId, productStock.id),
  });

  if (cartItem) {
    const noStockAvailable = productStock.quantity < cartItem.quantity + data.quantity;
    if (noStockAvailable) throw new Error("Not enough stock available");

    await db
      .update(cartItemTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemTable.id, cartItem.id));
    return;
  }

  await db.insert(cartItemTable).values({
    cartId,
    productStockId: productStock.id,
    quantity: data.quantity,
  });
};
