import { z } from "zod";

export const softDeleteAddressSchema = z.object({
  shippingAddressId: z.uuid(),
});
