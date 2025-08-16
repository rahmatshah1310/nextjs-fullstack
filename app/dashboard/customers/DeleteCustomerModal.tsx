"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/common/Model";
import { toast } from "react-toastify";
import { useDeleteCustomer } from "@/utils/customerApi";

interface DeleteCustomerModalProps {
  open: boolean;
  onClose: () => void;
  customerId: string;
}

export default function DeleteCustomerModal({ open, onClose, customerId }: DeleteCustomerModalProps) {
  const deleteCustomerMutation = useDeleteCustomer();

  const handleDelete = async () => {
    try {
      await deleteCustomerMutation.mutateAsync(customerId);
      toast.success("Customer deleted successfully!");
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <Modal title="Delete Product" open={open} onClose={onClose}>
      <p className="text-sm text-gray-600 mb-4 text-center">Are you sure you want to delete this customer? This action cannot be undone.</p>

      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleDelete} disabled={deleteCustomerMutation.isPending}>
          {deleteCustomerMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
