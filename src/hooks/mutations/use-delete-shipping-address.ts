import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteShippingAddress } from "@/actions/delete-shipping-address/index";

import { getUserAddressesQueryKey } from "../queries/use-user-addresses";

export const getDeleteShippingAddressMutationKey = (shippingAddressId: string) =>
  ["delete-shipping-address", shippingAddressId] as const;

export const useDeleteShippingAddress = (shippingAddressId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getDeleteShippingAddressMutationKey(shippingAddressId),
    mutationFn: () => deleteShippingAddress({ shippingAddressId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getUserAddressesQueryKey() }),
  });
};
