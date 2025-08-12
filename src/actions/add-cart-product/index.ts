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

  if (!productStock || productStock.quantity <= 0) {
    throw new Error("Product out of stock or combination not found");
  }

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
    if (productStock.quantity < cartItem.quantity + data.quantity) {
      throw new Error("Not enough stock available");
    }

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
