"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { cartItemTable, cartTable, orderItemTable, orderTable } from "@/db/schema";
import { requireUserAuth } from "@/lib/user-auth";

export const finishOrder = async () => {
  const user = await requireUserAuth();

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productStock: {
            with: {
              productVariant: true,
            },
          },
        },
      },
    },
  });
  if (!cart) throw new Error("Cart not found");
  if (!cart.shippingAddress) throw new Error("Shipping address not found");

  const totalPriceInCents = cart.items.reduce(
    (acc, item) => acc + item.productStock.productVariant.priceInCents * item.quantity,
    0
  );

  let orderId: string | undefined;

  await db.transaction(async (tx) => {
    if (!cart.shippingAddress) throw new Error("Shipping address not found");

    const [order] = await tx
      .insert(orderTable)
      .values({
        email: cart.shippingAddress.email,
        zipCode: cart.shippingAddress.zipCode,
        phone: cart.shippingAddress.phone,
        cpfOrCnpj: cart.shippingAddress.cpfOrCnpj,
        city: cart.shippingAddress.city,
        complement: cart.shippingAddress.complement,
        neighborhood: cart.shippingAddress.neighborhood,
        number: cart.shippingAddress.number,
        recipientName: cart.shippingAddress.recipientName,
        state: cart.shippingAddress.state,
        street: cart.shippingAddress.street,
        userId: user.id,
        totalPriceInCents,
        shippingAddressId: cart.shippingAddress!.id,
      })
      .returning();

    if (!order) throw new Error("Failed to create order");

    orderId = order.id;

    const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> = cart.items.map((item) => ({
      orderId: order.id,
      productStockId: item.productStock.id,
      quantity: item.quantity,
      priceInCents: item.productStock.productVariant.priceInCents,
    }));

    await tx.insert(orderItemTable).values(orderItemsPayload);
    await tx.delete(cartTable).where(eq(cartTable.id, cart.id));
    await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));
  });

  return { orderId };
};
