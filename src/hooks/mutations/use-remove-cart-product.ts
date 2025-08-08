import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeCartProduct } from "@/actions/remove-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getRemoveProductCartMutationKey = (cartItemId: string) => ["remove-cart-product", cartItemId] as const;

export const useRemoveCartProduct = (cartItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getRemoveProductCartMutationKey(cartItemId),
    mutationFn: () => removeCartProduct({ cartItemId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() }),
  });
};
