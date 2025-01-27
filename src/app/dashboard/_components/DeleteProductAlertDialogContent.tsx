"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteProduct } from "@/server/actions/products";
import { useTransition } from "react";

export function DeleteProductAlertDialogContent({ id }: { id: string }) {
  //call code from client onto server and get a loading state
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This actions cannot be undone. This will permanently delete this
          product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => {
          startDeleteTransition((async () => {
            const data = await deleteProduct(id)
            if (data?.message) {
              toast({
                title: data.error ? "Error" : "Success",
                description: data.message,
                variant: data.error ? "destructive" : "default"
              });
            }
          }))
        }} disabled={isDeletePending}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
