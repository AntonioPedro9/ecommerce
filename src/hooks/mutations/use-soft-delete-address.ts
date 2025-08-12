import { useMutation, useQueryClient } from "@tanstack/react-query";

import { softDeleteAddress } from "@/actions/soft-delete-address/index";

import { getUserAddressesQueryKey } from "../queries/use-user-addresses";

export const getSoftDeleteAddressMutationKey = (shippingAddressId: string) =>
  ["delete-shipping-address", shippingAddressId] as const;

export const useSoftDeleteAddress = (shippingAddressId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getSoftDeleteAddressMutationKey(shippingAddressId),
    mutationFn: () => softDeleteAddress({ shippingAddressId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getUserAddressesQueryKey() }),
  });
};
