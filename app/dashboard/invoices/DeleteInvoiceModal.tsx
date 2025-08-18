"use client";

import React from "react";
import { Modal } from "@/components/common/Model";
import { Button } from "@/components/ui/button";
import { useDeleteInvoice } from "@/utils/invoiceApi";

type Props = { open: boolean; onClose: (open: boolean) => void; invoiceId?: string };

export default function DeleteInvoiceModal({ open, onClose, invoiceId }: Props) {
  const mutation = useDeleteInvoice();
  const onDelete = async () => {
    if (!invoiceId) return;
    await mutation.mutateAsync(invoiceId);
    onClose(false);
  };
  return (
    <Modal title="Delete Invoice" open={open} onClose={onClose}>
      <p className="text-sm text-gray-600 dark:text-gray-300">Are you sure you want to delete this invoice? This action cannot be undone.</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={() => onClose(false)}>Cancel</Button>
        <Button variant="destructive" onClick={onDelete}>Delete</Button>
      </div>
    </Modal>
  );
}


