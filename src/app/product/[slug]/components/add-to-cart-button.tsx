// add-to-cart-button.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productStockId: string | null; // Agora aceita null!
  quantity: number;
  disabled: boolean; // Recebe o estado de disabled do pai
}

const AddToCartButton = ({ productStockId, quantity, disabled }: AddToCartButtonProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productStockId, quantity],
    mutationFn: () => {
      // Garantimos que productStockId não é null antes de chamar a action
      if (!productStockId) {
        throw new Error("Tamanho não selecionado");
      }
      return addProductToCart({
        productStockId,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produto adicionado ao carrinho.");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao adicionar produto.");
    },
  });

  return (
    <Button
      className="rounded-full"
      size="lg"
      variant="outline"
      disabled={isPending || disabled}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="animate-spin" />}
      Adicionar à sacola
    </Button>
  );
};

export default AddToCartButton;
