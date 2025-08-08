import { useMutation, useQueryClient } from "@tanstack/react-query";

import { increaseCartProductQuantity } from "@/actions/increase-cart-product-quantity";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getIncreaseCartProductQuantityMutationKey = (cartItemId: string) =>
  ["increase-cart-product-quantity", cartItemId] as const;

export const useIncreaseCartProductQuantity = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getIncreaseCartProductQuantityMutationKey(cartItemId),
    mutationFn: () => increaseCartProductQuantity({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
