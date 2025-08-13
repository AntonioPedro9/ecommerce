"use client";

import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useSoftDeleteAddress } from "@/hooks/mutations/use-soft-delete-address";

import { formatAddress } from "../../helpers/address";

interface AddressItemProps {
  address: typeof shippingAddressTable.$inferSelect;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const AddressItem = ({ address, onSelect, isSelected }: AddressItemProps) => {
  const deleteShippingAddressMutation = useSoftDeleteAddress(address.id);

  const handleDeleteClick = async () => {
    try {
      await deleteShippingAddressMutation.mutateAsync();
      toast.success("Endereço deletado com sucesso!");
      if (isSelected) onSelect("");
    } catch (error) {
      toast.error("Erro ao deletar endereço.");
      console.error(error);
    }
  };

  return (
    <Card key={address.id}>
      <CardContent className="flex justify-between items-center gap-4">
        <div className="flex items-start space-x-2">
          <RadioGroupItem value={address.id} id={address.id} />
          <div className="flex-1">
            <Label htmlFor={address.id} className="cursor-pointer">
              <div>
                <p className="text-sm whitespace-pre-line"> {formatAddress(address)}</p>
              </div>
            </Label>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" disabled={deleteShippingAddressMutation.isPending}>
              <TrashIcon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover endereço?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
              <AlertDialogAction className="rounded-full" onClick={handleDeleteClick}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
