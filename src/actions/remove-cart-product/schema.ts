import { z } from "zod";

export const removeCartProductSchema = z.object({
  cartItemId: z.uuid(),
});
