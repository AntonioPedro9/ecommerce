"use server";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { requireUserAuth } from "@/lib/user-auth";

export const getCart = async () => {
  const user = await requireUserAuth();

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, user.id),
    with: {
      shippingAddress: true,
      items: {
        orderBy: (items, { asc }) => [asc(items.createdAt)],
        with: {
          productStock: {
            with: {
              productVariant: {
                with: {
                  product: true,
                },
              },
              productSize: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: user.id,
      })
      .returning();
    return {
      ...newCart,
      items: [],
      totalPriceInCents: 0,
      shippingAddress: null,
    };
  }

  return {
    ...cart,
    totalPriceInCents: cart.items.reduce(
      (accumulator, item) => accumulator + item.productStock.productVariant.priceInCents * item.quantity,
      0
    ),
  };
};
