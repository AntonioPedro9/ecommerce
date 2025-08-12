import { z } from "zod";

export const deleteShippingAddressSchema = z.object({
  shippingAddressId: z.uuid(),
});
