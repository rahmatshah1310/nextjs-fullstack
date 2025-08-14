"use client";

import { Modal } from "@/components/common/Model";
import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/utils/productApi";
import { toast } from "react-toastify";

interface DeleteProductModalProps {
  open: boolean;
  onClose: () => void;
  productId: number;
}

export default function DeleteProductModal({ open, onClose, productId }: DeleteProductModalProps) {
  const deleteProductMutation = useDeleteProduct();

  const handleDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      toast.success("Product deleted successfully!");
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <Modal title="Delete Product" open={open} onClose={onClose}>
      <p className="text-center">Are you sure you want to delete this product?</p>
      <div className="flex justify-center gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleDelete} disabled={deleteProductMutation.isPending}>
          {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
