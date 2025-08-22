"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { requireUserAuth } from "@/lib/user-auth";

import { CreateShippingAddressSchema, createShippingAddressSchema } from "./schema";

export const createShippingAddress = async (data: CreateShippingAddressSchema) => {
  createShippingAddressSchema.parse(data);

  const user = await requireUserAuth();

  const [shippingAddress] = await db
    .insert(shippingAddressTable)
    .values({
      userId: user.id,
      recipientName: data.fullName,
      street: data.address,
      number: data.number,
      complement: data.complement || null,
      city: data.city,
      state: data.state,
      neighborhood: data.neighborhood,
      zipCode: data.zipCode,
      phone: data.phone,
      email: data.email,
      cpfOrCnpj: data.cpf,
    })
    .returning();

  revalidatePath("/cart/identification");

  return shippingAddress;
};
